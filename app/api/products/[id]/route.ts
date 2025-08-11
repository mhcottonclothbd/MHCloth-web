import { supabase, supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Individual Product API Routes
 * Handles GET, PUT, DELETE operations for specific products
 */

// Validation schema for product updates
const updateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').optional(),
  description: z.string().min(1, 'Product description is required').optional(),
  price: z.number().positive('Price must be positive').optional(),
  original_price: z.number().positive().optional(),
  category: z.string().min(1, 'Category is required').optional(),
  subcategory_id: z.string().optional(),
  sku: z.string().optional(),
  stock_quantity: z.number().int().min(0).optional(),
  low_stock_threshold: z.number().int().min(0).optional(),
  brand: z.string().optional(),
  status: z.enum(['active', 'draft', 'archived']).optional(),
  is_featured: z.boolean().optional(),
  is_on_sale: z.boolean().optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  image_urls: z.array(z.string()).optional(),
})

/**
 * Upload images to Supabase Storage under products/{product_id}/{uuid}.{ext}
 */
import { v4 as uuidv4 } from 'uuid'

async function uploadImagesToStorage(productId: string, images: File[]): Promise<{ urls: string[]; paths: string[] }> {
  if (!supabaseAdmin) {
    throw new Error('Admin client not available')
  }

  const uploadedUrls: string[] = []
  const storagePaths: string[] = []

  for (const image of images) {
    try {
      // Generate unique filename
      const fileExt = image.name.split('.').pop()
      const unique = uuidv4()
      const fileName = `${unique}.${fileExt}`
      const filePath = `products/${productId}/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabaseAdmin.storage
        .from('product-images')
        .upload(filePath, image, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading image:', error)
        throw new Error(`Failed to upload image: ${error.message}`)
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from('product-images')
        .getPublicUrl(filePath)

      uploadedUrls.push(urlData.publicUrl)
      storagePaths.push(filePath)
    } catch (error) {
      console.error('Error processing image upload:', error)
      throw error
    }
  }

  return { urls: uploadedUrls, paths: storagePaths }
}

/**
 * GET /api/products/[id]
 * Fetch a single product by ID
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
          error: 'Product ID is required',
        },
        { status: 400 }
      )
    }

    // Use anon client for reads to respect RLS
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            error: 'Product not found',
          },
          { status: 404 }
        )
      }
      throw new Error(`Failed to fetch product: ${error.message}`)
    }

    // Fetch category info if present
    let category: any = null
    if (product?.category_id) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id, name, slug, gender')
        .eq('id', product.category_id)
        .maybeSingle()
      if (cat) category = cat
    }

    // Preserve legacy string `category` on the product shape.
    // Expose the fetched category row under `category_details` to avoid breaking UI that expects a string.
    return NextResponse.json({
      success: true,
      data: { ...product, category_details: category },
    })
  } catch (error) {
    console.error('Error in GET /api/products/[id]:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch product',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/products/[id]
 * Update an existing product with image upload support
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    // Basic admin gate using secure cookie
    const adminCookie = request.cookies.get('admin_session')?.value
    const supaToken = request.cookies.get('sb-access-token')?.value
    if (!adminCookie || !supaToken) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID is required',
        },
        { status: 400 }
      )
    }

    // Check if request is multipart form data
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      // Handle multipart form data with images
      const formData = await request.formData()

      // Extract product data
      const productData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: formData.get('price') ? parseFloat(formData.get('price') as string) : undefined,
        original_price: formData.get('original_price') ? parseFloat(formData.get('original_price') as string) : undefined,
        category: formData.get('category') as string,
        subcategory_id: formData.get('subcategory_id') as string || undefined,
        sku: formData.get('sku') as string || undefined,
        stock_quantity: formData.get('stock_quantity') ? parseInt(formData.get('stock_quantity') as string) : undefined,
        low_stock_threshold: formData.get('low_stock_threshold') ? parseInt(formData.get('low_stock_threshold') as string) : undefined,
        brand: formData.get('brand') as string || undefined,
        status: formData.get('status') as string || undefined,
        is_featured: formData.get('is_featured') === 'true',
        is_on_sale: formData.get('is_on_sale') === 'true',
        sizes: formData.get('sizes') ? JSON.parse(formData.get('sizes') as string) : undefined,
        colors: formData.get('colors') ? JSON.parse(formData.get('colors') as string) : undefined,
        tags: formData.get('tags') ? JSON.parse(formData.get('tags') as string) : undefined,
      }

      // Remove undefined values
      const cleanProductData = Object.fromEntries(
        Object.entries(productData).filter(([_, value]) => value !== undefined)
      )

      // Validate product data
      const validatedData = updateProductSchema.parse(cleanProductData)

      // If name provided, compute/ensure unique slug when updating title
      let extraUpdates: Record<string, any> = {}
      if (validatedData.name) {
        const baseSlug = validatedData.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
        let candidate = baseSlug
        let suffix = 2
        // Loop until slug is unique (bounded by 50 attempts)
        for (let i = 0; i < 50; i++) {
          const { data: exists } = await supabaseAdmin!
            .from('products')
            .select('id')
            .eq('slug', candidate)
            .neq('id', id)
            .maybeSingle()
          if (!exists) break
          candidate = `${baseSlug}-${suffix++}`
        }
        extraUpdates.slug = candidate
      }

      // Handle image uploads
      const imageFiles: File[] = []
      const imageUrls: string[] = []

      // Collect image files
      for (const [key, value] of formData.entries()) {
        if (key === 'images' && value instanceof File) {
          imageFiles.push(value)
        } else if (key === 'image_urls' && typeof value === 'string') {
          // Handle existing image URLs
          try {
            const urls = JSON.parse(value)
            if (Array.isArray(urls)) {
              imageUrls.push(...urls)
            }
          } catch {
            imageUrls.push(value)
          }
        }
      }

      // Upload new images to Supabase Storage
      let uploadedImageUrls: string[] = []
      let storagePaths: string[] = []
      if (imageFiles.length > 0) {
        const result = await uploadImagesToStorage(id, imageFiles)
        uploadedImageUrls = result.urls
        storagePaths = result.paths
      }

      // Combine all image URLs
      const allImageUrls = [...imageUrls, ...uploadedImageUrls]

      // Update product with image URLs
      const productToUpdate = {
        ...validatedData,
        image_urls: allImageUrls,
        updated_at: new Date().toISOString(),
        ...extraUpdates,
      }

      const { data, error } = await supabaseAdmin!
        .from('products')
        .update(productToUpdate)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update product: ${error.message}`)
      }

      // Note: product_images table not required. We update image_urls only.

      return NextResponse.json(
        {
          success: true,
          data,
          message: 'Product updated successfully',
        }
      )
    } else {
      // Handle JSON request (fallback)
      const body = await request.json()

      // Validate request body
      const validatedData = updateProductSchema.parse(body)

      // Add updated_at timestamp
      const productToUpdate = {
        ...validatedData,
        updated_at: new Date().toISOString(),
      }

      // Update product
      const { data, error } = await supabaseAdmin!
        .from('products')
        .update(productToUpdate)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update product: ${error.message}`)
      }

      return NextResponse.json(
        {
          success: true,
          data,
          message: 'Product updated successfully',
        }
      )
    }
  } catch (error) {
    console.error('Error in PUT /api/products/[id]:', error)

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
        error: error instanceof Error ? error.message : 'Failed to update product',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/products/[id]
 * Delete a product
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    // Basic admin gate using secure cookie
    const adminCookie = request.cookies.get('admin_session')?.value
    const supaToken = request.cookies.get('sb-access-token')?.value
    if (!adminCookie || !supaToken) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID is required',
        },
        { status: 400 }
      )
    }

    // First, get the product to check if it exists and get image URLs
    const { data: product, error: fetchError } = await supabaseAdmin!
      .from('products')
      .select('image_urls')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            error: 'Product not found',
          },
          { status: 404 }
        )
      }
      throw new Error(`Failed to fetch product: ${fetchError.message}`)
    }

    // Delete the product
    const { error } = await supabaseAdmin!
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`)
    }

    // Delete associated images from storage (best-effort)
    if (product?.image_urls && product.image_urls.length > 0) {
      try {
        // Extract file paths from URLs and delete from storage
        const filePaths = product.image_urls.map((url: string) => {
          const marker = '/storage/v1/object/public/product-images/'
          const idx = url.indexOf(marker)
          if (idx >= 0) return url.substring(idx + marker.length)
          const parts = url.split('/')
          return parts.slice(-2).join('/')
        })

        for (const filePath of filePaths) {
          await supabaseAdmin!.storage
            .from('product-images')
            .remove([filePath])
        }
      } catch (storageError) {
        console.error('Error deleting images from storage:', storageError)
        // Don't fail the request if image deletion fails
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Product deleted successfully',
      }
    )
  } catch (error) {
    console.error('Error in DELETE /api/products/[id]:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete product',
      },
      { status: 500 }
    )
  }
}