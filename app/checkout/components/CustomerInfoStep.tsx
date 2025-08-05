"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { CheckoutFormData, customerInfoSchema } from "./CheckoutForm";

interface CustomerInfoStepProps {
  formData: Partial<CheckoutFormData>;
  updateFormData: (data: Partial<CheckoutFormData>) => void;
  onNext: () => void;
}

export default function CustomerInfoStep({
  formData,
  updateFormData,
  onNext,
}: CustomerInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    try {
      const fieldValue = formData[field as keyof CheckoutFormData];

      if (field === "customer_name") {
        customerInfoSchema.shape.customer_name.parse(fieldValue);
      } else if (field === "customer_phone") {
        customerInfoSchema.shape.customer_phone.parse(fieldValue);
      } else if (field === "customer_email") {
        if (fieldValue && fieldValue !== "") {
          customerInfoSchema.shape.customer_email.parse(fieldValue);
        }
      }

      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.issues[0].message }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const customerInfo = {
      customer_name: formData.customer_name || "",
      customer_phone: formData.customer_phone || "",
      customer_email: formData.customer_email || "",
    };

    try {
      customerInfoSchema.parse(customerInfo);
      setErrors({});
      onNext();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[String(err.path[0])] = err.message;
          }
        });
        setErrors(newErrors);

        // Mark all fields as touched
        setTouched({
          customer_name: true,
          customer_phone: true,
          customer_email: true,
        });
      }
    }
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
          Customer Information
        </h2>
        <p className="text-gray-600">
          We'll use this information to contact you about your order.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label
            htmlFor="customer_name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="customer_name"
              value={formData.customer_name || ""}
              onChange={(e) =>
                handleInputChange("customer_name", e.target.value)
              }
              onBlur={() => handleBlur("customer_name")}
              placeholder="Enter your full name"
              className={`
                w-full pl-12 pr-4 py-4 border rounded-xl transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                ${
                  errors.customer_name && touched.customer_name
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }
              `}
            />
          </div>
          {errors.customer_name && touched.customer_name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600"
            >
              {errors.customer_name}
            </motion.p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="customer_phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              id="customer_phone"
              value={formData.customer_phone || ""}
              onChange={(e) =>
                handleInputChange("customer_phone", e.target.value)
              }
              onBlur={() => handleBlur("customer_phone")}
              placeholder="Enter your phone number"
              className={`
                w-full pl-12 pr-4 py-4 border rounded-xl transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                ${
                  errors.customer_phone && touched.customer_phone
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }
              `}
            />
          </div>
          {errors.customer_phone && touched.customer_phone && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600"
            >
              {errors.customer_phone}
            </motion.p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            We'll use this number for delivery updates and order confirmation.
          </p>
        </div>

        {/* Email (Optional) */}
        <div>
          <label
            htmlFor="customer_email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address <span className="text-gray-400">(Optional)</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="customer_email"
              value={formData.customer_email || ""}
              onChange={(e) =>
                handleInputChange("customer_email", e.target.value)
              }
              onBlur={() => handleBlur("customer_email")}
              placeholder="Enter your email address"
              className={`
                w-full pl-12 pr-4 py-4 border rounded-xl transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                ${
                  errors.customer_email && touched.customer_email
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }
              `}
            />
          </div>
          {errors.customer_email && touched.customer_email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600"
            >
              {errors.customer_email}
            </motion.p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            We'll send order confirmations and updates to this email.
          </p>
        </div>

        {/* Guest Checkout Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">ℹ</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900">
                Guest Checkout
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                You're checking out as a guest. No account is required to place
                your order.
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end pt-6">
          <motion.button
            type="submit"
            className="inline-flex items-center space-x-2 bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Continue to Shipping</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
