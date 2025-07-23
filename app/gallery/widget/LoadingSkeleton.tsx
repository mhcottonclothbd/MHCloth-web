'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/Card'
import { cn } from '@/lib/utils'

/**
 * Loading skeleton component for gallery page
 * Provides visual feedback while content is loading
 */
export default function LoadingSkeleton() {
  // Animation variants for skeleton elements
  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: {
      x: '100%',
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 0.5
      }
    }
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  }

  // Skeleton shimmer effect component
  const SkeletonShimmer = ({ className }: { className?: string }) => (
    <div className={cn('relative overflow-hidden bg-gray-200 rounded', className)}>
      <motion.div
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
      />
    </div>
  )

  return (
    <div className="space-y-20">
      {/* Hero Section Skeleton */}
      <motion.section
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="relative h-[70vh] bg-gray-100 rounded-2xl overflow-hidden"
      >
        <SkeletonShimmer className="w-full h-full" />
        
        {/* Hero Content Skeleton */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-2xl mx-auto px-4">
            <SkeletonShimmer className="h-4 w-32 mx-auto" />
            <SkeletonShimmer className="h-12 w-96 mx-auto" />
            <SkeletonShimmer className="h-6 w-80 mx-auto" />
            <div className="flex gap-4 justify-center pt-4">
              <SkeletonShimmer className="h-12 w-32" />
              <SkeletonShimmer className="h-12 w-28" />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Collection Grid Skeleton */}
      <motion.section
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section Header Skeleton */}
        <div className="text-center mb-12 space-y-4">
          <SkeletonShimmer className="h-4 w-40 mx-auto" />
          <SkeletonShimmer className="h-10 w-64 mx-auto" />
          <SkeletonShimmer className="h-6 w-96 mx-auto" />
        </div>

        {/* Filter Buttons Skeleton */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Array.from({ length: 5 }).map((_, index) => (
            <motion.div key={index} variants={itemVariants}>
              <SkeletonShimmer className="h-10 w-20" />
            </motion.div>
          ))}
        </div>

        {/* Masonry Grid Skeleton */}
        <motion.div
          variants={containerVariants}
          className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
        >
          {Array.from({ length: 12 }).map((_, index) => {
            // Vary heights for masonry effect
            const heights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-60', 'h-88']
            const randomHeight = heights[index % heights.length]
            
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="break-inside-avoid mb-6"
              >
                <Card className="overflow-hidden">
                  <SkeletonShimmer className={cn('w-full', randomHeight)} />
                  <div className="p-4 space-y-3">
                    <SkeletonShimmer className="h-5 w-3/4" />
                    <SkeletonShimmer className="h-4 w-1/2" />
                    <div className="flex items-center justify-between pt-2">
                      <SkeletonShimmer className="h-6 w-16" />
                      <SkeletonShimmer className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.section>

      {/* Featured Collection Skeleton */}
      <motion.section
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="bg-gray-50 py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content Side Skeleton */}
            <motion.div variants={itemVariants} className="space-y-6">
              <SkeletonShimmer className="h-8 w-48" />
              <SkeletonShimmer className="h-16 w-full" />
              <SkeletonShimmer className="h-24 w-full" />
              
              {/* Stats Skeleton */}
              <div className="grid grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="text-center space-y-2">
                    <SkeletonShimmer className="h-12 w-12 rounded-full mx-auto" />
                    <SkeletonShimmer className="h-6 w-12 mx-auto" />
                    <SkeletonShimmer className="h-4 w-16 mx-auto" />
                  </div>
                ))}
              </div>
              
              {/* Buttons Skeleton */}
              <div className="flex gap-4">
                <SkeletonShimmer className="h-12 w-32" />
                <SkeletonShimmer className="h-12 w-28" />
              </div>
            </motion.div>

            {/* Visual Side Skeleton */}
            <motion.div variants={itemVariants} className="space-y-6">
              <SkeletonShimmer className="aspect-[4/5] w-full rounded-2xl" />
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <SkeletonShimmer className="aspect-square w-full rounded-lg" />
                    <SkeletonShimmer className="h-4 w-full" />
                    <SkeletonShimmer className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Instagram Feed Skeleton */}
      <motion.section
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header Skeleton */}
        <div className="text-center mb-16 space-y-4">
          <SkeletonShimmer className="h-8 w-48 mx-auto" />
          <SkeletonShimmer className="h-12 w-80 mx-auto" />
          <SkeletonShimmer className="h-6 w-96 mx-auto" />
        </div>

        {/* Instagram Grid Skeleton */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div key={index} variants={itemVariants}>
              <SkeletonShimmer className="aspect-square w-full rounded-lg" />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section Skeleton */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto space-y-6">
            <SkeletonShimmer className="h-16 w-16 rounded-full mx-auto" />
            <SkeletonShimmer className="h-8 w-64 mx-auto" />
            <SkeletonShimmer className="h-6 w-96 mx-auto" />
            <div className="flex justify-center gap-4">
              <SkeletonShimmer className="h-12 w-40" />
              <SkeletonShimmer className="h-12 w-32" />
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  )
}