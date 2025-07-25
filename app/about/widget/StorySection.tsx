'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

/**
 * Company story section with timeline and visual storytelling
 * Features animated content that appears as user scrolls
 */
export default function StorySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const timelineEvents = [
    {
      id: 'formation',
      year: '2022',
      title: 'Company Formation',
      description: 'MHCloth was founded in Bangladesh with a vision to revolutionize fashion retail in the region.'
    },
    {
      id: 'first-location',
      year: '2022',
      title: 'First Location',
      description: 'Opened our flagship store in Uttara, Dhaka, creating an innovative retail experience that bridges physical and digital shopping.'
    },
    {
      id: 'digital-platform',
      year: '2023',
      title: 'Digital Platform',
      description: 'Launched our comprehensive e-commerce platform, making our curated collection accessible across Bangladesh and beyond.'
    },
    {
      id: 'sustainable-growth',
      year: '2024',
      title: 'Sustainable Growth',
      description: 'Committed to sustainable practices, implementing eco-friendly packaging and carbon-neutral delivery options throughout Bangladesh.'
    }
  ]

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Story Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              MHCloth represents the evolution of fashion retail in the digital age. Founded in 2022, 
              we've built a company that combines the best of physical and online shopping experiences. 
              As a Bangladesh-based company, we're committed to serving our customers with integrity, 
              quality products, and exceptional service that reflects our values of fairness and excellence.
            </p>
            
            <div className="space-y-6">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {event.year.slice(-2)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-gray-600">
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative aspect-square rounded-lg overflow-hidden"
              >
                <Image
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&q=80"
                  alt="Artisan workspace"
                  fill
                  className="object-cover"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="relative aspect-square rounded-lg overflow-hidden mt-8"
              >
                <Image
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop&q=80"
                  alt="Product craftsmanship"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="relative aspect-[4/3] rounded-lg overflow-hidden mt-4"
            >
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=450&fit=crop&q=80"
                alt="Team collaboration"
                fill
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}