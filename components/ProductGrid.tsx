"use client";

import { ProductCard, type Product } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchProducts, type ProductFilters } from "@/lib/services/product-service";

interface ProductGridProps {
  filters?: ProductFilters;
  showWishlist?: boolean;
  showAddToCart?: boolean;
  className?: string;
  autoLoad?: boolean;
  products?: Product[];
  loading?: boolean;
  error?: string;
  onProductsChange?: (products: Product[]) => void;
}

export function ProductGrid({
  filters = {},
  showWishlist = true,
  showAddToCart = true,
  className = "",
  autoLoad = true,
  products: initialProducts,
  loading: externalLoading,
  error: externalError,
  onProductsChange,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState<string | null>(externalError || null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const isLoading = externalLoading !== undefined ? externalLoading : loading;

  const loadProducts = async (pageNum: number = 0, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchProducts({
        ...filters,
        limit: 12,
        offset: pageNum * 12,
      });

      if (result.success) {
        if (append) {
          setProducts(prev => [...prev, ...result.data]);
        } else {
          setProducts(result.data);
        }
        setHasMore(result.data.length === 12);
        setPage(pageNum);
        onProductsChange?.(append ? [...products, ...result.data] : result.data);
      } else {
        setError(result.error || "Failed to load products");
      }
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      loadProducts(page + 1, true);
    }
  };

  const refresh = () => {
    loadProducts(0, false);
  };

  // Load products on mount if autoLoad is true
  useEffect(() => {
    if (autoLoad && !initialProducts) {
      loadProducts(0, false);
    }
  }, [autoLoad, initialProducts]);

  // Update products when external products change
  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts);
    }
  }, [initialProducts]);

  // Update error when external error changes
  useEffect(() => {
    if (externalError !== undefined) {
      setError(externalError);
    }
  }, [externalError]);

  // Reload when filters change
  useEffect(() => {
    if (autoLoad) {
      loadProducts(0, false);
    }
  }, [filters]);

  if (error && !isLoading) {
    return (
      <Card className="p-8">
        <CardContent className="text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load products</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refresh} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0 && !isLoading) {
    return (
      <Card className="p-8">
        <CardContent className="text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or check back later.
          </p>
          <Button onClick={refresh} variant="outline">
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showWishlist={showWishlist}
            showAddToCart={showAddToCart}
          />
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading products...</span>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !isLoading && products.length > 0 && (
        <div className="flex justify-center">
          <Button onClick={loadMore} variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      )}

      {/* End of Results */}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-4">
          <p className="text-muted-foreground">
            You've reached the end of the products.
          </p>
        </div>
      )}
    </div>
  );
} 