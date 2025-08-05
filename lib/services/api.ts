/**
 * API Service Layer
 * Centralized service for making API calls and handling responses
 */

export interface ApiResponse<T> {
  data: T
  count?: number
  pagination?: {
    limit: number
    offset: number
    hasMore: boolean
  }
}

export interface ApiError {
  error: string
}

// Product API
export const productApi = {
  async getProducts(params?: {
    category?: string
    limit?: number
    offset?: number
    featured?: boolean
    onSale?: boolean
    search?: string
  }): Promise<ApiResponse<any[]> | ApiError> {
    const searchParams = new URLSearchParams()
    
    if (params?.category) searchParams.set('category', params.category)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.offset) searchParams.set('offset', params.offset.toString())
    if (params?.featured) searchParams.set('featured', 'true')
    if (params?.onSale) searchParams.set('onSale', 'true')
    if (params?.search) searchParams.set('search', params.search)
    
    const response = await fetch(`/api/products?${searchParams.toString()}`)
    return response.json()
  },

  async getProduct(id: string): Promise<any | ApiError> {
    const response = await fetch(`/api/products/${id}`)
    return response.json()
  }
}

// Category API
export const categoryApi = {
  async getCategories(params?: {
    parent?: string
    limit?: number
    offset?: number
  }): Promise<ApiResponse<any[]> | ApiError> {
    const searchParams = new URLSearchParams()
    
    if (params?.parent) searchParams.set('parent', params.parent)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.offset) searchParams.set('offset', params.offset.toString())
    
    const response = await fetch(`/api/categories?${searchParams.toString()}`)
    return response.json()
  },

  async getCategory(id: string): Promise<any | ApiError> {
    const response = await fetch(`/api/categories/${id}`)
    return response.json()
  }
}

// Dashboard API
export const dashboardApi = {
  async getDashboardData(timeRange: string = '7d'): Promise<any | ApiError> {
    const response = await fetch(`/api/admin/dashboard?timeRange=${timeRange}`)
    return response.json()
  }
}

// Order API
export const orderApi = {
  async getOrders(params?: {
    limit?: number
    offset?: number
    status?: string
  }): Promise<ApiResponse<any[]> | ApiError> {
    const searchParams = new URLSearchParams()
    
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.offset) searchParams.set('offset', params.offset.toString())
    if (params?.status) searchParams.set('status', params.status)
    
    const response = await fetch(`/api/orders?${searchParams.toString()}`)
    return response.json()
  },

  async createOrder(orderData: any): Promise<any | ApiError> {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
    return response.json()
  }
}

// User API
export const userApi = {
  async getProfile(): Promise<any | ApiError> {
    const response = await fetch('/api/user/profile')
    return response.json()
  },

  async updateProfile(profileData: any): Promise<any | ApiError> {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    })
    return response.json()
  }
}

// Utility function to handle API errors
export const handleApiError = (error: ApiError | any): string => {
  if (error?.error) {
    return error.error
  }
  return 'An unexpected error occurred'
}

// Utility function to check if response is an error
export const isApiError = (response: any): response is ApiError => {
  return response && 'error' in response
} 