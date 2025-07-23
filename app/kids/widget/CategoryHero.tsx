'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Baby, Star, Smile, Gamepad2 } from 'lucide-react'

interface CategoryHeroProps {
  title: string
  subtitle: string
  description: string
  backgroundImage: string
}

/**
 * Hero section component for kids category page
 * Features playful design elements and colorful styling
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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-purple-900/50" />
      </div>

      {/* Playful Decorative Elements */}
      <motion.div
        className="absolute top-16 right-12 text-yellow-300"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Star className="w-8 h-8" />
      </motion.div>
      <motion.div
        className="absolute bottom-28 right-20 text-green-300"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Smile className="w-10 h-10" />
      </motion.div>
      <motion.div
        className="absolute top-32 left-16 text-pink-300"
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -15, 15, 0]
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <Baby className="w-12 h-12" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-12 text-orange-300"
        animate={{ 
          y: [0, -15, 0],
          x: [0, 10, 0]
        }}
        transition={{ duration: 3.5, repeat: Infinity }}
      >
        <Gamepad2 className="w-8 h-8" />
      </motion.div>
      
      {/* Floating Emojis */}
      <motion.div
        className="absolute top-20 left-1/4 text-4xl"
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🎈
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-1/4 text-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, -15, 15, 0]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🌈
      </motion.div>
      <motion.div
        className="absolute bottom-1/3 left-1/3 text-2xl"
        animate={{ 
          y: [0, -20, 0],
          x: [0, 15, 0]
        }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        ⭐
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm text-yellow-200 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4 border-2 border-yellow-300/30"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Baby className="w-4 h-4" />
              {subtitle}
              <Star className="w-4 h-4" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {title}
              <motion.span
                className="inline-block ml-4 text-5xl"
                animate={{ 
                  rotate: [0, 20, -20, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎨
              </motion.span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
            
            {/* Fun Features */}
            <motion.div
              className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-blue-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-green-300" />
                Safe & Tested
              </div>
              <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full">
                <Smile className="w-4 h-4 text-yellow-300" />
                Fun & Educational
              </div>
              <div className="flex items-center gap-2 bg-pink-500/20 px-3 py-1 rounded-full">
                <Baby className="w-4 h-4 text-pink-300" />
                Age Appropriate
              </div>
            </motion.div>
            
            {/* Call to Action */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                <Gamepad2 className="w-5 h-5" />
                Discover Magic Below!
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-yellow-300/70 rounded-full flex justify-center bg-blue-500/20">
          <motion.div 
            className="w-1 h-3 bg-yellow-300/70 rounded-full mt-2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}