import { ArrowLeft, Mail } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import ForgotPasswordForm from "./widget/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | Physical Store",
  description:
    "Reset your password to regain access to your account and continue shopping",
};

/**
 * Forgot password page with email input and reset functionality
 * Features responsive design and navigation back to sign-in
 */
export default function ForgotPasswordPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#f8f6f3" }}
    >
      <div className="w-full max-w-md">
        {/* Back to Sign In Link */}
        <div className="mb-8">
          <Link
            href="/account/sign-in"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-gray-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600">
              No worries! Enter your email address and we'll send you a link to
              reset your password.
            </p>
          </div>

          {/* Forgot Password Form */}
          <ForgotPasswordForm />

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Remember your password?{" "}
              <Link
                href="/account/sign-in"
                className="text-gray-900 font-semibold hover:text-gray-700 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Need help?{" "}
            <Link href="/contact" className="underline hover:text-gray-700">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
