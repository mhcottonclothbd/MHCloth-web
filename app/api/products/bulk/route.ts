import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Bulk Product Operations API Routes
 * Handles bulk operations like delete, update status, etc.
 */

// Validation schema for bulk operations
const bulkDeleteSchema = z.object({
  productIds: z.array(z.string().uuid()).min(1, 'At least one product ID is required'),
})

const bulkUpdateSchema = z.object({
  productIds: z.array(z.string().uuid()).min(1, 'At least one product ID is required'),
  updates: z.object({
    status: z.enum(['active', 'draft', 'archived']).optional(),
    is_featured: z.boolean().optional(),
    is_on_sale: z.boolean().optional(),
    category: z.string().optional(),
  }),
})

/**
 * DELETE /api/products/bulk
 * Bulk delete products
 */
export async function DELETE(request: NextRequest) {
  try {
    const adminCookie = request.cookies.get('admin_session')?.value
    const supaToken = request.cookies.get('sb-access-token')?.value
    if (!adminCookie || !supaToken) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }
    const body = await request.json()

    // Validate request body
    const validatedData = bulkDeleteSchema.parse(body)

    // First, get the products to check if they exist and get image URLs
    const { data: products, error: fetchError } = await supabaseAdmin!
      .from('products')
      .select('id, image_urls')
      .in('id', validatedData.productIds)

    if (fetchError) {
      throw new Error(`Failed to fetch products: ${fetchError.message}`)
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No products found to delete',
        },
        { status: 404 }
      )
    }

    // Delete the products
    const { error } = await supabaseAdmin!
      .from('products')
      .delete()
      .in('id', validatedData.productIds)

    if (error) {
      throw new Error(`Failed to delete products: ${error.message}`)
    }

    // Delete associated images from storage
    const imageUrlsToDelete: string[] = []
    products.forEach(product => {
      if (product.image_urls && product.image_urls.length > 0) {
        imageUrlsToDelete.push(...product.image_urls)
      }
    })

    if (imageUrlsToDelete.length > 0) {
      try {
        // Extract file paths from URLs and delete from storage
        const filePaths = imageUrlsToDelete.map(url => {
          const urlParts = url.split('/')
          return urlParts.slice(-2).join('/') // Get 'products/filename.ext'
        })

        // Delete files in batches to avoid overwhelming the storage API
        const batchSize = 10
        for (let i = 0; i < filePaths.length; i += batchSize) {
          const batch = filePaths.slice(i, i + batchSize)
          await supabaseAdmin!.storage
            .from('product-images')
            .remove(batch)
        }
      } catch (storageError) {
        console.error('Error deleting images from storage:', storageError)
        // Don't fail the request if image deletion fails
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Successfully deleted ${products.length} product(s)`,
        deletedCount: products.length,
      }
    )
  } catch (error) {
    console.error('Error in DELETE /api/products/bulk:', error)

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
        error: error instanceof Error ? error.message : 'Failed to delete products',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/products/bulk
 * Bulk update products
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = bulkUpdateSchema.parse(body)

    // Prepare update data
    const updateData = {
      ...validatedData.updates,
      updated_at: new Date().toISOString(),
    }

    // Update the products
    const { data, error } = await supabaseAdmin!
      .from('products')
      .update(updateData)
      .in('id', validatedData.productIds)
      .select('id')

    if (error) {
      throw new Error(`Failed to update products: ${error.message}`)
    }

    return NextResponse.json(
      {
        success: true,
        message: `Successfully updated ${data?.length || 0} product(s)`,
        updatedCount: data?.length || 0,
        data,
      }
    )
  } catch (error) {
    console.error('Error in PUT /api/products/bulk:', error)

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
        error: error instanceof Error ? error.message : 'Failed to update products',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/products/bulk
 * Bulk import products (CSV/JSON)
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      // Handle CSV file upload
      const formData = await request.formData()
      const file = formData.get('file') as File

      if (!file) {
        return NextResponse.json(
          {
            success: false,
            error: 'No file provided',
          },
          { status: 400 }
        )
      }

      // Read and parse CSV file
      const text = await file.text()
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.trim())
      const products = []

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim())
          const product: any = {}

          headers.forEach((header, index) => {
            const value = values[index]
            if (value) {
              // Handle different data types
              if (['price', 'original_price', 'stock_quantity', 'low_stock_threshold'].includes(header)) {
                product[header] = parseFloat(value) || 0
              } else if (['is_featured', 'is_on_sale'].includes(header)) {
                product[header] = value.toLowerCase() === 'true'
              } else if (['sizes', 'colors', 'tags', 'image_urls'].includes(header)) {
                try {
                  product[header] = JSON.parse(value)
                } catch {
                  product[header] = value.split(';').filter(Boolean)
                }
              } else {
                product[header] = value
              }
            }
          })

          if (product.name && product.price) {
            products.push(product)
          }
        }
      }

      if (products.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'No valid products found in file',
          },
          { status: 400 }
        )
      }

      // Normalize products to satisfy DB constraints
      const normalizedProducts = products.map((p: any) => ({
        ...p,
        // Ensure legacy required `category` is present. Prefer explicit category, else mirror gender, else default.
        category: p.category || p.gender || 'mens',
      }))

      // Insert products in batches
      const batchSize = 50
      const results = []

      for (let i = 0; i < products.length; i += batchSize) {
        const batch = normalizedProducts.slice(i, i + batchSize)
        const { data, error } = await supabaseAdmin!
          .from('products')
          .insert(batch)
          .select()

        if (error) {
          throw new Error(`Failed to insert batch ${Math.floor(i / batchSize) + 1}: ${error.message}`)
        }

        results.push(...(data || []))
      }

      return NextResponse.json(
        {
          success: true,
          message: `Successfully imported ${results.length} product(s)`,
          importedCount: results.length,
          data: results,
        },
        { status: 201 }
      )
    } else {
      // Handle JSON array
      const body = await request.json()

      if (!Array.isArray(body)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Request body must be an array of products',
          },
          { status: 400 }
        )
      }

      if (body.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'No products provided',
          },
          { status: 400 }
        )
      }

      // Normalize products to satisfy DB constraints
      const bodyArray: any[] = body
      const normalized = bodyArray.map((p: any) => ({
        ...p,
        category: p.category || p.gender || 'mens',
      }))

      // Insert products in batches
      const batchSize = 50
      const results = []

      for (let i = 0; i < body.length; i += batchSize) {
        const batch = normalized.slice(i, i + batchSize)
        const { data, error } = await supabaseAdmin!
          .from('products')
          .insert(batch)
          .select()

        if (error) {
          throw new Error(`Failed to insert batch ${Math.floor(i / batchSize) + 1}: ${error.message}`)
        }

        results.push(...(data || []))
      }

      return NextResponse.json(
        {
          success: true,
          message: `Successfully imported ${results.length} product(s)`,
          importedCount: results.length,
          data: results,
        },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Error in POST /api/products/bulk:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to import products',
      },
      { status: 500 }
    )
  }
}