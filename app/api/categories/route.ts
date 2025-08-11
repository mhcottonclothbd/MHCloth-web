import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Categories API Routes
 * Handles category operations
 */

/**
 * GET /api/categories
 * Fetch categories, optionally filtered by gender
 * Query params:
 * - gender: 'mens' | 'womens' | 'kids'
 */
function slugify(input: string | null | undefined): string | null {
  if (!input) return null
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gender = searchParams.get('gender') as 'mens' | 'womens' | 'kids' | null

    // Fetch all categories, optionally filtered by gender
    let query = supabase.from('categories').select('*').order('name')
    if (gender) query = query.eq('gender', gender)
    const { data: categoriesData, error: categoriesError } = await query
    if (categoriesError) {
      throw new Error(`Failed to fetch categories: ${categoriesError.message}`)
    }
    const categories = categoriesData || []

    const shaped = categories.map((c: any) => ({
      id: c.id,
      name: c.name,
      description: c.description ?? `${c.name} collection`,
      image_url: c.image_url ?? null,
      // Provide slug in response even if not stored in DB
      slug: c.slug ?? slugify(c.name),
      // Keep gender if table has it; otherwise omit
      gender: c.gender ?? null,
      count: c.count ?? 0,
    }))

    return NextResponse.json({ success: true, data: shaped, count: shaped.length })
  } catch (error) {
    console.error('Error in GET /api/categories:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
      },
      { status: 500 }
    )
  }
}