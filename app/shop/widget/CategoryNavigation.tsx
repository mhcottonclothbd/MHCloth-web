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
 * Enhanced category navigation component for shop page
 * Features modern design, smooth animations, and responsive layout
 * Optimized for production with improved accessibility and performance
 */
export default function CategoryNavigation() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Quick Category Access
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Jump directly to your preferred collection with our streamlined category navigation
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Link href={category.href} className="block h-full">
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 h-full">
                  {/* Category Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img
                      src={category.image}
                      alt={`${category.title} Collection`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/95 backdrop-blur-sm text-gray-900 shadow-lg">
                        {category.title}
                      </span>
                    </div>

                    {/* Floating CTA */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Category Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {category.title} Collection
                    </h3>
                    <p className="text-sm font-semibold text-blue-600 mb-3">
                      {category.subtitle}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {category.description}
                    </p>
                    
                    {/* Enhanced CTA Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors duration-300">
                        Explore Collection
                      </span>
                      <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-all duration-300 group-hover:translate-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}