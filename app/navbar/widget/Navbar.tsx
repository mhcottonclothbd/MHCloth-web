"use client";

import { cn } from "@/lib/utils";
import { useBackgroundDetection, getTextColorClasses, getIconColorClasses, getBorderColorClasses } from "@/lib/useBackgroundDetection";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, User, ShoppingBag, Sparkles, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CartIcon from "./CartIcon";
import CartSidebar from "./CartSidebar";
import SearchBar from "./SearchBar";

const navigation = [
  { name: "Home", href: "/home" },
  { name: "Store", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const categories = [
  { 
    name: "Men", 
    href: "/mens", 
    icon: User,
    description: "Discover men's fashion",
    featured: ["New Arrivals", "Best Sellers", "Sale"]
  },
  { 
    name: "Women", 
    href: "/womens", 
    icon: Sparkles,
    description: "Explore women's collection",
    featured: ["Trending", "Accessories", "Dresses"]
  },
  { 
    name: "Kids", 
    href: "/kids", 
    icon: ShoppingBag,
    description: "Shop for little ones",
    featured: ["Boys", "Girls", "Toys"]
  },
];

/**
 * Main navigation component with responsive design
 * Features glass morphism effect, smooth animations, and reusable components
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const isLightBackground = useBackgroundDetection();

  // Handle scroll detection for navbar height reduction
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and dropdown when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as Element).closest('.relative')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b shadow-2xl",
          isScrolled ? "h-16" : "h-20 lg:h-24"
        )}
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.85) 100%)',
          backdropFilter: 'blur(40px) saturate(180%) brightness(1.1)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%) brightness(1.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn(
            "flex items-center justify-between transition-all duration-500",
            isScrolled ? "h-16" : "h-20 lg:h-24"
          )}>
            {/* Enhanced Brand Name */}
            <Link href="/home" className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <motion.span
                  className={cn(
                    "font-bold transition-all duration-300 text-white relative z-10",
                    isScrolled ? "text-lg lg:text-xl" : "text-xl lg:text-2xl"
                  )}
                >
                  MHCloth
                </motion.span>
                {/* Subtle glow effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
                  style={{ transform: 'scale(1.2)' }}
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation with Dropdown */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Categories Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={cn(
                    "flex items-center px-4 py-2 font-medium transition-all duration-300 rounded-xl backdrop-blur-sm relative overflow-hidden border",
                    "text-white hover:shadow-lg",
                    isDropdownOpen && "text-blue-300 shadow-lg"
                  )}
                  style={{
                    background: isDropdownOpen 
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                    backdropFilter: 'blur(20px) saturate(150%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    border: isDropdownOpen 
                      ? '1px solid rgba(59, 130, 246, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: isDropdownOpen 
                      ? '0 4px 16px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    fontWeight: 500,
                    letterSpacing: '-0.01em'
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  />
                  <span className="relative z-10 mr-1">Categories</span>
                  <motion.div
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <>
                      {/* Backdrop for dropdown */}
                      <div 
                        className="fixed inset-0 z-30" 
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 sm:left-0 top-full mt-2 w-72 sm:w-80 md:w-96 lg:w-[420px] max-h-[70vh] sm:max-h-[80vh] rounded-2xl shadow-2xl border z-40 overflow-hidden flex flex-col transform -translate-x-4 sm:translate-x-0"
                        style={{
                          background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.85) 100%)',
                          backdropFilter: 'blur(60px) saturate(200%) brightness(1.1)',
                          WebkitBackdropFilter: 'blur(60px) saturate(200%) brightness(1.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 0 rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        {/* Header Section - Fixed */}
                        <div className="p-4 sm:p-6 relative border-b border-white/10">
                          {/* Enhanced Glass reflection effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-70 pointer-events-none" />
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                          <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-transparent to-transparent" />
                          <h3 className="text-white font-semibold text-lg flex items-center">
                            <Menu className="w-5 h-5 mr-2 text-blue-400" />
                            Shop by Category
                          </h3>
                        </div>
                        
                        {/* Scrollable Categories Section */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
                          <div className="space-y-3">
                            {categories.map((category) => {
                              const Icon = category.icon;
                              const isActive = pathname === category.href;
                              
                              return (
                                <motion.div
                                  key={category.name}
                                  whileHover={{ scale: 1.02, x: 4 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Link
                                    href={category.href}
                                    onClick={() => setIsDropdownOpen(false)}
                                    className={cn(
                                      "group flex items-start p-4 rounded-xl transition-all duration-300 border backdrop-blur-sm relative overflow-hidden",
                                      "hover:shadow-xl",
                                      isActive 
                                        ? "text-blue-300 shadow-lg" 
                                        : "text-white"
                                    )}
                                    style={{
                                      background: isActive 
                                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(147, 51, 234, 0.15) 100%)'
                                        : 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
                                      backdropFilter: 'blur(30px) saturate(150%)',
                                      WebkitBackdropFilter: 'blur(30px) saturate(150%)',
                                      border: isActive 
                                        ? '1px solid rgba(59, 130, 246, 0.4)'
                                        : '1px solid rgba(255, 255, 255, 0.2)',
                                      boxShadow: isActive 
                                        ? '0 8px 32px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                                        : '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                                    }}
                                  >
                                    <div className={cn(
                                      "p-2 rounded-xl mr-4 transition-all duration-300 backdrop-blur-sm",
                                      isActive 
                                        ? "text-blue-300 shadow-lg" 
                                        : "text-white group-hover:shadow-md"
                                    )}
                                    style={{
                                      background: isActive 
                                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.25) 100%)'
                                        : 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.12) 100%)',
                                      backdropFilter: 'blur(20px) saturate(150%)',
                                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                                      border: '1px solid rgba(255, 255, 255, 0.2)',
                                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                                    }}>
                                      <Icon className="w-5 h-5" />
                                    </div>
                                    
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-base mb-1">
                                        {category.name}
                                      </h4>
                                      <p className={cn(
                                        "text-sm mb-2",
                                        isActive ? "text-blue-200" : "text-white/70"
                                      )}>
                                        {category.description}
                                      </p>
                                      <div className="flex flex-wrap gap-1">
                                        {category.featured.map((item) => (
                                          <span
                                            key={item}
                                            className={cn(
                                              "px-3 py-1.5 text-xs rounded-full transition-all duration-300 backdrop-blur-sm border",
                                              isActive 
                                                ? "text-blue-200 shadow-sm" 
                                                : "text-white/80 group-hover:text-white"
                                            )}
                                            style={{
                                              background: isActive 
                                                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.2) 100%)'
                                                : 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                                              backdropFilter: 'blur(15px) saturate(150%)',
                                              WebkitBackdropFilter: 'blur(15px) saturate(150%)',
                                              border: isActive 
                                                ? '1px solid rgba(59, 130, 246, 0.4)'
                                                : '1px solid rgba(255, 255, 255, 0.25)',
                                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                                            }}
                                          >
                                            {item}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </Link>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                        
                        {/* Quick Links - Fixed at bottom */}
                        <div className="p-4 sm:p-6 pt-4 border-t border-white/20 relative bg-black/20">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Link
                              href="/shop"
                              onClick={() => setIsDropdownOpen(false)}
                              className="text-center px-3 sm:px-4 py-2.5 text-sm text-purple-400 hover:text-purple-300 transition-all duration-300 font-medium rounded-xl border backdrop-blur-sm hover:shadow-lg"
                              style={{
                                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)',
                                backdropFilter: 'blur(25px) saturate(150%)',
                                WebkitBackdropFilter: 'blur(25px) saturate(150%)',
                                border: '1px solid rgba(147, 51, 234, 0.3)',
                                boxShadow: '0 4px 16px rgba(147, 51, 234, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                              }}
                            >
                              🛍️ Shop All →
                            </Link>
                            <Link
                              href="/new-arrivals"
                              onClick={() => setIsDropdownOpen(false)}
                              className="text-center px-3 sm:px-4 py-2.5 text-sm text-blue-400 hover:text-blue-300 transition-all duration-300 font-medium rounded-xl border backdrop-blur-sm hover:shadow-lg"
                              style={{
                                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.1) 100%)',
                                backdropFilter: 'blur(25px) saturate(150%)',
                                WebkitBackdropFilter: 'blur(25px) saturate(150%)',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                              }}
                            >
                              ✨ New Arrivals →
                            </Link>
                            <Link
                              href="/on-sale"
                              onClick={() => setIsDropdownOpen(false)}
                              className="text-center px-3 sm:px-4 py-2.5 text-sm text-green-400 hover:text-green-300 transition-all duration-300 font-medium rounded-xl border backdrop-blur-sm hover:shadow-lg"
                              style={{
                                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
                                backdropFilter: 'blur(25px) saturate(150%)',
                                WebkitBackdropFilter: 'blur(25px) saturate(150%)',
                                border: '1px solid rgba(34, 197, 94, 0.3)',
                                boxShadow: '0 4px 16px rgba(34, 197, 94, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                              }}
                            >
                              🔥 Sale Items →
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Enhanced Navigation Items */}
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/home" && pathname === "/");
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "px-4 py-2 font-medium transition-all duration-300 rounded-xl backdrop-blur-sm relative overflow-hidden border",
                        "text-white hover:shadow-lg",
                        isActive 
                          ? "text-blue-300 shadow-lg" 
                          : "border-transparent hover:border-white/20"
                      )}
                      style={{
                        background: isActive 
                          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.1) 100%)'
                          : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                        backdropFilter: 'blur(20px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                        border: isActive 
                          ? '1px solid rgba(59, 130, 246, 0.3)'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: isActive 
                          ? '0 4px 16px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                          : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                        fontWeight: 500,
                        letterSpacing: '-0.01em'
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/15 to-purple-500/15 opacity-0 hover:opacity-100 transition-opacity duration-300"
                      />
                      <span className="relative z-10">{item.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeDesktopTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-t"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Desktop Actions - Search + Cart with live count */}
            <div className="hidden lg:flex items-center space-x-3">
              <SearchBar isLightBackground={false} />
              <CartIcon
                showSidebar={true}
                onOpenSidebar={() => setIsCartOpen(true)}
                isLightBackground={false}
              />
            </div>

            {/* Mobile Menu Button - Cart Icon Remains for Mobile */}
            <div className="lg:hidden flex items-center space-x-2">
              <CartIcon
                showSidebar={true}
                onOpenSidebar={() => setIsCartOpen(true)}
                isLightBackground={false}
              />

              <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(!isOpen)}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-300 backdrop-blur-sm",
                    "text-white hover:bg-white/10"
                  )}
                  aria-label="Toggle menu"
                >
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isOpen ? (
                      <X className="w-6 h-6" />
                    ) : (
                      <Menu className="w-6 h-6" />
                    )}
                  </motion.div>
                </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Enhanced Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 bottom-0 w-80 shadow-2xl z-50 lg:hidden overflow-y-auto"
              style={{
                background: 'linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.92) 100%)',
                backdropFilter: 'blur(60px) saturate(200%) brightness(1.1)',
                WebkitBackdropFilter: 'blur(60px) saturate(200%) brightness(1.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="p-6">
                {/* Enhanced Mobile Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                  <span 
                    className="font-bold text-lg text-white"
                  >
                    MHCloth
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "p-2 rounded-xl transition-all duration-300 backdrop-blur-sm border",
                      "text-white hover:bg-white/10"
                    )}
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Mobile Search */}
                <div className="mb-6">
                  <SearchBar variant="mobile" isLightBackground={false} />
                </div>

                {/* Enhanced Mobile Categories */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold text-sm mb-4 px-1 text-white/70 uppercase tracking-wider"
                      style={{
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                        fontWeight: 600,
                        letterSpacing: '0.05em'
                      }}>
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      const isActive = pathname === category.href;
                      return (
                        <Link
                          key={category.name}
                          href={category.href}
                          className={cn(
                            "flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 backdrop-blur-sm border",
                            "text-white hover:bg-white/15 hover:border-white/30 hover:shadow-lg",
                            isActive
                              ? "bg-white/20 text-blue-300 border-blue-400/50 shadow-lg"
                              : "border-white/10"
                          )}
                          style={{
                            background: isActive 
                              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.1) 100%)'
                              : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)'
                          }}
                          onClick={() => setIsOpen(false)}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          <div>
                            <div>{category.name}</div>
                            <div className="text-xs text-white/60">{category.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Enhanced Mobile Navigation Links */}
                <div className="space-y-2 mb-8">
                  <h3 className="text-white font-semibold text-sm mb-4 px-1 text-white/70 uppercase tracking-wider"
                      style={{
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                        fontWeight: 600,
                        letterSpacing: '0.05em'
                      }}>
                    Pages
                  </h3>
                  {navigation.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href === "/home" && pathname === "/");
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 backdrop-blur-sm border",
                          "text-white hover:bg-white/15 hover:border-white/30 hover:shadow-lg",
                          isActive
                            ? "bg-white/20 text-blue-300 border-blue-400/50 shadow-lg"
                            : "border-white/10"
                        )}
                        style={{
                          background: isActive 
                            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.1) 100%)'
                            : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)'
                        }}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Actions - Account Access via Contact */}
                <div className="space-y-6">
                  <div className="border-t border-white/20 pt-6">
                    <Link
                      href="/contact"
                      className={cn(
                        "flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 backdrop-blur-sm border",
                        "text-white hover:bg-white/15 hover:border-white/30 hover:shadow-lg border-white/10"
                      )}
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)'
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-5 h-5 mr-3" />
                      <div>
                        <div>Account & Support</div>
                        <div className="text-xs text-white/60">Contact us for assistance</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Spacer to prevent content from hiding behind fixed nav */}
      <div className={cn(
        "transition-all duration-500",
        isScrolled ? "h-16" : "h-20 lg:h-24"
      )} />
    </>
  );
}
