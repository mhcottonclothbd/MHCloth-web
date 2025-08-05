import { Metadata } from 'next'
import { womensCategories } from '@/data/categories'
import ProductGridWithDropdown from './widget/ProductGridWithDropdown'

export const metadata: Metadata = {
  title: "Women's Collection - MHCloth | Premium Women's Products",
  description: "Discover our elegant women's collection featuring premium clothing, accessories, and lifestyle products designed for the modern woman.",
  keywords: "women's fashion, women's accessories, women's clothing, premium women's products, elegant collection",
}

interface WomensPageProps {
  searchParams: Promise<{
    search?: string
    sort?: string
    filter?: string
    category?: string
  }>
}

/**
 * Women's category page with product grid and category filtering
 */
export default async function WomensPage({ searchParams }: WomensPageProps) {
  const resolvedSearchParams = await searchParams
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Women's Collection
          </h1>
          <p className="text-xl text-pink-100">
            Elegance Redefined
          </p>
        </div>
      </div>

      {/* Product Grid with Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGridWithDropdown
          searchParams={resolvedSearchParams}
          categories={womensCategories}
          category="womens"
          title="Women's Collection"
        />
      </div>
    </div>
  )
}