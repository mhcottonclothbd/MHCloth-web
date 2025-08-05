"use client";

import { CartItem } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { Package, Shield, Truck } from "lucide-react";
import Image from "next/image";

interface CheckoutSummaryProps {
  items: CartItem[];
  total: number;
  step: number;
}

export default function CheckoutSummary({
  items,
  total,
  step,
}: CheckoutSummaryProps) {
  const subtotal = total;
  const shipping = subtotal >= 1000 ? 0 : 60; // Free shipping over ৳1000
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const finalTotal = subtotal + shipping + tax;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Order Summary
      </h2>

      {/* Order Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex space-x-4">
            {/* Product Image */}
            <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {item.product.image_urls?.[0] ? (
                <Image
                  src={item.product.image_urls[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
              )}
              {/* Quantity Badge */}
              <div className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.quantity}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {item.product.name}
              </h3>
              {(item.selectedSize || item.selectedColor) && (
                <p className="text-xs text-gray-500 mt-1">
                  {[item.selectedSize, item.selectedColor]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">
                  Qty: {item.quantity}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Totals */}
      <div className="space-y-3 mb-6 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm text-gray-700">
          <span>
            Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
            items)
          </span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-700">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
            {shipping === 0 ? "Free" : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-700">
          <span>Tax (5%)</span>
          <span>{formatPrice(tax)}</span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(finalTotal)}</span>
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
          <span className="text-sm font-medium">
            You qualify for free shipping!
          </span>
        </motion.div>
      ) : (
        <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 p-3 rounded-xl mb-6">
          <Truck className="w-5 h-5" />
          <span className="text-sm">
            Add {formatPrice(1000 - subtotal)} more for free shipping
          </span>
        </div>
      )}

      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-2 text-gray-600 text-sm border-t border-gray-100 pt-6">
        <Shield className="w-4 h-4" />
        <span>Secure checkout with SSL encryption</span>
      </div>

      {/* Delivery Info */}
      {step >= 2 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-xs text-gray-500 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span>Estimated delivery:</span>
            <span className="font-medium text-gray-700">3-5 business days</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Payment method:</span>
            <span className="font-medium text-gray-700">Cash on Delivery</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
