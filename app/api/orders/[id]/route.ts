import { NextRequest, NextResponse } from 'next/server'
import { getOrderById, updateOrderStatus } from '@/lib/services/supabase-api'
import { z } from 'zod'
import type { Order } from '@/types'

/**
 * Individual Order API Routes
 * Handles operations for specific orders
 */

// Validation schema for order status updates
const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
})

/**
 * GET /api/orders/[id]
 * Fetch a specific order by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order ID is required',
        },
        { status: 400 }
      )
    }

    const order = await getOrderById(id)
    
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found',
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error('Error in GET /api/orders/[id]:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch order',
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/orders/[id]
 * Update order status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order ID is required',
        },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // Validate request body
    const { status } = updateOrderStatusSchema.parse(body)
    
    // Check if order exists
    const existingOrder = await getOrderById(id)
    if (!existingOrder) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found',
        },
        { status: 404 }
      )
    }
    
    // Update order status
    const updatedOrder = await updateOrderStatus(id, status)
    
    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: `Order status updated to ${status}`,
    })
  } catch (error) {
    console.error('Error in PATCH /api/orders/[id]:', error)
    
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
        error: error instanceof Error ? error.message : 'Failed to update order',
      },
      { status: 500 }
    )
  }
}