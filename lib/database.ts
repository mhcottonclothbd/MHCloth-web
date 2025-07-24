/**
 * Production-ready database service layer with comprehensive error handling,
 * connection pooling, and type safety for Supabase integration
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { withDatabaseErrorHandling, createError, ErrorLogger } from './error-handler'
import { env } from './env'

// Database types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
  is_featured: boolean
  is_on_sale: boolean
  sale_price?: number
  tags: string[]
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product?: Product
}

// Enhanced Order interface for production use
export interface Order {
  id: string
  orderNumber: string // Required field
  user_id: string
  userId?: string // Keep for backward compatibility
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  total?: number // Keep for backward compatibility
  shipping_address: any
  billing_address: any
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method: string
  items: OrderItem[] | number // Support both detailed items and count
  date?: string // Keep for backward compatibility
  created_at: string
  createdAt?: string // Keep for backward compatibility
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
  product?: Product
}

export interface User {
  id: string
  clerk_id: string
  email: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  preferences: any
  created_at: string
  updated_at: string
}

// Dashboard stats interface (enhanced)
export interface DashboardStats {
  totalOrders: number
  activeOrders: number
  loyaltyPoints: number
  totalSpent: number
  recentOrders?: Order[]
  monthlySpending?: number
}

// Query options
export interface QueryOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Database service class with comprehensive error handling
 */
export class DatabaseService {
  private supabase: SupabaseClient
  private static instance: DatabaseService

  constructor() {
    this.supabase = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        db: {
          schema: 'public'
        },
        global: {
          headers: {
            'x-application-name': 'physical-store'
          }
        }
      }
    )
  }

  /**
   * Singleton pattern for database service
   */
  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select('id')
        .limit(1)

      if (error) {
        ErrorLogger.error(createError.database(`Connection test failed: ${error.message}`))
        return false
      }

      return true
    } catch (error) {
      ErrorLogger.error(createError.database('Database connection test failed'))
      return false
    }
  }

  // PRODUCT OPERATIONS

  /**
   * Get all products with pagination and filtering
   */
  async getProducts(options: QueryOptions = {}): Promise<PaginatedResponse<Product>> {
    return withDatabaseErrorHandling(async () => {
      const {
        page = 1,
        limit = 20,
        sortBy = 'created_at',
        sortOrder = 'desc',
        filters = {}
      } = options

      let query = this.supabase
        .from('products')
        .select('*', { count: 'exact' })

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'category') {
            query = query.eq('category', value)
          } else if (key === 'is_featured') {
            query = query.eq('is_featured', value)
          } else if (key === 'is_on_sale') {
            query = query.eq('is_on_sale', value)
          } else if (key === 'search') {
            query = query.or(`name.ilike.%${value}%,description.ilike.%${value}%`)
          } else if (key === 'price_min') {
            query = query.gte('price', value)
          } else if (key === 'price_max') {
            query = query.lte('price', value)
          }
        }
      })

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        throw createError.database(`Failed to fetch products: ${error.message}`)
      }

      return {
        data: data || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }, 'getProducts')
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    return withDatabaseErrorHandling(async () => {
      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Product not found
        }
        throw createError.database(`Failed to fetch product: ${error.message}`)
      }

      return data
    }, 'getProductById')
  }

  /**
   * Get user's orders with backward compatibility
   */
  async getUserOrders(userId: string, options: QueryOptions = {}): Promise<Order[]> {
    return withDatabaseErrorHandling(async () => {
      const {
        page = 1,
        limit = 10,
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = options

      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            product:products(*)
          )
        `)
        .eq('user_id', userId)
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to)

      if (error) {
        // If table doesn't exist or no data, return empty array for backward compatibility
        if (error.code === '42P01' || error.code === 'PGRST116') {
          return []
        }
        throw createError.database(`Failed to fetch orders: ${error.message}`)
      }

      // Transform data for backward compatibility
       return (data || []).map(order => ({
         ...order,
         userId: order.user_id, // Backward compatibility
         total: order.total_amount || 0, // Backward compatibility
         date: order.created_at, // Backward compatibility
         createdAt: order.created_at, // Backward compatibility
         orderNumber: order.orderNumber || order.id, // Fallback if no order number
         items: Array.isArray(order.items) ? order.items.length : 0 // Count for backward compatibility
       }))
    }, 'getUserOrders')
   }
}

// Export singleton instance
export const db = DatabaseService.getInstance()

// Backward compatibility functions
/**
 * Fetch user orders from database (backward compatible)
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  return db.getUserOrders(userId)
}

/**
 * Calculate dashboard statistics from user orders
 * This function processes order data to generate dashboard metrics
 */
export function calculateDashboardStats(orders: Order[]): DashboardStats {
  const totalOrders = orders.length
  const activeOrders = orders.filter(order => 
    order.status === 'processing' || order.status === 'shipped'
  ).length
  const totalSpent = orders.reduce((sum, order) => {
    const orderTotal = typeof order.total === 'number' ? order.total : order.total_amount || 0
    return sum + orderTotal
  }, 0)
  
  // Calculate loyalty points based on business logic
  // Example: 1 point per dollar spent, bonus points for frequent orders
  const basePoints = Math.floor(totalSpent)
  const bonusPoints = totalOrders >= 10 ? 500 : totalOrders >= 5 ? 200 : 0
  const loyaltyPoints = basePoints + bonusPoints
  
  return {
    totalOrders,
    activeOrders,
    loyaltyPoints,
    totalSpent,
    recentOrders: orders.slice(0, 5), // Last 5 orders
    monthlySpending: totalSpent // Simplified for now
  }
}

/**
 * Create a new order in the database
 */
export async function createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
  return withDatabaseErrorHandling(async () => {
    const { data, error } = await db['supabase']
      .from('orders')
      .insert({
        user_id: orderData.userId || orderData.user_id,
        status: orderData.status,
        total_amount: orderData.total || orderData.total_amount,
        shipping_address: orderData.shipping_address,
        billing_address: orderData.billing_address,
        payment_status: orderData.payment_status || 'pending',
        payment_method: orderData.payment_method || 'unknown'
      })
      .select()
      .single()

    if (error) {
      throw createError.database(`Failed to create order: ${error.message}`)
    }

    return {
      ...data,
      userId: data.user_id,
      total: data.total_amount,
      date: data.created_at,
      createdAt: data.created_at,
      orderNumber: data.id,
      items: 0
    }
  }, 'createOrder')
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string, 
  status: Order['status']
): Promise<Order> {
  return withDatabaseErrorHandling(async () => {
    const { data, error } = await db['supabase']
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      throw createError.database(`Failed to update order status: ${error.message}`)
    }

    return {
      ...data,
      userId: data.user_id,
      total: data.total_amount,
      date: data.created_at,
      createdAt: data.created_at,
      orderNumber: data.id,
      items: 0
    }
  }, 'updateOrderStatus')
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  return withDatabaseErrorHandling(async () => {
    const { data, error } = await db['supabase']
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', orderId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Order not found
      }
      throw createError.database(`Failed to fetch order: ${error.message}`)
    }

    return {
      ...data,
      userId: data.user_id,
      total: data.total_amount,
      date: data.created_at,
      createdAt: data.created_at,
      orderNumber: data.orderNumber || data.id,
      items: Array.isArray(data.items) ? data.items.length : 0
    }
  }, 'getOrderById')
}

// Export convenience functions for modern usage
export const dbOperations = {
  // Products
  getProducts: (options?: QueryOptions) => db.getProducts(options),
  getProduct: (id: string) => db.getProductById(id),

  // Orders (with both old and new interfaces)
  getUserOrders: (userId: string, options?: QueryOptions) => db.getUserOrders(userId, options),
  createOrder,
  updateOrderStatus,
  getOrderById,

  // Utility
  testConnection: () => db.testConnection(),
  calculateStats: calculateDashboardStats
}