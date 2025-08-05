"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, MapPin } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { CheckoutFormData, shippingAddressSchema } from "./CheckoutForm";

interface ShippingAddressStepProps {
  formData: Partial<CheckoutFormData>;
  updateFormData: (data: Partial<CheckoutFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

// Bangladesh divisions
const bangladeshDivisions = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

// Major cities in Bangladesh
const bangladeshCities = [
  "Dhaka",
  "Chattogram",
  "Cumilla",
  "Rajshahi",
  "Khulna",
  "Sylhet",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Gazipur",
  "Narayanganj",
  "Savar",
  "Cox's Bazar",
  "Jessore",
  "Bogura",
  "Dinajpur",
  "Pabna",
  "Comilla",
  "Faridpur",
  "Tangail",
];

export default function ShippingAddressStep({
  formData,
  updateFormData,
  onNext,
  onPrev,
}: ShippingAddressStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const handleInputChange = (field: string, value: string) => {
    const addressData = {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Bangladesh" as const,
      ...formData.shipping_address,
      [field.replace("shipping_", "")]: value,
    };

    updateFormData({
      shipping_address: addressData,
      // If same as billing, update billing address too
      ...(sameAsBilling && { billing_address: addressData }),
    });

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
      const addressValue =
        formData.shipping_address?.[
          field.replace(
            "shipping_",
            ""
          ) as keyof typeof formData.shipping_address
        ];

      if (field === "shipping_address") {
        shippingAddressSchema.shape.address.parse(addressValue);
      } else if (field === "shipping_city") {
        shippingAddressSchema.shape.city.parse(addressValue);
      } else if (field === "shipping_state") {
        shippingAddressSchema.shape.state.parse(addressValue);
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

    try {
      shippingAddressSchema.parse(formData.shipping_address);
      setErrors({});
      onNext();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[`shipping_${String(err.path[0])}`] = err.message;
          }
        });
        setErrors(newErrors);

        // Mark all fields as touched
        setTouched({
          shipping_address: true,
          shipping_city: true,
          shipping_state: true,
          shipping_zipCode: true,
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
          Shipping Address
        </h2>
        <p className="text-gray-600">Where should we deliver your order?</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Street Address */}
        <div>
          <label
            htmlFor="shipping_address"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Street Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <textarea
              id="shipping_address"
              rows={3}
              value={formData.shipping_address?.address || ""}
              onChange={(e) =>
                handleInputChange("shipping_address", e.target.value)
              }
              onBlur={() => handleBlur("shipping_address")}
              placeholder="Enter your complete address (House/Flat, Road, Area)"
              className={`
                w-full pl-12 pr-4 py-4 border rounded-xl transition-all duration-200 resize-none
                focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                ${
                  errors.shipping_address && touched.shipping_address
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }
              `}
            />
          </div>
          {errors.shipping_address && touched.shipping_address && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600"
            >
              {errors.shipping_address}
            </motion.p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* City */}
          <div>
            <label
              htmlFor="shipping_city"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              City <span className="text-red-500">*</span>
            </label>
            <select
              id="shipping_city"
              value={formData.shipping_address?.city || ""}
              onChange={(e) =>
                handleInputChange("shipping_city", e.target.value)
              }
              onBlur={() => handleBlur("shipping_city")}
              className={`
                w-full px-4 py-4 border rounded-xl transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                ${
                  errors.shipping_city && touched.shipping_city
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }
              `}
            >
              <option value="">Select City</option>
              {bangladeshCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.shipping_city && touched.shipping_city && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600"
              >
                {errors.shipping_city}
              </motion.p>
            )}
          </div>

          {/* Division */}
          <div>
            <label
              htmlFor="shipping_state"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Division <span className="text-red-500">*</span>
            </label>
            <select
              id="shipping_state"
              value={formData.shipping_address?.state || ""}
              onChange={(e) =>
                handleInputChange("shipping_state", e.target.value)
              }
              onBlur={() => handleBlur("shipping_state")}
              className={`
                w-full px-4 py-4 border rounded-xl transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                ${
                  errors.shipping_state && touched.shipping_state
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }
              `}
            >
              <option value="">Select Division</option>
              {bangladeshDivisions.map((division) => (
                <option key={division} value={division}>
                  {division}
                </option>
              ))}
            </select>
            {errors.shipping_state && touched.shipping_state && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600"
              >
                {errors.shipping_state}
              </motion.p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ZIP Code */}
          <div>
            <label
              htmlFor="shipping_zipCode"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              ZIP Code <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              id="shipping_zipCode"
              value={formData.shipping_address?.zipCode || ""}
              onChange={(e) =>
                handleInputChange("shipping_zipCode", e.target.value)
              }
              placeholder="Enter ZIP code"
              className="w-full px-4 py-4 border border-gray-300 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Country (Fixed) */}
          <div>
            <label
              htmlFor="shipping_country"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Country
            </label>
            <input
              type="text"
              id="shipping_country"
              value="Bangladesh"
              readOnly
              className="w-full px-4 py-4 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Same as Billing Address */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="sameAsBilling"
            checked={sameAsBilling}
            onChange={(e) => {
              setSameAsBilling(e.target.checked);
              if (e.target.checked) {
                updateFormData({ billing_address: formData.shipping_address });
              }
            }}
            className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black focus:ring-2"
          />
          <label htmlFor="sameAsBilling" className="text-sm text-gray-700">
            Billing address is the same as shipping address
          </label>
        </div>

        {/* Delivery Note */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-900">
                Free Delivery Available
              </h3>
              <p className="text-sm text-green-700 mt-1">
                {formData.shipping_address?.city === "Dhaka"
                  ? "Free delivery within Dhaka city (1-2 business days)"
                  : "Standard delivery (3-5 business days) - Free for orders above ৳1000"}
              </p>
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
            <span>Continue to Review</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
