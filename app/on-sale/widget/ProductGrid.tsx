'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye, Tag, Percent } from 'lucide-react'
import { Card, CardContent } from '@/components/Card'
import Button from '@/components/Button'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types'
import { useCart } from '@/lib/cart-context'
import { productsByCategory } from '@/data/andsons-products'

interface SaleProduct extends Product {
  original_price: number
  discount_percentage: number
}

interface ProductGridProps {
  searchParams: {
    search?: string
    sort?: string
    filter?: string
  }
  category: string
  title: string
}

// Real sale products from &Sons - authentic vintage-inspired items on sale
const saleProducts: Product[] = productsByCategory['on-sale']

// Convert regular products to sale products with discount information
const mockSaleProducts: SaleProduct[] = saleProducts.map(product => ({
  ...product,
  original_price: product.price * 1.6, // Calculate original price (assuming ~37% discount)
  discount_percentage: Math.round(((product.price * 1.6 - product.price) / (product.price * 1.6)) * 100)
}))

/**
 * Product grid component specifically for sale products
 * Shows discounted prices with original price strikethrough
 */
export default function ProductGrid({ searchParams, category, title }: ProductGridProps) {
  const [products, setProducts] = useState<SaleProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      
      let filteredProducts = [...mockSaleProducts]
      
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
        filteredProducts = filteredProducts.filter(product => product.stock && product.stock > 0)
      } else if (searchParams.filter === 'featured') {
        filteredProducts = filteredProducts.filter(product => product.featured)
      }
      
      // Sort products by discount percentage (highest first)
      filteredProducts.sort((a, b) => {
        return b.discount_percentage - a.discount_percentage
      })
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setProducts(filteredProducts)
      setLoading(false)
    }

    fetchProducts()
  }, [searchParams])

  const handleAddToCart = (product: SaleProduct) => {
    // Convert SaleProduct to Product for cart
    const cartProduct: Product = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price, // Use sale price
      image_url: product.image_url,
      category: product.category,
      stock: product.stock,
      featured: product.featured,
      created_at: product.created_at,
      updated_at: product.updated_at
    }
    addItem({
      product: cartProduct,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
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
        <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No sale items found</h3>
        <p className="text-gray-600">Check back soon for amazing deals!</p>
      </div>
    )
  }

  return (
    <div>
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Tag className="w-6 h-6 text-red-500" />
          {title}
        </h2>
        <p className="text-gray-600">
          Showing {products.length} sale item{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-red-100">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image_url || '/placeholder-image.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Percent className="w-3 h-3" />
                  {product.discount_percentage}% OFF
                </div>
                
                {/* Stock Badge */}
                {product.stock === 0 && (
                  <div className="absolute top-3 right-3 bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Out of Stock
                  </div>
                )}
                
                {/* Sale Flash */}
                <motion.div
                  className="absolute top-3 right-3 text-yellow-400 text-2xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⚡
                </motion.div>
                
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
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
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                {/* Price Section */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-red-600">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.original_price)}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    Save {formatPrice(product.original_price - product.price)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    {product.stock && product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                  <span className="text-red-500 font-medium">
                    Limited time!
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}