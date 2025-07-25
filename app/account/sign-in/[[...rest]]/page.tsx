import { SignIn } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In | MHCloth",
  description:
    "Sign in to your account to access exclusive features and manage your orders",
};

/**
 * Sign-in page with Clerk authentication
 * Features responsive design and navigation back to home
 */
export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#f8f6f3" }}
    >
      <div className="w-full max-w-md">
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

        {/* Sign In Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to your account to continue shopping
            </p>
          </div>

          {/* Clerk Sign In Component */}
          <div className="flex justify-center">
            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-none bg-transparent",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700",
                  formButtonPrimary: "bg-gray-900 hover:bg-gray-800 text-white",
                  footerActionLink: "text-gray-900 hover:text-gray-700",
                },
              }}
              redirectUrl="/dashboard"
              signUpUrl="/account/sign-up"
            />
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/account/sign-up"
                className="text-gray-900 font-semibold hover:text-gray-700 transition-colors duration-200"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-gray-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
