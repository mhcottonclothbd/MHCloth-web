'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Heart, Leaf, Star, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/Card'

interface Value {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

const values: Value[] = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Customer First',
    description: 'Every decision we make starts with our customers. We listen, we care, and we deliver experiences that exceed expectations.',
    color: 'text-red-600 bg-red-100'
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: 'Quality Excellence',
    description: 'We curate only the finest products, working with artisans and brands who share our commitment to exceptional craftsmanship.',
    color: 'text-yellow-600 bg-yellow-100'
  },
  {
    icon: <Leaf className="w-8 h-8" />,
    title: 'Sustainability',
    description: 'We believe in responsible business practices, supporting eco-friendly products and sustainable manufacturing processes.',
    color: 'text-green-600 bg-green-100'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Trust & Integrity',
    description: 'Transparency in everything we do. From product sourcing to customer service, we build relationships based on honesty and reliability.',
    color: 'text-blue-600 bg-blue-100'
  }
]

/**
 * Company values section with animated cards and mission statement
 * Showcases core principles and beliefs that guide the business
 */
export default function ValuesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Values
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These core principles guide every decision we make and shape the way we 
            interact with our customers, partners, and community.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-8">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${value.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    {value.icon}
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <Card className="overflow-hidden">
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="absolute inset-0 bg-black/20" />
              <CardContent className="relative p-8 md:p-12 text-center">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-2xl md:text-3xl font-bold mb-6"
                >
                  Our Mission
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-lg md:text-xl leading-relaxed max-w-4xl mx-auto"
                >
                  To create a world where beautiful, functional, and sustainable products 
                  are accessible to everyone. We bridge the gap between exceptional makers 
                  and conscious consumers, fostering a community that values quality, 
                  craftsmanship, and positive impact.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="mt-8 flex justify-center"
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                    <span className="text-sm font-medium">
                      "Design is not just what it looks like—design is how it works." - Steve Jobs
                    </span>
                  </div>
                </motion.div>
              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Join Our Journey
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Be part of a community that values quality, sustainability, and meaningful design. 
            Together, we're creating a better future through conscious consumption.
          </p>
        </motion.div>
      </div>
    </section>
  )
}