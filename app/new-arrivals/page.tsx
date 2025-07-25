import { Metadata } from 'next'
import { Suspense } from 'react'
import CategoryHero from './widget/CategoryHero'
import ProductGrid from './widget/ProductGrid'
import LoadingSkeleton from '../shop/widget/LoadingSkeleton'

export const metadata: Metadata = {
  title: 'New Arrivals - MHCloth | Latest Premium Products',
  description: 'Discover our newest collection of premium products. Be the first to explore our latest arrivals featuring cutting-edge design and exceptional quality.',
  keywords: 'new arrivals, latest products, new collection, premium goods, fresh inventory',
}

interface NewArrivalsPageProps {
  searchParams: Promise<{
    search?: string
    sort?: string
    filter?: string
  }>
}

/**
 * New Arrivals page showcasing the latest products
 * Features hero section and filtered product grid
 */
export default async function NewArrivalsPage({ searchParams }: NewArrivalsPageProps) {
  const resolvedSearchParams = await searchParams
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      {/* Hero Section */}
      <CategoryHero 
        title="New Arrivals"
        subtitle="Discover Our Latest Collection"
        description="Be the first to explore our newest premium products, carefully selected for their exceptional quality and innovative design."
        backgroundImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop"
      />

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<LoadingSkeleton />}>
          <ProductGrid 
            searchParams={resolvedSearchParams}
            category="new-arrivals"
            title="Latest Products"
          />
        </Suspense>
      </div>
    </div>
  )
}