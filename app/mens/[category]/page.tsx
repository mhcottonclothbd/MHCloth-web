import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductGrid from '../widget/ProductGrid'
import CategoryHero from '../widget/CategoryHero'
import { categoryApi } from '@/lib/services/api'

interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{
    search?: string
    sort?: string
    filter?: string
  }>
}

/**
 * Generates metadata for men's category pages
 */
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const res = await categoryApi.getCategories({ gender: 'mens' })
  const list = Array.isArray((res as any).data) ? (res as any).data : []
  const categoryData = list.find((cat: any) => (cat.slug || cat.id) === category)
  
  if (!categoryData) {
    return {
      title: 'Category Not Found - MHCloth',
      description: 'The category you are looking for does not exist.'
    }
  }
  
  return {
    title: `Men's ${categoryData.name} - MHCloth`,
    description: `Explore our ${categoryData.name.toLowerCase()} collection for men`,
    keywords: `men's ${categoryData.name.toLowerCase()}, ${categoryData.name}, men's fashion, premium clothing`,
    openGraph: {
      title: `Men's ${categoryData.name}`,
      description: categoryData.description || `${categoryData.name} collection`,
      type: 'website'
    }
  }
}

/**
 * Men's category page with filtered products
 * Features category-specific hero section and filtered product grid
 */
export default async function MensCategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params
  const resolvedSearchParams = await searchParams
  const res = await categoryApi.getCategories({ gender: 'mens' })
  const list = Array.isArray((res as any).data) ? (res as any).data : []
  const categoryData = list.find((cat: any) => (cat.slug || cat.id) === category)
  
  if (!categoryData) {
    notFound()
  }
  
  // Add category to search params for filtering
  const searchParamsWithCategory = {
    ...resolvedSearchParams,
    category
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Category Hero */}
      <CategoryHero 
        title={`Men's ${categoryData.name}`}
        subtitle={categoryData.description || `${categoryData.name} collection`}
        description={`Explore our premium collection of ${categoryData.name.toLowerCase()} designed for the modern gentleman.`}
        backgroundImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop"
      />
      
      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGrid 
          searchParams={searchParamsWithCategory}
          category="mens"
          title={categoryData.name}
        />
      </div>
    </div>
  )
}