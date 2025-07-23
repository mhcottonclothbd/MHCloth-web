'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Users, Package, Award, Globe } from 'lucide-react'

interface Stat {
  icon: React.ReactNode
  value: number
  label: string
  suffix?: string
  prefix?: string
}

const stats: Stat[] = [
  {
    icon: <Users className="w-8 h-8" />,
    value: 12500,
    label: 'Happy Customers',
    suffix: '+'
  },
  {
    icon: <Package className="w-8 h-8" />,
    value: 850,
    label: 'Curated Products',
    suffix: '+'
  },
  {
    icon: <Award className="w-8 h-8" />,
    value: 98,
    label: 'Customer Satisfaction',
    suffix: '%'
  },
  {
    icon: <Globe className="w-8 h-8" />,
    value: 45,
    label: 'Countries Served',
    suffix: '+'
  }
]

/**
 * Animated counter component for individual statistics
 */
function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      setCount(Math.floor(progress * value))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isInView, value, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

/**
 * Statistics section with animated counters and icons
 * Displays key company metrics and achievements
 */
export default function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These numbers represent more than statistics—they reflect the trust our customers 
            place in us and the community we've built together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300"
              >
                {stat.icon}
              </motion.div>
              
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {stat.prefix}
                <AnimatedCounter value={stat.value} />
                {stat.suffix}
              </div>
              
              <p className="text-gray-600 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional Context */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Growing Together
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every number tells a story of connection, quality, and trust. From our first customer 
              to our latest product launch, we're committed to maintaining the personal touch that 
              makes shopping with us special. Our growth is measured not just in sales, but in the 
              relationships we build and the positive impact we create.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}