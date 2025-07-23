'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { cn } from '@/lib/utils'

/**
 * Loading skeleton component for contact page
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
      {/* Contact Form and Info Section Skeleton */}
      <motion.section
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form Skeleton */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-xl">
                <CardHeader className="text-center pb-6">
                  <SkeletonShimmer className="h-8 w-48 mx-auto mb-2" />
                  <SkeletonShimmer className="h-4 w-80 mx-auto" />
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <SkeletonShimmer className="h-4 w-20" />
                      <SkeletonShimmer className="h-12 w-full" />
                    </div>
                    <div className="space-y-2">
                      <SkeletonShimmer className="h-4 w-24" />
                      <SkeletonShimmer className="h-12 w-full" />
                    </div>
                  </div>
                  
                  {/* Phone and Subject Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <SkeletonShimmer className="h-4 w-28" />
                      <SkeletonShimmer className="h-12 w-full" />
                    </div>
                    <div className="space-y-2">
                      <SkeletonShimmer className="h-4 w-16" />
                      <SkeletonShimmer className="h-12 w-full" />
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div className="space-y-2">
                    <SkeletonShimmer className="h-4 w-16" />
                    <SkeletonShimmer className="h-32 w-full" />
                    <SkeletonShimmer className="h-3 w-24" />
                  </div>
                  
                  {/* Submit Button */}
                  <SkeletonShimmer className="h-12 w-full" />
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info Skeleton */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Contact Methods */}
              <Card className="shadow-xl">
                <CardHeader>
                  <SkeletonShimmer className="h-6 w-32 mb-2" />
                  <SkeletonShimmer className="h-4 w-64" />
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100">
                      <SkeletonShimmer className="w-12 h-12 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <SkeletonShimmer className="h-4 w-24" />
                        <SkeletonShimmer className="h-4 w-32" />
                        <SkeletonShimmer className="h-3 w-28" />
                      </div>
                      <SkeletonShimmer className="h-8 w-20 rounded" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Store Hours */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <SkeletonShimmer className="w-10 h-10 rounded-lg" />
                    <div className="space-y-1">
                      <SkeletonShimmer className="h-5 w-24" />
                      <SkeletonShimmer className="h-3 w-32" />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <SkeletonShimmer className="h-4 w-28" />
                        <SkeletonShimmer className="h-4 w-32" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <SkeletonShimmer className="h-4 w-48" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="text-center space-y-3">
                        <SkeletonShimmer className="w-12 h-12 rounded-full mx-auto" />
                        <SkeletonShimmer className="h-6 w-12 mx-auto" />
                        <SkeletonShimmer className="h-3 w-16 mx-auto" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="shadow-lg">
                <CardHeader>
                  <SkeletonShimmer className="h-5 w-20 mb-2" />
                  <SkeletonShimmer className="h-4 w-64" />
                </CardHeader>
                
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <SkeletonShimmer key={index} className="w-12 h-12 rounded-full" />
                    ))}
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <SkeletonShimmer className="h-4 w-full" />
                    <SkeletonShimmer className="h-3 w-48" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Location Map Section Skeleton */}
      <motion.section
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <SkeletonShimmer className="h-6 w-24 mx-auto" />
            <SkeletonShimmer className="h-10 w-48 mx-auto" />
            <SkeletonShimmer className="h-6 w-96 mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Skeleton */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="overflow-hidden shadow-xl h-full">
                <SkeletonShimmer className="h-96 lg:h-full min-h-[400px] w-full" />
              </Card>
            </motion.div>

            {/* Location Details Skeleton */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Transportation */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <SkeletonShimmer className="h-5 w-32 mb-4" />
                  
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                        <SkeletonShimmer className="w-10 h-10 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <SkeletonShimmer className="h-4 w-20" />
                          <SkeletonShimmer className="h-3 w-32" />
                          <SkeletonShimmer className="h-3 w-28" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Nearby Landmarks */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <SkeletonShimmer className="h-5 w-28 mb-4" />
                  
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <SkeletonShimmer className="w-2 h-2 rounded-full" />
                        <SkeletonShimmer className="h-3 w-40" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Store Features */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <SkeletonShimmer className="h-5 w-28 mb-4" />
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <SkeletonShimmer className="w-2 h-2 rounded-full" />
                        <SkeletonShimmer className="h-3 w-20" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                    <SkeletonShimmer className="h-4 w-full" />
                    <SkeletonShimmer className="h-8 w-32" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section Skeleton */}
      <motion.section
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="py-20 bg-white"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <SkeletonShimmer className="h-6 w-48 mx-auto" />
            <SkeletonShimmer className="h-10 w-64 mx-auto" />
            <SkeletonShimmer className="h-6 w-96 mx-auto" />
            <SkeletonShimmer className="h-12 w-80 mx-auto" />
          </div>

          {/* FAQ Items */}
          <motion.div variants={containerVariants} className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex-1 space-y-2">
                      <SkeletonShimmer className="h-3 w-24" />
                      <SkeletonShimmer className="h-5 w-80" />
                    </div>
                    <SkeletonShimmer className="w-5 h-5 rounded" />
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact CTA */}
          <motion.div variants={itemVariants} className="mt-16">
            <Card className="bg-gray-50">
              <CardContent className="p-8 text-center space-y-6">
                <SkeletonShimmer className="w-16 h-16 rounded-full mx-auto" />
                <SkeletonShimmer className="h-8 w-48 mx-auto" />
                <SkeletonShimmer className="h-6 w-80 mx-auto" />
                <div className="flex gap-4 justify-center">
                  <SkeletonShimmer className="h-12 w-32" />
                  <SkeletonShimmer className="h-12 w-28" />
                </div>
                <div className="flex gap-6 justify-center">
                  <SkeletonShimmer className="h-4 w-32" />
                  <SkeletonShimmer className="h-4 w-28" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}