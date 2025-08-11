"use client";

import { CategoryItem } from "@/data/categories";
import { useCart } from "@/lib/cart-context";
import { handleApiError, isApiError, productApi } from "@/lib/services/api";
import { cn, formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
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
 * Modern product grid component with horizontal scrollable category filter
 * Features responsive design, smooth animations, and category-based product sections
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
  const [error, setError] = useState<string | null>(null);

  // Show only the requested Men's categories and skip ones without icons
  const allowedMensSlugs = useMemo(
    () =>
      new Set([
        "t-shirts",
        "polo",
        "polo-shirts",
        "shirts-formal-casual",
        "hoodies-sweatshirts",
        "hoodies-and-sweatshirts",
        "jackets-coats",
        "jackets",
        "coats",
        "jeans",
        "trousers",
        "cargo-pants",
        "joggers",
        "shorts",
        "sweaters-cardigans",
        "sweaters-and-cardigans",
        "blazers-suits",
        "blazers-and-suits",
        "undergarments",
      ]),
    []
  );

  const displayCategories = useMemo(() => {
    return (categories || []).filter((cat) => {
      const slug = ((cat as any).slug || cat.id || "").toString().toLowerCase();
      const hasIcon = !!cat.icon && !cat.icon.includes("placeholder-image");
      return allowedMensSlugs.has(slug) && hasIcon;
    });
  }, [categories, allowedMensSlugs]);

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
      setIsLoading(true);
      setError(null);

      try {
        const response = await productApi.getProducts({
          gender: category as "mens" | "womens" | "kids",
          limit: 50,
          search: searchParams.search,
          category_slug:
            selectedCategory !== "all" ? selectedCategory : undefined,
        });

        if (isApiError(response)) {
          setError(handleApiError(response));
          return;
        }

        setProducts(response.data || []);
      } catch (err) {
        setError("Failed to fetch products");
        console.error("Product fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchParams.search, selectedCategory]);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }
    // Products API already filtered by category_slug if provided
    return products;
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
            product.image_url ||
            product.image_urls?.[0] ||
            "/placeholder-image.svg",
        } as any,
        quantity: 1,
        selectedSize: undefined,
        selectedColor: undefined,
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Shop by Category - simple, single-line scroller */}
      <div className="w-full">
        {/* Section Header */}
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-1">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Browse categories and quickly filter the products
          </p>
        </div>

        {/* Horizontal scroller */}
        <div className="relative">
          <div
            className="flex items-stretch gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-1 px-1 pb-2"
            role="tablist"
            aria-label="Mens categories"
          >
            {/* All Categories */}
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
                    "h-14 w-14 rounded-lg overflow-hidden flex items-center justify-center transition-transform will-change-transform bg-gray-50",
                    "group-hover:-translate-y-0.5"
                  )}
                >
                  <Image
                    src="/assets/icon/mens.png"
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
                      "h-14 w-14 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 transition-transform will-change-transform",
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200"
            >
              Show All Categories
            </button>
          </div>
        )}
    </div>
  );
}

/**
 * Category section component with horizontal scrollable products
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
    <div className="space-y-6">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 bg-white">
            <Image
              src={category.icon}
              alt={category.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {category.name}
            </h3>
            <p className="text-gray-600">{category.description}</p>
          </div>
        </div>
        <Link
          href={`/mens/${category.id}`}
          className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
        >
          View All →
        </Link>
      </div>

      {/* Horizontal Scrollable Products */}
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth">
          {products.slice(0, 8).map((product) => (
            <div key={product.id} className="flex-shrink-0 w-72">
              <ProductCard
                product={{
                  ...product,
                  id: product.id.toString(),
                }}
                viewMode="grid"
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Enhanced product card component
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
                  product.image_url ||
                  product.image_urls?.[0] ||
                  "/placeholder-image.svg"
                }
                alt={product.name}
                fill
                className="object-cover rounded-xl"
              />
              {product.is_featured && (
                <span className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Featured
                </span>
              )}
              {(product.stock_quantity || 0) <= 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors duration-200">
                {product.name}
              </h3>
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
                disabled={(product.stock_quantity || 0) <= 0}
                className={cn(
                  "px-6 py-3 rounded-xl font-medium transition-all duration-200",
                  (product.stock_quantity || 0) > 0
                    ? "bg-blue-500 text-white hover:bg-blue-600 md:opacity-0 md:group-hover:opacity-100"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                )}
              >
                {(product.stock_quantity || 0) > 0
                  ? "Add to Cart"
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
        whileHover={{ y: -8 }}
        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={
              product.image_url ||
              product.image_urls?.[0] ||
              "/placeholder-image.svg"
            }
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.is_featured && (
            <span className="absolute top-4 left-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium z-10">
              Featured
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium z-10">
              -{discount}%
            </span>
          )}
          {(product.stock_quantity || 0) <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 text-lg mb-3 group-hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </h3>

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
            disabled={(product.stock_quantity || 0) <= 0}
            className={cn(
              "w-full py-3 px-4 rounded-xl font-medium transition-all duration-200",
              (product.stock_quantity || 0) > 0
                ? "bg-blue-500 text-white hover:bg-blue-600 md:opacity-0 md:group-hover:opacity-100"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            {(product.stock_quantity || 0) > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
