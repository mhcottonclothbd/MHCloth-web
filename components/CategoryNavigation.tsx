'use client';

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CategoryItem } from '@/data/categories'

interface CategoryNavigationProps {
  categories: CategoryItem[]
  basePath: string
  title?: string
  subtitle?: string
}

/**
 * Reusable category navigation component
 * Displays subcategories with icons, descriptions, and product counts
 * Features responsive grid layout and hover animations
 */
export default function CategoryNavigation({
  categories,
  basePath,
  title = "Shop by Category",
  subtitle = "Explore our curated collections"
}: CategoryNavigationProps) {
  // Add null check to prevent TypeError
  if (!categories || !Array.isArray(categories)) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600">
              No categories available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Link
                href={`${basePath}/${category.id}`}
                className="block"
              >
                <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300">
                  {/* Category Icon */}
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                      <span className="text-2xl">{category.icon}</span>
                    </div>

                    {/* Category Info */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {category.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {category.description}
                    </p>

                    {/* Product Count */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-700 transition-all duration-300">
                      {category.count} {category.count === 1 ? 'item' : 'items'}
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/20 group-hover:to-blue-50/5 transition-all duration-300 pointer-events-none" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href={basePath}
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
          >
            View All Products
            <svg
              className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}