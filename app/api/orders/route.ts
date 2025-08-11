import { createOrder, getOrders } from '@/lib/services/supabase-api'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Orders API Routes
 * Handles CRUD operations for orders
 */

// Validation schema for order creation
const createOrderSchema = z.object({
  customer_name: z.string().min(1, 'Customer name is required'),
  customer_email: z
    .union([z.string().email('Valid email is required'), z.literal('')])
    .optional(),
  customer_phone: z.string().min(1, 'Customer phone is required'),
  customer_address: z.string().min(1, 'Customer address is required'),
  total_amount: z.number().positive('Total amount must be positive'),
  payment_method: z.enum(['cash_on_delivery']),
  items: z
    .array(
      z.object({
        product_id: z.string().min(1, 'Product ID is required'),
        quantity: z.number().int().positive('Quantity must be positive'),
        price: z.number().positive('Price must be positive'),
        size: z.string().optional(),
        color: z.string().optional(),
      })
    )
    .min(1, 'At least one item is required'),
})

/**
 * GET /api/orders
 * Fetch orders with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const filters = {
      status: searchParams.get('status') || undefined,
      payment_status: searchParams.get('payment_status') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
    }

    // Remove undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    )

    const orders = await getOrders(cleanFilters)
    
    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
    })
  } catch (error) {
    console.error('Error in GET /api/orders:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/orders
 * Create a new order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = createOrderSchema.parse(body)
    
    // Create order
    const order = await createOrder(validatedData)
    
    return NextResponse.json(
      {
        success: true,
        data: order,
        message: 'Order created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST /api/orders:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order',
      },
      { status: 500 }
    )
  }
}