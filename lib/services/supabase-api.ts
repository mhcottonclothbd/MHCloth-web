import { supabase, supabaseAdmin } from '@/lib/supabase'
import type { Category, Order, Product } from '@/types'

/**
 * Supabase API service layer
 * Handles all database operations for the e-commerce application
 */

// ============================================================================
// PRODUCT OPERATIONS
// ============================================================================

/**
 * Fetch all products with optional filtering
 * @param filters - Optional filters for category, status, etc.
 * @returns Promise<Product[]>
 */
export async function getProducts(filters?: {
  category?: string
  status?: string
  is_featured?: boolean
  is_on_sale?: boolean
  limit?: number
  offset?: number
}): Promise<Product[]> {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured)
    }
    if (filters?.is_on_sale !== undefined) {
      query = query.eq('is_on_sale', filters.is_on_sale)
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      throw new Error(`Failed to fetch products: ${error.message}`)
    }

    // Transform data to match frontend Product interface
    return (data || []).map(transformProductFromDB)
  } catch (error) {
    console.error('Error in getProducts:', error)
    throw error
  }
}

/**
 * Fetch a single product by ID
 * @param id - Product ID
 * @returns Promise<Product | null>
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Product not found
      }
      throw new Error(`Failed to fetch product: ${error.message}`)
    }

    return transformProductFromDB(data)
  } catch (error) {
    console.error('Error in getProductById:', error)
    throw error
  }
}

/**
 * Create a new product (Admin only)
 * @param product - Product data
 * @returns Promise<Product>
 */
export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  try {
    if (!supabaseAdmin) {
      throw new Error('Admin client not available')
    }

    const productData = transformProductToDB(product)

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([productData])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`)
    }

    return transformProductFromDB(data)
  } catch (error) {
    console.error('Error in createProduct:', error)
    throw error
  }
}

/**
 * Update an existing product (Admin only)
 * @param id - Product ID
 * @param updates - Product updates
 * @returns Promise<Product>
 */
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  try {
    if (!supabaseAdmin) {
      throw new Error('Admin client not available')
    }

    const updateData = transformProductToDB(updates)
    delete updateData.id // Don't update ID
    delete updateData.created_at // Don't update created_at

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`)
    }

    return transformProductFromDB(data)
  } catch (error) {
    console.error('Error in updateProduct:', error)
    throw error
  }
}

/**
 * Delete a product (Admin only)
 * @param id - Product ID
 * @returns Promise<void>
 */
export async function deleteProduct(id: string): Promise<void> {
  try {
    if (!supabaseAdmin) {
      throw new Error('Admin client not available')
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`)
    }
  } catch (error) {
    console.error('Error in deleteProduct:', error)
    throw error
  }
}

/**
 * Bulk delete products (Admin only)
 * @param ids - Array of product IDs
 * @returns Promise<void>
 */
export async function bulkDeleteProducts(ids: string[]): Promise<void> {
  try {
    if (!supabaseAdmin) {
      throw new Error('Admin client not available')
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .in('id', ids)

    if (error) {
      throw new Error(`Failed to bulk delete products: ${error.message}`)
    }
  } catch (error) {
    console.error('Error in bulkDeleteProducts:', error)
    throw error
  }
}

// ============================================================================
// ORDER OPERATIONS
// ============================================================================

/**
 * Fetch all orders with optional filtering
 * @param filters - Optional filters for status, date range, etc.
 * @returns Promise<Order[]>
 */
export async function getOrders(filters?: {
  status?: string
  payment_status?: string
  limit?: number
  offset?: number
}): Promise<Order[]> {
  try {
    const db = supabaseAdmin ?? supabase
    let query = db
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.payment_status) {
      query = query.eq('payment_status', filters.payment_status)
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`)
    }

    // Transform data to match frontend Order interface
    return (data || []).map(transformOrderFromDB)
  } catch (error) {
    console.error('Error in getOrders:', error)
    throw error
  }
}

/**
 * Fetch a single order by ID
 * @param id - Order ID
 * @returns Promise<Order | null>
 */
export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const db = supabaseAdmin ?? supabase
    const { data, error } = await db
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Order not found
      }
      throw new Error(`Failed to fetch order: ${error.message}`)
    }

    return transformOrderFromDB(data)
  } catch (error) {
    console.error('Error in getOrderById:', error)
    throw error
  }
}

/**
 * Create a new order
 * @param orderData - Order data including items
 * @returns Promise<Order>
 */
export async function createOrder(orderData: {
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  customer_address?: string
  total_amount: number
  payment_method: 'cash_on_delivery'
  items: {
    product_id: string
    quantity: number
    price: number
    size?: string
    color?: string
  }[]
}): Promise<Order> {
  try {
    if (!supabaseAdmin) {
      throw new Error('Admin client not available')
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          order_number: orderNumber,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          customer_address: orderData.customer_address,
          total_amount: orderData.total_amount,
          payment_method: orderData.payment_method,
          status: 'pending',
          payment_status: 'pending',
        },
      ])
      .select()
      .single()

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`)
    }

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
      size: item.size,
      color: item.color,
    }))

    const { data: insertedItems, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems)
      .select('*')

    if (itemsError) {
      // Rollback order creation
      await supabaseAdmin.from('orders').delete().eq('id', order.id)
      throw new Error(`Failed to create order items: ${itemsError.message}`)
    }

    // Compose minimal structure and return without an extra round-trip
    const orderWithItems = {
      ...order,
      order_items: insertedItems || [],
    }
    return transformOrderFromDB(orderWithItems)
  } catch (error) {
    console.error('Error in createOrder:', error)
    throw error
  }
}

/**
 * Update order status (Admin only)
 * @param id - Order ID
 * @param status - New status
 * @returns Promise<Order>
 */
export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
  try {
    if (!supabaseAdmin) {
      throw new Error('Admin client not available')
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update order status: ${error.message}`)
    }

    const completeOrder = await getOrderById(id)
    if (!completeOrder) {
      throw new Error('Failed to fetch updated order')
    }

    return completeOrder
  } catch (error) {
    console.error('Error in updateOrderStatus:', error)
    throw error
  }
}

// ============================================================================
// CATEGORY OPERATIONS
// ============================================================================

/**
 * Fetch all categories
 * @returns Promise<Category[]>
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Error in getCategories:', error)
    throw error
  }
}

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

/**
 * Subscribe to real-time order updates
 * @param callback - Callback function for order updates
 * @returns Subscription object
 */
export function subscribeToOrders(callback: (payload: any) => void) {
  return supabase
    .channel('orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, callback)
    .subscribe()
}

/**
 * Subscribe to real-time product updates
 * @param callback - Callback function for product updates
 * @returns Subscription object
 */
export function subscribeToProducts(callback: (payload: any) => void) {
  return supabase
    .channel('products')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, callback)
    .subscribe()
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Transform product data from database format to frontend format
 */
function transformProductFromDB(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    original_price: dbProduct.original_price,
    category: dbProduct.category,
    gender: dbProduct.gender ?? dbProduct.category,
    subcategory_id: dbProduct.subcategory_id,
    sku: dbProduct.sku,
    stock_quantity: dbProduct.stock_quantity,
    brand: dbProduct.brand,
    status: dbProduct.status,
    is_featured: dbProduct.is_featured,
    is_on_sale: dbProduct.is_on_sale,
    sizes: dbProduct.sizes || [],
    colors: dbProduct.colors || [],
    tags: dbProduct.tags || [],
    image_urls: dbProduct.image_urls || [],
    // Legacy compatibility
    image_url: dbProduct.image_urls?.[0],
    stock: dbProduct.stock_quantity,
    featured: dbProduct.is_featured,
    created_at: dbProduct.created_at,
    updated_at: dbProduct.updated_at,
  }
}

/**
 * Transform product data from frontend format to database format
 */
function transformProductToDB(product: any): any {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    original_price: product.original_price,
    // DB requires legacy category string, mirror from gender if needed
    category: product.category ?? product.gender,
    subcategory_id: product.subcategory_id,
    sku: product.sku,
    stock_quantity: product.stock_quantity || product.stock,
    brand: product.brand,
    status: product.status,
    is_featured: product.is_featured || product.featured,
    is_on_sale: product.is_on_sale,
    sizes: product.sizes || [],
    colors: product.colors || [],
    tags: product.tags || [],
    image_urls: product.image_urls || (product.image_url ? [product.image_url] : []),
    created_at: product.created_at,
    updated_at: product.updated_at,
  }
}

/**
 * Transform order data from database format to frontend format
 */
function transformOrderFromDB(dbOrder: any): Order {
  const items = dbOrder.order_items?.map((item: any) => ({
    id: item.id,
    order_id: item.order_id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
    total: item.total,
    size: item.size,
    color: item.color,
    created_at: item.created_at,
    product: item.products ? transformProductFromDB(item.products) : undefined,
  })) || []

  return {
    id: dbOrder.id,
    orderNumber: dbOrder.order_number,
    user_id: 'guest', // Since no authentication
    customer_name: dbOrder.customer_name,
    customer_email: dbOrder.customer_email,
    customer_phone: dbOrder.customer_phone,
    customer_address: dbOrder.customer_address,
    status: dbOrder.status,
    total_amount: dbOrder.total_amount,
    total: dbOrder.total_amount, // Legacy compatibility
    shipping_address: dbOrder.customer_address,
    billing_address: dbOrder.customer_address,
    payment_status: dbOrder.payment_status,
    payment_method: dbOrder.payment_method,
    items,
    date: dbOrder.created_at, // Legacy compatibility
    created_at: dbOrder.created_at,
    updated_at: dbOrder.updated_at,
  }
}