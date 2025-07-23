'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Heart, Sparkles, Flower } from 'lucide-react'

interface CategoryHeroProps {
  title: string
  subtitle: string
  description: string
  backgroundImage: string
}

/**
 * Hero section component for women's category page
 * Features elegant design elements and feminine styling
 */
export default function CategoryHero({ 
  title, 
  subtitle, 
  description, 
  backgroundImage 
}: CategoryHeroProps) {
  return (
    <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-rose-900/60 to-pink-900/40" />
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-20 right-10 text-pink-300/40"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Heart className="w-10 h-10" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 right-16 text-rose-300/40"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Sparkles className="w-8 h-8" />
      </motion.div>
      <motion.div
        className="absolute top-40 left-16 text-pink-400/40"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <Flower className="w-12 h-12" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-10 text-rose-400/30"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-6 h-6" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-rose-800/80 backdrop-blur-sm text-pink-200 px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider mb-4 border border-pink-300/20"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Heart className="w-4 h-4" />
              {subtitle}
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {title}
              <motion.span
                className="inline-block ml-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </h1>
            <p className="text-lg md:text-xl text-pink-100 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
            
            {/* Quality Indicators */}
            <motion.div
              className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-pink-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-300" />
                Curated with Love
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-300" />
                Premium Quality
              </div>
              <div className="flex items-center gap-2">
                <Flower className="w-4 h-4 text-pink-400" />
                Elegant Design
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-pink-300/20"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <Heart className="w-4 h-4" />
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-1/3 text-rose-300/20"
        animate={{ 
          y: [0, 15, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Sparkles className="w-5 h-5" />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-pink-200/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-pink-200/50 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  )
}