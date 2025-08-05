'use client'

import { motion } from 'framer-motion'
import { Package } from 'lucide-react'

/**
 * Category navigation component - Currently showing empty state
 * All product categories have been removed from the website
 */
export default function CategoryNavigation() {
  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Empty State for Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Categories Coming Soon
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            We're currently reorganizing our product categories. Stay tuned for an improved shopping experience!
          </p>
        </motion.div>
      </div>
    </section>
  )
}