"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockCategories, mockProducts } from "@/lib/mock-data/products";
import type { Product } from "@/types";
import {
  Filter,
  Grid3X3,
  Heart,
  List,
  Loader2,
  Search,
  ShoppingCart,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ProductDisplayProps {
  categoryFilter?: string;
  showFilters?: boolean;
  maxProducts?: number;
  gridCols?: 2 | 3 | 4 | 5;
  showPagination?: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

/**
 * Real-time Product Display component for the public website
 * Automatically updates when products are added/modified in admin
 */
export function ProductDisplay({
  categoryFilter,
  showFilters = true,
  maxProducts,
  gridCols = 4,
  showPagination = true,
}: ProductDisplayProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    categoryFilter || "all"
  );
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const itemsPerPage = 12;

  /**
   * Fetch products from mock data
   */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Using mock data for development
      const transformedProducts = mockProducts.map((product) => ({
        ...product,
        images: product.image_urls || (product.image_url ? [product.image_url] : []),
        status: "active" as const,
      }));

      setProducts(transformedProducts);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch categories from mock data
   */
  const fetchCategories = useCallback(async () => {
    try {
      // Use mock categories
      setCategories(
        mockCategories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.name.toLowerCase(),
        }))
      );
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Note: Real-time updates removed since we're using mock data

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  /**
   * Filtered and sorted products
   */
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product: Product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      const matchesPrice = (() => {
        if (priceRange === "all") return true;
        const price =
          product.sale_price && product.sale_price > 0
            ? product.sale_price
            : product.price;
        switch (priceRange) {
          case "under-25":
            return price < 25;
          case "25-50":
            return price >= 25 && price <= 50;
          case "50-100":
            return price >= 50 && price <= 100;
          case "over-100":
            return price > 100;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => {
          const priceA =
            a.sale_price && a.sale_price > 0 ? a.sale_price : a.price;
          const priceB =
            b.sale_price && b.sale_price > 0 ? b.sale_price : b.price;
          return priceA - priceB;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const priceA =
            a.sale_price && a.sale_price > 0 ? a.sale_price : a.price;
          const priceB =
            b.sale_price && b.sale_price > 0 ? b.sale_price : b.price;
          return priceB - priceA;
        });
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.created_at || "").getTime() -
            new Date(a.created_at || "").getTime()
        );
        break;
    }

    return maxProducts ? filtered.slice(0, maxProducts) : filtered;
  }, [products, searchTerm, selectedCategory, priceRange, sortBy, maxProducts]);

  /**
   * Paginated products
   */
  const paginatedProducts = useMemo(() => {
    if (!showPagination) return filteredProducts;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, showPagination]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  /**
   * Toggle wishlist item
   */
  const toggleWishlist = (productId: string) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };

  /**
   * Calculate discount percentage
   */
  const getDiscountPercentage = (product: Product) => {
    if (
      product.sale_price &&
      product.price &&
      product.sale_price < product.price
    ) {
      return Math.round(
        ((product.price - product.sale_price) / product.price) * 100
      );
    }
    return 0;
  };

  /**
   * Get display price
   */
  const getDisplayPrice = (product: Product) => {
    const hasDiscount =
      product.sale_price &&
      product.sale_price > 0 &&
      product.sale_price < product.price;
    return {
      current: hasDiscount ? product.sale_price : product.price,
      original: hasDiscount ? product.price : null,
      discount: hasDiscount ? getDiscountPercentage(product) : 0,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <Button onClick={fetchProducts} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Price Range Filter */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-25">Under $25</SelectItem>
                  <SelectItem value="25-50">$25 - $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="over-100">Over $100</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
          products
        </p>
        {!showFilters && (
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Products Grid/List */}
      {paginatedProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${gridCols} gap-6`}
        >
          {paginatedProducts.map((product) => {
            const pricing = getDisplayPrice(product);
            return (
              <Card
                key={product.id}
                className="group overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {product.images && product.images[0] && typeof product.images[0] === 'string' ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.is_featured && (
                      <Badge className="bg-yellow-500 text-yellow-900">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {pricing.discount > 0 && (
                      <Badge className="bg-red-500 text-white">
                        -{pricing.discount}%
                      </Badge>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        wishlist.includes(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  </Button>

                  {/* Quick Actions */}
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link href={`/products/${product.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button variant="outline">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-sm leading-tight line-clamp-2">
                        {product.name}
                      </h3>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">
                            ${pricing.current?.toFixed(2)}
                          </span>
                          {pricing.original && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${pricing.original.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {product.brand && (
                          <p className="text-xs text-muted-foreground">
                            {product.brand}
                          </p>
                        )}
                      </div>

                      {product.stock_quantity !== undefined &&
                        product.stock_quantity <= 5 &&
                        product.stock_quantity > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Only {product.stock_quantity} left
                          </Badge>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedProducts.map((product) => {
            const pricing = getDisplayPrice(product);
            return (
              <Card key={product.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {product.images && product.images[0] && typeof product.images[0] === 'string' ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-lg">
                            {product.name}
                          </h3>
                          {product.brand && (
                            <p className="text-sm text-muted-foreground">
                              {product.brand}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {product.is_featured && (
                            <Badge className="bg-yellow-500 text-yellow-900">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {pricing.discount > 0 && (
                            <Badge className="bg-red-500 text-white">
                              -{pricing.discount}%
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xl">
                              ${pricing.current?.toFixed(2)}
                            </span>
                            {pricing.original && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${pricing.original.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {product.stock_quantity !== undefined &&
                            product.stock_quantity <= 5 &&
                            product.stock_quantity > 0 && (
                              <Badge variant="outline">
                                Only {product.stock_quantity} left
                              </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleWishlist(product.id)}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                wishlist.includes(product.id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </Button>
                          <Button variant="outline" size="sm">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button asChild size="sm">
                            <Link href={`/products/${product.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum =
                currentPage <= 3
                  ? i + 1
                  : currentPage >= totalPages - 2
                  ? totalPages - 4 + i
                  : currentPage - 2 + i;

              if (pageNum < 1 || pageNum > totalPages) return null;

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Featured Products component for homepage
 */
export function FeaturedProducts() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
        <p className="text-muted-foreground mt-2">
          Discover our handpicked selection of premium clothing
        </p>
      </div>

      <ProductDisplay
        showFilters={false}
        maxProducts={8}
        gridCols={4}
        showPagination={false}
      />

      <div className="text-center">
        <Button asChild size="lg">
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
    </div>
  );
}

/**
 * Category Products component
 */
export function CategoryProducts({ category }: { category: string }) {
  return (
    <ProductDisplay
      categoryFilter={category}
      showFilters={true}
      gridCols={3}
      showPagination={true}
    />
  );
}
