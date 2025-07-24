/**
 * Comprehensive error handling system for production-ready application
 * Provides centralized error logging, user-friendly error messages, and error boundaries
 */

import { isProduction } from './env'

// Error types for better categorization
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  NETWORK = 'NETWORK',
  DATABASE = 'DATABASE',
  PAYMENT = 'PAYMENT',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN'
}

// Custom error class with additional context
export class AppError extends Error {
  public readonly type: ErrorType
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly context?: Record<string, any>
  public readonly timestamp: string

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message)
    this.type = type
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.context = context
    this.timestamp = new Date().toISOString()
    
    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor)
  }
}

// Predefined error creators for common scenarios
export const createError = {
  validation: (message: string, context?: Record<string, any>) => 
    new AppError(message, ErrorType.VALIDATION, 400, true, context),
    
  authentication: (message: string = 'Authentication required') => 
    new AppError(message, ErrorType.AUTHENTICATION, 401),
    
  authorization: (message: string = 'Insufficient permissions') => 
    new AppError(message, ErrorType.AUTHORIZATION, 403),
    
  notFound: (resource: string = 'Resource') => 
    new AppError(`${resource} not found`, ErrorType.NOT_FOUND, 404),
    
  network: (message: string = 'Network error occurred') => 
    new AppError(message, ErrorType.NETWORK, 503),
    
  database: (message: string = 'Database operation failed') => 
    new AppError(message, ErrorType.DATABASE, 500),
    
  payment: (message: string = 'Payment processing failed') => 
    new AppError(message, ErrorType.PAYMENT, 402),
    
  rateLimit: (message: string = 'Too many requests') => 
    new AppError(message, ErrorType.RATE_LIMIT, 429),
    
  server: (message: string = 'Internal server error') => 
    new AppError(message, ErrorType.SERVER, 500),
    
  client: (message: string = 'Bad request') => 
    new AppError(message, ErrorType.CLIENT, 400)
}

// Error logger with different levels
export class ErrorLogger {
  private static log(level: 'error' | 'warn' | 'info', error: Error | AppError, context?: Record<string, any>) {
    const logData = {
      timestamp: new Date().toISOString(),
      level,
      message: error.message,
      stack: error.stack,
      ...(error instanceof AppError && {
        type: error.type,
        statusCode: error.statusCode,
        isOperational: error.isOperational,
        errorContext: error.context
      }),
      ...context
    }

    if (isProduction) {
      // In production, send to external logging service
      // Example: Sentry, LogRocket, DataDog, etc.
      console.error(JSON.stringify(logData))
      
      // TODO: Integrate with your preferred logging service
      // await sendToLoggingService(logData)
    } else {
      // In development, log to console with formatting
      console.group(`🚨 ${level.toUpperCase()}: ${error.message}`)
      console.error('Error:', error)
      if (context) console.log('Context:', context)
      if (error instanceof AppError && error.context) {
        console.log('Error Context:', error.context)
      }
      console.groupEnd()
    }
  }

  static error(error: Error | AppError, context?: Record<string, any>) {
    this.log('error', error, context)
  }

  static warn(error: Error | AppError, context?: Record<string, any>) {
    this.log('warn', error, context)
  }

  static info(error: Error | AppError, context?: Record<string, any>) {
    this.log('info', error, context)
  }
}

// User-friendly error messages
export function getUserFriendlyMessage(error: Error | AppError): string {
  if (error instanceof AppError) {
    switch (error.type) {
      case ErrorType.VALIDATION:
        return error.message // Validation messages are usually user-friendly
      case ErrorType.AUTHENTICATION:
        return 'Please sign in to continue'
      case ErrorType.AUTHORIZATION:
        return 'You don\'t have permission to perform this action'
      case ErrorType.NOT_FOUND:
        return 'The requested item could not be found'
      case ErrorType.NETWORK:
        return 'Network connection error. Please check your internet connection'
      case ErrorType.DATABASE:
        return 'We\'re experiencing technical difficulties. Please try again later'
      case ErrorType.PAYMENT:
        return 'Payment processing failed. Please check your payment details'
      case ErrorType.RATE_LIMIT:
        return 'Too many requests. Please wait a moment before trying again'
      case ErrorType.SERVER:
        return 'Something went wrong on our end. Please try again later'
      case ErrorType.CLIENT:
        return 'Invalid request. Please check your input and try again'
      default:
        return 'An unexpected error occurred. Please try again'
    }
  }
  
  // For generic errors, provide a safe fallback
  return 'An unexpected error occurred. Please try again'
}

// Error boundary hook for React components
export function handleAsyncError<T>(
  asyncFn: () => Promise<T>,
  errorHandler?: (error: Error) => void
): Promise<T | null> {
  return asyncFn().catch((error: Error) => {
    ErrorLogger.error(error)
    if (errorHandler) {
      errorHandler(error)
    }
    return null
  })
}

// API error handler for Next.js API routes
export function handleApiError(error: unknown): { error: string; statusCode: number } {
  if (error instanceof AppError) {
    ErrorLogger.error(error)
    return {
      error: isProduction ? getUserFriendlyMessage(error) : error.message,
      statusCode: error.statusCode
    }
  }
  
  if (error instanceof Error) {
    const appError = new AppError(error.message, ErrorType.SERVER, 500, false)
    ErrorLogger.error(appError)
    return {
      error: getUserFriendlyMessage(appError),
      statusCode: 500
    }
  }
  
  // Unknown error type
  const unknownError = new AppError('Unknown error occurred', ErrorType.UNKNOWN, 500, false)
  ErrorLogger.error(unknownError)
  return {
    error: getUserFriendlyMessage(unknownError),
    statusCode: 500
  }
}

// Validation helper
export function validateRequired<T>(value: T | null | undefined, fieldName: string): T {
  if (value === null || value === undefined || value === '') {
    throw createError.validation(`${fieldName} is required`)
  }
  return value
}

// Async wrapper with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorContext?: Record<string, any>
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (error instanceof AppError) {
      ErrorLogger.error(error, errorContext)
      throw error
    }
    
    const wrappedError = new AppError(
      error instanceof Error ? error.message : 'Unknown error',
      ErrorType.UNKNOWN,
      500,
      false,
      errorContext
    )
    
    ErrorLogger.error(wrappedError)
    throw wrappedError
  }
}

// Database operation wrapper
export async function withDatabaseErrorHandling<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    const dbError = createError.database(`Database ${operationName} failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    ErrorLogger.error(dbError, { operation: operationName })
    throw dbError
  }
}

// Network request wrapper
export async function withNetworkErrorHandling<T>(
  request: () => Promise<T>,
  endpoint: string
): Promise<T> {
  try {
    return await request()
  } catch (error) {
    const networkError = createError.network(`Network request to ${endpoint} failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    ErrorLogger.error(networkError, { endpoint })
    throw networkError
  }
}