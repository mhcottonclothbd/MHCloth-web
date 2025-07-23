'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/Card'
import { cn } from '@/lib/utils'

interface ProductSearchProps {
  initialSearch?: string
}

/**
 * Product search component with real-time filtering
 * Debounces input to avoid excessive API calls
 */
export default function ProductSearch({ initialSearch = '' }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  /**
   * Debounced search effect to update URL after user stops typing
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (searchTerm.trim()) {
        params.set('search', searchTerm.trim())
      } else {
        params.delete('search')
      }
      
      // Reset to first page when searching
      params.delete('page')
      
      router.push(`/shop?${params.toString()}`)
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchTerm, router, searchParams])

  /**
   * Clears the search input and updates URL
   */
  const clearSearch = () => {
    setSearchTerm('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="relative">
          <motion.div
            className={cn(
              'relative flex items-center transition-all duration-200',
              isFocused ? 'scale-[1.02]' : 'scale-100'
            )}
            whileFocus={{ scale: 1.02 }}
          >
            {/* Search Icon */}
            <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
            
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={cn(
                'w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'placeholder-gray-400 text-gray-900 transition-all duration-200',
                isFocused ? 'shadow-md' : 'shadow-sm'
              )}
            />
            
            {/* Clear Button */}
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clearSearch}
                className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
          
          {/* Search Suggestions/Results Count */}
          {searchTerm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-gray-600"
            >
              Searching for "{searchTerm}"...
            </motion.div>
          )}
        </div>
        
        {/* Search Tips */}
        {!searchTerm && (
          <div className="mt-3 text-xs text-gray-500">
            <p className="mb-1">💡 <strong>Search tips:</strong></p>
            <ul className="space-y-1 ml-4">
              <li>• Try "leather jacket" or "minimalist watch"</li>
              <li>• Search by category like "home" or "accessories"</li>
              <li>• Use specific terms for better results</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}