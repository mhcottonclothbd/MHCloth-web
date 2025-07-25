import { Metadata } from 'next'
import { Suspense } from 'react'
import CategoryHero from './widget/CategoryHero'
import ShopByCategory from '@/components/ShopByCategory'
import LoadingSkeleton from '../shop/widget/LoadingSkeleton'
import { mensCategories } from '@/data/categories'
import { mensProducts } from '@/data/mens-products'

export const metadata: Metadata = {
  title: "Men's Collection - MHCloth | Premium Men's Products",
  description: "Explore our curated men's collection featuring premium clothing, accessories, and lifestyle products designed for the modern gentleman.",
  keywords: "men's fashion, men's accessories, men's clothing, premium men's products, gentleman's collection",
}

interface MensPageProps {
  searchParams: Promise<{
    search?: string
    sort?: string
    filter?: string
    category?: string
  }>
}

/**
 * Men's category page showcasing masculine products
 * Features hero section, category dropdown, and filtered product grid for men's items
 */
export default async function MensPage({ searchParams }: MensPageProps) {
  const resolvedSearchParams = await searchParams
  
  // Transform mensProducts to match the expected Product interface
  const transformedProducts = mensProducts.map(product => {
    const productAny = product as any
    return {
      ...product,
      id: product.id.toString(),
      description: product.name, // Use name as description
      image_url: productAny.image || productAny.image_url || '',
      stock: productAny.stock || (productAny.inStock ? 10 : 0),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  })
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      {/* Hero Section */}
      <CategoryHero 
        title="Men's Collection"
        subtitle="For the Modern Gentleman"
        description="Discover our carefully curated selection of premium men's products, from sophisticated clothing to essential accessories."
        backgroundImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop"
      />

      {/* Products Section with Category Dropdown */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 md:py-8">
        <Suspense fallback={<LoadingSkeleton />}>
          <ShopByCategory 
            searchParams={resolvedSearchParams}
            categories={mensCategories}
            products={transformedProducts}
            categoryType="mens"
            title="Men's Products"
          />
        </Suspense>
      </div>
    </div>
  )
}