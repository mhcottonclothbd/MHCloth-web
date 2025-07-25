'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Users, Heart, Sparkles } from 'lucide-react'

/**
 * Featured categories section with animated cards and hover effects
 * Showcases main product categories with engaging visuals
 */
export default function FeaturedCategories() {
  const categories = [
    {
      id: 'men',
      title: 'Men\'s Collection',
      description: 'Sophisticated styles for the modern gentleman',
      icon: Users,
      href: '/men',
      gradient: 'from-blue-600 to-indigo-700',
      hoverGradient: 'from-blue-500 to-indigo-600',
      stats: '150+ Items'
    },
    {
      id: 'women',
      title: 'Women\'s Collection',
      description: 'Elegant designs that celebrate femininity',
      icon: Heart,
      href: '/women',
      gradient: 'from-pink-600 to-rose-700',
      hoverGradient: 'from-pink-500 to-rose-600',
      stats: '200+ Items'
    },
    {
      id: 'kids',
      title: 'Kids\' Collection',
      description: 'Playful and comfortable for little ones',
      icon: Sparkles,
      href: '/kids',
      gradient: 'from-purple-600 to-violet-700',
      hoverGradient: 'from-purple-500 to-violet-600',
      stats: '80+ Items'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Shop by
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our thoughtfully organized collections, each designed to meet your unique style preferences and lifestyle needs.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Link href={category.href}>
                  <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} group-hover:bg-gradient-to-br group-hover:${category.hoverGradient} transition-all duration-500`} />
                    
                    {/* Content */}
                    <div className="relative p-8 h-80 flex flex-col justify-between">
                      {/* Top Section */}
                      <div>
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-100 transition-colors duration-300">
                          {category.title}
                        </h3>
                        
                        <p className="text-white/90 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                          {category.description}
                        </p>
                      </div>

                      {/* Bottom Section */}
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 font-medium group-hover:text-white transition-colors duration-300">
                          {category.stats}
                        </span>
                        
                        <div className="flex items-center text-white group-hover:text-blue-100 transition-all duration-300 group-hover:translate-x-2">
                          <span className="font-semibold mr-2">Explore</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-500 group-hover:scale-110" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-500 group-hover:scale-110" />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link 
            href="/shop?filter=all"
            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-white border-2 border-gray-900 rounded-full hover:bg-gray-900 hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View All Products
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}