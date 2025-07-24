/**
 * Production-ready security utilities
 * Provides encryption, hashing, input validation, and security headers
 */

import crypto from 'crypto'
import { ErrorLogger, AppError, ErrorType } from './error-handler'
import { env } from './env'

// Security configuration interface
export interface SecurityConfig {
  encryptionKey?: string
  jwtSecret?: string
  corsOrigins?: string[]
  csrfTokenLength?: number
  sessionTimeout?: number
}

// Input validation schemas
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  type?: 'string' | 'number' | 'email' | 'url' | 'phone' | 'password'
  custom?: (value: any) => boolean | string
}

export interface ValidationSchema {
  [key: string]: ValidationRule
}

/**
 * Encryption utilities
 */
export class Encryption {
  private static algorithm = 'aes-256-gcm'
  private static keyLength = 32
  private static ivLength = 16
  private static tagLength = 16

  /**
   * Generate a secure random key
   */
  static generateKey(): string {
    return crypto.randomBytes(this.keyLength).toString('hex')
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  static encrypt(data: string, key?: string): string {
    try {
      const encryptionKey = key || env.ENCRYPTION_KEY
      if (!encryptionKey) {
        throw new AppError('Encryption key not provided', ErrorType.SERVER)
      }

      const keyBuffer = Buffer.from(encryptionKey, 'hex')
      const iv = crypto.randomBytes(this.ivLength)
      const cipher = crypto.createCipheriv(this.algorithm, keyBuffer, iv)

      let encrypted = cipher.update(data, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      const tag = (cipher as any).getAuthTag()
      
      // Combine IV, tag, and encrypted data
      return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted
    } catch (error) {
      ErrorLogger.error(new AppError('Encryption failed', ErrorType.SERVER, 500, true, { originalError: error }))
      throw new AppError('Encryption failed', ErrorType.SERVER)
    }
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  static decrypt(encryptedData: string, key?: string): string {
    try {
      const encryptionKey = key || env.ENCRYPTION_KEY
      if (!encryptionKey) {
        throw new AppError('Encryption key not provided', ErrorType.SERVER)
      }

      const parts = encryptedData.split(':')
      if (parts.length !== 3) {
        throw new AppError('Invalid encrypted data format', ErrorType.VALIDATION)
      }

      const keyBuffer = Buffer.from(encryptionKey, 'hex')
      const iv = Buffer.from(parts[0], 'hex')
      const tag = Buffer.from(parts[1], 'hex')
      const encrypted = parts[2]

      const decipher = crypto.createDecipheriv(this.algorithm, keyBuffer, iv)
      ;(decipher as any).setAuthTag(tag)

      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      
      return decrypted
    } catch (error) {
      ErrorLogger.error(new AppError('Decryption failed', ErrorType.SERVER, 500, true, { originalError: error }))
      throw new AppError('Decryption failed', ErrorType.SERVER)
    }
  }
}

/**
 * Hashing utilities
 */
export class Hashing {
  private static saltRounds = 12

  /**
   * Hash password using bcrypt-like algorithm
   */
  static async hashPassword(password: string): Promise<string> {
    try {
      // Generate salt
      const salt = crypto.randomBytes(16).toString('hex')
      
      // Hash password with salt using PBKDF2
      const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
      
      return `${salt}:${hash}`
    } catch (error) {
      ErrorLogger.error(new AppError('Password hashing failed', ErrorType.SERVER, 500, true, { originalError: error }))
      throw new AppError('Password hashing failed', ErrorType.SERVER)
    }
  }

  /**
   * Verify password against hash
   */
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const parts = hashedPassword.split(':')
      if (parts.length !== 2) {
        return false
      }

      const [salt, hash] = parts
      const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
      
      return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verifyHash, 'hex'))
    } catch (error) {
      ErrorLogger.error(new AppError('Password verification failed', ErrorType.SERVER, 500, true, { originalError: error }))
      return false
    }
  }

  /**
   * Generate secure random token
   */
  static generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }

  /**
   * Generate CSRF token
   */
  static generateCSRFToken(): string {
    return this.generateToken(32)
  }

  /**
   * Hash data using SHA-256
   */
  static sha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex')
  }

  /**
   * Generate HMAC signature
   */
  static generateHMAC(data: string, secret?: string): string {
    const key = secret || env.ENCRYPTION_KEY
    if (!key) {
      throw new AppError('HMAC secret not provided', ErrorType.SERVER)
    }
    return crypto.createHmac('sha256', key).update(data).digest('hex')
  }

  /**
   * Verify HMAC signature
   */
  static verifyHMAC(data: string, signature: string, secret?: string): boolean {
    try {
      const expectedSignature = this.generateHMAC(data, secret)
      return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'))
    } catch (error) {
      return false
    }
  }
}

/**
 * Input validation utilities
 */
export class InputValidator {
  private static patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    numeric: /^\d+$/,
    alpha: /^[a-zA-Z]+$/
  }

  /**
   * Validate single value against rule
   */
  static validateValue(value: any, rule: ValidationRule): { valid: boolean; error?: string } {
    // Check required
    if (rule.required && (value === undefined || value === null || value === '')) {
      return { valid: false, error: 'This field is required' }
    }

    // Skip other validations if value is empty and not required
    if (!rule.required && (value === undefined || value === null || value === '')) {
      return { valid: true }
    }

    // Type validation
    if (rule.type) {
      switch (rule.type) {
        case 'string':
          if (typeof value !== 'string') {
            return { valid: false, error: 'Must be a string' }
          }
          break
        case 'number':
          if (typeof value !== 'number' && !this.patterns.numeric.test(value)) {
            return { valid: false, error: 'Must be a number' }
          }
          break
        case 'email':
          if (!this.patterns.email.test(value)) {
            return { valid: false, error: 'Must be a valid email address' }
          }
          break
        case 'url':
          if (!this.patterns.url.test(value)) {
            return { valid: false, error: 'Must be a valid URL' }
          }
          break
        case 'phone':
          if (!this.patterns.phone.test(value)) {
            return { valid: false, error: 'Must be a valid phone number' }
          }
          break
        case 'password':
          if (!this.patterns.password.test(value)) {
            return { valid: false, error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' }
          }
          break
      }
    }

    // Length validation
    if (rule.minLength && value.length < rule.minLength) {
      return { valid: false, error: `Must be at least ${rule.minLength} characters long` }
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return { valid: false, error: `Must be no more than ${rule.maxLength} characters long` }
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return { valid: false, error: 'Invalid format' }
    }

    // Custom validation
    if (rule.custom) {
      const result = rule.custom(value)
      if (result !== true) {
        return { valid: false, error: typeof result === 'string' ? result : 'Invalid value' }
      }
    }

    return { valid: true }
  }

  /**
   * Validate object against schema
   */
  static validate(data: Record<string, any>, schema: ValidationSchema): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    for (const [field, rule] of Object.entries(schema)) {
      const result = this.validateValue(data[field], rule)
      if (!result.valid && result.error) {
        errors[field] = result.error
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    }
  }

  /**
   * Sanitize HTML input
   */
  static sanitizeHTML(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }

  /**
   * Sanitize SQL input (basic protection)
   */
  static sanitizeSQL(input: string): string {
    return input.replace(/[';"\\]/g, '')
  }

  /**
   * Check for common XSS patterns
   */
  static containsXSS(input: string): boolean {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>.*?<\/embed>/gi
    ]

    return xssPatterns.some(pattern => pattern.test(input))
  }
}

/**
 * Security headers utilities
 */
export class SecurityHeaders {
  /**
   * Get security headers for responses
   */
  static getSecurityHeaders(options: {
    corsOrigin?: string
    cspDirectives?: Record<string, string[]>
    enableHSTS?: boolean
  } = {}): Record<string, string> {
    const headers: Record<string, string> = {}

    // CORS headers
    if (options.corsOrigin) {
      headers['Access-Control-Allow-Origin'] = options.corsOrigin
      headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
      headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
      headers['Access-Control-Allow-Credentials'] = 'true'
    }

    // Content Security Policy
    const defaultCSP = {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'", 'https:'],
      'connect-src': ["'self'"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    }

    const cspDirectives = { ...defaultCSP, ...options.cspDirectives }
    const cspString = Object.entries(cspDirectives)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ')
    
    headers['Content-Security-Policy'] = cspString

    // Other security headers
    headers['X-Content-Type-Options'] = 'nosniff'
    headers['X-Frame-Options'] = 'DENY'
    headers['X-XSS-Protection'] = '1; mode=block'
    headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()'

    // HSTS (only for HTTPS)
    if (options.enableHSTS) {
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
    }

    return headers
  }

  /**
   * Apply security headers to Next.js response
   */
  static applyToResponse(res: any, options?: Parameters<typeof SecurityHeaders.getSecurityHeaders>[0]) {
    const headers = this.getSecurityHeaders(options)
    
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value)
    })
  }
}

/**
 * Session security utilities
 */
export class SessionSecurity {
  /**
   * Generate secure session ID
   */
  static generateSessionId(): string {
    return Hashing.generateToken(64)
  }

  /**
   * Create session token with expiration
   */
  static createSessionToken(userId: string, expiresIn: number = 24 * 60 * 60 * 1000): string {
    const payload = {
      userId,
      iat: Date.now(),
      exp: Date.now() + expiresIn,
      jti: Hashing.generateToken(16) // JWT ID for revocation
    }

    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
    const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
    const signature = Hashing.generateHMAC(`${header}.${payloadEncoded}`)
    
    return `${header}.${payloadEncoded}.${signature}`
  }

  /**
   * Verify session token
   */
  static verifySessionToken(token: string): { valid: boolean; payload?: any; error?: string } {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) {
        return { valid: false, error: 'Invalid token format' }
      }

      const [header, payloadEncoded, signature] = parts
      const expectedSignature = Hashing.generateHMAC(`${header}.${payloadEncoded}`)
      
      if (!Hashing.verifyHMAC(`${header}.${payloadEncoded}`, signature)) {
        return { valid: false, error: 'Invalid signature' }
      }

      const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64url').toString())
      
      if (Date.now() > payload.exp) {
        return { valid: false, error: 'Token expired' }
      }

      return { valid: true, payload }
    } catch (error) {
      return { valid: false, error: 'Token verification failed' }
    }
  }
}

// Export convenience functions
export const security = {
  // Encryption
  encrypt: Encryption.encrypt,
  decrypt: Encryption.decrypt,
  generateKey: Encryption.generateKey,
  
  // Hashing
  hashPassword: Hashing.hashPassword,
  verifyPassword: Hashing.verifyPassword,
  generateToken: Hashing.generateToken,
  generateCSRFToken: Hashing.generateCSRFToken,
  sha256: Hashing.sha256,
  generateHMAC: Hashing.generateHMAC,
  verifyHMAC: Hashing.verifyHMAC,
  
  // Validation
  validate: InputValidator.validate,
  validateValue: InputValidator.validateValue,
  sanitizeHTML: InputValidator.sanitizeHTML,
  sanitizeSQL: InputValidator.sanitizeSQL,
  containsXSS: InputValidator.containsXSS,
  
  // Headers
  getSecurityHeaders: SecurityHeaders.getSecurityHeaders,
  applySecurityHeaders: SecurityHeaders.applyToResponse,
  
  // Sessions
  generateSessionId: SessionSecurity.generateSessionId,
  createSessionToken: SessionSecurity.createSessionToken,
  verifySessionToken: SessionSecurity.verifySessionToken
}

// Common validation schemas
export const validationSchemas = {
  user: {
    email: { required: true, type: 'email' as const },
    password: { required: true, type: 'password' as const },
    firstName: { required: true, type: 'string' as const, minLength: 2, maxLength: 50 },
    lastName: { required: true, type: 'string' as const, minLength: 2, maxLength: 50 },
    phone: { type: 'phone' as const }
  },
  
  product: {
    name: { required: true, type: 'string' as const, minLength: 3, maxLength: 100 },
    description: { required: true, type: 'string' as const, minLength: 10, maxLength: 1000 },
    price: { required: true, type: 'number' as const },
    category: { required: true, type: 'string' as const },
    stock: { required: true, type: 'number' as const }
  },
  
  order: {
    items: { required: true },
    shippingAddress: { required: true, type: 'string' as const },
    paymentMethod: { required: true, type: 'string' as const }
  }
}