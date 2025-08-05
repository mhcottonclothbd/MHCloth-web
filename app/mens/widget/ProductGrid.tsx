"use client";

import Button from "@/components/Button";
import { Card, CardContent } from "@/components/Card";
import { useCart } from "@/lib/cart-context";
import { handleApiError, isApiError, productApi } from "@/lib/services/api";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { motion } from "framer-motion";
import { Eye, Shield, ShoppingCart, User } from "lucide-react";
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

/**
 * Product grid component specifically for men's products
 * Features masculine styling and product categories
 */
export default function ProductGrid({
  searchParams,
  category,
  title,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState(searchParams.sort || "featured");
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await productApi.getProducts({
          category: category,
          limit: 20,
          search: searchParams.search
        });

        if (isApiError(response)) {
          setError(handleApiError(response));
          return;
        }

        let filteredProducts = response.data || [];

        // Search filter
        if (searchParams.search) {
          const searchTerm = searchParams.search.toLowerCase();
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(searchTerm) ||
              product.description?.toLowerCase().includes(searchTerm) ||
              product.brand?.toLowerCase().includes(searchTerm)
          );
        }

        // Category filter - handle subcategory filtering
        if (searchParams.category) {
          const category = searchParams.category.toLowerCase();
          filteredProducts = filteredProducts.filter((product) => {
            const productName = product.name.toLowerCase();
            const productDesc = product.description?.toLowerCase() || "";

            switch (category) {
              case "jackets":
                return (
                  productName.includes("jacket") ||
                  productName.includes("coat") ||
                  productDesc.includes("jacket") ||
                  productDesc.includes("outerwear")
                );
              case "shirts":
                return (
                  productName.includes("shirt") &&
                  !productName.includes("t-shirt")
                );
              case "pants":
                return (
                  productName.includes("pants") ||
                  productName.includes("chino") ||
                  productName.includes("trouser")
                );
              case "denim":
                return (
                  productName.includes("denim") ||
                  productName.includes("jean") ||
                  productName.includes("overall")
                );
              case "t-shirts":
                return (
                  productName.includes("t-shirt") ||
                  productName.includes("tee") ||
                  productName.includes("henley")
                );
              case "accessories":
                return product.category === "accessories";
              default:
                return product.category === searchParams.category;
            }
          });
        }

        // Stock filter
        if (searchParams.filter === "in-stock") {
          filteredProducts = filteredProducts.filter(
            (product) => (product.stock_quantity || product.stock || 0) > 0
          );
        } else if (searchParams.filter === "featured") {
          filteredProducts = filteredProducts.filter(
            (product) => product.is_featured || product.featured
          );
        }

        // Sort products
        filteredProducts.sort((a, b) => {
          switch (sortBy) {
            case "price-low":
              return (
                (a.sale_price || a.original_price || a.price || 0) -
                (b.sale_price || b.original_price || b.price || 0)
              );
            case "price-high":
              return (
                (b.sale_price || b.original_price || b.price || 0) -
                (a.sale_price || a.original_price || a.price || 0)
              );
            case "name":
              return a.name.localeCompare(b.name);
            case "featured":
            default:
              const aFeatured = a.is_featured || a.featured || false;
              const bFeatured = b.is_featured || b.featured || false;
              return bFeatured === aFeatured ? 0 : bFeatured ? 1 : -1;
          }
        });

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again.");
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

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

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
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No men's products found
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
            <User className="w-6 h-6 text-blue-600" />
            {title}
          </h2>
          <p className="text-gray-600">
            Showing {products.length} product{products.length !== 1 ? "s" : ""}{" "}
            for men
          </p>
        </div>

        {/* Sort Controls */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="featured">Featured First</option>
          <option value="name">Sort by Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => {
          const currentPrice =
            product.sale_price || product.original_price || product.price || 0;
          const originalPrice = product.original_price || product.price || 0;
          const isOnSale =
            product.sale_price && product.sale_price < originalPrice;
          const stockCount = product.stock_quantity || product.stock || 0;
          const isFeatured = product.is_featured || product.featured || false;
          const imageUrl =
            (product.image_urls && product.image_urls[0]) ||
            product.image_url ||
            "/placeholder-image.svg";

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-slate-200">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Featured Badge */}
                  {isFeatured && (
                    <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Premium
                    </div>
                  )}

                  {/* Sale Badge */}
                  {isOnSale && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Sale
                    </div>
                  )}

                  {/* Stock Badge */}
                  {stockCount === 0 && (
                    <div className="absolute top-3 right-3 bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Out of Stock
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Link href={`/shop/${product.id}`}>
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
                      disabled={stockCount === 0}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>

                    {product.brand && (
                      <p className="text-sm text-gray-500">{product.brand}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(currentPrice)}
                        </span>
                        {isOnSale && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(originalPrice)}
                          </span>
                        )}
                      </div>

                      {stockCount > 0 && stockCount <= 5 && (
                        <span className="text-xs text-orange-600 font-medium">
                          Only {stockCount} left
                        </span>
                      )}
                    </div>

                    {product.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
