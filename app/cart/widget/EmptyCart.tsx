'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react'

/**
 * Empty cart state component with call-to-action
 * Features engaging animations and modern design
 */
export default function EmptyCart() {
  const suggestions = [
    { name: 'New Arrivals', href: '/shop?filter=new', icon: '✨' },
    { name: 'Best Sellers', href: '/shop?filter=popular', icon: '🔥' },
    { name: 'Sale Items', href: '/shop?filter=sale', icon: '💰' },
  ]

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center bg-white p-12 rounded-2xl shadow-sm border border-gray-200 max-w-md"
      >
        {/* Animated Shopping Bag */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.2,
            type: "spring",
            stiffness: 200
          }}
          className="relative mb-6"
        >
          <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto" />
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Discover our amazing products and add them to your cart to get started.
          </p>
        </motion.div>

        {/* Quick Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <p className="text-sm text-gray-500 mb-4">Popular categories:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
              >
                <Link href={suggestion.href}>
                  <span className="inline-flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors cursor-pointer">
                    <span>{suggestion.icon}</span>
                    <span>{suggestion.name}</span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Link href="/shop">
            <button className="group bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
              <span>Start Shopping</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Additional Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl"
      >
        {[
          {
            icon: '🚚',
            title: 'Free Shipping',
            description: 'On orders over $100'
          },
          {
            icon: '🔒',
            title: 'Secure Payment',
            description: 'SSL encrypted checkout'
          },
          {
            icon: '↩️',
            title: 'Easy Returns',
            description: '30-day return policy'
          }
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
            className="text-center p-4 bg-white rounded-xl border border-gray-100"
          >
            <div className="text-2xl mb-2">{feature.icon}</div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">
              {feature.title}
            </h3>
            <p className="text-xs text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}