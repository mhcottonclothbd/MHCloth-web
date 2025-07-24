/**
 * Production-ready monitoring and analytics system
 * Provides performance tracking, error monitoring, and user analytics
 */

import { ErrorLogger, AppError, ErrorType } from './error-handler'
import { env } from './env'

// Performance metrics interface
export interface PerformanceMetric {
  name: string
  value: number
  unit: 'ms' | 'bytes' | 'count' | 'percentage'
  timestamp: string
  context?: Record<string, any>
}

// User event interface
export interface UserEvent {
  event: string
  userId?: string
  sessionId: string
  properties?: Record<string, any>
  timestamp: string
  page?: string
  userAgent?: string
}

// Business metrics interface
export interface BusinessMetric {
  metric: string
  value: number
  currency?: string
  timestamp: string
  context?: Record<string, any>
}

/**
 * Performance monitoring class
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetric[] = []
  private observers: PerformanceObserver[] = []

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  /**
   * Initialize performance monitoring
   */
  init() {
    if (typeof window === 'undefined') return

    // Monitor Core Web Vitals
    this.observeWebVitals()
    
    // Monitor resource loading
    this.observeResourceTiming()
    
    // Monitor navigation timing
    this.observeNavigationTiming()
    
    // Monitor long tasks
    this.observeLongTasks()
  }

  /**
   * Observe Core Web Vitals (CLS, FID, LCP)
   */
  private observeWebVitals() {
    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        this.recordMetric({
          name: 'LCP',
          value: lastEntry.startTime,
          unit: 'ms',
          timestamp: new Date().toISOString()
        })
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(lcpObserver)

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.recordMetric({
            name: 'FID',
            value: entry.processingStart - entry.startTime,
            unit: 'ms',
            timestamp: new Date().toISOString()
          })
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
      this.observers.push(fidObserver)

      // Cumulative Layout Shift (CLS)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        this.recordMetric({
          name: 'CLS',
          value: clsValue,
          unit: 'count',
          timestamp: new Date().toISOString()
        })
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(clsObserver)

    } catch (error) {
      ErrorLogger.warn(new AppError('Failed to observe web vitals', ErrorType.CLIENT))
    }
  }

  /**
   * Observe resource loading performance
   */
  private observeResourceTiming() {
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (entry.transferSize > 0) {
            this.recordMetric({
              name: 'resource_load_time',
              value: entry.responseEnd - entry.startTime,
              unit: 'ms',
              timestamp: new Date().toISOString(),
              context: {
                resource: entry.name,
                size: entry.transferSize,
                type: entry.initiatorType
              }
            })
          }
        })
      })
      resourceObserver.observe({ entryTypes: ['resource'] })
      this.observers.push(resourceObserver)
    } catch (error) {
      ErrorLogger.warn(new AppError('Failed to observe resource timing', ErrorType.CLIENT))
    }
  }

  /**
   * Observe navigation timing
   */
  private observeNavigationTiming() {
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.recordMetric({
            name: 'page_load_time',
            value: entry.loadEventEnd - entry.startTime,
            unit: 'ms',
            timestamp: new Date().toISOString(),
            context: {
              domContentLoaded: entry.domContentLoadedEventEnd - entry.startTime,
              firstPaint: entry.responseEnd - entry.startTime
            }
          })
        })
      })
      navigationObserver.observe({ entryTypes: ['navigation'] })
      this.observers.push(navigationObserver)
    } catch (error) {
      ErrorLogger.warn(new AppError('Failed to observe navigation timing', ErrorType.CLIENT))
    }
  }

  /**
   * Observe long tasks that block the main thread
   */
  private observeLongTasks() {
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.recordMetric({
            name: 'long_task',
            value: entry.duration,
            unit: 'ms',
            timestamp: new Date().toISOString(),
            context: {
              startTime: entry.startTime,
              attribution: entry.attribution
            }
          })
        })
      })
      longTaskObserver.observe({ entryTypes: ['longtask'] })
      this.observers.push(longTaskObserver)
    } catch (error) {
      ErrorLogger.warn(new AppError('Failed to observe long tasks', ErrorType.CLIENT))
    }
  }

  /**
   * Record a custom performance metric
   */
  recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric)
    
    // Send to analytics service in production
    if (env.isProduction && env.NEXT_PUBLIC_ENABLE_ANALYTICS) {
      this.sendMetricToService(metric)
    }
    
    // Log in development
    if (!env.isProduction) {
      console.log('📊 Performance Metric:', metric)
    }
  }

  /**
   * Send metric to external analytics service
   */
  private async sendMetricToService(metric: PerformanceMetric) {
    try {
      // Example: Send to your analytics service
      // await fetch('/api/analytics/performance', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(metric)
      // })
      
      // For now, just log to console in production
      console.log('Sending metric to analytics service:', metric)
    } catch (error) {
      ErrorLogger.warn(new AppError('Failed to send metric to analytics service', ErrorType.NETWORK))
    }
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics = []
  }

  /**
   * Cleanup observers
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

/**
 * User analytics class
 */
export class UserAnalytics {
  private static instance: UserAnalytics
  private sessionId: string
  private events: UserEvent[] = []

  constructor() {
    this.sessionId = this.generateSessionId()
  }

  static getInstance(): UserAnalytics {
    if (!UserAnalytics.instance) {
      UserAnalytics.instance = new UserAnalytics()
    }
    return UserAnalytics.instance
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Track user event
   */
  track(event: string, properties?: Record<string, any>, userId?: string) {
    const userEvent: UserEvent = {
      event,
      userId,
      sessionId: this.sessionId,
      properties,
      timestamp: new Date().toISOString(),
      page: typeof window !== 'undefined' ? window.location.pathname : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
    }

    this.events.push(userEvent)

    // Send to analytics service in production
    if (env.isProduction && env.NEXT_PUBLIC_ENABLE_ANALYTICS) {
      this.sendEventToService(userEvent)
    }

    // Log in development
    if (!env.isProduction) {
      console.log('📈 User Event:', userEvent)
    }
  }

  /**
   * Track page view
   */
  trackPageView(page: string, userId?: string) {
    this.track('page_view', { page }, userId)
  }

  /**
   * Track user action
   */
  trackAction(action: string, properties?: Record<string, any>, userId?: string) {
    this.track('user_action', { action, ...properties }, userId)
  }

  /**
   * Track conversion event
   */
  trackConversion(event: string, value?: number, currency?: string, userId?: string) {
    this.track('conversion', { event, value, currency }, userId)
  }

  /**
   * Send event to external analytics service
   */
  private async sendEventToService(event: UserEvent) {
    try {
      // Example: Send to your analytics service
      // await fetch('/api/analytics/events', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // })
      
      // For now, just log to console in production
      console.log('Sending event to analytics service:', event)
    } catch (error) {
      ErrorLogger.warn(new AppError('Failed to send event to analytics service', ErrorType.NETWORK))
    }
  }

  /**
   * Get all tracked events
   */
  getEvents(): UserEvent[] {
    return [...this.events]
  }

  /**
   * Clear all events
   */
  clearEvents() {
    this.events = []
  }
}

/**
 * Business metrics tracker
 */
export class BusinessMetrics {
  private static instance: BusinessMetrics
  private metrics: BusinessMetric[] = []

  static getInstance(): BusinessMetrics {
    if (!BusinessMetrics.instance) {
      BusinessMetrics.instance = new BusinessMetrics()
    }
    return BusinessMetrics.instance
  }

  /**
   * Track revenue metric
   */
  trackRevenue(amount: number, currency: string = 'USD', context?: Record<string, any>) {
    this.recordMetric({
      metric: 'revenue',
      value: amount,
      currency,
      timestamp: new Date().toISOString(),
      context
    })
  }

  /**
   * Track conversion rate
   */
  trackConversionRate(rate: number, context?: Record<string, any>) {
    this.recordMetric({
      metric: 'conversion_rate',
      value: rate,
      timestamp: new Date().toISOString(),
      context
    })
  }

  /**
   * Track cart abandonment
   */
  trackCartAbandonment(cartValue: number, context?: Record<string, any>) {
    this.recordMetric({
      metric: 'cart_abandonment',
      value: cartValue,
      currency: 'USD',
      timestamp: new Date().toISOString(),
      context
    })
  }

  /**
   * Record business metric
   */
  private recordMetric(metric: BusinessMetric) {
    this.metrics.push(metric)

    // Send to analytics service in production
    if (env.isProduction && env.NEXT_PUBLIC_ENABLE_ANALYTICS) {
      this.sendMetricToService(metric)
    }

    // Log in development
    if (!env.isProduction) {
      console.log('💰 Business Metric:', metric)
    }
  }

  /**
   * Send metric to external service
   */
  private async sendMetricToService(metric: BusinessMetric) {
    try {
      // Example: Send to your analytics service
      // await fetch('/api/analytics/business', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(metric)
      // })
      
      console.log('Sending business metric to analytics service:', metric)
    } catch (error) {
      ErrorLogger.warn(new AppError('Failed to send business metric to analytics service', ErrorType.NETWORK))
    }
  }

  /**
   * Get all business metrics
   */
  getMetrics(): BusinessMetric[] {
    return [...this.metrics]
  }
}

// Export singleton instances
export const performanceMonitor = PerformanceMonitor.getInstance()
export const userAnalytics = UserAnalytics.getInstance()
export const businessMetrics = BusinessMetrics.getInstance()

// Convenience functions
export const monitoring = {
  // Performance
  init: () => performanceMonitor.init(),
  recordMetric: (metric: PerformanceMetric) => performanceMonitor.recordMetric(metric),
  getPerformanceMetrics: () => performanceMonitor.getMetrics(),
  
  // User Analytics
  track: (event: string, properties?: Record<string, any>, userId?: string) => 
    userAnalytics.track(event, properties, userId),
  trackPageView: (page: string, userId?: string) => userAnalytics.trackPageView(page, userId),
  trackAction: (action: string, properties?: Record<string, any>, userId?: string) => 
    userAnalytics.trackAction(action, properties, userId),
  trackConversion: (event: string, value?: number, currency?: string, userId?: string) => 
    userAnalytics.trackConversion(event, value, currency, userId),
  
  // Business Metrics
  trackRevenue: (amount: number, currency?: string, context?: Record<string, any>) => 
    businessMetrics.trackRevenue(amount, currency, context),
  trackConversionRate: (rate: number, context?: Record<string, any>) => 
    businessMetrics.trackConversionRate(rate, context),
  trackCartAbandonment: (cartValue: number, context?: Record<string, any>) => 
    businessMetrics.trackCartAbandonment(cartValue, context),
  
  // Cleanup
  cleanup: () => performanceMonitor.cleanup()
}

/**
 * Initialize monitoring system
 */
export function initializeMonitoring() {
  if (typeof window !== 'undefined') {
    performanceMonitor.init()
    
    // Track initial page view
    userAnalytics.trackPageView(window.location.pathname)
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        userAnalytics.track('page_hidden')
      } else {
        userAnalytics.track('page_visible')
      }
    })
    
    // Track unload events
    window.addEventListener('beforeunload', () => {
      userAnalytics.track('page_unload')
    })
  }
}