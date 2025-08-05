import { Metadata } from 'next'
import { mensCategories } from '@/data/categories'
import ProductGridWithDropdown from './widget/ProductGridWithDropdown'

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
 * Men's category page with product grid and category filtering
 */
export default async function MensPage({ searchParams }: MensPageProps) {
  const resolvedSearchParams = await searchParams
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Men's Collection
          </h1>
          <p className="text-xl text-blue-100">
            For the Modern Gentleman
          </p>
        </div>
      </div>

      {/* Product Grid with Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGridWithDropdown
          searchParams={resolvedSearchParams}
          categories={mensCategories}
          category="mens"
          title="Men's Collection"
        />
      </div>
    </div>
  )
}