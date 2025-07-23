'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/Button'
import { ArrowRight, Award, Users, Globe } from 'lucide-react'

const stats = [
  {
    icon: Award,
    value: '15+',
    label: 'Years of Excellence'
  },
  {
    icon: Users,
    value: '50K+',
    label: 'Happy Customers'
  },
  {
    icon: Globe,
    value: '25+',
    label: 'Countries Served'
  }
]

/**
 * About preview section showcasing company values and achievements
 * Features parallax-like effects and animated statistics
 */
export default function AboutPreview() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Crafting Excellence
                <span className="block text-gray-600">Since 2008</span>
              </h2>
              
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We believe that exceptional products are born from the perfect marriage of traditional 
                craftsmanship and innovative design. Every piece in our collection tells a story of 
                dedication, quality, and timeless appeal.
              </p>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                From our humble beginnings as a small workshop to becoming a globally recognized brand, 
                we've never compromised on our core values: authenticity, sustainability, and 
                uncompromising quality.
              </p>
              
              <Link href="/about">
                <Button size="lg" className="group">
                  Our Story
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-gray-700" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&q=80"
                alt="Artisan crafting premium products"
                width={800}
                height={600}
                className="rounded-lg shadow-2xl"
              />
              
              {/* Glass morphism overlay card */}
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md rounded-lg p-6 shadow-xl border border-white/20"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Premium Quality</div>
                    <div className="text-sm text-gray-600">Certified Excellence</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}