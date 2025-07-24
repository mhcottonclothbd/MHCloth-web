export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  image_url?: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
}

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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  total: number // Required for dashboard display
  shipping_address: any
  billing_address: any
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method: string
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