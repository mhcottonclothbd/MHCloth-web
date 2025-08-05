export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  sale_price?: number
  discount_percentage?: number
  image_url?: string // Legacy compatibility
  image_urls?: string[]
  images?: (string | File)[] // Can be URLs or File objects for uploads
  category: string
  subcategory_id?: string
  sku?: string
  stock?: number // Legacy compatibility  
  stock_quantity?: number
  low_stock_threshold?: number
  sizes?: string[]
  colors?: string[]
  weight?: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  brand?: string
  status?: 'active' | 'draft' | 'archived'
  is_featured?: boolean
  is_on_sale?: boolean
  featured?: boolean // Legacy compatibility
  tags?: string[]
  meta_title?: string
  meta_description?: string
  keywords?: string[]
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  image_url?: string
}

export interface Subcategory {
  id: string
  name: string
  description?: string
  category_id: string
  image_url?: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
}

export type PaymentMethod = 'cash_on_delivery' | 'ssl_commerce'

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

// Order interface matching database schema
export interface Order {
  id: string
  orderNumber: string // Required for dashboard display
  user_id: string
  userId?: string // Keep for backward compatibility
  customer_name?: string // Customer information
  customer_email?: string // Customer email for notifications
  customer_address?: string // Customer address
  customer_phone?: string // Customer phone
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  total: number // Required for dashboard display
  shipping_address: any
  billing_address: any
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method: PaymentMethod
  items: OrderItem[] | number
  date: string // Required for dashboard display
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

export interface DashboardStats {
  totalOrders: number
  activeOrders: number
  loyaltyPoints: number
  totalSpent: number
  recentOrders?: Order[]
  monthlySpending?: number
}

export interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export type ContactFormType = ContactForm