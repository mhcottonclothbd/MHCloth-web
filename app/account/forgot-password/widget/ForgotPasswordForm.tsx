"use client";

import { useState } from "react";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

/**
 * Forgot password form component with email validation and submission
 * Handles form state, validation, and success/error messaging
 */
export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  /**
   * Validates email format using regex
   * @param email - Email string to validate
   * @returns boolean indicating if email is valid
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handles form submission for password reset
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call for password reset
      // In a real application, this would call your authentication service
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll always show success
      // In production, you'd integrate with Clerk or your auth provider
      setIsSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Success state - show confirmation message
  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Check Your Email
        </h3>
        <p className="text-gray-600 mb-6">
          We've sent a password reset link to{" "}
          <span className="font-medium text-gray-900">{email}</span>
        </p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
              }}
              className="text-gray-900 font-medium hover:text-gray-700 transition-colors duration-200"
            >
              try again
            </button>
          </p>
          <Link
            href="/account/sign-in"
            className="inline-block w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Form state - show email input form
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors duration-200"
            placeholder="Enter your email address"
            disabled={isLoading}
            autoComplete="email"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !email.trim()}
        className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Sending Reset Link...</span>
          </>
        ) : (
          <span>Send Reset Link</span>
        )}
      </button>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          We'll send you a secure link to reset your password.
        </p>
      </div>
    </form>
  );
}