'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { 
  CreditCard, 
  Lock, 
  ShoppingBag, 
  ArrowLeft,
  Check,
  Truck,
  Shield
} from 'lucide-react'
import { useCart, CartItem } from '@/lib/cart-context'
import Button from '@/components/Button'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

/**
 * Checkout page component that supports both guest and authenticated users
 * Handles order processing, payment, and shipping information
 */
export default function CheckoutPage() {
  const { user } = useUser()
  const { items, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  
  // Form state for guest checkout
  const [guestInfo, setGuestInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: ''
  })
  
  // Shipping information state
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United Kingdom'
  })
  
  // Payment information state
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  })
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  
  // Redirect if cart is empty
  if (!items || (items.length === 0 && !orderComplete)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8f6f3' }}>
        <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-md mx-4">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {!items ? 'Loading...' : 'Your cart is empty'}
            </h2>
            <p className="text-gray-600 mb-6">
              {!items ? 'Please wait while we load your cart.' : 'Add some products to your cart before checking out.'}
            </p>
            {items && (
              <Link href="/shop">
                <button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Continue Shopping
                </button>
              </Link>
            )}
          </div>
      </div>
    )
  }
  
  /**
   * Handles the checkout process
   * Simulates payment processing and order creation
   */
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Clear cart and show success
      clearCart()
      setOrderComplete(true)
      
      // Redirect to success page after delay
      setTimeout(() => {
        router.push('/shop')
      }, 3000)
      
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsProcessing(false)
    }
  }
  
  // Show order success message
  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8f6f3' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-md mx-4"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Complete!</h2>
          <p className="text-gray-600 mb-6">Thank you for your purchase. You'll receive a confirmation email shortly.</p>
          <button 
            onClick={() => router.push('/shop')} 
            className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    )
  }
  
  const subtotal = getTotalPrice()
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-gray-700 hover:text-black mb-6 text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue shopping
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-8">
              {/* Contact Information */}
              {!user && (
                <div className="space-y-6">
                  <h2 className="text-xl font-medium text-gray-900">Contact</h2>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Email"
                        value={guestInfo.email}
                        onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-gray-900 placeholder:text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Address Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-gray-900">Address</h2>
                <div className="space-y-4">
                  <div>
                    <select 
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-gray-900"
                    >
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="First name"
                      value={guestInfo.firstName}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, firstName: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-gray-900 placeholder:text-gray-600"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Last name"
                      value={guestInfo.lastName}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, lastName: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-gray-900 placeholder:text-gray-600"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Company (optional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-gray-900 placeholder:text-gray-600"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-gray-900 placeholder:text-gray-600"
                  />
                  <input
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-gray-900 placeholder:text-gray-600"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-gray-900 placeholder:text-gray-600"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-gray-900 placeholder:text-gray-600"
                    />
                    <input
                      type="text"
                      placeholder="Postal code (optional)"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-gray-900 placeholder:text-gray-600"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={guestInfo.phone}
                    onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-gray-900 placeholder:text-gray-600"
                  />
                </div>
              </div>
              
              {/* Shipping Method */}
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-gray-900">Shipping method</h2>
                <div className="text-sm text-black bg-gray-50 p-3 rounded-lg border border-gray-200">
                  Enter your shipping address to view available shipping methods.
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-gray-900">Payment</h2>
                <div className="text-sm text-black bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
                  All transactions are secure and encrypted.
                </div>
                
                {/* Payment Method Selection */}
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="bg-blue-50 border-b border-gray-300 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input type="radio" name="payment" id="card" defaultChecked className="mr-3" />
                        <label htmlFor="card" className="font-medium">Credit or Debit Card</label>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                        <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                        <div className="w-8 h-5 bg-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <input
                      type="text"
                      required
                      placeholder="Card number"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-gray-900 placeholder:text-gray-600"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        placeholder="Expiration date (MM / YY)"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-gray-900 placeholder:text-gray-600"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Security code"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-gray-900 placeholder:text-gray-600"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Name on card"
                      value={paymentInfo.nameOnCard}
                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, nameOnCard: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-gray-900 placeholder:text-gray-600"
                    />
                    
                    <div className="flex items-start space-x-3 pt-2">
                      <input type="checkbox" id="billing" className="mt-1" />
                      <label htmlFor="billing" className="text-sm text-black">
                        Use shipping address as billing address
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* More Payment Options */}
                <div className="text-center">
                  <button type="button" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    More Payment Options
                  </button>
                </div>
                
                {/* Remember Me */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-start space-x-3">
                    <input type="checkbox" id="remember" className="mt-1" />
                    <div>
                      <label htmlFor="remember" className="text-sm font-medium text-gray-900">
                        Remember me
                      </label>
                      <p className="text-sm text-black">
                        Save my information for a faster checkout with a Shop account
                      </p>
                    </div>
                  </div>
                  <input
                    type="tel"
                    placeholder="Mobile phone number"
                    className="w-full mt-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-gray-900 placeholder:text-gray-600"
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-black hover:bg-gray-800 text-white py-4 px-6 rounded-lg font-medium text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  {isProcessing ? 'Processing...' : `Complete order`}
                </button>
                
                <div className="mt-4 text-xs text-gray-600 text-center leading-relaxed">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Secure and encrypted
                </div>
                
                <div className="mt-4 text-xs text-gray-600 text-center leading-relaxed">
                  By clicking below and placing your order, you agree (i) to make your purchase from Global-e as merchant of record for this transaction, subject to Global-e's Terms & Conditions; (ii) that your information will be handled by Global-e in accordance with the Global-e Privacy Policy; and (iii) that your information (excluding the payment details) will be shared between Global-e and &Sons.
                </div>
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-8">
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items?.map((item: CartItem) => (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-start space-x-4">
                    <div className="relative">
                       <img
                         src={item.product.image_url}
                         alt={item.product.name}
                         className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                       />
                      <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 truncate">{item.product.name}</h4>
                      <div className="text-xs text-gray-600 mt-1">
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        {item.selectedColor && item.selectedSize && <span> • </span>}
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <hr className="border-gray-200 mb-6" />
              
              {/* Discount Code */}
              <div className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Discount code"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-sm text-gray-900 placeholder:text-gray-600"
                  />
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
              
              <hr className="border-gray-200 mb-6" />
              
              {/* Order Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatPrice(tax)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatPrice(total)}</span>
                </div>
              </div>
              
              {shipping === 0 && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800 font-medium flex items-center">
                    <Truck className="w-4 h-4 mr-2" />
                    Free shipping on orders over £100!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}