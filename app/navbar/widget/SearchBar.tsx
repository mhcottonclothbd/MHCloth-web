"use client";

import { cn } from "@/lib/utils";
import { getTextColorClasses, getIconColorClasses } from "@/lib/useBackgroundDetection";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchBarProps {
  className?: string;
  variant?: "desktop" | "mobile";
  isLightBackground?: boolean;
}

/**
 * Reusable search bar component for navbar
 * Features responsive design and smooth animations
 */
export default function SearchBar({
  className,
  variant = "desktop",
  isLightBackground = false,
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  if (variant === "mobile") {
    return (
      <div className={cn("w-full", className)}>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products..."
            className={cn(
              "w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-xl border rounded-xl focus:outline-none transition-all duration-300",
              isLightBackground 
                ? "border-gray-200 focus:border-gray-400 text-gray-900 placeholder-gray-500" 
                : "border-white/30 focus:border-white/50 text-white placeholder-white/70"
            )}
          />
        </form>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Search Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 rounded-lg transition-all duration-300 backdrop-blur-sm",
          getIconColorClasses(isLightBackground),
          isLightBackground ? "hover:bg-gray-100/50" : "hover:bg-white/10"
        )}
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </motion.button>

      {/* Search Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Search Modal */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-12 left-1/2 transform -translate-x-1/2 w-80 bg-white/20 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 z-50 p-4"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search products..."
                  className={cn(
                "w-full pl-10 pr-10 py-3 bg-white/20 backdrop-blur-xl border rounded-lg focus:outline-none transition-all duration-300",
                    isLightBackground 
                      ? "border-gray-200 focus:border-gray-400 text-gray-900 placeholder-gray-500" 
                      : "border-white/30 focus:border-white/50 text-white placeholder-white/70"
                  )}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors",
                    getIconColorClasses(isLightBackground)
                  )}
                >
                  <X className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Search Suggestions */}
              <div className={cn(
                "mt-4 text-sm",
                getTextColorClasses(isLightBackground)
              )}>
                <p className="mb-2 font-medium">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {["New arrivals", "Sale items", "Best sellers"].map(
                    (suggestion) => (
                      <motion.button
                        key={suggestion}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          router.push(
                            `/shop?search=${encodeURIComponent(suggestion)}`
                          );
                          setIsOpen(false);
                        }}
                        className={cn(
                          "px-3 py-1 bg-white/20 rounded-full text-xs transition-all duration-200 backdrop-blur-sm",
                          getTextColorClasses(isLightBackground),
                          isLightBackground ? "hover:bg-gray-100/70" : "hover:bg-white/30"
                        )}
                      >
                        {suggestion}
                      </motion.button>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
