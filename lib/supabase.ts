import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client configuration
 * Provides both client-side and server-side Supabase instances
 */

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * Client-side Supabase instance
 * Use this for client-side operations with RLS enabled
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Since we're not using authentication
  },
})

/**
 * Server-side Supabase instance with service role key
 * Use this for admin operations that bypass RLS
 * Only use on the server side (API routes)
 */
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

/**
 * Database types for better TypeScript support
 */
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          original_price?: number
          category: string
          subcategory_id?: string
          sku?: string
          stock_quantity?: number
          brand?: string
          status?: 'active' | 'draft' | 'archived'
          is_featured?: boolean
          is_on_sale?: boolean
          sizes?: string[]
          colors?: string[]
          tags?: string[]
          image_urls?: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          original_price?: number
          category: string
          subcategory_id?: string
          sku?: string
          stock_quantity?: number
          brand?: string
          status?: 'active' | 'draft' | 'archived'
          is_featured?: boolean
          is_on_sale?: boolean
          sizes?: string[]
          colors?: string[]
          tags?: string[]
          image_urls?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          original_price?: number
          category?: string
          subcategory_id?: string
          sku?: string
          stock_quantity?: number
          brand?: string
          status?: 'active' | 'draft' | 'archived'
          is_featured?: boolean
          is_on_sale?: boolean
          sizes?: string[]
          colors?: string[]
          tags?: string[]
          image_urls?: string[]
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          customer_address?: string
          total_amount: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_method: 'cash_on_delivery'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          customer_address?: string
          total_amount: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_method: 'cash_on_delivery'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          customer_address?: string
          total_amount?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_method?: 'cash_on_delivery'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          total: number
          size?: string
          color?: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          total: number
          size?: string
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          total?: number
          size?: string
          color?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description?: string
          image_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          image_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string
          updated_at?: string
        }
      }
    }
  }
}

// Type the supabase client
export type SupabaseClient = typeof supabase