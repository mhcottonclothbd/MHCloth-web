import { Metadata } from 'next'
import { Suspense } from 'react'
import CategoryHero from './widget/CategoryHero'
import ProductGrid from './widget/ProductGrid'
import LoadingSkeleton from '../shop/widget/LoadingSkeleton'

export const metadata: Metadata = {
  title: "Men's Collection - Physical Store | Premium Men's Products",
  description: "Explore our curated men's collection featuring premium clothing, accessories, and lifestyle products designed for the modern gentleman.",
  keywords: "men's fashion, men's accessories, men's clothing, premium men's products, gentleman's collection",
}

interface MensPageProps {
  searchParams: Promise<{
    search?: string
    sort?: string
    filter?: string
  }>
}

/**
 * Men's category page showcasing masculine products
 * Features hero section and filtered product grid for men's items
 */
export default async function MensPage({ searchParams }: MensPageProps) {
  const resolvedSearchParams = await searchParams
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      {/* Hero Section */}
      <CategoryHero 
        title="Men's Collection"
        subtitle="For the Modern Gentleman"
        description="Discover our carefully curated selection of premium men's products, from sophisticated clothing to essential accessories."
        backgroundImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop"
      />

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<LoadingSkeleton />}>
          <ProductGrid 
            searchParams={resolvedSearchParams}
            category="mens"
            title="Men's Products"
          />
        </Suspense>
      </div>
    </div>
  )
}