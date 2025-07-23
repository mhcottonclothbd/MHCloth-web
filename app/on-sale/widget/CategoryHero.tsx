'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Tag, Percent } from 'lucide-react'

interface CategoryHeroProps {
  title: string
  subtitle: string
  description: string
  backgroundImage: string
  saleTheme?: boolean
}

/**
 * Hero section component for sale category page
 * Features animated sale badges and promotional styling
 */
export default function CategoryHero({ 
  title, 
  subtitle, 
  description, 
  backgroundImage,
  saleTheme = false
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
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/60 to-orange-900/60" />
      </div>

      {/* Animated Sale Elements */}
      {saleTheme && (
        <>
          <motion.div
            className="absolute top-20 left-10 text-red-400"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Tag className="w-8 h-8" />
          </motion.div>
          <motion.div
            className="absolute top-32 right-16 text-orange-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Percent className="w-10 h-10" />
          </motion.div>
          <motion.div
            className="absolute bottom-32 left-20 text-yellow-400"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Tag className="w-6 h-6" />
          </motion.div>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Sale Badge */}
            {saleTheme && (
              <motion.div
                className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Tag className="w-4 h-4" />
                {subtitle}
              </motion.div>
            )}
            
            {!saleTheme && (
              <h2 className="text-sm font-medium text-white/80 uppercase tracking-wider mb-4">
                {subtitle}
              </h2>
            )}
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {title}
              {saleTheme && (
                <motion.span
                  className="text-yellow-400 ml-4"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🔥
                </motion.span>
              )}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
            
            {/* Sale CTA */}
            {saleTheme && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-bold text-lg">
                  <Percent className="w-5 h-5" />
                  Up to 50% Off
                </div>
              </motion.div>
            )}
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