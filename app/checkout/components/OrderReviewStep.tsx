"use client";

import { CartItem } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Minus,
  Package,
  Plus,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CheckoutFormData } from "./CheckoutForm";

interface OrderReviewStepProps {
  formData: Partial<CheckoutFormData>;
  updateFormData: (data: Partial<CheckoutFormData>) => void;
  items: CartItem[];
  onNext: () => void;
  onPrev: () => void;
}

export default function OrderReviewStep({
  formData,
  updateFormData,
  items,
  onNext,
  onPrev,
}: OrderReviewStepProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    items.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})
  );

  const subtotal = items.reduce((sum, item) => {
    const quantity = quantities[item.id] || item.quantity;
    return sum + item.product.price * quantity;
  }, 0);

  const shipping = subtotal >= 1000 ? 0 : 60;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantities((prev) => ({ ...prev, [itemId]: newQuantity }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review Your Order
        </h2>
        <p className="text-gray-600">
          Review your items and delivery details before placing your order.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Order Items */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Order Items ({items.length})
          </h3>
          <div className="space-y-4 border border-gray-200 rounded-xl p-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex space-x-4 p-4 border-b border-gray-100 last:border-b-0"
              >
                {/* Product Image */}
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.image_urls?.[0] ? (
                    <Image
                      src={item.product.image_urls[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-medium text-gray-900 truncate">
                    {item.product.name}
                  </h4>
                  {(item.selectedSize || item.selectedColor) && (
                    <p className="text-sm text-gray-500 mt-1">
                      {[item.selectedSize, item.selectedColor]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    {formatPrice(item.product.price)}
                  </p>

                  {/* Stock Status */}
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">
                      In Stock
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end space-y-3">
                  <div className="flex items-center space-x-3 border border-gray-300 rounded-lg">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, quantities[item.id] - 1)
                      }
                      disabled={quantities[item.id] <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {quantities[item.id]}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, quantities[item.id] + 1)
                      }
                      disabled={quantities[item.id] >= 10}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <p className="text-lg font-semibold text-gray-900">
                    {formatPrice(item.product.price * quantities[item.id])}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Delivery Information
          </h3>
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            {/* Shipping Address */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Truck className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">
                  Shipping Address
                </span>
              </div>
              <div className="ml-7 text-gray-700">
                <p className="font-medium">{formData.customer_name}</p>
                <p>{formData.shipping_address?.address}</p>
                <p>
                  {formData.shipping_address?.city},{" "}
                  {formData.shipping_address?.state}
                  {formData.shipping_address?.zipCode &&
                    ` ${formData.shipping_address.zipCode}`}
                </p>
                <p>{formData.shipping_address?.country}</p>
                <p className="mt-1 text-sm font-medium">
                  Phone: {formData.customer_phone}
                </p>
              </div>
            </div>

            {/* Delivery Time */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">
                  Estimated Delivery
                </span>
              </div>
              <div className="ml-7 text-gray-700">
                <p>
                  {formData.shipping_address?.city === "Dhaka"
                    ? "1-2 business days (Within Dhaka)"
                    : "3-5 business days (Outside Dhaka)"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Order Summary
          </h3>
          <div className="border border-gray-200 rounded-xl p-6 space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>
                Subtotal (
                {items.reduce((sum, item) => sum + quantities[item.id], 0)}{" "}
                items)
              </span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span
                className={shipping === 0 ? "text-green-600 font-medium" : ""}
              >
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Tax (5%)</span>
              <span>{formatPrice(tax)}</span>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {shipping === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                <p className="text-green-700 text-sm font-medium">
                  🎉 You qualify for free shipping!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              required
              className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black focus:ring-2 mt-0.5"
            />
            <div className="flex-1">
              <label htmlFor="terms" className="text-sm text-blue-900">
                I agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  className="underline hover:text-blue-700"
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  className="underline hover:text-blue-700"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <motion.button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center space-x-2 border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>

          <motion.button
            type="submit"
            className="inline-flex items-center space-x-2 bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Continue to Payment</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
