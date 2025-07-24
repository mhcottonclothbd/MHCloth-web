/**
 * Production-ready rate limiting system
 * Provides multiple rate limiting strategies with Redis and in-memory fallback
 */

import { ErrorLogger, AppError, ErrorType } from './error-handler'
import { env } from './env'
import { cache } from './cache'

// Rate limit configuration interface
export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (req: any) => string // Custom key generator
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
  message?: string // Custom error message
  headers?: boolean // Include rate limit headers in response
}

// Rate limit result interface
export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  totalHits: number
  retryAfter?: number
}

// Rate limit store interface
export interface RateLimitStore {
  get(key: string): Promise<{ count: number; resetTime: number } | null>
  set(key: string, value: { count: number; resetTime: number }, ttl: number): Promise<void>
  increment(key: string, ttl: number): Promise<{ count: number; resetTime: number }>
  reset(key: string): Promise<void>
}

/**
 * In-memory rate limit store
 */
export class MemoryRateLimitStore implements RateLimitStore {
  private store = new Map<string, { count: number; resetTime: number }>()

  async get(key: string): Promise<{ count: number; resetTime: number } | null> {
    const entry = this.store.get(key)
    
    if (!entry) {
      return null
    }

    // Check if expired
    if (Date.now() > entry.resetTime) {
      this.store.delete(key)
      return null
    }

    return entry
  }

  async set(key: string, value: { count: number; resetTime: number }, ttl: number): Promise<void> {
    this.store.set(key, value)
    
    // Set cleanup timeout
    setTimeout(() => {
      this.store.delete(key)
    }, ttl)
  }

  async increment(key: string, ttl: number): Promise<{ count: number; resetTime: number }> {
    const now = Date.now()
    const resetTime = now + ttl
    const existing = await this.get(key)

    if (!existing) {
      const newEntry = { count: 1, resetTime }
      await this.set(key, newEntry, ttl)
      return newEntry
    }

    existing.count++
    this.store.set(key, existing)
    return existing
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key)
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store) {
      if (now > entry.resetTime) {
        this.store.delete(key)
      }
    }
  }
}

/**
 * Redis rate limit store (for production)
 */
export class RedisRateLimitStore implements RateLimitStore {
  private prefix = 'rate_limit:'

  async get(key: string): Promise<{ count: number; resetTime: number } | null> {
    try {
      const data = await cache.get<{ count: number; resetTime: number }>(`${this.prefix}${key}`)
      
      if (!data) {
        return null
      }

      // Check if expired
      if (Date.now() > data.resetTime) {
        await this.reset(key)
        return null
      }

      return data
    } catch (error) {
      ErrorLogger.error(new AppError('Failed to get rate limit data from Redis', ErrorType.DATABASE, 500, true, { originalError: error }))
      return null
    }
  }

  async set(key: string, value: { count: number; resetTime: number }, ttl: number): Promise<void> {
    try {
      await cache.set(`${this.prefix}${key}`, value, ttl)
    } catch (error) {
      ErrorLogger.error(new AppError('Failed to set rate limit data in Redis', ErrorType.DATABASE, 500, true, { originalError: error }))
    }
  }

  async increment(key: string, ttl: number): Promise<{ count: number; resetTime: number }> {
    const now = Date.now()
    const resetTime = now + ttl
    const existing = await this.get(key)

    if (!existing) {
      const newEntry = { count: 1, resetTime }
      await this.set(key, newEntry, ttl)
      return newEntry
    }

    existing.count++
    await this.set(key, existing, ttl)
    return existing
  }

  async reset(key: string): Promise<void> {
    try {
      await cache.delete(`${this.prefix}${key}`)
    } catch (error) {
      ErrorLogger.error(new AppError('Failed to reset rate limit data in Redis', ErrorType.DATABASE, 500, true, { originalError: error }))
    }
  }
}

/**
 * Rate limiter class
 */
export class RateLimiter {
  private store: RateLimitStore
  private config: Required<RateLimitConfig>

  constructor(config: RateLimitConfig) {
    this.config = {
      windowMs: config.windowMs,
      maxRequests: config.maxRequests,
      keyGenerator: config.keyGenerator || this.defaultKeyGenerator,
      skipSuccessfulRequests: config.skipSuccessfulRequests || false,
      skipFailedRequests: config.skipFailedRequests || false,
      message: config.message || 'Too many requests, please try again later',
      headers: config.headers !== false
    }

    // Use Redis store in production, memory store in development
    this.store = env.isProduction && env.REDIS_URL 
      ? new RedisRateLimitStore() 
      : new MemoryRateLimitStore()
  }

  /**
   * Default key generator using IP address
   */
  private defaultKeyGenerator(req: any): string {
    const ip = req.ip || 
               req.connection?.remoteAddress || 
               req.socket?.remoteAddress ||
               req.headers?.['x-forwarded-for']?.split(',')[0] ||
               req.headers?.['x-real-ip'] ||
               'unknown'
    return `ip:${ip}`
  }

  /**
   * Check if request should be rate limited
   */
  async checkLimit(req: any): Promise<RateLimitResult> {
    const key = this.config.keyGenerator(req)
    const entry = await this.store.increment(key, this.config.windowMs)
    
    const allowed = entry.count <= this.config.maxRequests
    const remaining = Math.max(0, this.config.maxRequests - entry.count)
    const retryAfter = allowed ? undefined : Math.ceil((entry.resetTime - Date.now()) / 1000)

    return {
      allowed,
      remaining,
      resetTime: entry.resetTime,
      totalHits: entry.count,
      retryAfter
    }
  }

  /**
   * Reset rate limit for a specific key
   */
  async resetKey(req: any): Promise<void> {
    const key = this.config.keyGenerator(req)
    await this.store.reset(key)
  }

  /**
   * Get current rate limit status
   */
  async getStatus(req: any): Promise<RateLimitResult | null> {
    const key = this.config.keyGenerator(req)
    const entry = await this.store.get(key)
    
    if (!entry) {
      return null
    }

    const allowed = entry.count <= this.config.maxRequests
    const remaining = Math.max(0, this.config.maxRequests - entry.count)
    const retryAfter = allowed ? undefined : Math.ceil((entry.resetTime - Date.now()) / 1000)

    return {
      allowed,
      remaining,
      resetTime: entry.resetTime,
      totalHits: entry.count,
      retryAfter
    }
  }
}

/**
 * Sliding window rate limiter
 */
export class SlidingWindowRateLimiter {
  private store: RateLimitStore
  private config: Required<RateLimitConfig>

  constructor(config: RateLimitConfig) {
    this.config = {
      windowMs: config.windowMs,
      maxRequests: config.maxRequests,
      keyGenerator: config.keyGenerator || this.defaultKeyGenerator,
      skipSuccessfulRequests: config.skipSuccessfulRequests || false,
      skipFailedRequests: config.skipFailedRequests || false,
      message: config.message || 'Too many requests, please try again later',
      headers: config.headers !== false
    }

    this.store = env.isProduction && env.REDIS_URL 
      ? new RedisRateLimitStore() 
      : new MemoryRateLimitStore()
  }

  private defaultKeyGenerator(req: any): string {
    const ip = req.ip || 
               req.connection?.remoteAddress || 
               req.socket?.remoteAddress ||
               req.headers?.['x-forwarded-for']?.split(',')[0] ||
               req.headers?.['x-real-ip'] ||
               'unknown'
    return `sliding:${ip}`
  }

  async checkLimit(req: any): Promise<RateLimitResult> {
    const key = this.config.keyGenerator(req)
    const now = Date.now()
    const windowStart = now - this.config.windowMs
    
    // Get current window data
    const entry = await this.store.get(key)
    const timestamps = entry ? JSON.parse(entry.count.toString()) : []
    
    // Filter out old timestamps
    const validTimestamps = timestamps.filter((timestamp: number) => timestamp > windowStart)
    
    // Add current timestamp
    validTimestamps.push(now)
    
    // Update store
    await this.store.set(key, {
      count: JSON.parse(JSON.stringify(validTimestamps)) as any,
      resetTime: now + this.config.windowMs
    }, this.config.windowMs)
    
    const allowed = validTimestamps.length <= this.config.maxRequests
    const remaining = Math.max(0, this.config.maxRequests - validTimestamps.length)
    const retryAfter = allowed ? undefined : Math.ceil(this.config.windowMs / 1000)

    return {
      allowed,
      remaining,
      resetTime: now + this.config.windowMs,
      totalHits: validTimestamps.length,
      retryAfter
    }
  }
}

/**
 * Token bucket rate limiter
 */
export class TokenBucketRateLimiter {
  private store: RateLimitStore
  private config: Required<RateLimitConfig & { refillRate: number; bucketSize: number }>

  constructor(config: RateLimitConfig & { refillRate: number; bucketSize: number }) {
    this.config = {
      windowMs: config.windowMs,
      maxRequests: config.maxRequests,
      keyGenerator: config.keyGenerator || this.defaultKeyGenerator,
      skipSuccessfulRequests: config.skipSuccessfulRequests || false,
      skipFailedRequests: config.skipFailedRequests || false,
      message: config.message || 'Too many requests, please try again later',
      headers: config.headers !== false,
      refillRate: config.refillRate,
      bucketSize: config.bucketSize
    }

    this.store = env.isProduction && env.REDIS_URL 
      ? new RedisRateLimitStore() 
      : new MemoryRateLimitStore()
  }

  private defaultKeyGenerator(req: any): string {
    const ip = req.ip || 
               req.connection?.remoteAddress || 
               req.socket?.remoteAddress ||
               req.headers?.['x-forwarded-for']?.split(',')[0] ||
               req.headers?.['x-real-ip'] ||
               'unknown'
    return `bucket:${ip}`
  }

  async checkLimit(req: any): Promise<RateLimitResult> {
    const key = this.config.keyGenerator(req)
    const now = Date.now()
    
    // Get current bucket state
    const entry = await this.store.get(key)
    let tokens = this.config.bucketSize
    let lastRefill = now
    
    if (entry) {
      const bucketData = JSON.parse(entry.count.toString())
      tokens = bucketData.tokens
      lastRefill = bucketData.lastRefill
      
      // Calculate tokens to add based on time passed
      const timePassed = now - lastRefill
      const tokensToAdd = Math.floor(timePassed / this.config.windowMs * this.config.refillRate)
      tokens = Math.min(this.config.bucketSize, tokens + tokensToAdd)
    }
    
    const allowed = tokens > 0
    
    if (allowed) {
      tokens--
    }
    
    // Update bucket state
    await this.store.set(key, {
      count: JSON.parse(JSON.stringify({ tokens, lastRefill: now })) as any,
      resetTime: now + this.config.windowMs
    }, this.config.windowMs)
    
    const retryAfter = allowed ? undefined : Math.ceil(this.config.windowMs / this.config.refillRate / 1000)

    return {
      allowed,
      remaining: tokens,
      resetTime: now + this.config.windowMs,
      totalHits: this.config.bucketSize - tokens,
      retryAfter
    }
  }
}

// Predefined rate limiters for common use cases
export const rateLimiters = {
  // General API rate limiter
  api: new RateLimiter({
    windowMs: env.RATE_LIMIT_WINDOW,
    maxRequests: env.RATE_LIMIT_MAX,
    message: 'Too many API requests, please try again later'
  }),
  
  // Strict rate limiter for authentication endpoints
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts, please try again later',
    keyGenerator: (req) => `auth:${req.ip || 'unknown'}`
  }),
  
  // Rate limiter for password reset
  passwordReset: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 attempts per hour
    message: 'Too many password reset attempts, please try again later',
    keyGenerator: (req) => `pwd_reset:${req.body?.email || req.ip || 'unknown'}`
  }),
  
  // Rate limiter for file uploads
  upload: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 uploads per minute
    message: 'Too many file uploads, please try again later'
  }),
  
  // Rate limiter for search endpoints
  search: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 searches per minute
    message: 'Too many search requests, please try again later'
  })
}

/**
 * Middleware factory for Next.js API routes
 */
export function createRateLimitMiddleware(limiter: RateLimiter) {
  return async (req: any, res: any, next?: () => void) => {
    try {
      const result = await limiter.checkLimit(req)
      
      // Add rate limit headers
      if (limiter['config'].headers) {
        res.setHeader('X-RateLimit-Limit', limiter['config'].maxRequests)
        res.setHeader('X-RateLimit-Remaining', result.remaining)
        res.setHeader('X-RateLimit-Reset', new Date(result.resetTime).toISOString())
        
        if (!result.allowed && result.retryAfter) {
          res.setHeader('Retry-After', result.retryAfter)
        }
      }
      
      if (!result.allowed) {
        return res.status(429).json({
          error: limiter['config'].message,
          retryAfter: result.retryAfter
        })
      }
      
      if (next) {
        next()
      }
    } catch (error) {
      ErrorLogger.error(new AppError('Rate limiting error', ErrorType.SERVER, 500, true, { originalError: error }))
      
      // Allow request to proceed if rate limiting fails
      if (next) {
        next()
      }
    }
  }
}

// Convenience middleware exports
export const apiRateLimit = createRateLimitMiddleware(rateLimiters.api)
export const authRateLimit = createRateLimitMiddleware(rateLimiters.auth)
export const passwordResetRateLimit = createRateLimitMiddleware(rateLimiters.passwordReset)
export const uploadRateLimit = createRateLimitMiddleware(rateLimiters.upload)
export const searchRateLimit = createRateLimitMiddleware(rateLimiters.search)

/**
 * Initialize rate limiter cleanup
 */
export function initializeRateLimiter() {
  // Clean up expired entries every 5 minutes for memory store
  if (!env.isProduction || !env.REDIS_URL) {
    setInterval(() => {
      // Cleanup memory stores
      Object.values(rateLimiters).forEach(limiter => {
        if (limiter['store'] instanceof MemoryRateLimitStore) {
          (limiter['store'] as MemoryRateLimitStore).cleanup()
        }
      })
    }, 5 * 60 * 1000)
  }
}

// Auto-initialize rate limiter
if (typeof window === 'undefined') {
  initializeRateLimiter()
}