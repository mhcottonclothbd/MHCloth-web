'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { MapPin, Navigation, Car, Train, Clock, ExternalLink } from 'lucide-react'
import Button from '@/components/Button'
import { Card, CardContent } from '@/components/Card'

/**
 * Location map component with store information
 * Displays interactive map and transportation details
 */
export default function LocationMap() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const transportationOptions = [
    {
      icon: <Car className="w-5 h-5" />,
      title: 'By Car',
      description: 'Free parking available',
      details: '2-hour street parking or paid garage next door'
    },
    {
      icon: <Train className="w-5 h-5" />,
      title: 'Public Transit',
      description: '5 min walk from subway',
      details: 'Union Square Station (4, 5, 6, L, N, Q, R, W)'
    },
    {
      icon: <Navigation className="w-5 h-5" />,
      title: 'Walking/Biking',
      description: 'Bike racks available',
      details: 'Located in pedestrian-friendly area'
    }
  ]

  const nearbyLandmarks = [
    'Union Square Park - 2 blocks',
    'Whole Foods Market - 1 block',
    'Barnes & Noble - 3 blocks',
    'Multiple cafes and restaurants'
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <MapPin className="w-4 h-4" />
              Find Us
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Visit Our Store
            </h2>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Located in the heart of Manhattan, our showroom features the full collection 
              in a beautifully designed space that inspires.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Section */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2"
            >
              <Card className="overflow-hidden shadow-xl h-full">
                <div className="relative h-96 lg:h-full min-h-[400px]">
                  {/* Embedded Map Placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div key={i} className="border border-gray-300" />
                        ))}
                      </div>
                    </div>
                    
                    {/* Map Content */}
                    <div className="relative z-10 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : { scale: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg"
                      >
                        <MapPin className="w-8 h-8" />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Your Store Name
                        </h3>
                        <p className="text-gray-600 mb-4">
                          123 Design Street<br />
                          New York, NY 10001
                        </p>
                        
                        <Link 
                          href="https://maps.google.com/?q=123+Design+Street+New+York+NY"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button className="inline-flex items-center gap-2">
                            <Navigation className="w-4 h-4" />
                            Get Directions
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                    
                    {/* Floating Elements */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="font-medium text-gray-900">Open Now</span>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                      transition={{ duration: 1, delay: 1 }}
                      className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-900">Closes 8PM</span>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Real Map Integration Note */}
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    Interactive map placeholder - Integrate with Google Maps API
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Location Details */}
            <motion.div
              variants={itemVariants}
              className="space-y-6"
            >
              {/* Transportation */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    How to Get Here
                  </h3>
                  
                  <div className="space-y-4">
                    {transportationOptions.map((option, index) => (
                      <motion.div
                        key={option.title}
                        variants={itemVariants}
                        className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                          {option.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {option.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">
                            {option.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {option.details}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Nearby Landmarks */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    What's Nearby
                  </h3>
                  
                  <div className="space-y-3">
                    {nearbyLandmarks.map((landmark, index) => (
                      <motion.div
                        key={landmark}
                        variants={itemVariants}
                        className="flex items-center gap-3 text-gray-600"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        <span className="text-sm">{landmark}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Store Features */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Store Features
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Free WiFi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Wheelchair Accessible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Personal Shopping</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Gift Wrapping</span>
                    </div>
                  </div>
                  
                  <motion.div
                    variants={itemVariants}
                    className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <p className="text-sm text-blue-800">
                      <strong>Book an Appointment:</strong> Schedule a personal consultation 
                      with our design experts for a tailored shopping experience.
                    </p>
                    
                    <Link href="/contact?service=consultation">
                      <Button size="sm" className="mt-3">
                        Book Consultation
                      </Button>
                    </Link>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}