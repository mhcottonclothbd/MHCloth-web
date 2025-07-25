'use client';

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { CategoryItem } from '@/data/categories'
import { cn } from '@/lib/utils'
import { useCart } from '@/lib/cart-context'
import { womensProducts } from '@/data/womens-products'

// Use actual women's product data
const mockProducts = womensProducts.map(product => ({
  ...product,
  image: product.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop'
}))

interface ProductGridWithDropdownProps {
  searchParams: {
    search?: string
    sort?: string
    filter?: string
    category?: string
  }
  categories: CategoryItem[]
  category: string
  title: string
}

/**
 * Modern product grid component with horizontal scrollable category filter
 * Features responsive design, smooth animations, and category-based product sections
 */
export default function ProductGridWithDropdown({
  searchParams,
  categories,
  category,
  title
}: ProductGridWithDropdownProps) {
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || 'all')
  const [isLoading, setIsLoading] = useState(false)

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return mockProducts
    }
    return mockProducts.filter(product => product.category === selectedCategory)
  }, [selectedCategory])

  // Group products by category for section display
  const productsByCategory = useMemo(() => {
    const grouped: { [key: string]: typeof mockProducts } = {}
    
    categories.forEach(cat => {
      grouped[cat.id] = mockProducts.filter(product => product.category === cat.id)
    })
    
    return grouped
  }, [categories])

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
    
    // Find the product by ID (convert to number for comparison with mock data)
    const product = mockProducts.find(p => p.id.toString() === productId)
    if (product && product.inStock) {
      addItem({
        product: {
          id: productId,
          name: product.name,
          description: product.name, // Using name as description fallback
          price: product.price,
          image_url: product.image,
          stock: product.inStock ? 10 : 0, // Assuming stock of 10 for in-stock items
          category: product.category,
          featured: product.featured,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        quantity: 1,
        selectedSize: undefined,
        selectedColor: undefined
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Shop by Category Section */}
      <div className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 rounded-3xl p-8 shadow-sm border border-white/20">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-rose-800 to-purple-900 bg-clip-text text-transparent mb-2 md:mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-4">
            Discover our curated collection across different categories
          </p>
        </div>

        {/* Category Grid */}
        <div className="relative">
          {/* Simplified Gradient Overlays for mobile */}
          <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-rose-50 to-transparent z-10 pointer-events-none" />
          <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-purple-50 to-transparent z-10 pointer-events-none" />
          
          <div className="w-full flex gap-2 sm:gap-3 md:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 md:pb-6 scroll-smooth px-3 sm:px-4">
            {/* All Categories Option */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleCategoryChange('all')}
              className={cn(
                   "flex-shrink-0 group relative overflow-hidden touch-manipulation",
                   "min-w-[calc(33.333%-0.5rem)] sm:min-w-[140px] md:min-w-[160px] p-4 md:p-6 rounded-xl md:rounded-2xl transition-all duration-300",
                   "backdrop-blur-sm border border-white/30",
                   selectedCategory === 'all'
                     ? "bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600 text-white shadow-lg shadow-pink-500/20"
                     : "bg-white/80 text-gray-700 hover:bg-white/95 hover:shadow-md hover:shadow-gray-200/40"
                 )}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-current" />
                <div className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-current" />
              </div>
              
              <div className="relative z-10 flex flex-col items-center space-y-3 md:space-y-4">
                 <div className={cn(
                   "w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl font-bold transition-all duration-200",
                   "border-2 backdrop-blur-sm",
                   selectedCategory === 'all'
                     ? "border-white/30 bg-white/20 text-white shadow-md"
                     : "border-gray-200/50 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 group-hover:from-pink-50 group-hover:to-rose-100 group-hover:text-rose-600"
                 )}>
                   ALL
                 </div>
                 <div className="text-center">
                   <span className="text-xs md:text-sm font-semibold block mb-1 leading-tight">All Products</span>
                   <span className={cn(
                     "text-xs px-2 md:px-3 py-1 rounded-full font-medium",
                     selectedCategory === 'all'
                       ? "bg-white/20 text-white/90"
                       : "bg-gray-100/80 text-gray-600 group-hover:bg-pink-100 group-hover:text-rose-700"
                   )}>
                     {mockProducts.length} items
                   </span>
                 </div>
               </div>
            </motion.button>

            {/* Category Items */}
             {categories.map((cat) => (
               <motion.button
                 key={cat.id}
                 whileHover={{ scale: 1.01 }}
                 whileTap={{ scale: 0.99 }}
                 onClick={() => handleCategoryChange(cat.id)}
                 className={cn(
                   "flex-shrink-0 group relative overflow-hidden touch-manipulation",
                   "min-w-[calc(33.333%-0.5rem)] sm:min-w-[140px] md:min-w-[160px] p-4 md:p-6 rounded-xl md:rounded-2xl transition-all duration-300",
                   "backdrop-blur-sm border border-white/30",
                   selectedCategory === cat.id
                     ? "bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600 text-white shadow-lg shadow-pink-500/20"
                     : "bg-white/80 text-gray-700 hover:bg-white/95 hover:shadow-md hover:shadow-gray-200/40"
                 )}
               >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-current" />
                  <div className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-current" />
                </div>
                
                <div className="relative z-10 flex flex-col items-center space-y-3 md:space-y-4">
                  <div className={cn(
                    "w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden transition-all duration-200",
                    "border-2 backdrop-blur-sm shadow-md",
                    selectedCategory === cat.id
                       ? "border-white/30 shadow-white/20"
                       : "border-gray-200/50 group-hover:border-pink-200 group-hover:shadow-pink-200/30"
                  )}>
                    <Image
                      src={cat.icon}
                      alt={cat.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-102"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-xs md:text-sm font-semibold block mb-1 leading-tight px-1">{cat.name}</span>
                    <span className={cn(
                      "text-xs px-2 md:px-3 py-1 rounded-full font-medium",
                      selectedCategory === cat.id
                       ? "bg-white/20 text-white/90"
                       : "bg-gray-100/80 text-gray-600 group-hover:bg-pink-100 group-hover:text-rose-700"
                    )}>
                      {cat.count} items
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
            className="mt-6 text-center"
          >
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <p className="text-gray-600 text-sm">
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
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
                  product={{
                    ...product,
                    id: product.id.toString()
                  }}
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
            className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors duration-200"
          >
            Show All Categories
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Enhanced category section component with beautiful container design
 */
interface CategorySectionProps {
  category: CategoryItem
  products: typeof mockProducts
  onAddToCart: (e: React.MouseEvent, productId: string) => void
}

function CategorySection({ category, products, onAddToCart }: CategorySectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative bg-gradient-to-br from-white via-rose-50/30 to-purple-50/30 rounded-3xl p-6 md:p-8 shadow-sm border border-white/40 backdrop-blur-sm overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100/40 to-purple-100/40 rounded-full blur-3xl -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-rose-100/40 to-pink-100/40 rounded-full blur-2xl translate-y-12 -translate-x-12" />
      
      <div className="relative z-10 space-y-6">
        {/* Enhanced Category Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-3 border-white shadow-lg bg-white">
                <Image
                  src={category.icon}
                  alt={category.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Icon decoration */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-rose-800 to-purple-900 bg-clip-text text-transparent">
                {category.name}
              </h3>
              <p className="text-gray-600 text-sm md:text-base mt-1">{category.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-medium text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                  {products.length} Products
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">Curated Collection</span>
              </div>
            </div>
          </div>
          <Link
            href={`/womens/${category.id}`}
            className="group flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm md:text-base"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Enhanced Product Grid Container */}
        <div className="relative">
          {/* Gradient overlays for scroll indication */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white via-rose-50/30 to-transparent z-10 pointer-events-none rounded-l-2xl" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-purple-50/30 via-rose-50/30 to-transparent z-10 pointer-events-none rounded-r-2xl" />
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/50">
            <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
              {products.slice(0, 8).map((product, index) => (
                <motion.div 
                  key={product.id} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex-shrink-0 w-64 md:w-72"
                >
                  <ProductCard
                    product={{
                      ...product,
                      id: product.id.toString()
                    }}
                    viewMode="grid"
                    onAddToCart={onAddToCart}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Enhanced product card component
 */
interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    originalPrice: number | null
    image: string
    category: string
    featured: boolean
    inStock: boolean
    rating: number
    reviews: number
  }
  viewMode: 'grid' | 'list'
  onAddToCart: (e: React.MouseEvent, productId: string) => void
}

function ProductCard({ product, viewMode, onAddToCart }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  if (viewMode === 'list') {
    return (
      <Link href={`/shop/${product.id}`}>
        <motion.div
          whileHover={{ y: -2 }}
          className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100"
        >
          <div className="flex gap-6">
            {/* Product Image */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-xl"
              />
              {product.featured && (
                <span className="absolute -top-2 -left-2 bg-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Featured
                </span>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-pink-600 transition-colors duration-200">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.reviews})</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                    <span className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">-{discount}%</span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-center">
              <button
                onClick={(e) => onAddToCart(e, product.id)}
                disabled={!product.inStock}
                className={cn(
                  "px-6 py-3 rounded-xl font-medium transition-all duration-200",
                  product.inStock
                    ? "bg-pink-500 text-white hover:bg-pink-600 md:opacity-0 md:group-hover:opacity-100"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                )}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  return (
    <Link href={`/shop/${product.id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <span className="absolute top-4 left-4 bg-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium z-10">
              Featured
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium z-10">
              -{discount}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 text-lg mb-3 group-hover:text-pink-600 transition-colors duration-200">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">-{discount}%</span>
              </>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => onAddToCart(e, product.id)}
            disabled={!product.inStock}
            className={cn(
              "w-full py-3 px-4 rounded-xl font-medium transition-all duration-200",
              product.inStock
                ? "bg-pink-500 text-white hover:bg-pink-600 md:opacity-0 md:group-hover:opacity-100"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </motion.div>
    </Link>
  )
}