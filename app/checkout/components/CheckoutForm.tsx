"use client";

import { useCart } from "@/lib/cart-context";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import CheckoutProgress from "./CheckoutProgress";
import CheckoutSummary from "./CheckoutSummary";
import CustomerInfoStep from "./CustomerInfoStep";
import OrderConfirmation from "./OrderConfirmation";
import OrderReviewStep from "./OrderReviewStep";
import PaymentMethodStep from "./PaymentMethodStep";
import ShippingAddressStep from "./ShippingAddressStep";

// Validation schemas matching API requirements
export const customerInfoSchema = z.object({
  customer_name: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Name too long"),
  customer_phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\+]?[\d\s\-\(\)]+$/, "Invalid phone number format"),
  customer_email: z
    .union([z.string().email("Invalid email address"), z.literal("")])
    .optional(),
});

export const shippingAddressSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "Division is required"),
  zipCode: z.string().optional(),
  country: z.literal("Bangladesh"),
});

export const paymentMethodSchema = z.object({
  payment_method: z.enum(["cash_on_delivery", "sslcommerz"]),
});

export interface CheckoutFormData {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: {
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    country: "Bangladesh";
  };
  billing_address: {
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    country: "Bangladesh";
  };
  payment_method: "cash_on_delivery" | "sslcommerz";
}

const steps = [
  { id: 1, name: "Customer Information", description: "Your details" },
  { id: 2, name: "Shipping Address", description: "Where to deliver" },
  { id: 3, name: "Order Review", description: "Review your order" },
  { id: 4, name: "Payment Method", description: "How to pay" },
  { id: 5, name: "Confirmation", description: "Order complete" },
];

export default function CheckoutForm() {
  const { items, getTotalPrice, clearCart, isLoading } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Form data state
  const [formData, setFormData] = useState<Partial<CheckoutFormData>>({
    shipping_address: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Bangladesh",
    },
    billing_address: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Bangladesh",
    },
    payment_method: "cash_on_delivery",
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && items.length === 0 && currentStep < 5) {
      router.push("/cart");
    }
  }, [items.length, isLoading, currentStep, router]);

  // Load form data from sessionStorage
  useEffect(() => {
    const savedData = sessionStorage.getItem("checkout-form-data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn("Failed to load saved form data:", error);
      }
    }
  }, []);

  // Save form data to sessionStorage
  useEffect(() => {
    if (Object.keys(formData).length > 2) {
      // Only save if we have meaningful data
      sessionStorage.setItem("checkout-form-data", JSON.stringify(formData));
    }
  }, [formData]);

  const updateFormData = (data: Partial<CheckoutFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmitOrder = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Prepare order data
      const orderData = {
        customer_name: formData.customer_name!,
        customer_phone: formData.customer_phone!,
        customer_email: formData.customer_email || "",
        shipping_address: formData.shipping_address!,
        billing_address: formData.billing_address || formData.shipping_address!,
        payment_method: formData.payment_method!,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total_amount: getTotalPrice(),
      };

      console.log("Submitting order:", orderData);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create order");
      }

      // Order created successfully
      setOrderNumber(result.order_number || result.orderNumber || result.id);
      clearCart();
      sessionStorage.removeItem("checkout-form-data");
      setCurrentStep(5);
    } catch (error) {
      console.error("Order submission failed:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  if (items.length === 0 && currentStep < 5) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some items to your cart before checking out.
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your order in just a few steps</p>
      </div>

      {/* Progress Indicator */}
      <CheckoutProgress steps={steps} currentStep={currentStep} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <CustomerInfoStep
                key="customer-info"
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
              />
            )}
            {currentStep === 2 && (
              <ShippingAddressStep
                key="shipping-address"
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 3 && (
              <OrderReviewStep
                key="order-review"
                formData={formData}
                updateFormData={updateFormData}
                items={items}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 4 && (
              <PaymentMethodStep
                key="payment-method"
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleSubmitOrder}
                onPrev={prevStep}
                isSubmitting={isSubmitting}
                submitError={submitError}
              />
            )}
            {currentStep === 5 && (
              <OrderConfirmation
                key="confirmation"
                orderNumber={orderNumber}
                formData={formData}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        {currentStep < 5 && (
          <div className="lg:col-span-1">
            <CheckoutSummary
              items={items}
              total={getTotalPrice()}
              step={currentStep}
            />
          </div>
        )}
      </div>
    </div>
  );
}
