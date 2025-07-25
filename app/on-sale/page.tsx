import { Metadata } from 'next'
import { Suspense } from 'react'
import CategoryHero from './widget/CategoryHero'
import ProductGrid from './widget/ProductGrid'
import LoadingSkeleton from '../shop/widget/LoadingSkeleton'

export const metadata: Metadata = {
  title: 'On Sale - MHCloth | Premium Products at Great Prices',
  description: 'Discover amazing deals on our premium product collection. Shop high-quality items at discounted prices for a limited time.',
  keywords: 'sale, discounts, deals, premium products, special offers, clearance',
}

interface OnSalePageProps {
  searchParams: Promise<{
    search?: string
    sort?: string
    filter?: string
  }>
}

/**
 * On Sale page showcasing discounted products
 * Features hero section and filtered product grid with sale prices
 */
export default async function OnSalePage({ searchParams }: OnSalePageProps) {
  const resolvedSearchParams = await searchParams
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      {/* Hero Section */}
      <CategoryHero 
        title="On Sale"
        subtitle="Limited Time Offers"
        description="Don't miss out on these incredible deals! Premium products at unbeatable prices for a limited time only."
        backgroundImage="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200&h=600&fit=crop"
        saleTheme={true}
      />

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<LoadingSkeleton />}>
          <ProductGrid 
            searchParams={resolvedSearchParams}
            category="on-sale"
            title="Sale Products"
          />
        </Suspense>
      </div>
    </div>
  )
}