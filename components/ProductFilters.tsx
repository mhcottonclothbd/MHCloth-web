"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import {
  getProductBrands,
  getProductCategories,
  getProductColors,
  getProductPriceBounds,
  getProductSizes,
} from "@/lib/services/product-service";

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  price_min?: number;
  price_max?: number;
  brand?: string;
  size?: string[];
  color?: string[];
  is_on_sale?: boolean;
  is_featured?: boolean;
  sort_by?: string;
  search?: string;
}

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
}

export function ProductFilters({
  filters,
  onFiltersChange,
}: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [brandOptions, setBrandOptions] = useState<string[]>([]);
  const [sizeOptions, setSizeOptions] = useState<string[]>([]);
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [priceBounds, setPriceBounds] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });

  // Initialize dynamic facets
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [cats, brands, sizes, colors, bounds] = await Promise.all([
          getProductCategories(),
          getProductBrands(),
          getProductSizes(),
          getProductColors(),
          getProductPriceBounds(),
        ]);
        if (!isMounted) return;
        setCategoryOptions(cats);
        setBrandOptions(brands);
        setSizeOptions(sizes);
        setColorOptions(colors);
        setPriceBounds(bounds);
        // Normalize existing price filters to bounds
        setLocalFilters((prev) => ({
          ...prev,
          price_min: prev.price_min ?? bounds.min,
          price_max: prev.price_max ?? bounds.max,
        }));
      } finally {
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    // Map sentinel values to undefined for cleaner URLs and queries
    const normalizedValue = value === "all" || value === "default" ? undefined : value;
    const newFilters = { ...localFilters, [key]: normalizedValue };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: ProductFilters = {
      price_min: priceBounds.min,
      price_max: priceBounds.max,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {/* <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FilterIcon className="w-5 h-5" />
            Filters
          </h3> */}
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-3">
          <Label>Category</Label>
          <Select
            value={localFilters.category || ""}
            onValueChange={(value) => updateFilter("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Brand Filter */}
        <div className="space-y-3">
          <Label>Brand</Label>
          <Select
            value={localFilters.brand || ""}
            onValueChange={(value) => updateFilter("brand", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brandOptions.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-3">
          <Label>Price Range</Label>
          <div className="space-y-2">
            <Slider
              value={[
                localFilters.price_min ?? priceBounds.min,
                localFilters.price_max ?? priceBounds.max,
              ]}
              onValueChange={([min, max]) => {
                updateFilter("price_min", min);
                updateFilter("price_max", max);
              }}
              min={priceBounds.min}
              max={Math.max(priceBounds.max, priceBounds.min)}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{`৳${new Intl.NumberFormat('en-US').format(localFilters.price_min ?? priceBounds.min)}`}</span>
              <span>{`৳${new Intl.NumberFormat('en-US').format(localFilters.price_max ?? priceBounds.max)}`}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Size Filter */}
        <div className="space-y-3">
          <Label>Sizes</Label>
          <div className="grid grid-cols-2 gap-2">
            {sizeOptions.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={localFilters.size?.includes(size) || false}
                  onCheckedChange={(checked) => {
                    const currentSizes = localFilters.size || [];
                    const newSizes = checked
                      ? [...currentSizes, size]
                      : currentSizes.filter((s) => s !== size);
                    updateFilter("size", newSizes);
                  }}
                />
                <Label htmlFor={`size-${size}`} className="text-sm">
                  {size}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Color Filter */}
        <div className="space-y-3">
          <Label>Colors</Label>
          <div className="grid grid-cols-2 gap-2">
            {colorOptions.map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${color}`}
                  checked={localFilters.color?.includes(color) || false}
                  onCheckedChange={(checked) => {
                    const currentColors = localFilters.color || [];
                    const newColors = checked
                      ? [...currentColors, color]
                      : currentColors.filter((c) => c !== color);
                    updateFilter("color", newColors);
                  }}
                />
                <Label htmlFor={`color-${color}`} className="text-sm">
                  {color}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Special Filters */}
        <div className="space-y-3">
          <Label>Special</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="on-sale"
                checked={localFilters.is_on_sale || false}
                onCheckedChange={(checked) =>
                  updateFilter("is_on_sale", checked)
                }
              />
              <Label htmlFor="on-sale" className="text-sm">
                On Sale
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={localFilters.is_featured || false}
                onCheckedChange={(checked) =>
                  updateFilter("is_featured", checked)
                }
              />
              <Label htmlFor="featured" className="text-sm">
                Featured
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Sort By */}
        <div className="space-y-3">
          <Label>Sort By</Label>
          <Select
            value={localFilters.sort_by || ""}
            onValueChange={(value) => updateFilter("sort_by", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="name_asc">Name: A to Z</SelectItem>
              <SelectItem value="name_desc">Name: Z to A</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
