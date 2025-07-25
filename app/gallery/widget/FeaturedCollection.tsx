'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Users, Award } from 'lucide-react'
import Button from '@/components/Button'
import { Card, CardContent } from '@/components/Card'

/**
 * Featured collection section with detailed presentation
 * Showcases a special collection with statistics and call-to-action
 */
export default function FeaturedCollection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const collectionStats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: '2.5K',
      label: 'Happy Customers',
      suffix: '+'
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: '15',
      label: 'Design Awards',
      suffix: '+'
    }
  ]

  const featuredProducts = [
    {
      id: '1',
      name: 'Minimalist Desk Lamp',
      price: '৳4500',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&q=80'
    },
    {
      id: '2',
      name: 'Wooden Organizer',
      price: '৳2250',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop&q=80'
    },
    {
      id: '3',
      name: 'Ceramic Vase',
      price: '৳1600',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&q=80'
    }
  ]

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              Featured Collection
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              Scandinavian
              <br />
              <span className="text-blue-600">Minimalism</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-600 mb-8 leading-relaxed"
            >
              Discover the beauty of simplicity with our Scandinavian-inspired collection. 
              Each piece embodies clean lines, natural materials, and functional design that 
              brings calm and clarity to your living space.
            </motion.p>
            
            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 gap-6 mb-8"
            >
              {collectionStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/shop?collection=scandinavian">
                <Button size="lg">
                  Shop Collection
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link href="/gallery/scandinavian">
                <Button size="lg" variant="outline">
                  View Gallery
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Featured Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6"
            >
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=750&fit=crop&q=80"
                alt="Scandinavian minimalist interior"
                fill
                className="object-cover"
              />
              
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute bottom-6 left-6 right-6"
              >
                <Card className="backdrop-blur-md bg-white/90 border-white/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Clean Living Space
                    </h4>
                    <p className="text-sm text-gray-600">
                      Transform your home with thoughtfully designed pieces
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
            
            {/* Product Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-3 gap-4"
            >
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group cursor-pointer"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-square">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-3">
                      <h5 className="font-medium text-sm text-gray-900 mb-1 line-clamp-1">
                        {product.name}
                      </h5>
                      <p className="text-sm font-bold text-blue-600">
                        {product.price}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}