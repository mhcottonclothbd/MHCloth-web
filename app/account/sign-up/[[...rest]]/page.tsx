import { ArrowLeft, ShoppingBag, Package, CreditCard, Truck } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guest Shopping | MHCloth",
  description:
    "Shop as a guest - no account required. Easy checkout and order tracking.",
};

/**
 * Guest shopping information page
 * Explains how to shop without creating an account
 */
export default function GuestShoppingPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#f8f6f3" }}
    >
      <div className="w-full max-w-2xl">
        {/* Back to Home Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Guest Shopping Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Shop as Guest
            </h1>
            <p className="text-gray-600">
              No account needed! Shop easily and track your orders with just an email.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Easy Shopping</h3>
                <p className="text-gray-600 text-sm">
                  Browse and add items to your cart without creating an account.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Quick Checkout</h3>
                <p className="text-gray-600 text-sm">
                  Simple checkout process with just your shipping and payment details.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Order Tracking</h3>
                <p className="text-gray-600 text-sm">
                  Get a unique order number to track your purchase via email.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Truck className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">
                  Same great shipping options and delivery times for all customers.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4">
            <Link
              href="/shop"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              Start Shopping
            </Link>
            <p className="text-sm text-gray-500">
              Questions? <Link href="/contact" className="text-blue-600 hover:underline">Contact us</Link> for help.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
