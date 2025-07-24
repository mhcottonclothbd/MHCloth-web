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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Sort Controls */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">
          Showing {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="name">Sort by Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
  const handleAddToCart = () => {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay Actions */}
          <motion.div
            className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Link href={`/shop/${product.id}`}>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/90 hover:bg-white"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
          
          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
              Out of Stock
            </div>
          )}
          
          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
              Featured
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            
            <Button
              size="sm"
              disabled={product.stock === 0}
              className="min-w-[100px]"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}