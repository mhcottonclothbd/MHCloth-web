"use client";

import { CartItem, useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Cart sidebar component with sliding animation
 * Displays cart items and provides checkout functionality
 */
export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, getItemCount } =
    useCart();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              {/* Sidebar Panel */}
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Shopping Cart ({getItemCount()})
                      </Dialog.Title>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                        onClick={onClose}
                      >
                        <X className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto px-4 py-6">
                      {items.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col items-center justify-center h-full text-center"
                        >
                          <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Your cart is empty
                          </h3>
                          <p className="text-gray-500 mb-6">
                            Add some products to get started
                          </p>
                          <Link href="/shop">
                            <button
                              onClick={onClose}
                              className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
                            >
                              Continue Shopping
                            </button>
                          </Link>
                        </motion.div>
                      ) : (
                        <div className="space-y-6">
                          {items.map((item: CartItem, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex space-x-4"
                            >
                              {/* Product Image */}
                              <div className="flex-shrink-0">
                                <img
                                  src={item.product.image_url}
                                  alt={item.product.name}
                                  className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                                />
                              </div>

                              {/* Product Details */}
                              <div className="flex-1 space-y-2">
                                <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                                  {item.product.name}
                                </h4>

                                {/* Variants */}
                                {(item.selectedSize || item.selectedColor) && (
                                  <div className="text-xs text-gray-500 space-y-1">
                                    {item.selectedSize && (
                                      <div>Size: {item.selectedSize}</div>
                                    )}
                                    {item.selectedColor && (
                                      <div>Color: {item.selectedColor}</div>
                                    )}
                                  </div>
                                )}

                                {/* Price */}
                                <div className="text-sm font-medium text-gray-900">
                                  {formatPrice(item.product.price)}
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.id,
                                          item.quantity - 1
                                        )
                                      }
                                      className="p-1 hover:bg-gray-50 transition-colors"
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="px-3 py-1 text-sm border-x border-gray-300 min-w-[40px] text-center">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.id,
                                          item.quantity + 1
                                        )
                                      }
                                      disabled={
                                        item.product.stock ? item.quantity >= item.product.stock : false
                                      }
                                      className="p-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                      aria-label="Increase quantity"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-xs text-red-600 hover:text-red-700 transition-colors"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-t border-gray-200 px-4 py-6 space-y-4"
                      >
                        {/* Total */}
                        <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
                          <span>Total</span>
                          <span>{formatPrice(getTotalPrice())}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <Link href="/cart">
                            <button
                              onClick={onClose}
                              className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors"
                            >
                              View Cart
                            </button>
                          </Link>

                          <Link href="/checkout">
                            <button
                              onClick={onClose}
                              className="w-full px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
                            >
                              Checkout • {formatPrice(getTotalPrice())}
                            </button>
                          </Link>
                        </div>

                        {/* Continue Shopping */}
                        <Link href="/shop">
                          <button
                            onClick={onClose}
                            className="w-full text-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            Continue Shopping
                          </button>
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
