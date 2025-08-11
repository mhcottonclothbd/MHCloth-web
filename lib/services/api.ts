/**
 * API Service Layer
 * Centralized service for making API calls and handling responses
 */

// Resolve base URL for server/client environments
const getApiBaseUrl = (): string => {
  // On the client, relative URLs are fine
  if (typeof window !== 'undefined') return ''

  // Prefer explicitly configured site URL
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || process.env.VERCEL_URL
  if (configuredUrl) {
    // VERCEL_URL is host only; add protocol if missing
    const hasProtocol = configuredUrl.startsWith('http://') || configuredUrl.startsWith('https://')
    return hasProtocol ? configuredUrl : `https://${configuredUrl}`
  }

  // Fallback to localhost for development
  return 'http://localhost:3000'
}

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

// Internal helpers
const ensureJson = async (response: Response): Promise<any | ApiError> => {
  const contentType = response.headers.get('content-type') || ''
  const bodyText = await response.text()

  // If server returned JSON, try to parse it regardless of status
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(bodyText)
    } catch (error) {
      return { error: `Invalid JSON response (${response.status}): ${bodyText.slice(0, 300)}` }
    }
  }

  // Non-JSON (often an HTML error page) → surface as typed error instead of crashing on JSON.parse
  const statusLabel = `${response.status} ${response.statusText}`.trim()
  return {
    error: `Unexpected ${contentType || 'unknown'} response (${statusLabel}). Body: ${bodyText.slice(0, 300)}`,
  }
}

const withAcceptHeader = (init?: RequestInit): RequestInit => {
  const baseHeaders: Record<string, string> = { Accept: 'application/json' }
  const incoming = (init?.headers || {}) as Record<string, string>
  return { ...init, headers: { ...baseHeaders, ...incoming } }
}

// Product API
export const productApi = {
  async getProducts(params?: {
    gender?: 'mens' | 'womens' | 'kids'
    category_slug?: string
    sort?: 'price_asc' | 'price_desc' | 'newest'
    limit?: number
    offset?: number
    is_featured?: boolean
    is_on_sale?: boolean
    search?: string
  }): Promise<ApiResponse<any[]> | ApiError> {
    const searchParams = new URLSearchParams()

    if (params?.gender) searchParams.set('gender', params.gender)
    if (params?.category_slug) searchParams.set('category_slug', params.category_slug)
    if (params?.sort) searchParams.set('sort', params.sort)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.offset) searchParams.set('offset', params.offset.toString())
    if (params?.is_featured) searchParams.set('is_featured', 'true')
    if (params?.is_on_sale) searchParams.set('is_on_sale', 'true')
    if (params?.search) searchParams.set('search', params.search)

    const response = await fetch(
      `${getApiBaseUrl()}/api/products?${searchParams.toString()}`,
      withAcceptHeader()
    )
    return ensureJson(response)
  },

  async getProduct(id: string): Promise<any | ApiError> {
    const response = await fetch(`${getApiBaseUrl()}/api/products/${id}`, withAcceptHeader())
    return ensureJson(response)
  }
}

// Category API
export const categoryApi = {
  async getCategories(params?: {
    gender?: 'mens' | 'womens' | 'kids'
    limit?: number
    offset?: number
  }): Promise<ApiResponse<any[]> | ApiError> {
    const searchParams = new URLSearchParams()

    if (params?.gender) searchParams.set('gender', params.gender)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.offset) searchParams.set('offset', params.offset.toString())

    const response = await fetch(
      `${getApiBaseUrl()}/api/categories?${searchParams.toString()}`,
      withAcceptHeader()
    )
    return ensureJson(response)
  },

  async getCategory(id: string): Promise<any | ApiError> {
    const response = await fetch(`${getApiBaseUrl()}/api/categories/${id}`, withAcceptHeader())
    return ensureJson(response)
  }
}

// Dashboard API
export const dashboardApi = {
  async getDashboardData(timeRange: string = '7d'): Promise<any | ApiError> {
    const response = await fetch(
      `${getApiBaseUrl()}/api/admin/dashboard?timeRange=${timeRange}`,
      withAcceptHeader()
    )
    return ensureJson(response)
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

    const response = await fetch(
      `${getApiBaseUrl()}/api/orders?${searchParams.toString()}`,
      withAcceptHeader()
    )
    return ensureJson(response)
  },

  async createOrder(orderData: any): Promise<any | ApiError> {
    const response = await fetch(`${getApiBaseUrl()}/api/orders`, withAcceptHeader({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    }))
    return ensureJson(response)
  }
}

// User API
export const userApi = {
  async getProfile(): Promise<any | ApiError> {
    const response = await fetch(`${getApiBaseUrl()}/api/user/profile`, withAcceptHeader())
    return ensureJson(response)
  },

  async updateProfile(profileData: any): Promise<any | ApiError> {
    const response = await fetch(`${getApiBaseUrl()}/api/user/profile`, withAcceptHeader({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    }))
    return ensureJson(response)
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