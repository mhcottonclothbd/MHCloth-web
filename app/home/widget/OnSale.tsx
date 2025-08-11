"use client";

import { ProductGrid } from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import Link from "next/link";

export default function OnSale() {
  return (
    <section className="py-16 bg-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Tag className="h-6 w-6 text-red-500" />
            <h2 className="text-3xl font-bold text-red-900">On Sale</h2>
            <Tag className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-lg text-red-700 max-w-2xl mx-auto">
            Don't miss out on these amazing deals! Limited time offers on premium products.
          </p>
          <Badge className="mt-4 bg-red-500 text-white">
            Up to 70% Off
          </Badge>
        </div>

        <ProductGrid
          filters={{ is_on_sale: true }}
          showWishlist={true}
          showAddToCart={true}
          autoLoad={true}
          className="mb-8"
        />

        <div className="text-center">
          <Link href="/on-sale">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              View All Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
