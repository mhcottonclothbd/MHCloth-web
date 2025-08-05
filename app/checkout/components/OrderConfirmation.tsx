"use client";

import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Home,
  Mail,
  Package,
  Phone,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { CheckoutFormData } from "./CheckoutForm";

interface OrderConfirmationProps {
  orderNumber: string | null;
  formData: Partial<CheckoutFormData>;
}

export default function OrderConfirmation({
  orderNumber,
  formData,
}: OrderConfirmationProps) {
  // Trigger confetti animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const estimatedDelivery =
    formData.shipping_address?.city === "Dhaka"
      ? "1-2 business days"
      : "3-5 business days";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto"
    >
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          delay: 0.2,
        }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          Order Placed Successfully!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 text-lg"
        >
          Thank you for your order. We'll prepare it with care and deliver it
          soon.
        </motion.p>
      </motion.div>

      {/* Order Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Order Details
          </h2>
          {orderNumber && (
            <div className="inline-block bg-gray-100 rounded-full px-6 py-2">
              <span className="text-sm text-gray-600">Order Number:</span>
              <span className="ml-2 font-mono font-bold text-gray-900">
                {orderNumber}
              </span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Customer Information
            </h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {formData.customer_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p>{formData.customer_phone}</p>
                </div>
              </div>

              {formData.customer_email && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p>{formData.customer_email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Delivery Information
            </h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Home className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Shipping Address:</p>
                  <p>{formData.shipping_address?.address}</p>
                  <p>
                    {formData.shipping_address?.city},{" "}
                    {formData.shipping_address?.state}
                    {formData.shipping_address?.zipCode &&
                      ` ${formData.shipping_address.zipCode}`}
                  </p>
                  <p>{formData.shipping_address?.country}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Estimated Delivery:
                  </p>
                  <p>{estimatedDelivery}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* What's Next */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-8"
      >
        <h3 className="text-xl font-semibold text-blue-900 mb-4">
          What happens next?
        </h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-sm">1</span>
            </div>
            <div>
              <p className="font-medium text-blue-900">Order Confirmation</p>
              <p className="text-blue-700 text-sm">
                We'll send you a confirmation call/SMS within 30 minutes to
                verify your order.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-sm">2</span>
            </div>
            <div>
              <p className="font-medium text-blue-900">Order Processing</p>
              <p className="text-blue-700 text-sm">
                Our team will carefully pack your items and prepare them for
                delivery.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-sm">3</span>
            </div>
            <div>
              <p className="font-medium text-blue-900">Out for Delivery</p>
              <p className="text-blue-700 text-sm">
                You'll receive a call from our delivery partner when your order
                is on the way.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-sm">4</span>
            </div>
            <div>
              <p className="font-medium text-blue-900">Cash on Delivery</p>
              <p className="text-blue-700 text-sm">
                Pay the delivery person when you receive your order. Enjoy your
                purchase!
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link href="/shop">
          <motion.button
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </Link>

        <Link href="/">
          <motion.button
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Contact Support */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center mt-8 p-6 bg-gray-50 rounded-xl"
      >
        <p className="text-gray-600 mb-2">Need help with your order?</p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
          <a
            href="tel:+8801234567890"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <Phone className="w-4 h-4" />
            <span>Call: +880 123 456 7890</span>
          </a>
          <Link
            href="/contact"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Support</span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
