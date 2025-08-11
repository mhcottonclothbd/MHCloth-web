'use client'

import { motion } from 'framer-motion'
import { Package } from 'lucide-react'

interface ProductGridProps {
  searchParams?: {
    category?: string
    search?: string
    sort?: string
    filter?: string
  }
  filters?: any
  showWishlist?: boolean
}

// No products available - all products have been removed
const shopProducts = []

/**
 * Product grid component - Currently showing empty state
 * All products have been removed from the website
 */
export default function ProductGrid({ searchParams, filters, showWishlist }: ProductGridProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      {/* Empty State */}
      <motion.div
        className="text-center py-16 max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Package className="w-20 h-20 text-gray-400 mx-auto mb-8" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No Products Available
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          We're currently updating our product catalog. Our shop will be restocked soon with amazing new items.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm font-medium">
            💡 Check back soon for new arrivals and exciting products!
          </p>
        </div>
      </motion.div>
    </div>
  )
}