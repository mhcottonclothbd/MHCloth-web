import { SignUp } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign Up | MHCloth",
  description:
    "Create your account to start shopping and access exclusive features",
};

/**
 * Sign-up page with Clerk authentication
 * Features responsive design and navigation back to home
 */
export default function SignUpPage() {
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

        {/* Sign Up Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">
              Join us today and start your shopping journey
            </p>
          </div>

          {/* Clerk Sign Up Component */}
          <div className="flex justify-center">
            <SignUp
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
              signInUrl="/account/sign-in"
            />
          </div>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
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
            By creating an account, you agree to our{" "}
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
