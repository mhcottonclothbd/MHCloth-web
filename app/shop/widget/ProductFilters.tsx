'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Filter, X } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/Card'
import Button from '@/components/Button'
import { cn } from '@/lib/utils'

interface ProductFiltersProps {
  selectedCategory?: string
  selectedFilter?: string
}

const categories = [
  { id: 'all', name: 'All Products', count: 48 },
  { id: 'clothing', name: 'Clothing', count: 32 },
  { id: 'jackets', name: 'Jackets & Outerwear', count: 8 },
  { id: 'shirts', name: 'Shirts', count: 6 },
  { id: 'pants', name: 'Pants & Trousers', count: 6 },
  { id: 'denim', name: 'Denim', count: 4 },
  { id: 't-shirts', name: 'T-Shirts', count: 4 },
  { id: 'accessories', name: 'Accessories', count: 4 }
]

const filters = [
  { id: 'all', name: 'All Items' },
  { id: 'in-stock', name: 'In Stock Only' },
  { id: 'featured', name: 'Featured Products' }
]

const priceRanges = [
  { id: 'all', name: 'All Prices', min: 0, max: Infinity },
  { id: 'under-2500', name: 'Under ৳2500', min: 0, max: 2500 },
    { id: '2500-5000', name: '৳2500 - ৳5000', min: 2500, max: 5000 },
    { id: '5000-10000', name: '৳5000 - ৳10000', min: 5000, max: 10000 },
    { id: 'over-10000', name: 'Over ৳10000', min: 10000, max: Infinity }
]

/**
 * Product filters sidebar component
 * Handles category, availability, and price filtering
 */
export default function ProductFilters({ selectedCategory, selectedFilter }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  /**
   * Updates URL search parameters when filter changes
   */
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === 'all' || !value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    router.push(`/shop?${params.toString()}`)
  }

  /**
   * Clears all active filters
   */
  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    params.delete('filter')
    params.delete('price')
    
    router.push(`/shop?${params.toString()}`)
  }

  const hasActiveFilters = selectedCategory || selectedFilter || searchParams.get('price')

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Categories */}
      <Card>
        <CardHeader>
          <h3 className="font-medium text-gray-900">Categories</h3>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => updateFilter('category', category.id)}
              className={cn(
                'w-full flex items-center justify-between p-2 rounded-md text-left transition-colors',
                (selectedCategory === category.id || (!selectedCategory && category.id === 'all'))
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'hover:bg-gray-50 text-gray-700'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm font-medium">{category.name}</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {category.count}
              </span>
            </motion.button>
          ))}
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <h3 className="font-medium text-gray-900">Availability</h3>
        </CardHeader>
        <CardContent className="space-y-2">
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => updateFilter('filter', filter.id)}
              className={cn(
                'w-full flex items-center p-2 rounded-md text-left transition-colors',
                (selectedFilter === filter.id || (!selectedFilter && filter.id === 'all'))
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'hover:bg-gray-50 text-gray-700'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm font-medium">{filter.name}</span>
            </motion.button>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <h3 className="font-medium text-gray-900">Price Range</h3>
        </CardHeader>
        <CardContent className="space-y-2">
          {priceRanges.map((range) => (
            <motion.button
              key={range.id}
              onClick={() => updateFilter('price', range.id)}
              className={cn(
                'w-full flex items-center p-2 rounded-md text-left transition-colors',
                (searchParams.get('price') === range.id || (!searchParams.get('price') && range.id === 'all'))
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'hover:bg-gray-50 text-gray-700'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm font-medium">{range.name}</span>
            </motion.button>
          ))}
        </CardContent>
      </Card>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Active Filters</h4>
            <div className="space-y-1">
              {selectedCategory && selectedCategory !== 'all' && (
                <div className="flex items-center justify-between text-sm text-blue-700">
                  <span>Category: {categories.find(c => c.id === selectedCategory)?.name}</span>
                  <button
                    onClick={() => updateFilter('category', 'all')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedFilter && selectedFilter !== 'all' && (
                <div className="flex items-center justify-between text-sm text-blue-700">
                  <span>Filter: {filters.find(f => f.id === selectedFilter)?.name}</span>
                  <button
                    onClick={() => updateFilter('filter', 'all')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {searchParams.get('price') && searchParams.get('price') !== 'all' && (
                <div className="flex items-center justify-between text-sm text-blue-700">
                  <span>Price: {priceRanges.find(p => p.id === searchParams.get('price'))?.name}</span>
                  <button
                    onClick={() => updateFilter('price', 'all')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}