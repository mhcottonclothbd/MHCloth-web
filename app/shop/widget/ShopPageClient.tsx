"use client";

import {
  ProductFilters as FiltersSidebar,
  type ProductFilters as FiltersType,
} from "@/components/ProductFilters";
import { ProductGrid } from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Filter, Search as SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BreadcrumbNavigation from "../widget/BreadcrumbNavigation";

export default function ShopPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FiltersType>({});
  const [searchTerm, setSearchTerm] = useState("");

  const derivedFilters = useMemo<FiltersType>(() => {
    const sp = new URLSearchParams(searchParams?.toString());
    const parseList = (value: string | null) =>
      value
        ? value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
        : undefined;
    return {
      category: sp.get("category") || undefined,
      brand: sp.get("brand") || undefined,
      sort_by: sp.get("sort_by") || undefined,
      search: sp.get("search") || undefined,
      price_min: sp.get("price_min") ? Number(sp.get("price_min")) : undefined,
      price_max: sp.get("price_max") ? Number(sp.get("price_max")) : undefined,
      size: parseList(sp.get("size")),
      color: parseList(sp.get("color")),
      is_on_sale: sp.get("is_on_sale") === "true" ? true : undefined,
      is_featured: sp.get("is_featured") === "true" ? true : undefined,
    };
  }, [searchParams]);

  useEffect(() => {
    setFilters(derivedFilters);
    setSearchTerm(derivedFilters.search || "");
  }, [derivedFilters]);

  const updateUrl = (updates: Partial<FiltersType>) => {
    const sp = new URLSearchParams(searchParams?.toString());
    const setParam = (key: string, value: any) => {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        sp.delete(key);
      } else {
        sp.set(key, Array.isArray(value) ? value.join(",") : String(value));
      }
    };

    Object.entries(updates).forEach(([k, v]) => setParam(k, v as any));
    sp.delete("offset");
    router.push(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  const onFiltersChange = (next: FiltersType) => {
    setFilters(next);
    updateUrl(next);
  };

  useEffect(() => {
    const id = setTimeout(() => {
      if (searchTerm !== (filters.search || "")) {
        updateUrl({ search: searchTerm || undefined });
      }
    }, 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const genderTab = filters.category || "all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 backdrop-blur-3xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <BreadcrumbNavigation />

          <motion.div
            className="mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col gap-4 md:gap-6">
              <Tabs
                value={genderTab}
                onValueChange={(val) =>
                  updateUrl({
                    category: val === "all" ? undefined : (val as any),
                  })
                }
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 w-full md:w-auto md:inline-grid">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="mens">Men's</TabsTrigger>
                  <TabsTrigger value="womens">Women's</TabsTrigger>
                  <TabsTrigger value="kids">Kids</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search products..."
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Select
                    value={filters.sort_by || "default"}
                    onValueChange={(v) =>
                      updateUrl({ sort_by: v === "default" ? undefined : v })
                    }
                  >
                    <SelectTrigger className="min-w-[160px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price_asc">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc">Price: High to Low</SelectItem>
                      <SelectItem value="name_asc">Name: A to Z</SelectItem>
                      <SelectItem value="name_desc">Name: Z to A</SelectItem>
                    </SelectContent>
                  </Select>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="md:hidden">
                        <Filter className="h-4 w-4 mr-2" /> Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[90vw] sm:w-[420px]">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FiltersSidebar
                          filters={filters}
                          onFiltersChange={onFiltersChange}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            <motion.aside
              className="hidden lg:block lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="sticky top-6 space-y-6">
                <FiltersSidebar
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                />
              </div>
            </motion.aside>

            <motion.section
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductGrid
                filters={{ status: "active", ...filters } as any}
                showWishlist
                showAddToCart
                className="mt-2"
              />
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}


