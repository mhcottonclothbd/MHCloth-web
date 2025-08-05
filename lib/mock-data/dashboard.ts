import { Order, OrderItem, User } from '@/types'
import { DASHBOARD_CONFIG } from '@/lib/dashboard-config'
import { mockProducts } from './products'

/**
 * Mock dashboard data to replace Supabase database
 * This file provides static dashboard data for the admin UI
 */

// Mock users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'john.doe@example.com',
    full_name: 'John Doe',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    created_at: '2023-06-15T10:30:00Z'
  },
  {
    id: 'user-2',
    email: 'jane.smith@example.com',
    full_name: 'Jane Smith',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    created_at: '2023-07-20T14:45:00Z'
  },
  {
    id: 'user-3',
    email: 'michael.brown@example.com',
    full_name: 'Michael Brown',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    created_at: '2023-08-05T09:15:00Z'
  },
  {
    id: 'user-4',
    email: 'emily.wilson@example.com',
    full_name: 'Emily Wilson',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    created_at: '2023-08-18T16:20:00Z'
  },
  {
    id: 'user-5',
    email: 'david.johnson@example.com',
    full_name: 'David Johnson',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    created_at: '2023-09-02T11:10:00Z'
  }
]

// Generate mock order items
const generateOrderItems = (orderId: string, count: number): OrderItem[] => {
  const items: OrderItem[] = []
  const usedProductIds = new Set<string>()
  
  for (let i = 0; i < count; i++) {
    // Get random product that hasn't been used yet for this order
    let availableProducts = mockProducts.filter(p => !usedProductIds.has(p.id))
    
    // If all products have been used, reset the used products set
    if (availableProducts.length === 0) {
      usedProductIds.clear()
      availableProducts = mockProducts
    }
    
    const randomIndex = Math.floor(Math.random() * availableProducts.length)
    const product = availableProducts[randomIndex]
    usedProductIds.add(product.id)
    
    const quantity = Math.floor(Math.random() * 3) + 1
    
    items.push({
      id: `item-${orderId}-${i}`,
      order_id: orderId,
      product_id: product.id,
      quantity,
      price: product.price,
      created_at: new Date().toISOString(),
      product
    })
  }
  
  return items
}

// Generate a random date within the last X days
const getRandomRecentDate = (daysAgo: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
  return date.toISOString()
}

// Generate mock orders
export const generateMockOrders = (count: number): Order[] => {
  const orders: Order[] = []
  
  for (let i = 0; i < count; i++) {
    const id = `order-${i + 1}`
    const orderNumber = `${DASHBOARD_CONFIG.ORDER_NUMBER.PREFIX}${String(i + 1).padStart(DASHBOARD_CONFIG.ORDER_NUMBER.PADDING, '0')}`
    const randomUserIndex = Math.floor(Math.random() * mockUsers.length)
    const user = mockUsers[randomUserIndex]
    
    // Generate between 1 and 4 items per order
    const itemCount = Math.floor(Math.random() * 4) + 1
    const items = generateOrderItems(id, itemCount)
    
    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    // Random status
    const statusIndex = Math.floor(Math.random() * DASHBOARD_CONFIG.ORDER_STATUSES.length)
    const status = DASHBOARD_CONFIG.ORDER_STATUSES[statusIndex] as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    
    // Random payment status based on order status
    let paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' = 'pending'
    if (status === 'delivered') {
      paymentStatus = 'paid'
    } else if (status === 'cancelled') {
      paymentStatus = Math.random() > 0.5 ? 'refunded' : 'failed'
    } else if (status === 'shipped' || status === 'processing') {
      paymentStatus = Math.random() > 0.3 ? 'paid' : 'pending'
    }
    
    // Create date within the last 30 days
    const createdAt = getRandomRecentDate(DASHBOARD_CONFIG.DATE_RANGES.ORDER_CREATION_MAX_DAYS_AGO)
    
    orders.push({
      id,
      orderNumber,
      user_id: user.id,
      customer_name: user.full_name,
      customer_email: user.email,
      customer_phone: '+1234567890', // Mock phone number
      status,
      total_amount: totalAmount,
      total: totalAmount, // For dashboard compatibility
      shipping_address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        country: 'USA'
      },
      billing_address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        country: 'USA'
      },
      payment_status: paymentStatus,
      payment_method: 'cash_on_delivery',
      items,
      date: new Date(createdAt).toLocaleDateString(), // For dashboard compatibility
      created_at: createdAt,
      updated_at: createdAt
    })
  }
  
  // Sort by created_at in descending order (newest first)
  return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

// Mock orders - generate 20 orders
export const mockOrders = generateMockOrders(20)

// Helper function to get recent orders
export const getRecentOrders = (limit: number = 5): Order[] => {
  return mockOrders.slice(0, limit)
}

// Helper function to get active orders (pending, processing, shipped)
export const getActiveOrders = (): Order[] => {
  return mockOrders.filter(order => 
    order.status === 'pending' || 
    order.status === 'processing' || 
    order.status === 'shipped'
  )
}

// Helper function to calculate total revenue
export const getTotalRevenue = (timeRange: string = '7d'): number => {
  const now = new Date()
  let startDate = new Date()
  
  switch (timeRange) {
    case '7d':
      startDate.setDate(now.getDate() - 7)
      break
    case '30d':
      startDate.setDate(now.getDate() - 30)
      break
    case '90d':
      startDate.setDate(now.getDate() - 90)
      break
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1)
      break
    default:
      startDate.setDate(now.getDate() - 7)
  }
  
  return mockOrders
    .filter(order => 
      order.payment_status === 'paid' && 
      new Date(order.created_at) >= startDate
    )
    .reduce((sum, order) => sum + order.total_amount, 0)
}

// Helper function to get top products by sales
export const getTopProducts = (limit: number = 5) => {
  // Create a map to track product sales
  const productSales = new Map<string, { id: string, name: string, sales: number, revenue: number }>()
  
  // Process all order items
  mockOrders.forEach(order => {
    if (Array.isArray(order.items)) {
      order.items.forEach(item => {
        const productId = item.product_id
        const product = mockProducts.find(p => p.id === productId)
        
        if (product) {
          if (!productSales.has(productId)) {
            productSales.set(productId, {
              id: productId,
              name: product.name,
              sales: 0,
              revenue: 0
            })
          }
          
          const productData = productSales.get(productId)!
          productData.sales += item.quantity
          productData.revenue += item.price * item.quantity
        }
      })
    }
  })
  
  // Convert to array and sort by revenue
  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
    .map(product => ({
      ...product,
      trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down'
    }))
  
  return topProducts
}

// Helper function to get revenue data for charts
export const getRevenueData = (timeRange: string = '7d') => {
  const now = new Date()
  let startDate = new Date()
  let dataPoints = 7 // Default to 7 days
  
  switch (timeRange) {
    case '7d':
      startDate.setDate(now.getDate() - 7)
      dataPoints = 7
      break
    case '30d':
      startDate.setDate(now.getDate() - 30)
      dataPoints = 10 // Use 10 data points for 30 days
      break
    case '90d':
      startDate.setDate(now.getDate() - 90)
      dataPoints = 12 // Use 12 data points for 90 days
      break
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1)
      dataPoints = 12 // Use 12 months for 1 year
      break
    default:
      startDate.setDate(now.getDate() - 7)
      dataPoints = 7
  }
  
  const result = []
  const interval = (now.getTime() - startDate.getTime()) / dataPoints
  
  for (let i = 0; i < dataPoints; i++) {
    const date = new Date(startDate.getTime() + interval * i)
    const nextDate = new Date(startDate.getTime() + interval * (i + 1))
    
    // Filter orders in this time interval
    const intervalOrders = mockOrders.filter(order => {
      const orderDate = new Date(order.created_at)
      return orderDate >= date && orderDate < nextDate
    })
    
    // Calculate metrics
    const revenue = intervalOrders.reduce((sum, order) => sum + order.total_amount, 0)
    const orders = intervalOrders.length
    
    // Count unique customers
    const uniqueCustomers = new Set(intervalOrders.map(order => order.user_id)).size
    
    // Format date label based on time range
    let name = ''
    if (timeRange === '1y') {
      name = date.toLocaleDateString('en-US', { month: 'short' })
    } else {
      name = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    
    result.push({
      name,
      revenue,
      orders,
      customers: uniqueCustomers
    })
  }
  
  return result
}

// Helper function to get category data for charts
export const getCategoryData = () => {
  const categoryMap = new Map<string, number>()
  
  // Process all order items
  mockOrders.forEach(order => {
    if (Array.isArray(order.items)) {
      order.items.forEach(item => {
        const product = mockProducts.find(p => p.id === item.product_id)
        
        if (product) {
          const category = product.category
          const currentValue = categoryMap.get(category) || 0
          categoryMap.set(category, currentValue + (item.price * item.quantity))
        }
      })
    }
  })
  
  // Define colors for categories
  const categoryColors: Record<string, string> = {
    'Men': '#4f46e5',
    'Women': '#ec4899',
    'Kids': '#f59e0b',
    'Accessories': '#10b981',
    'On Sale': '#ef4444'
  }
  
  // Convert to array format for charts
  return Array.from(categoryMap.entries()).map(([name, value]) => ({
    name,
    value,
    color: categoryColors[name] || '#6b7280' // Default color if not found
  }))
}

// Dashboard stats object
export const getDashboardStats = (timeRange: string = '7d') => {
  return {
    totalOrders: mockOrders.length,
    activeOrders: getActiveOrders().length,
    totalRevenue: getTotalRevenue(timeRange),
    recentOrders: getRecentOrders(),
    topProducts: getTopProducts(),
    revenueData: getRevenueData(timeRange),
    categoryData: getCategoryData()
  }
}