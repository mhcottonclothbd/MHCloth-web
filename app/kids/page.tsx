import { Metadata } from 'next'
import { kidsCategories } from '@/data/categories'
import ProductGridWithDropdown from './widget/ProductGridWithDropdown'

export const metadata: Metadata = {
  title: "Kids Collection - MHCloth | Premium Children's Products",
  description: "Explore our delightful kids collection featuring premium clothing, accessories, and lifestyle products designed for children.",
  keywords: "kids fashion, children's clothing, kids accessories, premium children's products, kids collection",
}

interface KidsPageProps {
  searchParams: Promise<{
    search?: string
    sort?: string
    filter?: string
    category?: string
  }>
}

/**
 * Kids category page with product grid and category filtering
 */
export default async function KidsPage({ searchParams }: KidsPageProps) {
  const resolvedSearchParams = await searchParams
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Kids Collection
          </h1>
          <p className="text-xl text-orange-100">
            Fun & Comfortable
          </p>
        </div>
      </div>

      {/* Product Grid with Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGridWithDropdown
          searchParams={resolvedSearchParams}
          categories={kidsCategories}
          category="kids"
          title="Kids Collection"
        />
      </div>
    </div>
  )
}