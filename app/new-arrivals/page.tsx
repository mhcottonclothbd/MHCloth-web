import { Metadata } from 'next'
import { Package } from 'lucide-react'

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
 * New Arrivals page - Currently showing empty state
 * All new arrival products have been removed from the website
 */
export default async function NewArrivalsPage({ searchParams }: NewArrivalsPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            New Arrivals
          </h1>
          <p className="text-xl text-green-100">
            Discover Our Latest Collection
          </p>
        </div>
      </div>

      {/* Empty State */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-400 mx-auto mb-8" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            New Arrivals Coming Soon
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            We're constantly sourcing the latest and greatest products for our customers. Our team is working around the clock to bring you fresh, innovative items that combine cutting-edge design with exceptional quality.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-green-800 font-medium">
              🌟 Be the first to know when new products arrive!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}