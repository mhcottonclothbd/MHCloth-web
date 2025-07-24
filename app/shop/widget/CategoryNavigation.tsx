'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface CategoryCard {
  title: string
  subtitle: string
  href: string
  image: string
  description: string
}

const categories: CategoryCard[] = [
  {
    title: "Men's",
    subtitle: "For the Modern Gentleman",
    href: "/mens",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    description: "Sophisticated clothing and essential accessories"
  },
  {
    title: "Women's",
    subtitle: "Elegance Redefined",
    href: "/womens",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop",
    description: "Exquisite fashion and premium accessories"
  },
  {
    title: "Kids",
    subtitle: "Fun & Learning Combined",
    href: "/kids",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    description: "Safe, educational, and fun products for children"
  }
]

/**
 * Category navigation component for shop page
 * Displays interactive cards for men's, women's, and kids categories
 * Features hover animations and responsive design
 */
export default function CategoryNavigation() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated collections designed for every member of your family
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Link href={category.href} className="block">
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Category Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={category.image}
                      alt={`${category.title} Collection`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-90 text-gray-900">
                        {category.title}
                      </span>
                    </div>
                  </div>

                  {/* Category Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {category.title} Collection
                    </h3>
                    <p className="text-sm font-medium text-blue-600 mb-2">
                      {category.subtitle}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {category.description}
                    </p>
                    
                    {/* CTA Button */}
                    <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors duration-300">
                      <span>Shop Now</span>
                      <svg 
                        className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}