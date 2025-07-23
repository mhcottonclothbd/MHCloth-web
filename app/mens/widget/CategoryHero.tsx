'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { User, Shield, Star } from 'lucide-react'

interface CategoryHeroProps {
  title: string
  subtitle: string
  description: string
  backgroundImage: string
}

/**
 * Hero section component for men's category page
 * Features masculine design elements and sophisticated styling
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
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-gray-900/50" />
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-20 right-10 text-blue-400/30"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Shield className="w-12 h-12" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 right-16 text-gray-400/30"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Star className="w-8 h-8" />
      </motion.div>
      <motion.div
        className="absolute top-40 left-16 text-slate-400/30"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <User className="w-10 h-10" />
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
              className="inline-flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm text-blue-300 px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider mb-4 border border-blue-400/20"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <User className="w-4 h-4" />
              {subtitle}
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
            
            {/* Quality Indicators */}
            <motion.div
              className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Premium Quality
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                Curated Selection
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-green-400" />
                Modern Style
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  )
}