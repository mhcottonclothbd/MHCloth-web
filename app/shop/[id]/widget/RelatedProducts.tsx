'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Eye } from 'lucide-react'
import { Product } from '@/types'
import { Card, CardContent } from '@/components/Card'
import Button from '@/components/Button'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/lib/cart-context'

interface RelatedProductsProps {
  products: Product[]
}

/**
 * Related products component showing similar items
 * Features responsive grid layout with product cards and quick actions
 */
export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null
  }
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            You Might Also Like
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover more products from our curated collection that complement your style.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
        
        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/shop">
            <Button size="lg" variant="outline">
              View All Products
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

/**
 * Individual product card component for related products
 */
function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart()
  
  /**
   * Handles adding product to cart
   */
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.stock && product.stock > 0) {
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
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={`/products/${(product as any).slug || product.id}`}>
        <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.image_url || '/placeholder-image.jpg'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Overlay Actions */}
            <motion.div
              className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                  aria-label="View product"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
            
            {/* Stock Status */}
            {(!product.stock || product.stock === 0) && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 text-xs rounded">
                Out of Stock
              </div>
            )}
            
            {/* Featured Badge */}
            {product.featured && (
              <div className="absolute top-4 left-4 bg-blue-500 text-white px-2 py-1 text-xs rounded">
                Featured
              </div>
            )}
          </div>
          
          <CardContent className="p-4">
            {/* Product Info */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
                {product.name}
              </h3>
              
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                
                <Button
                  size="sm"
                  disabled={!product.stock || product.stock === 0}
                  className="min-w-[100px]"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  {product.stock && product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}