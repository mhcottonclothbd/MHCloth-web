"use client";

import { cn } from "@/lib/utils";
import { getTextColorClasses, getIconColorClasses } from "@/lib/useBackgroundDetection";
import { motion } from "framer-motion";
import { User, ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";

interface ProfileIconProps {
  className?: string;
  variant?: "desktop" | "mobile";
  isLightBackground?: boolean;
}

/**
 * Reusable profile icon component for guest users
 * Provides access to cart and account-related features
 */
export default function ProfileIcon({
  className,
  variant = "desktop",
  isLightBackground = false,
}: ProfileIconProps) {
  if (variant === "mobile") {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="space-y-2">
          <Link href="/cart" className="block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full px-4 py-3 bg-white/20 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border flex items-center gap-3",
                getTextColorClasses(isLightBackground),
                isLightBackground 
                  ? "hover:bg-gray-100/70 border-gray-200 hover:border-gray-300" 
                  : "hover:bg-white/30 border-white/30"
              )}
              style={{ fontFamily: "'Crimson Pro', serif" }}
            >
              <ShoppingBag className="w-5 h-5" />
              Shopping Cart
            </motion.button>
          </Link>
          <Link href="/contact" className="block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm flex items-center gap-3",
                isLightBackground
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              )}
              style={{ fontFamily: "'Crimson Pro', serif" }}
            >
              <User className="w-5 h-5" />
              Contact Us
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  // Desktop variant
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Cart Icon */}
      <Link href="/cart">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "p-2 rounded-full transition-all duration-300 backdrop-blur-sm",
            isLightBackground
              ? "hover:bg-gray-100/70 text-gray-700 hover:text-gray-900"
              : "hover:bg-white/20 text-white/80 hover:text-white"
          )}
          aria-label="Shopping Cart"
        >
          <ShoppingBag 
            className={cn(
              "w-5 h-5 transition-colors duration-300",
              getIconColorClasses(isLightBackground)
            )} 
          />
        </motion.button>
      </Link>

      {/* Contact/Account Icon */}
      <Link href="/contact">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "p-2 rounded-full transition-all duration-300 backdrop-blur-sm",
            isLightBackground
              ? "hover:bg-gray-100/70 text-gray-700 hover:text-gray-900"
              : "hover:bg-white/20 text-white/80 hover:text-white"
          )}
          aria-label="Contact Us"
        >
          <User 
            className={cn(
              "w-5 h-5 transition-colors duration-300",
              getIconColorClasses(isLightBackground)
            )} 
          />
        </motion.button>
      </Link>
    </div>
  );
}
