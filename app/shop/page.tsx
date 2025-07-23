import { Metadata } from 'next'
import { Suspense } from 'react'
import ProductGrid from './widget/ProductGrid'
import LoadingSkeleton from './widget/LoadingSkeleton'
import CategoryNavigation from './widget/CategoryNavigation'

export const metadata: Metadata = {
  title: 'Shop - Physical Store | Premium Products Collection',
  description: 'Browse our curated collection of premium products. Find unique, high-quality items that blend timeless style with modern functionality.',
  keywords: 'shop, premium products, quality goods, online store, curated collection',
}

interface ShopPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    sort?: string
    filter?: string
  }>
}

/**
 * Shop page with product filtering, search, and grid display
 * Implements server-side rendering with search params
 */
export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = await searchParams
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop Collection</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover our carefully curated selection of premium products, each chosen for its 
            exceptional quality and timeless design.
          </p>
        </div>
      </div>

      {/* Category Navigation */}
      <CategoryNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<LoadingSkeleton />}>
          <ProductGrid 
            searchParams={resolvedSearchParams}
          />
        </Suspense>
      </div>
    </div>
  )
}