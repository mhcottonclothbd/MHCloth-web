/**
 * Mock API service to replace Supabase API calls
 * This file provides functions that simulate API responses
 */

import { mockProducts, getProductById, getProductsByCategory, searchProducts } from './products'
import { mockUsers, getUserById, updateUserProfile } from './users'
import { mockOrders, getDashboardStats } from './dashboard'
import { v4 as uuidv4 } from 'uuid'

// Simulate API delay
const simulateDelay = async (ms: number = 300) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Mock API response format
interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

// Products API
export const productsApi = {
  // Get all products with filtering
  getProducts: async (params?: {
    category?: string
    status?: string
    limit?: number
    offset?: number
    featured?: boolean
    onSale?: boolean
    search?: string
  }): Promise<ApiResponse<any>> => {
    await simulateDelay()
    
    try {
      let filteredProducts = [...mockProducts]
      
      // Apply filters
      if (params?.category) {
        filteredProducts = getProductsByCategory(params.category)
      }
      
      if (params?.status && params.status !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.status === params.status)
      }
      
      if (params?.featured) {
        filteredProducts = filteredProducts.filter(product => product.is_featured)
      }
      
      if (params?.onSale) {
        filteredProducts = filteredProducts.filter(product => product.is_on_sale)
      }
      
      if (params?.search) {
        filteredProducts = searchProducts(params.search)
      }
      
      // Apply pagination
      const limit = params?.limit || 10
      const offset = params?.offset || 0
      const paginatedProducts = filteredProducts.slice(offset, offset + limit)
      
      return {
        data: {
          data: paginatedProducts,
          count: filteredProducts.length,
          pagination: {
            limit,
            offset,
            hasMore: offset + limit < filteredProducts.length
          }
        },
        status: 200
      }
    } catch (error) {
      return {
        error: 'Failed to fetch products',
        status: 500
      }
    }
  },
  
  // Get product by ID
  getProductById: async (id: string): Promise<ApiResponse<any>> => {
    await simulateDelay()
    
    try {
      const product = getProductById(id)
      
      if (!product) {
        return {
          error: 'Product not found',
          status: 404
        }
      }
      
      return {
        data: product,
        status: 200
      }
    } catch (error) {
      return {
        error: 'Failed to fetch product',
        status: 500
      }
    }
  },
  
  // Create product
  createProduct: async (productData: any): Promise<ApiResponse<any>> => {
    await simulateDelay()
    
    try {
      const newProduct = {
        id: `prod-${uuidv4()}`,
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // In a real implementation, we would add this to the database
      // For mock purposes, we'll just return the new product
      
      return {
        data: newProduct,
        status: 201
      }
    } catch (error) {
      return {
        error: 'Failed to create product',
        status: 500
      }
    }
  },
  
  // Update product
  updateProduct: async (id: string, productData: any): Promise<ApiResponse<any>> => {
    await simulateDelay()
    
    try {
      const existingProduct = getProductById(id)
      
      if (!existingProduct) {
        return {
          error: 'Product not found',
          status: 404
        }
      }
      
      const updatedProduct = {
        ...existingProduct,
        ...productData,
        id, // Ensure ID doesn't change
        updated_at: new Date().toISOString()
      }
      
      // In a real implementation, we would update the database
      // For mock purposes, we'll just return the updated product
      
      return {
        data: updatedProduct,
        status: 200
      }
    } catch (error) {
      return {
        error: 'Failed to update product',
        status: 500
      }
    }
  },
  
  // Delete product
  deleteProduct: async (id: string): Promise<ApiResponse<any>> => {
    await simulateDelay()
    
    try {
      const existingProduct = getProductById(id)
      
      if (!existingProduct) {
        return {
          error: 'Product not found',
          status: 404
        }
      }
      
      // In a real implementation, we would delete from the database
      // For mock purposes, we'll just return success
      
      return {
        data: { success: true },
        status: 200
      }
    } catch (error) {
      return {
        error: 'Failed to delete product',
        status: 500
      }
    }
  }
}

// Users API
export const usersApi = {
  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<any>> => {
    await simulateDelay()
    
    try {
      // In a real implementation, we would get the authenticated user
      // For mock purposes, we'll return the first user as the current user
      const currentUser = mockUsers[0]
      
      return {
        data: currentUser,
        status: 200
      }
    } catch (error) {
      return {
        error: 'Failed to fetch user',
        status: 500
      }
    }
  },
  
  // Get user by ID
  getUserById: async (id: string): Promise<ApiResponse<any>> => {
    await simulateDelay()
    
    try {
      const user = getUserById(id)
      
      if (!user) {
        return {
          error: 'User not found',
          status: 404
        }
      }
      
      return {
        data: user,
        status: 200
      }
    } catch (error) {
      return {
        error: 'Failed to fetch user',
        status: 500
      }
    }
  },
  
  // Update user profile
  updateUserProfile: async (userId: string, userData: any): Promise<ApiResponse<any>> => {
    await simulateDelay()
    
    try {
      const updatedUser = updateUserProfile(userId, userData)
      
      if (!updatedUser) {
        return {
          error: 'User not found',
          status: 404
        }
      }
      
      return {
        data: updatedUser,
        status: 200
      }
    } catch (error) {
      return {
        error: 'Failed to update user profile',
        status: 500
      }
    }
  }
}

// Dashboard API
export const dashboardApi = {
  // Get dashboard stats
  getDashboardStats: async (params?: { timeRange?: string }): Promise<ApiResponse<any>> => {
    await simulateDelay()
    
    try {
      const timeRange = params?.timeRange || '7d'
      const stats = getDashboardStats(timeRange)
      
      return {
        data: stats,
        status: 200
      }
    } catch (error) {
      return {
        error: 'Failed to fetch dashboard stats',
        status: 500
      }
    }
  },
  
  // Get orders
  getOrders: async (params?: {
    limit?: number
    offset?: number
    status?: string
  }): Promise<ApiResponse<any>> => {
    await simulateDelay()
    
    try {
      let filteredOrders = [...mockOrders]
      
      // Apply status filter
      if (params?.status && params.status !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === params.status)
      }
      
      // Apply pagination
      const limit = params?.limit || 10
      const offset = params?.offset || 0
      const paginatedOrders = filteredOrders.slice(offset, offset + limit)
      
      return {
        data: {
          data: paginatedOrders,
          count: filteredOrders.length,
          pagination: {
            limit,
            offset,
            hasMore: offset + limit < filteredOrders.length
          }
        },
        status: 200
      }
    } catch (error) {
      return {
        error: 'Failed to fetch orders',
        status: 500
      }
    }
  }
}

// Orders API
export const ordersApi = {
  // Get all orders with filtering and pagination
  getOrders: async (params?: {
    limit?: number
    offset?: number
    status?: string
  }): Promise<ApiResponse<any>> => {
    await simulateDelay()
    
    try {
      let filteredOrders = [...mockOrders]
      
      // Apply status filter
      if (params?.status && params.status !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === params.status)
      }
      
      // Apply pagination
      const limit = params?.limit || 10
      const offset = params?.offset || 0
      const paginatedOrders = filteredOrders.slice(offset, offset + limit)
      
      return {
        data: {
          data: paginatedOrders,
          count: filteredOrders.length,
          pagination: {
            limit,
            offset,
            hasMore: offset + limit < filteredOrders.length
          }
        },
        status: 200
      }
    } catch (error) {
      return {
        error: 'Failed to fetch orders',
        status: 500
      }
    }
  },
  
  // Get order by ID
  getOrderById: async (id: string): Promise<ApiResponse<any>> => {
    await simulateDelay()
    
    try {
      const order = mockOrders.find(order => order.id === id)
      
      if (!order) {
        return {
          error: 'Order not found',
          status: 404
        }
      }
      
      return {
        data: order,
        status: 200
      }
    } catch (error) {
      return {
        error: 'Failed to fetch order',
        status: 500
      }
    }
  },
  
  // Create new order
  createOrder: async (orderData: any): Promise<ApiResponse<any>> => {
    await simulateDelay()
    
    try {
      // Generate order ID and number
      const id = `order-${mockOrders.length + 1}`
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`
      
      // Create new order object
      const newOrder = {
        id,
        orderNumber,
        status: 'pending',
        payment_status: 'pending',
        ...orderData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // In a real implementation, we would add this to the database
      // For mock purposes, we'll just return the new order
      
      return {
        data: newOrder,
        status: 201
      }
    } catch (error) {
      return {
        error: 'Failed to create order',
        status: 500
      }
    }
  },
  
  // Update order status
  updateOrderStatus: async (id: string, status: string): Promise<ApiResponse<any>> => {
    await simulateDelay()
    
    try {
      const orderIndex = mockOrders.findIndex(order => order.id === id)
      
      if (orderIndex === -1) {
        return {
          error: 'Order not found',
          status: 404
        }
      }
      
      // In a real implementation, we would update the database
      // For mock purposes, we'll just return success
      
      return {
        data: { success: true },
        status: 200
      }
    } catch (error) {
      return {
        error: 'Failed to update order status',
        status: 500
      }
    }
  }
}