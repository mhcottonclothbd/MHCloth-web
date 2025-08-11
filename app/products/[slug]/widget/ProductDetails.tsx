"use client";

import Button from "@/components/Button";
import { Card, CardContent } from "@/components/Card";
import { useCart } from "@/lib/cart-context";
import { cn, formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface ProductDetailsProps {
  product: any;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const images: string[] = useMemo(
    () =>
      Array.isArray(product?.image_urls)
        ? product.image_urls.filter(Boolean)
        : product?.image_url
        ? [product.image_url]
        : ["/placeholder-image.jpg"],
    [product]
  );

  const sizes: string[] = Array.isArray(product?.sizes) ? product.sizes : [];
  const colors: string[] = Array.isArray(product?.colors) ? product.colors : [];

  const hasStock = (product?.stock_quantity ?? product?.stock ?? 0) > 0;

  const handleAddToCart = () => {
    if (!hasStock) return;
    addItem({
      product: {
        ...product,
        image_url: images[0],
      },
      quantity,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined,
    });
    // Meta Pixel: AddToCart event
    try {
      const priceToSend =
        product?.sale_price &&
        product.sale_price > 0 &&
        product.sale_price < product.price
          ? product.sale_price
          : product.price;
      (window as any)?.fbq?.("track", "AddToCart", {
        content_ids: [product?.id],
        content_name: product?.name,
        content_type: "product",
        value: priceToSend,
        currency: "BDT",
      });
    } catch {}
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
    setShowCheckout(true);
  };

  useEffect(() => {
    if (sizes.length > 0 && !selectedSize) setSelectedSize(sizes[0]);
    if (colors.length > 0 && !selectedColor) setSelectedColor(colors[0]);
  }, [sizes, colors]);

  const currentPrice =
    product?.sale_price &&
    product.sale_price > 0 &&
    product.sale_price < product.price
      ? product.sale_price
      : product.price;
  const originalPrice =
    product?.sale_price && product.sale_price < product.price
      ? product.price
      : null;

  // Meta Pixel: ViewContent event
  useEffect(() => {
    try {
      const priceToSend =
        product?.sale_price &&
        product.sale_price > 0 &&
        product.sale_price < product.price
          ? product.sale_price
          : product.price;
      (window as any)?.fbq?.("track", "ViewContent", {
        content_ids: [product?.id],
        content_name: product?.name,
        content_type: "product",
        value: priceToSend,
        currency: "BDT",
      });
    } catch {}
  }, [product]);

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
          {product?.name}
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl font-bold text-gray-900">
            {formatPrice(currentPrice)}
          </span>
          {originalPrice && (
            <span className="text-sm sm:text-base text-gray-500 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
          {product?.is_on_sale && (
            <span className="text-xs sm:text-sm bg-red-500 text-white px-2 py-1 rounded-full">
              On Sale
            </span>
          )}
        </div>
      </motion.div>

      {product?.description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-gray-600 leading-relaxed"
        >
          {product.description}
        </motion.p>
      )}

      {/* Size Selector */}
      {sizes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="space-y-2"
        >
          <div className="text-sm font-medium">Size</div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "px-3 py-2 border rounded-md text-sm font-medium transition-colors",
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Color Selector */}
      {colors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-2"
        >
          <div className="text-sm font-medium">Color</div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "px-3 py-2 border rounded-md text-sm font-medium transition-colors",
                  selectedColor === color
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                )}
                aria-label={`Select ${color}`}
              >
                {color}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quantity + Add to Bag */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-md overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-gray-700 hover:bg-gray-50"
            >
              -
            </button>
            <span className="px-4 py-2 min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-2 text-gray-700 hover:bg-gray-50"
            >
              +
            </button>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!hasStock}
            className={cn(
              "flex-1 sm:flex-none sm:min-w-[200px] inline-flex items-center justify-center gap-2",
              justAdded && "animate-pulse"
            )}
          >
            <ShoppingBag className="w-5 h-5" />
            {hasStock ? "Add to Bag" : "Out of Stock"}
          </Button>
          {justAdded && (
            <span className="inline-flex items-center text-green-600 text-sm">
              <Check className="w-4 h-4 mr-1" /> Added
            </span>
          )}
        </div>
        <div className="text-sm text-gray-600">
          {(product?.stock_quantity ?? product?.stock ?? 0) > 0
            ? `${product?.stock_quantity ?? product?.stock} in stock`
            : "Out of stock"}
        </div>
      </motion.div>

      {/* Details Card (brand, gender, tags) */}
      <Card className="border-gray-200">
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
          {product?.brand && (
            <div>
              <span className="text-gray-500">Brand: </span>
              {product.brand}
            </div>
          )}
          {product?.gender && (
            <div>
              <span className="text-gray-500">Gender: </span>
              {product.gender}
            </div>
          )}
          {product?.category && (
            <div>
              <span className="text-gray-500">Category: </span>
              {product.category}
            </div>
          )}
          {Array.isArray(product?.tags) && product.tags.length > 0 && (
            <div className="sm:col-span-2">
              <span className="text-gray-500">Tags: </span>
              {product.tags.join(", ")}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Checkout popup */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowCheckout(false)}
          />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="relative z-10 w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-5"
          >
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">Added to bag</h3>
              <p className="text-sm text-gray-600">{product?.name}</p>
              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1"
                  onClick={() => (window.location.href = "/checkout")}
                >
                  Checkout
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCheckout(false)}
                >
                  Continue shopping
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
