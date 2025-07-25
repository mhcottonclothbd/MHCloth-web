'use client';

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { CategoryItem } from '@/data/categories'
import { cn } from '@/lib/utils'
import { useCart } from '@/lib/cart-context'

// Import Product type from types
import { Product as ProductType } from '@/types'

// Extended product interface for component compatibility
interface Product extends ProductType {
  originalPrice?: number | null
  image?: string
  inStock?: boolean
  rating?: number
  reviews?: number
}

interface ShopByCategoryProps {
  searchParams: {
    search?: string
    sort?: string
    filter?: string
    category?: string
  }
  categories: CategoryItem[]
  products: Product[]
  categoryType: 'mens' | 'womens' | 'kids'
  title: string
}

/**
 * Reusable shop by category component with horizontal scrollable category filter
 * Features responsive design, smooth animations, and category-based product sections
 */
export default function ShopByCategory({
  searchParams,
  categories,
  products,
  categoryType,
  title
}: ShopByCategoryProps) {
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || 'all')
  const [isLoading, setIsLoading] = useState(false)

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products
    }
    return products.filter(product => product.category === selectedCategory)
  }, [selectedCategory, products])

  // Group products by category for section display
  const productsByCategory = useMemo(() => {
    const grouped: { [key: string]: Product[] } = {}
    
    categories.forEach(cat => {
      grouped[cat.id] = products.filter(product => product.category === cat.id)
    })
    
    return grouped
  }, [categories, products])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 300)
  }

  const { addItem } = useCart()

  /**
   * Handles adding product to cart with proper cart context integration
   */
  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Find the product by ID
    const product = products.find(p => p.id === productId)
    if (product && product.stock > 0) {
      addItem({
          product: {
            id: product.id,
            name: product.name,
            description: product.description || product.name, // Using description or name as fallback
            price: product.price,
            image_url: product.image_url,
            stock: product.stock,
            category: product.category,
            featured: product.featured,
            created_at: product.created_at,
            updated_at: product.updated_at
          },
          quantity: 1,
          selectedSize: undefined,
          selectedColor: undefined
        })
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Enhanced Shop by Category Section */}
      <div className="w-full">
        {/* Section Header */}
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-orange-600 to-amber-700 bg-clip-text text-transparent mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Discover our curated collection across different categories
          </p>
        </div>

        {/* Category Horizontal Scrollable Line */}
        <div className="w-full">
          <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth">
            {/* All Categories Option */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryChange('all')}
              className={cn(
                "flex-shrink-0 group relative overflow-hidden touch-manipulation",
                "min-w-[120px] sm:min-w-[140px] p-3 sm:p-4 rounded-xl md:rounded-2xl transition-all duration-300",
                "backdrop-blur-sm border shadow-lg",
                selectedCategory === 'all'
                  ? "bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 text-white shadow-orange-500/30 border-orange-300/50"
                  : "bg-white/90 text-gray-700 hover:bg-white hover:shadow-xl hover:shadow-orange-200/40 border-gray-200/50 hover:border-orange-200"
              )}
            >
              <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                <div className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-sm sm:text-base md:text-lg font-bold transition-all duration-200",
                  "border backdrop-blur-sm",
                  selectedCategory === 'all'
                    ? "border-white/30 bg-white/20 text-white"
                    : "border-gray-200/50 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 group-hover:from-orange-50 group-hover:to-orange-100 group-hover:text-orange-600"
                )}>
                  ALL
                </div>
                <div className="text-center">
                  <span className="text-xs sm:text-sm font-medium block leading-tight">All Products</span>
                </div>
              </div>
            </motion.button>

            {/* Category Items */}
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryChange(cat.id)}
                className={cn(
                  "flex-shrink-0 group relative overflow-hidden touch-manipulation",
                  "min-w-[120px] sm:min-w-[140px] p-3 sm:p-4 rounded-xl md:rounded-2xl transition-all duration-300",
                  "backdrop-blur-sm border shadow-lg",
                  selectedCategory === cat.id
                    ? "bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 text-white shadow-orange-500/30 border-orange-300/50"
                    : "bg-white/90 text-gray-700 hover:bg-white hover:shadow-xl hover:shadow-orange-200/40 border-gray-200/50 hover:border-orange-200"
                )}
              >
                <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                  <div className={cn(
                    "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl overflow-hidden transition-all duration-200",
                    "border backdrop-blur-sm shadow-md",
                    selectedCategory === cat.id
                      ? "border-white/30 shadow-white/20"
                      : "border-gray-200/50 group-hover:border-orange-200 group-hover:shadow-orange-200/30"
                  )}>
                    <Image
                      src={cat.icon}
                      alt={cat.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-xs sm:text-sm font-medium block leading-tight">
                      {cat.name}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Category Description */}
        {selectedCategory !== 'all' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 text-center"
          >
            <div className="bg-orange-50/80 backdrop-blur-sm rounded-xl p-3 border border-orange-200/50">
              <p className="text-gray-700 text-sm">
                {categories.find(cat => cat.id === selectedCategory)?.description}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          {selectedCategory !== 'all' && (
            <span className="ml-1">
              in {categories.find(cat => cat.id === selectedCategory)?.name || 'category'}
            </span>
          )}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Category Sections or Filtered Products */}
      {!isLoading && (
        <AnimatePresence mode="wait">
          {selectedCategory === 'all' ? (
            // Show all categories with their products
            <motion.div
              key="all-categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {categories.map((cat) => {
                const categoryProducts = productsByCategory[cat.id] || []
                if (categoryProducts.length === 0) return null

                return (
                  <CategorySection
                    key={cat.id}
                    category={cat}
                    products={categoryProducts}
                    categoryType={categoryType}
                    onAddToCart={handleAddToCart}
                  />
                )
              })}
            </motion.div>
          ) : (
            // Show filtered products
            <motion.div
              key="filtered-products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode="grid"
                  onAddToCart={handleAddToCart}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* No Results */}
      {!isLoading && filteredProducts.length === 0 && selectedCategory !== 'all' && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200"
          >
            Show All Categories
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Category section component with horizontal scrollable products
 */
interface CategorySectionProps {
  category: CategoryItem
  products: Product[]
  categoryType: 'mens' | 'womens' | 'kids'
  onAddToCart: (e: React.MouseEvent, productId: string) => void
}

function CategorySection({ category, products, categoryType, onAddToCart }: CategorySectionProps) {
  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 bg-white">
            <Image
              src={category.icon}
              alt={category.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
            <p className="text-gray-600">{category.description}</p>
          </div>
        </div>
        <Link
          href={`/${categoryType}/${category.id}`}
          className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
        >
          View All →
        </Link>
      </div>

      {/* Horizontal Scrollable Products */}
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth">
          {products.slice(0, 8).map((product) => (
            <div key={product.id} className="flex-shrink-0 w-72">
              <ProductCard
                product={product}
                viewMode="grid"
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Enhanced product card component
 */
interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
  onAddToCart: (e: React.MouseEvent, productId: string) => void
}

function ProductCard({ product, viewMode, onAddToCart }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  // Use image_url from Product type, fallback to image if available
  const productImage = product.image_url || (product as any).image || '/placeholder-image.jpg'
  const isInStock = product.stock > 0
  const productRating = (product as any).rating || 4.5
  const productReviews = (product as any).reviews || 0

  return (
    <Link href={`/shop/${product.id}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                Featured
              </span>
            )}
            {discount > 0 && (
              <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                -{discount}%
              </span>
            )}
          </div>

          {!isInStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {product.name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3 h-3",
                      i < Math.floor(productRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({productReviews})</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => onAddToCart(e, product.id)}
            disabled={!isInStock}
            className={cn(
              "w-full py-2.5 px-4 rounded-xl font-medium transition-all duration-200",
              isInStock
                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            )}
          >
            {isInStock ? 'Add to Cart' : 'Out of Stock'}
          </motion.button>
        </div>
      </motion.div>
    </Link>
  )
}

export type { Product }