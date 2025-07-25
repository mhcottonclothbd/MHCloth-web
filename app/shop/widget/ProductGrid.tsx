'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/Card'
import Button from '@/components/Button'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types'
import { useCart } from '@/lib/cart-context'
import { allAndSonsProducts, productsByCategory } from '@/data/andsons-products'

interface ProductGridProps {
  searchParams: {
    category?: string
    search?: string
    sort?: string
    filter?: string
  }
}

// Real product data from &Sons - authentic vintage-inspired clothing and accessories
const shopProducts: Product[] = allAndSonsProducts

/**
 * Product grid component with filtering, sorting, and animations
 * Displays products in a responsive grid layout
 */
export default function ProductGrid({ searchParams }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState(searchParams.sort || 'name')

  useEffect(() => {
    // Simulate API call - replace with Supabase query
    const fetchProducts = async () => {
      setLoading(true)
      
      // Filter products based on search params
      let filteredProducts = [...shopProducts]
      
      // Category filter
      if (searchParams.category && searchParams.category !== 'all') {
        if (searchParams.category === 'clothing') {
          // Include both mens and womens clothing
          filteredProducts = filteredProducts.filter(
            product => product.category === 'mens' || product.category === 'women'
          )
        } else if (['jackets', 'shirts', 'pants', 'denim', 't-shirts', 'accessories'].includes(searchParams.category)) {
          // Filter by specific product categories from &Sons
          filteredProducts = filteredProducts.filter(
            product => product.category === searchParams.category
          )
        } else {
          filteredProducts = filteredProducts.filter(
            product => product.category === searchParams.category
          )
        }
      }
      
      // Search filter
      if (searchParams.search) {
        const searchTerm = searchParams.search.toLowerCase()
        filteredProducts = filteredProducts.filter(
          product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        )
      }
      
      // Stock filter
      if (searchParams.filter === 'in-stock') {
        filteredProducts = filteredProducts.filter(product => product.stock > 0)
      } else if (searchParams.filter === 'featured') {
        filteredProducts = filteredProducts.filter(product => product.featured)
      }
      
      // Sort products
      filteredProducts.sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price
          case 'price-high':
            return b.price - a.price
          case 'name':
          default:
            return a.name.localeCompare(b.name)
        }
      })
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setProducts(filteredProducts)
      setLoading(false)
    }

    fetchProducts()
  }, [searchParams, sortBy])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gradient-to-br from-gray-200 to-gray-300 aspect-square rounded-2xl mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-20"
      >
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            We couldn't find any products matching your criteria. Try adjusting your search or filter options.
          </p>
          <button 
            onClick={() => window.location.href = '/shop'}
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Browse All Products
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div>
      {/* Enhanced Sort Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-gray-700">
            <span className="text-blue-600 font-bold">{products.length}</span> product{products.length !== 1 ? 's' : ''} found
          </p>
          {searchParams.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {searchParams.category}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300"
          >
            <option value="name">Name (A-Z)</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </motion.div>

      {/* Enhanced Product Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </motion.div>
    </div>
  )
}

/**
 * Individual product card component with hover effects and actions
 */
function ProductCard({ product, index }: { product: Product; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const { addItem } = useCart()
  
  /**
   * Handles adding product to cart
   */
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addItem({
        product: product,
        quantity: 1,
        selectedSize: undefined,
        selectedColor: undefined
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Link href={`/shop/${product.id}`} className="block h-full">
        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer h-full bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <div className="relative aspect-square overflow-hidden rounded-t-2xl">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            {/* Overlay Actions - Enhanced for desktop */}
            <motion.div
              className="absolute inset-0 items-center justify-center gap-3 hidden md:flex"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8
              }}
              transition={{ duration: 0.3 }}
            >
              <Button
                size="sm"
                variant="outline"
                className="bg-white/95 hover:bg-white border-0 shadow-lg backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/shop/${product.id}`;
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Quick View
              </Button>
              
              {product.stock > 0 && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg transform hover:scale-105 transition-all duration-300"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              )}
            </motion.div>
            
            {/* Enhanced Status Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.stock === 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/90 text-white backdrop-blur-sm shadow-lg">
                  Out of Stock
                </span>
              )}
              {product.featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white backdrop-blur-sm shadow-lg">
                  ⭐ Featured
                </span>
              )}
            </div>
            
            {/* Wishlist Button */}
            <div className="absolute top-3 right-3">
              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <CardContent className="p-6 flex-1 flex flex-col">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 text-lg group-hover:text-blue-600 transition-colors duration-300">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.stock > 0 && product.stock <= 5 && (
                  <span className="text-xs text-orange-600 font-medium">
                    Only {product.stock} left!
                  </span>
                )}
              </div>
              
              {/* Mobile: Always show, Desktop: Show on hover */}
              <Button
                size="sm"
                disabled={product.stock === 0}
                className={`min-w-[120px] transition-all duration-300 ${
                  product.stock === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 md:opacity-0 md:group-hover:opacity-100 transform hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}