"use client";

import { ProductGrid } from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="h-6 w-6 text-yellow-500 fill-current" />
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Star className="h-6 w-6 text-yellow-500 fill-current" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked collection of premium products that combine 
            exceptional quality with timeless design.
          </p>
        </div>

        <ProductGrid
          filters={{ is_featured: true }}
          showWishlist={true}
          showAddToCart={true}
          autoLoad={true}
          className="mb-8"
        />

        <div className="text-center">
          <Link href="/featured">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              View All Featured Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
