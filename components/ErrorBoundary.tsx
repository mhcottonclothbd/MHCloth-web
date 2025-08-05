'use client'

/**
 * React Error Boundary component for graceful error handling
 * Catches JavaScript errors anywhere in the child component tree
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'
// Note: Backend error handling removed - using simple frontend-only implementation

// Simple error types for frontend-only functionality
enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN'
}

class AppError extends Error {
  constructor(message: string, public type: ErrorType = ErrorType.UNKNOWN) {
    super(message)
    this.name = 'AppError'
  }
}

// Simple error logger for frontend
const ErrorLogger = {
  logError: (error: Error, context?: any) => {
    console.error('Error logged:', error, context)
  },
  error: (message: string, error?: Error, context?: any, type?: ErrorType, userId?: string) => {
    console.error('Error:', message, error, context, type, userId)
    return Math.random().toString(36).substr(2, 9) // Simple error ID
  }
}

// Simple user-friendly message function
const getUserFriendlyMessage = (error: Error): string => {
  if (error.message.includes('network') || error.message.includes('fetch')) {
    return 'Network connection issue. Please check your internet connection.'
  }
  return 'Something went wrong. Please try again.'
}
// import { Button } from '@/components/ui/button' // TODO: Create or import proper Button component

// Temporary Button component for now
const Button = ({ children, onClick, variant = 'default', size = 'default', className = '', ...props }: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm'
  className?: string
  [key: string]: any
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded font-medium transition-colors ${
      variant === 'outline' 
        ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' 
        : 'bg-blue-600 text-white hover:bg-blue-700'
    } ${size === 'sm' ? 'px-3 py-1 text-sm' : ''} ${className}`}
    {...props}
  >
    {children}
  </button>
)
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorId: string | null
}

/**
 * Error Boundary component that catches and handles React errors
 * Provides a user-friendly fallback UI when errors occur
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      hasError: true,
      error,
      errorId
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error with context
    const appError = new AppError(
      error.message,
      ErrorType.CLIENT,
      500,
      true,
      {
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
        errorId: this.state.errorId
      }
    )

    ErrorLogger.error(appError, {
      errorInfo,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null
    })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 mb-4">
                {this.state.error ? getUserFriendlyMessage(this.state.error) : 'An unexpected error occurred'}
              </p>
              {this.state.errorId && (
                <p className="text-xs text-gray-400 mb-6">
                  Error ID: {this.state.errorId}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Button 
                onClick={this.handleRetry}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Technical Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Higher-order component to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

/**
 * Lightweight error boundary for specific sections
 */
export function SectionErrorBoundary({ 
  children, 
  title = "Section Error",
  description = "This section encountered an error"
}: {
  children: ReactNode
  title?: string
  description?: string
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-red-500 mb-3" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
          <p className="text-red-700 mb-4">{description}</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Page
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Hook for handling async errors in functional components
 */
export function useErrorHandler() {
  const handleError = React.useCallback((error: Error, context?: Record<string, any>) => {
    const appError = error instanceof AppError ? error : new AppError(
      error.message,
      ErrorType.CLIENT,
      500,
      true,
      context
    )
    
    ErrorLogger.error(appError, context)
    
    // You can also trigger a toast notification here
    // toast.error(getUserFriendlyMessage(appError))
  }, [])

  return { handleError }
}

/**
 * Async error wrapper hook
 */
export function useAsyncError() {
  const [error, setError] = React.useState<Error | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const execute = React.useCallback(async <T,>(
    asyncFunction: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void
  ): Promise<T | null> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await asyncFunction()
      
      if (onSuccess) {
        onSuccess(result)
      }
      
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      
      ErrorLogger.error(error)
      
      if (onError) {
        onError(error)
      }
      
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  return {
    error,
    isLoading,
    execute,
    clearError,
    hasError: !!error
  }
}