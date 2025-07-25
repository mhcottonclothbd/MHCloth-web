'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useCart, CartItem } from '@/lib/cart-context'
import CartItemComponent from './widget/CartItem'
import OrderSummary from './widget/OrderSummary'
import EmptyCart from './widget/EmptyCart'

/**
 * Shopping Cart page component with modern design
 * Displays cart items with quantity controls and checkout functionality
 * Matches the checkout page aesthetic with clean animations
 * 
 * @metadata
 * title: 'Shopping Cart - MHCloth | Review Your Items'
 * description: 'Review and manage items in your shopping cart. Update quantities, remove items, and proceed to checkout with MHCloth.'
 * keywords: ['shopping cart', 'cart', 'checkout', 'MHCloth', 'review items', 'update cart']
 */
export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getItemCount, clearCart } = useCart()
  const [isClearing, setIsClearing] = useState(false)
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  /**
   * Handle quantity change with optimistic updates
   * @param itemId - Cart item ID
   * @param newQuantity - New quantity value
   */
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  /**
   * Handle item removal with animation
   * @param itemId - Cart item ID to remove
   */
  const handleRemoveItem = (itemId: string) => {
    setRemovingItems(prev => new Set(prev).add(itemId))
    setTimeout(() => {
      removeItem(itemId)
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }, 300)
  }

  /**
   * Handle clearing entire cart
   */
  const handleClearCart = () => {
    setIsClearing(true)
    setTimeout(() => {
      clearCart()
      setIsClearing(false)
    }, 500)
  }

  // Calculate subtotal, shipping, and tax
  const subtotal = getTotalPrice()
  const shipping = subtotal > 5000 ? 0 : 500
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  // Empty cart state
  if (items.length === 0 && !isClearing) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/shop" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>

          {/* Empty State */}
          <EmptyCart />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/shop" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Shopping Cart ({getItemCount()} {getItemCount() === 1 ? 'item' : 'items'})
            </h1>
            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Cart Items</h2>
                
                <div className="space-y-6">
                  {items.map((item: CartItem, index) => (
                    <CartItemComponent
                      key={item.id}
                      item={item}
                      index={index}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemoveItem}
                      isRemoving={removingItems.has(item.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  )
}