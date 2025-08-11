"use client";

import { CategoryItem } from "@/data/categories";
import { useCart } from "@/lib/cart-context";
import { cn, formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface ProductGridWithDropdownProps {
  searchParams: {
    search?: string;
    sort?: string;
    filter?: string;
    category?: string;
  };
  categories: CategoryItem[];
  category: string;
  title: string;
}

/**
 * Playful kids product grid component with horizontal scrollable category filter
 * Features fun animations, bright colors, and category-based product sections
 */
export default function ProductGridWithDropdown({
  searchParams,
  categories,
  category,
  title,
}: ProductGridWithDropdownProps) {
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.category || "all"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Only include requested Kids categories and skip categories without icons
  const allowedKidsSlugs = useMemo(
    () =>
      new Set([
        // Core kids categories
        "t-shirts",
        "hoodies-sweatshirts",
        "jeans",
        "shorts",
        "dresses",
        "jackets-coats",
        "jackets",
        "coats",
        "joggers",
        "sweaters-cardigans",
        // Add mens categories for kids per request
        "polo",
        "polo-shirts",
        "shirts-formal-casual",
        "trousers",
        "cargo-pants",
        "blazers-suits",
        "undergarments",
      ]),
    []
  );

  const displayCategories = useMemo(() => {
    return (categories || []).filter((cat) => {
      const slug = ((cat as any).slug || cat.id || "").toString().toLowerCase();
      const hasIcon = !!cat.icon && !cat.icon.includes("placeholder-image");
      return allowedKidsSlugs.has(slug) && hasIcon;
    });
  }, [categories, allowedKidsSlugs]);

  // Helper to match products with a given category item
  const categoryMatchesProduct = (
    product: Product,
    cat: CategoryItem
  ): boolean => {
    const productCategoryId =
      (product as any).category_id || product.category_id;
    const productCategory = (product as any).category || product.category;
    const catId = cat.id;
    const catSlug = (cat as any).slug || cat.id;
    const catName = cat.name?.toLowerCase();
    const productCategoryName =
      typeof productCategory === "string" ? productCategory.toLowerCase() : "";
    return (
      productCategoryId === catId ||
      productCategoryId === catSlug ||
      productCategoryName === catId ||
      productCategoryName === catSlug ||
      productCategoryName === (catSlug as string) ||
      productCategoryName === (catName || "")
    );
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams({
          gender: "kids",
          ...(searchParams.search && { search: searchParams.search }),
          ...(selectedCategory !== "all" && {
            category_slug: selectedCategory,
          }),
          ...(searchParams.filter === "featured" && { is_featured: "true" }),
        });

        const response = await fetch(`/api/products?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        const items = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
        // Normalize image_url for display
        const normalized = items.map((p: any) => ({
          ...p,
          image_url:
            p?.image_url ||
            (Array.isArray(p?.image_urls) ? p.image_urls[0] : undefined),
        }));
        setProducts(normalized);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [searchParams.search, searchParams.filter, selectedCategory]);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products; // API filtered
  }, [selectedCategory, products]);

  // Group products by category for section display
  const productsByCategory = useMemo(() => {
    const grouped: { [key: string]: Product[] } = {};
    categories.forEach((cat) => {
      grouped[cat.id] = products.filter((product) =>
        categoryMatchesProduct(product, cat)
      );
    });
    return grouped;
  }, [categories, products]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  const { addItem } = useCart();

  /**
   * Handles adding product to cart with proper cart context integration
   */
  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Find the product by ID
    const product = products.find((p) => p.id === productId);
    if (product && (product.stock_quantity || 0) > 0) {
      addItem({
        product: {
          ...product,
          image_url:
            (product.image_urls && product.image_urls[0]) || product.image_url,
        } as any,
        quantity: 1,
        selectedSize: undefined,
        selectedColor: undefined,
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Shop by Category - simple, single-line scroller */}
      <div className="w-full">
        {/* Section Header */}
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-1">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Discover our collection across different categories
          </p>
        </div>

        {/* Horizontal scroller */}
        <div className="relative">
          <div
            className="flex items-stretch gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-1 px-1 pb-2"
            role="tablist"
            aria-label="Kids categories"
          >
            {/* All */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleCategoryChange("all")}
              role="tab"
              aria-selected={selectedCategory === "all"}
              className={cn(
                "group relative flex-none w-[150px] sm:w-[170px] md:w-[190px] rounded-xl border bg-white text-left",
                "px-4 py-3 transition-all duration-200 hover:bg-gray-50 hover:shadow-md",
                selectedCategory === "all"
                  ? "border-gray-700 ring-2 ring-gray-700/40 shadow"
                  : "border-gray-200"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-14 w-14 rounded-lg overflow-hidden flex items-center justify-center transition-transform bg-gray-50",
                    "group-hover:-translate-y-0.5"
                  )}
                >
                  <Image
                    src="/assets/icon/kids.png"
                    alt="All Products"
                    width={56}
                    height={56}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    All Products
                  </div>
                </div>
              </div>
              {selectedCategory === "all" && (
                <span className="pointer-events-none absolute left-3 right-3 -bottom-[2px] h-0.5 bg-gray-800 rounded-full" />
              )}
            </motion.button>

            {/* Category Items */}
            {displayCategories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleCategoryChange(cat.id)}
                role="tab"
                aria-selected={selectedCategory === cat.id}
                className={cn(
                  "group relative flex-none w-[150px] sm:w-[170px] md:w-[190px] rounded-xl border bg-white text-left",
                  "px-4 py-3 transition-all duration-200 hover:bg-gray-50 hover:shadow-md",
                  selectedCategory === cat.id
                    ? "border-gray-700 ring-2 ring-gray-700/40 shadow"
                    : "border-gray-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-14 w-14 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 transition-transform",
                      "group-hover:-translate-y-0.5"
                    )}
                  >
                    <Image
                      src={cat.icon}
                      alt={cat.name}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {cat.name}
                    </div>
                  </div>
                </div>
                {selectedCategory === cat.id && (
                  <span className="pointer-events-none absolute left-3 right-3 -bottom-[2px] h-0.5 bg-gray-800 rounded-full" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
          {selectedCategory !== "all" && (
            <span className="ml-1">
              in{" "}
              {categories.find((cat) => cat.id === selectedCategory)?.name ||
                "category"}
            </span>
          )}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      )}

      {/* Category Sections or Filtered Products */}
      {!isLoading && (
        <AnimatePresence mode="wait">
          <motion.div
            key={
              selectedCategory === "all" ? "all-products" : "filtered-products"
            }
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {(selectedCategory === "all" ? products : filteredProducts).map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    id: product.id.toString(),
                  }}
                  viewMode="grid"
                  onAddToCart={handleAddToCart}
                />
              )
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* No Results */}
      {!isLoading &&
        filteredProducts.length === 0 &&
        selectedCategory !== "all" && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors duration-200"
            >
              Show All Categories
            </button>
          </div>
        )}
    </div>
  );
}

/**
 * Kids category section component with horizontal scrollable products
 */
interface CategorySectionProps {
  category: CategoryItem;
  products: Product[];
  onAddToCart: (e: React.MouseEvent, productId: string) => void;
}

function CategorySection({
  category,
  products,
  onAddToCart,
}: CategorySectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 rounded-3xl p-6 md:p-8 shadow-sm border border-white/50"
    >
      {/* Playful Background Elements */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute top-4 right-4 w-6 h-6 bg-yellow-300 rounded-full opacity-20 animate-pulse" />
        <div className="absolute bottom-4 left-4 w-4 h-4 bg-blue-300 rounded-full opacity-30" />
        <div
          className="absolute top-1/2 right-8 w-8 h-8 bg-pink-300 rounded-full opacity-25 animate-bounce"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Enhanced Category Header */}
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-3 border-white bg-white shadow-lg">
              <Image
                src={category.icon}
                alt={category.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {category.name}
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                {category.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                  {products.length} products
                </span>
                <span className="text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-medium">
                  ✨ Curated Collection
                </span>
              </div>
            </div>
          </div>
          <Link
            href={`/kids/${category.id}`}
            className="text-purple-500 hover:text-purple-600 font-medium transition-colors duration-200 flex items-center gap-1"
          >
            View All →
          </Link>
        </div>

        {/* Enhanced Product Grid Container */}
        <div className="relative bg-gradient-to-r from-white/60 via-white/80 to-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/80 to-transparent z-10 pointer-events-none rounded-l-2xl" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 to-transparent z-10 pointer-events-none rounded-r-2xl" />

          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth">
            {products.slice(0, 8).map((product) => (
              <motion.div
                key={product.id}
                className="flex-shrink-0 w-72"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard
                  product={{
                    ...product,
                    id: product.id.toString(),
                  }}
                  viewMode="grid"
                  onAddToCart={onAddToCart}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Enhanced kids product card component with playful styling
 */
interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
  onAddToCart: (e: React.MouseEvent, productId: string) => void;
}

function ProductCard({ product, viewMode, onAddToCart }: ProductCardProps) {
  const discount = product.original_price
    ? Math.round(
        ((product.original_price - product.price) / product.original_price) *
          100
      )
    : 0;

  if (viewMode === "list") {
    return (
      <Link href={`/products/${(product as any).slug || product.id}`}>
        <motion.div
          whileHover={{ y: -2 }}
          className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100"
        >
          <div className="flex gap-6">
            {/* Product Image */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={
                  (product.image_urls && product.image_urls[0]) ||
                  product.image_url ||
                  "/placeholder-image.svg"
                }
                alt={product.name}
                fill
                className="object-cover rounded-xl"
              />
              {(product.is_featured || product.featured) && (
                <span className="absolute -top-2 -left-2 bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  ⭐ Featured
                </span>
              )}
              {(!product.stock_quantity || product.stock_quantity === 0) && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-purple-600 transition-colors duration-200">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < 4 // Default 4-star rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  (12) {/* Default review count */}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.original_price)}
                    </span>
                    <span className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-center">
              <button
                onClick={(e) => onAddToCart(e, product.id)}
                disabled={
                  !(product.stock_quantity && product.stock_quantity > 0)
                }
                className={cn(
                  "px-6 py-3 rounded-xl font-medium transition-all duration-200",
                  product.stock_quantity && product.stock_quantity > 0
                    ? "bg-purple-500 text-white hover:bg-purple-600 md:opacity-0 md:group-hover:opacity-100"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                )}
              >
                {product.stock_quantity && product.stock_quantity > 0
                  ? "🛒 Add to Cart"
                  : "Out of Stock"}
              </button>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${(product as any).slug || product.id}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={
              (product.image_urls && product.image_urls[0]) ||
              product.image_url ||
              "/placeholder-image.svg"
            }
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <span className="absolute top-4 left-4 bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-medium z-10">
              ⭐ Featured
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium z-10">
              -{discount}%
            </span>
          )}
          {!(product.stock_quantity && product.stock_quantity > 0) && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 text-lg mb-3 group-hover:text-purple-600 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(4.5)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">(128)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.original_price && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.original_price)}
                </span>
                <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => onAddToCart(e, product.id)}
            disabled={!(product.stock_quantity && product.stock_quantity > 0)}
            className={cn(
              "w-full px-6 py-3 rounded-xl font-medium transition-all duration-200",
              product.stock_quantity && product.stock_quantity > 0
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            {product.stock_quantity && product.stock_quantity > 0
              ? "🛒 Add to Cart"
              : "Out of Stock"}
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
