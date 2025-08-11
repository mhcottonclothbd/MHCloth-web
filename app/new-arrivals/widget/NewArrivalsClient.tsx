"use client";

import { ProductGrid } from "@/components/ProductGrid";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Sparkles, Search as SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function NewArrivalsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");

  const derived = useMemo(() => {
    const sp = new URLSearchParams(searchParams?.toString());
    return {
      category: sp.get("category") || undefined,
      search: sp.get("search") || undefined,
      sort_by: sp.get("sort_by") || "newest",
    } as { category?: string; search?: string; sort_by?: string };
  }, [searchParams]);

  useEffect(() => setSearchTerm(derived.search || ""), [derived.search]);

  const updateUrl = (updates: Record<string, any>) => {
    const sp = new URLSearchParams(searchParams?.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) sp.delete(k);
      else sp.set(k, String(v));
    });
    router.push(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const id = setTimeout(() => {
      if (searchTerm !== (derived.search || "")) updateUrl({ search: searchTerm || undefined });
    }, 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const genderTab = derived.category || "all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center justify-center gap-3 mb-3">
              <Sparkles className="h-6 w-6" />
              <h1 className="text-4xl md:text-5xl font-bold">New Arrivals</h1>
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
              Be the first to discover the latest drops. Fresh styles, added daily.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Controls */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col gap-4">
            <Tabs
              value={genderTab}
              onValueChange={(val) => updateUrl({ category: val === "all" ? undefined : val })}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 w-full md:w-auto md:inline-grid">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="mens">Men's</TabsTrigger>
                <TabsTrigger value="womens">Women's</TabsTrigger>
                <TabsTrigger value="kids">Kids</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="flex-1">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search new arrivals..."
                    className="pl-9"
                  />
                </div>
              </div>

              <Select
                value={derived.sort_by || "newest"}
                onValueChange={(v) => updateUrl({ sort_by: v || "newest" })}
              >
                <SelectTrigger className="min-w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="name_asc">Name: A to Z</SelectItem>
                  <SelectItem value="name_desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Products */}
        <ProductGrid
          filters={{ status: "active", sort_by: derived.sort_by || "newest", category: derived.category, search: derived.search }}
          showWishlist
          showAddToCart
        />
      </div>
    </div>
  );
}


