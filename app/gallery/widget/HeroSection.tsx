'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Camera, ArrowRight } from 'lucide-react'
import Button from '@/components/Button'

/**
 * Gallery hero section with visual storytelling and collection highlights
 * Features parallax effects and smooth animations
 */
export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images Grid */}
      <div className="absolute inset-0 grid grid-cols-3 gap-1">
        {/* Left Column */}
        <div className="space-y-1">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-1/3 overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&q=80"
              alt="Home collection"
              fill
              className="object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative h-2/3 overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop&q=80"
              alt="Fashion collection"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
        
        {/* Center Column */}
        <div className="space-y-1">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="relative h-2/3 overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=800&fit=crop&q=80"
              alt="Accessories collection"
              fill
              className="object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-1/3 overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=600&h=400&fit=crop&q=80"
              alt="Lifestyle collection"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-1">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative h-1/2 overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop&q=80"
              alt="Premium collection"
              fill
              className="object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative h-1/2 overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80"
              alt="Sustainable collection"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="backdrop-blur-md bg-white/10 rounded-2xl p-8 md:p-12 border border-white/20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6"
          >
            <Camera className="w-5 h-5" />
            <span className="text-sm font-medium">Visual Stories</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Gallery of
            <br />
            <span className="text-blue-300">Inspiration</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed"
          >
            Discover our curated collections through beautiful imagery. 
            Each piece tells a story of craftsmanship, design, and purpose.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="#collections">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                Explore Collections
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link href="/shop">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                Shop Now
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1]
        }}
        className="absolute top-20 left-10 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
      />
      
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -3, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
          delay: 2
        }}
        className="absolute bottom-32 right-16 w-12 h-12 bg-blue-400/20 backdrop-blur-sm rounded-full border border-blue-300/30"
      />
      
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          x: [0, 10, 0]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
        className="absolute top-1/3 right-20 w-8 h-8 bg-purple-400/20 backdrop-blur-sm rounded-full border border-purple-300/30"
      />
    </section>
  )
}