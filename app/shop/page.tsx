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
 * Enhanced shop page with modern design, hero section, and improved UX
 * Features responsive layout, smooth animations, and production-ready components
 */
export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = await searchParams
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Category Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-y border-gray-200/50">
        <CategoryNavigation />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<LoadingSkeleton />}>
          <ProductGrid 
            searchParams={resolvedSearchParams}
          />
        </Suspense>
      </div>
    </div>
  )
}