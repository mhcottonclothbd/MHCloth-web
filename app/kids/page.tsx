import { Metadata } from 'next'
import { Suspense } from 'react'
import CategoryHero from './widget/CategoryHero'
import ProductGrid from './widget/ProductGrid'
import LoadingSkeleton from '../shop/widget/LoadingSkeleton'
import CategoryNavigation from '@/components/CategoryNavigation'
import { kidsCategories } from '@/data/categories'

export const metadata: Metadata = {
  title: "Kids Collection - Physical Store | Premium Children's Products",
  description: "Explore our delightful kids collection featuring safe, fun, and educational products designed for children of all ages.",
  keywords: "kids products, children's toys, kids clothing, educational toys, safe products for kids",
}

interface KidsPageProps {
  searchParams: Promise<{
    search?: string
    sort?: string
    filter?: string
  }>
}

/**
 * Kids category page showcasing child-friendly products
 * Features playful hero section and filtered product grid for children's items
 */
export default async function KidsPage({ searchParams }: KidsPageProps) {
  const resolvedSearchParams = await searchParams
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      {/* Hero Section */}
      <CategoryHero 
        title="Kids Collection"
        subtitle="Fun & Learning Combined"
        description="Discover our wonderful selection of safe, educational, and fun products designed to inspire creativity and joy in children."
        backgroundImage="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop"
      />

      {/* Category Navigation */}
      <CategoryNavigation 
        categories={kidsCategories}
        basePath="/kids"
        title="Shop Kids Categories"
        subtitle="Fun and educational products organized by category for easy browsing"
      />

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<LoadingSkeleton />}>
          <ProductGrid 
            searchParams={resolvedSearchParams}
            category="kids"
            title="Kids Products"
          />
        </Suspense>
      </div>
    </div>
  )
}