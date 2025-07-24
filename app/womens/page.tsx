import { Metadata } from 'next'
import { Suspense } from 'react'
import CategoryHero from './widget/CategoryHero'
import ProductGrid from './widget/ProductGrid'
import LoadingSkeleton from '../shop/widget/LoadingSkeleton'
import { womensCategories } from '@/data/categories'
import CategoryNavigation from '@/components/CategoryNavigation'

export const metadata: Metadata = {
  title: "Women's Collection | Physical Store",
  description: "Discover our curated Women's collection featuring elegant fashion, premium accessories, and timeless pieces.",
}

interface WomensPageProps {
  searchParams: Promise<{
    search?: string
    sort?: string
    filter?: string
  }>
}

/**
 * Women's category page showcasing feminine products
 * Features hero section and filtered product grid for women's items
 */
export default async function WomensPage({ searchParams }: WomensPageProps) {
  const resolvedSearchParams = await searchParams
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      {/* Hero Section */}
      <CategoryHero 
        title="Women's Collection"
        subtitle="Elegance Redefined"
        description="Discover our exquisite selection of premium women's products, from sophisticated fashion to essential accessories."
        backgroundImage="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop"
      />

      {/* Category Navigation */}
      <CategoryNavigation 
        categories={womensCategories}
        basePath="/womens"
        title="Shop Women's Categories"
        subtitle="Explore our elegant collections designed for the modern woman"
      />

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<LoadingSkeleton />}>
          <ProductGrid 
            searchParams={resolvedSearchParams}
            category="women"
            title="Women's Products"
          />
        </Suspense>
      </div>
    </div>
  )
}