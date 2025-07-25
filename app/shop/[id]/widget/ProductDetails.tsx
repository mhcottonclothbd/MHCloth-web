'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  Shield, 
  Truck, 
  RotateCcw,
  ChevronLeft,
  Check
} from 'lucide-react'
import { Product } from '@/types'
import Button from '@/components/Button'
import { Card, CardContent } from '@/components/Card'
import { formatPrice, cn } from '@/lib/utils'
import { useCart } from '@/lib/cart-context'

interface ProductDetailsProps {
  product: Product
}

/**
 * Product details component with pricing, quantity selection, and purchase options
 * Features responsive design with comprehensive product information
 */
export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  
  const { addItem } = useCart()
  
  // Mock data for product variants
  const sizes = product.category === 'clothing' ? ['XS', 'S', 'M', 'L', 'XL'] : []
  const colors = ['Black', 'White', 'Gray', 'Navy']
  
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1)
    }
  }
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }
  
  const handleAddToCart = () => {
    // Add item to cart
    addItem({
      product,
      quantity,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined
    })
    
    // Show success feedback
    setIsAddedToCart(true)
    setTimeout(() => setIsAddedToCart(false), 2000)
  }
  

  
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <Link href="/shop" className="hover:text-gray-900 transition-colors">
          Shop
        </Link>
        <span>/</span>
        <Link 
          href={`/shop?category=${product.category}`} 
          className="hover:text-gray-900 transition-colors capitalize"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>
      
      {/* Back Button */}
      <Link 
        href="/shop"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Shop
      </Link>
      
      {/* Product Info */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {product.name}
          </h1>
          

        </motion.div>
        
        {/* Price */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-2"
        >
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.featured && (
              <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                Featured
              </span>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              product.stock > 0 ? "bg-green-500" : "bg-red-500"
            )} />
            <span className={cn(
              "text-sm font-medium",
              product.stock > 0 ? "text-green-700" : "text-red-700"
            )}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </motion.div>
        
        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </motion.div>
        
        {/* Size Selection */}
        {sizes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-medium text-gray-900">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "px-4 py-2 border rounded-md text-sm font-medium transition-all duration-200",
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Color Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-medium text-gray-900">Color</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "px-4 py-2 border rounded-md text-sm font-medium transition-all duration-200",
                  selectedColor === color
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Quantity and Add to Cart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-4"
        >
          {/* Quantity Selector */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
            <div className="flex items-center space-x-3">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-center min-w-[3rem] border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-gray-600">
                {product.stock} available
              </span>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="flex">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddedToCart}
              className={cn(
                "flex-1 text-white transition-all duration-200",
                isAddedToCart 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-black hover:bg-gray-800"
              )}
              size="lg"
            >
              {isAddedToCart ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Product Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders over ৳2500</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <RotateCcw className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                  <p className="text-xs text-gray-600">30-day return policy</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Warranty</p>
                  <p className="text-xs text-gray-600">1-year guarantee</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}