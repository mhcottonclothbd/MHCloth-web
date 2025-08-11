import { supabase, supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

/**
 * Enhanced Product API Routes
 * Handles CRUD operations for products with image upload support
 */

// Validation schema for product creation
const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Product description is required'),
  price: z.number().positive('Price must be positive'),
  original_price: z.number().positive().optional(),
  gender: z.enum(['mens', 'womens', 'kids']),
  category_id: z.string().uuid('category_id must be a valid UUID'),
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
 * Slug utilities
 */
function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
  return base || uuidv4()
}

async function ensureUniqueSlug(initialSlug: string): Promise<string> {
  if (!supabaseAdmin) return initialSlug
  let candidate = initialSlug
  let suffix = 2
  // Try a few times to avoid an infinite loop
  // Using service role for uniqueness check to bypass RLS restrictions on draft
  while (true) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle()

    if (error) break
    if (!data) break
    candidate = `${initialSlug}-${suffix++}`
  }
  return candidate
}

/**
 * Generate unique SKU for product
 */
async function generateUniqueSKU(category: string, baseSKU?: string): Promise<string> {
  if (!supabaseAdmin) {
    throw new Error('Admin client not available')
  }

  // Get category prefix
  const categoryPrefix = category.toUpperCase().substring(0, 3)

  // Try to generate unique SKU using the database function
  const { data, error } = await supabaseAdmin.rpc('generate_unique_sku', {
    category_prefix: categoryPrefix,
    base_sku: baseSKU || null
  })

  if (error) {
    console.error('Error generating SKU:', error)
    // Fallback: generate simple unique SKU
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `${categoryPrefix}-${timestamp}-${random}`
  }

  return data
}

/**
 * Upload images to Supabase Storage under products/{product_id}/{uuid}.{ext}
 */
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
 * GET /api/products
 * Fetch products with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isAdmin = !!request.cookies.get('admin_session')?.value && !!request.cookies.get('sb-access-token')?.value

    const gender = searchParams.get('gender') as 'mens' | 'womens' | 'kids' | null
    const categorySlug = searchParams.get('category_slug')
    const categoryIdParam = searchParams.get('category_id')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') // price_asc|price_desc|newest
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 24
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    const status = searchParams.get('status') || 'active'
    const isFeaturedParam = searchParams.get('is_featured')
    const isOnSaleParam = searchParams.get('is_on_sale')

    // Use admin client for reads when admin cookie is present, otherwise anon with RLS
    let query = (isAdmin && supabaseAdmin ? supabaseAdmin : supabase)
      .from('products')
      .select('*', { count: 'exact' })

    if (gender) query = query.eq('gender', gender)
    // Filter by status unless 'all' requested
    if (status !== 'all') query = query.eq('status', status)
    if (isFeaturedParam === 'true') query = query.eq('is_featured', true)
    if (isOnSaleParam === 'true') query = query.eq('is_on_sale', true)

    // Filter by category - accept either category_id or category_slug
    if (categoryIdParam) {
      query = query.eq('category_id', categoryIdParam)
    } else if (categorySlug) {
      let resolvedCategoryId: string | null = null
      try {
        // Prefer gender-scoped category resolution to avoid duplicate slugs across genders
        let catQuery = supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .limit(1)

        if (gender) {
          catQuery = catQuery.eq('gender', gender)
        }

        let { data: cat, error: catErr } = await catQuery.maybeSingle()

        // Fallback: try slug-only if gender-scoped lookup failed to return a row
        if ((!cat || catErr) && gender) {
          const fallback = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categorySlug)
            .limit(1)
            .maybeSingle()
          cat = fallback.data
          catErr = fallback.error
        }
        if (!catErr && cat) {
          resolvedCategoryId = cat.id as string
        }
      } catch {
        // ignore and try fallback
      }

      // Fallback: if provided slug looks like a UUID, treat as ID directly
      const looksLikeUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(categorySlug)
      if (!resolvedCategoryId && looksLikeUuid) {
        resolvedCategoryId = categorySlug
      }

      if (resolvedCategoryId) {
        query = query.eq('category_id', resolvedCategoryId)
      } else {
        return NextResponse.json({ success: true, data: [], count: 0 })
      }
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    // Pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: count || data?.length || 0,
    })
  } catch (error) {
    console.error('Error in GET /api/products:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/products
 * Create a new product with image upload support
 */
export async function POST(request: NextRequest) {
  try {
    // Basic admin gate using secure cookie set by /api/admin/sessions
    const adminCookie = request.cookies.get('admin_session')?.value
    const supaToken = request.cookies.get('sb-access-token')?.value
    if (!adminCookie || !supaToken) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
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
        price: parseFloat(formData.get('price') as string),
        original_price: formData.get('original_price') ? parseFloat(formData.get('original_price') as string) : undefined,
        gender: formData.get('gender') as string,
        category_id: (formData.get('category_id') as string) || undefined,
        subcategory_id: formData.get('subcategory_id') as string || undefined,
        sku: formData.get('sku') as string || undefined,
        stock_quantity: formData.get('stock_quantity') ? parseInt(formData.get('stock_quantity') as string) : 0,
        low_stock_threshold: formData.get('low_stock_threshold') ? parseInt(formData.get('low_stock_threshold') as string) : 5,
        brand: formData.get('brand') as string || 'MHCloth',
        status: (formData.get('status') as string) || 'active',
        is_featured: formData.get('is_featured') === 'true',
        is_on_sale: formData.get('is_on_sale') === 'true',
        sizes: formData.get('sizes') ? JSON.parse(formData.get('sizes') as string) : [],
        colors: formData.get('colors') ? JSON.parse(formData.get('colors') as string) : [],
        tags: formData.get('tags') ? JSON.parse(formData.get('tags') as string) : [],
      }

      // Generate unique SKU if not provided or if it might be duplicate
      if (!productData.sku || productData.sku.trim() === '') {
        productData.sku = await generateUniqueSKU(productData.gender)
      } else {
        // Check if SKU already exists and generate a unique one if needed
        const { data: existingProduct } = await supabaseAdmin!
          .from('products')
          .select('id')
          .eq('sku', productData.sku)
          .single()

        if (existingProduct) {
          productData.sku = await generateUniqueSKU(productData.gender, productData.sku)
        }
      }

      // Validate product data
      const validatedData = createProductSchema.parse(productData)

      // Compute slug and price_cents, currency, stock
      const baseSlug = slugify(validatedData.name)
      const uniqueSlug = await ensureUniqueSlug(baseSlug)
      const priceCents = Math.round((validatedData.price || 0) * 100)
      const currency = 'USD'
      const stock = validatedData.stock_quantity ?? 0

      // Create product first (without images), using service client
      // DB requires legacy `category` (mens|womens|kids). Mirror from `gender`.
      const insertPayload = {
        ...validatedData,
        category: validatedData.gender,
        slug: uniqueSlug,
      }
      const { data: created, error: createError } = await supabaseAdmin!
        .from('products')
        .insert([insertPayload])
        .select()
        .single()

      if (createError || !created) {
        throw new Error(`Failed to create product: ${createError?.message}`)
      }

      // Handle image uploads
      const imageFiles: File[] = []
      const existingImageUrls: string[] = []

      for (const [key, value] of formData.entries()) {
        if (key === 'images' && value instanceof File) {
          imageFiles.push(value)
        } else if (key === 'image_urls' && typeof value === 'string') {
          try {
            const urls = JSON.parse(value)
            if (Array.isArray(urls)) existingImageUrls.push(...urls)
          } catch {
            existingImageUrls.push(value)
          }
        }
      }

      let uploadedUrls: string[] = []
      let storagePaths: string[] = []
      try {
        // Server-side validation: type and size limits
        if (imageFiles.length > 10) {
          throw new Error('Maximum 10 images allowed per product')
        }
        const allowed = new Set(['image/webp', 'image/jpeg', 'image/png'])
        for (const f of imageFiles) {
          if (f.size > 5 * 1024 * 1024) throw new Error('Each image must be <= 5MB')
          if (f.type && !allowed.has(f.type)) throw new Error('Unsupported image type')
        }
        if (imageFiles.length > 0) {
          const result = await uploadImagesToStorage(created.id, imageFiles)
          uploadedUrls = result.urls
          storagePaths = result.paths
        }

        // Note: we maintain image_urls array on products; no separate product_images table required

        // Update product.image_urls for UI compatibility
        const allUrls = [...existingImageUrls, ...uploadedUrls]
        if (allUrls.length > 0) {
          const { error: updErr } = await supabaseAdmin!
            .from('products')
            .update({ image_urls: allUrls })
            .eq('id', created.id)
          if (updErr) throw new Error(`Failed to update product image_urls: ${updErr.message}`)
        }
      } catch (err) {
        // Cleanup on failure: delete uploaded storage files and the created product
        try {
          if (storagePaths.length > 0) {
            await supabaseAdmin!.storage.from('product-images').remove(storagePaths)
          }
        } catch { }
        await supabaseAdmin!.from('products').delete().eq('id', created.id)
        throw err
      }

      return NextResponse.json(
        {
          success: true,
          data: { id: created.id, slug: uniqueSlug },
          message: 'Product created successfully',
        },
        { status: 201 }
      )
    } else {
      // Handle JSON request (fallback)
      const body = await request.json()

      // Validate request body
      const validatedData = createProductSchema.parse(body)

      const baseSlug = slugify(validatedData.name)
      const uniqueSlug = await ensureUniqueSlug(baseSlug)
      const priceCents = Math.round((validatedData.price || 0) * 100)
      const currency = 'USD'
      const stock = validatedData.stock_quantity ?? 0

      const insertJsonPayload = {
        ...validatedData,
        category: validatedData.gender,
        slug: uniqueSlug,
      }
      const { data, error } = await supabaseAdmin!
        .from('products')
        .insert([insertJsonPayload])
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create product: ${error.message}`)
      }

      return NextResponse.json(
        {
          success: true,
          data: { id: data.id, slug: uniqueSlug },
          message: 'Product created successfully',
        },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Error in POST /api/products:', error)

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
        error: error instanceof Error ? error.message : 'Failed to create product',
      },
      { status: 500 }
    )
  }
}