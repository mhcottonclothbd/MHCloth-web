"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  Clock,
  CreditCard,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { CheckoutFormData } from "./CheckoutForm";

interface PaymentMethodStepProps {
  formData: Partial<CheckoutFormData>;
  updateFormData: (data: Partial<CheckoutFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

export default function PaymentMethodStep({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isSubmitting,
  submitError,
}: PaymentMethodStepProps) {
  const [selectedMethod, setSelectedMethod] = useState<
    "cash_on_delivery" | "ssl_commerce"
  >(formData.payment_method || "cash_on_delivery");

  const handlePaymentMethodChange = (
    method: "cash_on_delivery" | "ssl_commerce"
  ) => {
    setSelectedMethod(method);
    updateFormData({ payment_method: method });
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
          Payment Method
        </h2>
        <p className="text-gray-600">
          Choose your preferred payment method to complete your order.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Methods */}
        <div className="space-y-4">
          {/* Cash on Delivery */}
          <motion.div
            className={`
              relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200
              ${
                selectedMethod === "cash_on_delivery"
                  ? "border-black bg-gray-50"
                  : "border-gray-300 hover:border-gray-400"
              }
            `}
            onClick={() => handlePaymentMethodChange("cash_on_delivery")}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div
                  className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${
                    selectedMethod === "cash_on_delivery"
                      ? "border-black bg-black"
                      : "border-gray-300"
                  }
                `}
                >
                  {selectedMethod === "cash_on_delivery" && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Banknote className="w-6 h-6 text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Cash on Delivery
                  </h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    Recommended
                  </span>
                </div>

                <p className="text-gray-600 mb-4">
                  Pay with cash when your order is delivered to your doorstep.
                  No advance payment required.
                </p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>100% secure - No card details required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Pay only when you receive your order</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Banknote className="w-4 h-4 text-gray-600" />
                    <span>Exact change recommended</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Online Payment (Coming Soon) */}
          <motion.div
            className="relative border-2 border-gray-200 rounded-xl p-6 opacity-60 cursor-not-allowed"
            whileHover={{ scale: selectedMethod !== "ssl_commerce" ? 1.01 : 1 }}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  {/* Empty circle for disabled option */}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <CreditCard className="w-6 h-6 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-500">
                    Online Payment
                  </h3>
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>

                <p className="text-gray-500 mb-4">
                  Pay online using your credit/debit card, mobile banking, or
                  digital wallet.
                </p>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Credit/Debit Cards</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 flex items-center justify-center text-xs">
                      📱
                    </span>
                    <span>Mobile Banking (bKash, Nagad)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 bg-white bg-opacity-50 rounded-xl flex items-center justify-center">
              <span className="bg-white px-4 py-2 rounded-lg shadow-md text-gray-600 font-medium">
                Available Soon
              </span>
            </div>
          </motion.div>
        </div>

        {/* Cash on Delivery Instructions */}
        {selectedMethod === "cash_on_delivery" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold text-yellow-900 mb-2">
                  Cash on Delivery Instructions
                </h4>
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>
                      Please keep the exact amount ready for smooth delivery
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>
                      Delivery personnel will provide a receipt upon payment
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>
                      You can inspect your order before making the payment
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>
                      Orders can be refused if damaged or not as described
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <h4 className="text-red-900 font-medium">
                  Order Submission Failed
                </h4>
                <p className="text-red-700 text-sm mt-1">{submitError}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Security Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Shield className="w-6 h-6 text-gray-600" />
            <h4 className="font-semibold text-gray-900">Secure Checkout</h4>
          </div>
          <p className="text-sm text-gray-600">
            Your personal information is protected with SSL encryption. We never
            store your payment details and all transactions are processed
            securely.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <motion.button
            type="button"
            onClick={onPrev}
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Placing Order...</span>
              </>
            ) : (
              <>
                <Banknote className="w-5 h-5" />
                <span>Place Order</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
