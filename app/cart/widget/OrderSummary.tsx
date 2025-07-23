'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Tag, Truck, Shield } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface OrderSummaryProps {
  subtotal: number
  shipping: number
  tax: number
  total: number
}

/**
 * Order summary component with promo code input and totals
 * Features responsive design and smooth animations
 */
export default function OrderSummary({ subtotal, shipping, tax, total }: OrderSummaryProps) {
  const [promoCode, setPromoCode] = useState('')
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [promoApplied, setPromoApplied] = useState(false)

  /**
   * Handle promo code application
   */
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return
    
    setIsApplyingPromo(true)
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, accept any promo code
      setPromoApplied(true)
      setIsApplyingPromo(false)
    }, 1000)
  }

  /**
   * Handle removing promo code
   */
  const handleRemovePromo = () => {
    setPromoCode('')
    setPromoApplied(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
      
      {/* Promo Code Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Promo Code
        </label>
        {!promoApplied ? (
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
              />
            </div>
            <button 
              onClick={handleApplyPromo}
              disabled={!promoCode.trim() || isApplyingPromo}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium rounded-xl transition-colors"
            >
              {isApplyingPromo ? 'Applying...' : 'Apply'}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Promo code applied: {promoCode}
              </span>
            </div>
            <button
              onClick={handleRemovePromo}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        )}
      </div>
      
      {/* Order Totals */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        {promoApplied && (
          <div className="flex justify-between text-green-600">
            <span>Promo discount</span>
            <span>-{formatPrice(subtotal * 0.1)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-gray-700">
          <span>Shipping</span>
          <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
            {shipping === 0 ? 'Free' : formatPrice(shipping)}
          </span>
        </div>
        
        <div className="flex justify-between text-gray-700">
          <span>Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-xl font-bold text-gray-900">
            <span>Total</span>
            <span>
              {formatPrice(promoApplied ? total - (subtotal * 0.1) : total)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Shipping Message */}
      {shipping === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-xl mb-6"
        >
          <Truck className="w-5 h-5" />
          <span className="text-sm font-medium">You qualify for free shipping!</span>
        </motion.div>
      ) : (
        <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 p-3 rounded-xl mb-6">
          <Truck className="w-5 h-5" />
          <span className="text-sm">
            Add {formatPrice(100 - subtotal)} more for free shipping
          </span>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Checkout Button */}
        <Link href="/checkout">
          <button className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105">
            Proceed to Checkout
          </button>
        </Link>
        
        {/* Continue Shopping */}
        <Link href="/shop">
          <button className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 py-3 rounded-xl font-medium transition-colors">
            Continue Shopping
          </button>
        </Link>
      </div>
      
      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-2 text-gray-600 text-sm mt-4 pt-4 border-t border-gray-100">
        <Shield className="w-4 h-4" />
        <span>Secure checkout with SSL encryption</span>
      </div>
      
      {/* Additional Info */}
      <div className="mt-4 text-xs text-gray-500 text-center space-y-1">
        <p>Free returns within 30 days</p>
        <p>Customer support: 24/7</p>
      </div>
    </motion.div>
  )
}