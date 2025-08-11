"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface Product {
  id: string;
  slug?: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_urls: string[];
  category: string;
  brand: string;
  is_on_sale: boolean;
  is_featured: boolean;
  stock_quantity: number;
  sizes?: string[];
  colors?: string[];
  tags?: string[];
  created_at: string;
  updated_at: string;
}

interface ProductCardProps {
  product: Product;
  showWishlist?: boolean;
  showAddToCart?: boolean;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  className?: string;
}

export function ProductCard({
  product,
  showWishlist = true,
  showAddToCart = true,
  onAddToCart,
  onAddToWishlist,
  className = "",
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!onAddToCart) return;

    setIsLoading(true);
    try {
      await onAddToCart(product);
      // Meta Pixel: AddToCart event for quick add button
      try {
        const priceNum = Number(product.price ?? 0);
        (window as any)?.fbq?.("track", "AddToCart", {
          content_ids: [product.id],
          content_name: product.name,
          content_type: "product",
          value: priceNum,
          currency: "BDT",
        });
      } catch {}
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted);
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  const discountPercentage =
    product.original_price && product.original_price > product.price
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) *
            100
        )
      : 0;

  const mainImage = product.image_urls?.[0] || "/placeholder-image.svg";
  const detailsPath = product.slug
    ? `/products/${product.slug}`
    : `/products/${product.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(detailsPath)}
    >
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
        <CardContent className="p-0">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.is_on_sale && (
                <Badge variant="destructive" className="text-xs">
                  {discountPercentage}% OFF
                </Badge>
              )}
              {product.is_featured && (
                <Badge variant="secondary" className="text-xs">
                  Featured
                </Badge>
              )}
              {product.stock_quantity === 0 && (
                <Badge variant="outline" className="text-xs bg-white/90">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* No wishlist/eye buttons per requirements */}

            {/* Quick Add to Cart */}
            {showAddToCart && product.stock_quantity > 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                  disabled={isLoading}
                  className="w-full"
                  size="sm"
                >
                  <ShoppingBag size={16} className="mr-2" />
                  {isLoading ? "Adding..." : "Add to Bag"}
                </Button>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <Link href={detailsPath} className="block">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
            </Link>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-gray-900">
                  {(() => {
                    const priceNum = Number(product.price ?? 0);
                    const formatted = new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(priceNum);
                    return `৳${formatted}`;
                  })()}
                </span>
              </div>

              {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                <Badge variant="outline" className="text-xs text-orange-600">
                  Only {product.stock_quantity} left
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
