"use client";

import Button from "@/components/Button";
import { Card, CardContent, CardHeader } from "@/components/Card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface ProductFiltersProps {
  selectedCategory?: string;
  selectedFilter?: string;
  filtersData?: any;
  onFiltersChange?: (filters: any) => void;
}

// Dynamic data - these should be fetched from API or passed as props
const getFilters = () => [
  { id: "all", name: "All Items" },
  { id: "mens", name: "Mens" },
  { id: "womens", name: "Womens" },
  { id: "kids", name: "Kids" },
  { id: "featured", name: "Featured Products" },
  { id: "new-arrivals", name: "New Arrivals" },
  { id: "on-sale", name: "On Sale" },
];

/**
 * Product filters sidebar component
 * Handles availability filtering only
 */
function ProductFiltersInner({
  selectedCategory,
  selectedFilter,
  filtersData,
  onFiltersChange,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get data from functions
  const filters = getFilters();

  /**
   * Updates URL search parameters when filter changes
   */
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/shop?${params.toString()}`);
  };

  /**
   * Clears all active filters
   */
  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("filter");

    router.push(`/shop?${params.toString()}`);
  };

  const hasActiveFilters = selectedFilter || searchParams.get("filter");

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Availability */}
      <Card>
        <CardHeader>
          <h3 className="font-medium text-gray-900">Availability</h3>
        </CardHeader>
        <CardContent className="space-y-2">
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => updateFilter("filter", filter.id)}
              className={cn(
                "w-full flex items-center p-2 rounded-md text-left transition-colors",
                selectedFilter === filter.id ||
                  (!selectedFilter && filter.id === "all")
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "hover:bg-gray-50 text-gray-700"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm font-medium">{filter.name}</span>
            </motion.button>
          ))}
        </CardContent>
      </Card>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Active Filters
            </h4>
            <div className="space-y-1">
              {selectedFilter && selectedFilter !== "all" && (
                <div className="flex items-center justify-between text-sm text-blue-700">
                  <span>
                    Filter: {filters.find((f) => f.id === selectedFilter)?.name}
                  </span>
                  <button
                    onClick={() => updateFilter("filter", "all")}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function ProductFilters(props: ProductFiltersProps) {
  return (
    <Suspense fallback={null}>
      <ProductFiltersInner {...props} />
    </Suspense>
  );
}
