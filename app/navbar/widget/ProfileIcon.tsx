"use client";

import { cn } from "@/lib/utils";
import { getTextColorClasses, getIconColorClasses } from "@/lib/useBackgroundDetection";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";

interface ProfileIconProps {
  className?: string;
  variant?: "desktop" | "mobile";
  isLightBackground?: boolean;
}

/**
 * Reusable profile icon component with Clerk authentication
 * Shows different states based on authentication status
 */
export default function ProfileIcon({
  className,
  variant = "desktop",
  isLightBackground = false,
}: ProfileIconProps) {
  if (variant === "mobile") {
    return (
      <div className={cn("space-y-3", className)}>
        <SignedOut>
          <div className="space-y-2">
            <Link href="/account/sign-in" className="block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full px-4 py-3 bg-white/20 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border",
                  getTextColorClasses(isLightBackground),
                  isLightBackground 
                    ? "hover:bg-gray-100/70 border-gray-200 hover:border-gray-300" 
                    : "hover:bg-white/30 border-white/30"
                )}
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                Sign In
              </motion.button>
            </Link>
            <Link href="/account/sign-up" className="block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm",
                  isLightBackground 
                    ? "bg-gray-900 hover:bg-gray-800 text-white" 
                    : "bg-white/90 hover:bg-white text-gray-900"
                )}
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                Sign Up
              </motion.button>
            </Link>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="space-y-2">
            <Link href="/dashboard" className="block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full px-4 py-3 bg-white/20 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border",
                  getTextColorClasses(isLightBackground),
                  isLightBackground 
                    ? "hover:bg-gray-100/70 border-gray-200 hover:border-gray-300" 
                    : "hover:bg-white/30 border-white/30"
                )}
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                Dashboard
              </motion.button>
            </Link>
            <div className="flex justify-center pt-2">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </div>
          </div>
        </SignedIn>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-4", className)}>
      <SignedOut>
        <Link href="/account/sign-in">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 backdrop-blur-sm",
              getTextColorClasses(isLightBackground),
              isLightBackground 
                ? "hover:bg-gray-100/50" 
                : "hover:bg-white/10"
            )}
          >
            Sign In
          </motion.button>
        </Link>
        <Link href="/account/sign-up">
          <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 backdrop-blur-sm",
                isLightBackground 
                  ? "bg-gray-900 text-white hover:bg-gray-800" 
                  : "bg-white/20 text-white hover:bg-white/30"
              )}
            >
              Sign Up
            </motion.button>
        </Link>
      </SignedOut>
      <SignedIn>
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 backdrop-blur-sm border",
              getTextColorClasses(isLightBackground),
              isLightBackground 
                ? "hover:bg-gray-100/50 border-gray-300 hover:border-gray-400" 
                : "hover:bg-white/10 border-white/20 hover:border-white/40"
            )}
          >
            Dashboard
          </motion.button>
        </Link>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </SignedIn>
    </div>
  );
}
