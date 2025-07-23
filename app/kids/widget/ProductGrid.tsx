'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye, Baby, Star, Smile, Gamepad2 } from 'lucide-react'
import { Card, CardContent } from '@/components/Card'
import Button from '@/components/Button'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types'
import { useCart } from '@/lib/cart-context'

interface ProductGridProps {
  searchParams: {
    search?: string
    sort?: string
    filter?: string
  }
  category: string
  title: string
}

// Mock data for kids products - will be replaced with Supabase data
const mockKidsProducts: Product[] = [
  {
    id: 'kids1',
    name: 'Educational Building Blocks',
    description: 'Colorful wooden blocks for creative learning and development',
    price: 49.99,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    category: 'kids',
    stock: 25,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'kids2',
    name: 'Plush Teddy Bear',
    description: 'Soft and cuddly teddy bear made from organic cotton',
    price: 29.99,
    image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
    category: 'kids',
    stock: 30,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'kids3',
    name: 'Art & Craft Set',
    description: 'Complete art set with crayons, markers, and drawing paper',
    price: 39.99,
    image_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    category: 'kids',
    stock: 20,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'kids4',
    name: 'Interactive Learning Tablet',
    description: 'Kid-friendly tablet with educational games and apps',
    price: 129.99,
    image_url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=400&fit=crop',
    category: 'kids',
    stock: 15,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'kids5',
    name: 'Colorful Puzzle Set',
    description: 'Age-appropriate puzzles for cognitive development',
    price: 24.99,
    image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
    category: 'kids',
    stock: 35,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'kids6',
    name: 'Musical Instrument Set',
    description: 'Child-safe musical instruments for early music education',
    price: 59.99,
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    category: 'kids',
    stock: 18,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'kids7',
    name: 'Storybook Collection',
    description: 'Set of 10 illustrated storybooks for bedtime reading',
    price: 34.99,
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
    category: 'kids',
    stock: 22,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'kids8',
    name: 'Science Experiment Kit',
    description: 'Safe and fun science experiments for curious minds',
    price: 79.99,
    image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop',
    category: 'kids',
    stock: 12,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

/**
 * Product grid component specifically for kids products
 * Features playful styling and child-friendly product categories
 */
export default function ProductGrid({ searchParams, category, title }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState(searchParams.sort || 'featured')
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      
      let filteredProducts = [...mockKidsProducts]
      
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
            return a.name.localeCompare(b.name)
          case 'featured':
          default:
            return b.featured === a.featured ? 0 : b.featured ? 1 : -1
        }
      })
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setProducts(filteredProducts)
      setLoading(false)
    }

    fetchProducts()
  }, [searchParams, sortBy])

  const handleAddToCart = (product: Product) => {
    addItem({
      product,
      quantity: 1,
      selectedSize: undefined,
      selectedColor: undefined
    })
  }

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Baby className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No kids products found</h3>
        <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Section Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Baby className="w-6 h-6 text-purple-600" />
            {title}
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl"
            >
              🎈
            </motion.span>
          </h2>
          <p className="text-gray-600">
            Showing {products.length} product{products.length !== 1 ? 's' : ''} for kids
          </p>
        </div>
        
        {/* Sort Controls */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="featured">Featured First</option>
          <option value="name">Sort by Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-purple-100 hover:border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Featured Badge */}
                {product.featured && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Popular!
                  </div>
                )}
                
                {/* Stock Badge */}
                {product.stock === 0 && (
                  <div className="absolute top-3 right-3 bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Out of Stock
                  </div>
                )}
                
                {/* Fun Floating Elements */}
                <motion.div
                  className="absolute top-3 right-3 text-2xl"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  ⭐
                </motion.div>
                
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <Link href={`/shop/${product.id}`}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/90 hover:bg-white text-gray-900"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors flex items-center gap-2">
                  {product.name}
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {product.featured ? '🌟' : '🎨'}
                  </motion.span>
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                {/* Price and Stock */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                
                {/* Safety Badge */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <Smile className="w-3 h-3" />
                    Safe & Tested
                  </div>
                  <div className="flex items-center gap-1 text-blue-600">
                    <Gamepad2 className="w-3 h-3" />
                    Educational
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}