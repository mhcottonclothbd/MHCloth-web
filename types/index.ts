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

export interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export type ContactFormType = ContactForm