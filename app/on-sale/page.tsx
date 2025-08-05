import { Metadata } from 'next'
import { Package } from 'lucide-react'

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
 * On Sale page - Currently showing empty state
 * All sale products have been removed from the website
 */
export default async function OnSalePage({ searchParams }: OnSalePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            On Sale
          </h1>
          <p className="text-xl text-red-100">
            Limited Time Offers
          </p>
        </div>
      </div>

      {/* Empty State */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-400 mx-auto mb-8" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sale Items Coming Soon
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            We're preparing some incredible deals and discounts for you! Our team is working to bring you amazing offers on premium products at unbeatable prices. Don't miss out when our sales go live.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-800 font-medium">
              🔥 Stay tuned for amazing deals and limited-time offers!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}