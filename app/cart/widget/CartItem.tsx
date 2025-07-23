'use client'

import { motion } from 'framer-motion'
import { Plus, Minus, Trash2 } from 'lucide-react'
import { CartItem as CartItemType } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'

interface CartItemProps {
  item: CartItemType
  index: number
  onQuantityChange: (itemId: string, newQuantity: number) => void
  onRemove: (itemId: string) => void
  isRemoving: boolean
}

/**
 * Individual cart item component with quantity controls
 * Features smooth animations and responsive design
 */
export default function CartItem({ 
  item, 
  index, 
  onQuantityChange, 
  onRemove, 
  isRemoving 
}: CartItemProps) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isRemoving ? 0 : 1, 
        y: isRemoving ? -20 : 0,
        scale: isRemoving ? 0.95 : 1
      }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-start space-x-4 p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors"
    >
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={item.product.image_url}
          alt={item.product.name}
          className="w-24 h-24 object-cover rounded-xl border border-gray-200"
        />
      </div>
      
      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {item.product.name}
            </h3>
            
            {/* Variants */}
            <div className="flex flex-wrap gap-2 mb-3">
              {item.selectedSize && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  Size: {item.selectedSize}
                </span>
              )}
              {item.selectedColor && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  Color: {item.selectedColor}
                </span>
              )}
            </div>
            
            {/* Price */}
            <div className="text-xl font-bold text-gray-900 mb-4">
              {formatPrice(item.product.price)}
            </div>
            
            {/* Stock Status */}
            {item.product.stock <= 5 && item.product.stock > 0 && (
              <div className="text-sm text-orange-600 mb-2">
                Only {item.product.stock} left in stock
              </div>
            )}
          </div>
          
          {/* Remove Button */}
          <button
            onClick={() => onRemove(item.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
            aria-label="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        
        {/* Quantity Controls */}
        <div className="flex items-center">
          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
            <button
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              className="p-3 hover:bg-gray-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-3 text-lg font-medium border-x border-gray-300 min-w-[60px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
              className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}