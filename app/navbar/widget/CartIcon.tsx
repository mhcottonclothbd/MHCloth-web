"use client";

import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";
import { getIconColorClasses } from "@/lib/useBackgroundDetection";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

interface CartIconProps {
  className?: string;
  showSidebar?: boolean;
  onOpenSidebar?: () => void;
  isLightBackground?: boolean;
}

/**
 * Reusable cart icon component that links to cart page
 * Shows current number of items in cart with animated badge
 */
export default function CartIcon({
  className,
  showSidebar = false,
  onOpenSidebar,
  isLightBackground = false,
}: CartIconProps) {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  const handleClick = (e: React.MouseEvent) => {
    if (showSidebar && onOpenSidebar) {
      e.preventDefault();
      onOpenSidebar();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative p-2 rounded-lg transition-all duration-300 backdrop-blur-sm group",
        getIconColorClasses(isLightBackground),
        isLightBackground ? "hover:bg-gray-100/50" : "hover:bg-white/10",
        className
      )}
    >
      <Link
        href="/cart"
        onClick={handleClick}
        aria-label={`Shopping cart with ${itemCount} items`}
      >
      <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />

        {/* Animated Item Count Badge */}
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={itemCount}
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </motion.span>
        )}
      </Link>
    </motion.div>
  );
}
