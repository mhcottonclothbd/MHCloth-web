/**
 * Loading skeleton component for shop page
 * Provides visual feedback while products are loading
 */
export default function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Sort Controls Skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} delay={i * 100} />
        ))}
      </div>
    </div>
  )
}

/**
 * Individual product card skeleton with staggered animation
 */
function ProductCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div 
      className="animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Image Skeleton */}
        <div className="aspect-square bg-gray-200"></div>
        
        {/* Content Skeleton */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          
          {/* Description */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
          
          {/* Price and Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="h-5 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  )
}