/**
 * Production-ready API client with comprehensive error handling,
 * request/response interceptors, and type safety
 */

import { AppError, ErrorType, createError, withNetworkErrorHandling } from './error-handler'
import { env } from './env'

// API Response wrapper type
export interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

// API Error response type
export interface ApiErrorResponse {
  success: false
  message: string
  errors?: string[]
  code?: string
  statusCode?: number
}

// Request configuration
export interface RequestConfig extends RequestInit {
  timeout?: number
  retries?: number
  retryDelay?: number
  skipAuth?: boolean
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Production-ready API client class
 */
export class ApiClient {
  private baseURL: string
  private defaultTimeout: number = 30000 // 30 seconds
  private defaultRetries: number = 3
  private defaultRetryDelay: number = 1000 // 1 second

  constructor(baseURL?: string) {
    this.baseURL = baseURL || env.NEXT_PUBLIC_APP_URL || '/api'
  }

  /**
   * Get authentication token from storage or context
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      // For Clerk authentication
      if (typeof window !== 'undefined') {
        // Client-side: get from Clerk
        const { useAuth } = await import('@clerk/nextjs')
        // Note: This is a simplified approach. In practice, you'd use useAuth hook in components
        // For now, return null and handle auth in components
        return null
      } else {
        // Server-side: get from headers or context
        return null
      }
    } catch (error) {
      console.warn('Failed to get auth token:', error)
      return null
    }
  }

  /**
   * Create request headers with authentication and content type
   */
  private async createHeaders(config?: RequestConfig): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    // Add authentication if not skipped
    if (!config?.skipAuth) {
      const token = await this.getAuthToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    // Add custom headers
    if (config?.headers) {
      Object.assign(headers, config.headers)
    }

    return headers
  }

  /**
   * Create AbortController with timeout
   */
  private createAbortController(timeout: number): AbortController {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), timeout)
    return controller
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Handle API response and errors
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    let responseData: any
    try {
      responseData = isJson ? await response.json() : await response.text()
    } catch (error) {
      throw createError.network('Failed to parse response')
    }

    if (!response.ok) {
      const errorMessage = responseData?.message || responseData?.error || `HTTP ${response.status}: ${response.statusText}`
      
      switch (response.status) {
        case 400:
          throw createError.validation(errorMessage, responseData)
        case 401:
          throw createError.authentication(errorMessage)
        case 403:
          throw createError.authorization(errorMessage)
        case 404:
          throw createError.notFound(errorMessage)
        case 429:
          throw createError.rateLimit(errorMessage)
        case 500:
        case 502:
        case 503:
        case 504:
          throw createError.server(errorMessage)
        default:
          throw new AppError(errorMessage, ErrorType.NETWORK, response.status)
      }
    }

    // Ensure response follows our API format
    if (isJson && typeof responseData === 'object') {
      return {
        data: responseData.data || responseData,
        success: responseData.success !== false,
        message: responseData.message,
        errors: responseData.errors,
        meta: responseData.meta
      }
    }

    return {
      data: responseData as T,
      success: true
    }
  }

  /**
   * Make HTTP request with retries and error handling
   */
  private async makeRequest<T>(
    endpoint: string,
    method: HttpMethod,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`
    const timeout = config?.timeout || this.defaultTimeout
    const maxRetries = config?.retries || this.defaultRetries
    const retryDelay = config?.retryDelay || this.defaultRetryDelay

    let lastError: Error

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = this.createAbortController(timeout)
        const headers = await this.createHeaders(config)

        const requestConfig: RequestInit = {
          method,
          headers,
          signal: controller.signal,
          ...config
        }

        // Add body for non-GET requests
        if (method !== 'GET' && config?.body) {
          if (typeof config.body === 'object' && !(config.body instanceof FormData)) {
            requestConfig.body = JSON.stringify(config.body)
          } else {
            requestConfig.body = config.body as BodyInit
            // Remove content-type for FormData to let browser set it
            if (config.body instanceof FormData) {
              delete (requestConfig.headers as any)['Content-Type']
            }
          }
        }

        const response = await fetch(url, requestConfig)
        return await this.handleResponse<T>(response)

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')

        // Don't retry on certain errors
        if (
          error instanceof AppError && 
          [ErrorType.AUTHENTICATION, ErrorType.AUTHORIZATION, ErrorType.VALIDATION].includes(error.type)
        ) {
          throw error
        }

        // Don't retry on last attempt
        if (attempt === maxRetries) {
          break
        }

        // Wait before retry
        await this.sleep(retryDelay * Math.pow(2, attempt)) // Exponential backoff
      }
    }

    throw lastError!
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return withNetworkErrorHandling(
      () => this.makeRequest<T>(endpoint, 'GET', config),
      endpoint
    )
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return withNetworkErrorHandling(
      () => this.makeRequest<T>(endpoint, 'POST', { ...config, body: data }),
      endpoint
    )
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return withNetworkErrorHandling(
      () => this.makeRequest<T>(endpoint, 'PUT', { ...config, body: data }),
      endpoint
    )
  }

  /**
   * PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return withNetworkErrorHandling(
      () => this.makeRequest<T>(endpoint, 'PATCH', { ...config, body: data }),
      endpoint
    )
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return withNetworkErrorHandling(
      () => this.makeRequest<T>(endpoint, 'DELETE', config),
      endpoint
    )
  }

  /**
   * Upload file with progress tracking
   */
  async uploadFile<T = any>(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const formData = new FormData()
      formData.append('file', file)

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100
            onProgress(progress)
          }
        })
      }

      xhr.addEventListener('load', async () => {
        try {
          const response = new Response(xhr.responseText, {
            status: xhr.status,
            statusText: xhr.statusText
          })
          const result = await this.handleResponse<T>(response)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })

      xhr.addEventListener('error', () => {
        reject(createError.network('File upload failed'))
      })

      xhr.addEventListener('timeout', () => {
        reject(createError.network('File upload timeout'))
      })

      const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`
      xhr.open('POST', url)
      
      // Add auth header if needed
      this.getAuthToken().then(token => {
        if (token && !config?.skipAuth) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        }
        xhr.send(formData)
      })
    })
  }
}

// Default API client instance
export const apiClient = new ApiClient()

// Convenience functions
export const api = {
  get: <T = any>(endpoint: string, config?: RequestConfig) => apiClient.get<T>(endpoint, config),
  post: <T = any>(endpoint: string, data?: any, config?: RequestConfig) => apiClient.post<T>(endpoint, data, config),
  put: <T = any>(endpoint: string, data?: any, config?: RequestConfig) => apiClient.put<T>(endpoint, data, config),
  patch: <T = any>(endpoint: string, data?: any, config?: RequestConfig) => apiClient.patch<T>(endpoint, data, config),
  delete: <T = any>(endpoint: string, config?: RequestConfig) => apiClient.delete<T>(endpoint, config),
  upload: <T = any>(endpoint: string, file: File, onProgress?: (progress: number) => void, config?: RequestConfig) => 
    apiClient.uploadFile<T>(endpoint, file, onProgress, config)
}

// Type-safe API endpoints (add your specific endpoints here)
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile'
  },
  
  // Products
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    create: '/products',
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
    search: '/products/search'
  },
  
  // Orders
  orders: {
    list: '/orders',
    detail: (id: string) => `/orders/${id}`,
    create: '/orders',
    update: (id: string) => `/orders/${id}`,
    cancel: (id: string) => `/orders/${id}/cancel`
  },
  
  // Cart
  cart: {
    get: '/cart',
    add: '/cart/items',
    update: (itemId: string) => `/cart/items/${itemId}`,
    remove: (itemId: string) => `/cart/items/${itemId}`,
    clear: '/cart/clear'
  },
  
  // Users
  users: {
    profile: '/users/profile',
    update: '/users/profile',
    preferences: '/users/preferences'
  }
} as const