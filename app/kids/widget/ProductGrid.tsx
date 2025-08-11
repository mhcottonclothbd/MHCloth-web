"use client";

import Button from "@/components/Button";
import { Card, CardContent } from "@/components/Card";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { motion } from "framer-motion";
import { Baby, Eye, Gamepad2, ShoppingCart, Smile, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ProductGridProps {
  searchParams: {
    search?: string;
    sort?: string;
    filter?: string;
    category?: string;
  };
  category: string;
  title: string;
}

// Removed hardcoded kids products. Fetch from API only.

/**
 * Product grid component specifically for kids products
 * Features playful styling and child-friendly product categories
 */
export default function ProductGrid({
  searchParams,
  category,
  title,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(searchParams.sort || "featured");
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          gender: "kids",
          ...(searchParams.search && { search: searchParams.search }),
          ...(searchParams.category && {
            category_slug: searchParams.category,
          }),
          ...(searchParams.filter === "featured" && { is_featured: "true" }),
        });

        const response = await fetch(`/api/products?${params}`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const api = await response.json();
        let filteredProducts: Product[] = api?.data || [];
        // Normalize image_url to prefer first image_urls entry
        filteredProducts = filteredProducts.map((p: any) => ({
          ...p,
          image_url:
            p?.image_url ||
            (Array.isArray(p?.image_urls) ? p.image_urls[0] : undefined),
        }));

        // Client-side sort
        filteredProducts.sort((a: Product, b: Product) => {
          switch (sortBy) {
            case "price-low":
              return a.price - b.price;
            case "price-high":
              return b.price - a.price;
            case "name":
              return a.name.localeCompare(b.name);
            case "featured":
            default:
              return (
                (b.is_featured || b.featured ? 1 : 0) -
                (a.is_featured || a.featured ? 1 : 0)
              );
          }
        });

        setProducts(filteredProducts);
      } catch (e) {
        console.error("Error fetching products:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, sortBy]);

  const handleAddToCart = (product: Product) => {
    addItem({
      product,
      quantity: 1,
      selectedSize: undefined,
      selectedColor: undefined,
    });
  };

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Baby className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No kids products found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Section Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Baby className="w-6 h-6 text-purple-600" />
            {title}
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl"
            >
              🎈
            </motion.span>
          </h2>
          <p className="text-gray-600">
            Showing {products.length} product{products.length !== 1 ? "s" : ""}{" "}
            for kids
          </p>
        </div>

        {/* Sort Controls */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="featured">Featured First</option>
          <option value="name">Sort by Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-purple-100 hover:border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={
                    (product.image_urls && product.image_urls[0]) ||
                    product.image_url ||
                    "/placeholder-image.jpg"
                  }
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Featured Badge */}
                {product.featured && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Popular!
                  </div>
                )}

                {/* Stock Badge */}
                {product.stock === 0 && (
                  <div className="absolute top-3 right-3 bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Out of Stock
                  </div>
                )}

                {/* Fun Floating Elements */}
                <motion.div
                  className="absolute top-3 right-3 text-2xl"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  ⭐
                </motion.div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <Link href={`/products/${(product as any).slug || product.id}`}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/90 hover:bg-white text-gray-900"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={
                      (product.stock_quantity || product.stock || 0) === 0
                    }
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors flex items-center gap-2">
                  {product.name}
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {product.featured ? "🌟" : "🎨"}
                  </motion.span>
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Price and Stock */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {(product.stock_quantity || product.stock || 0) > 0
                      ? `${
                          product.stock_quantity || product.stock || 0
                        } in stock`
                      : "Out of stock"}
                  </span>
                </div>

                {/* Safety Badge */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <Smile className="w-3 h-3" />
                    Safe & Tested
                  </div>
                  <div className="flex items-center gap-1 text-blue-600">
                    <Gamepad2 className="w-3 h-3" />
                    Educational
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
