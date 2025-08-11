"use client";

import { SectionErrorBoundary } from "@/components/ErrorBoundary";
import { ProductGrid } from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewArrivals() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-emerald-600" />
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Sparkles className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fresh drops you’ll love. Updated frequently.
          </p>
        </motion.div>

        <SectionErrorBoundary
          title="New Arrivals Unavailable"
          description="We couldn't load the latest products right now. Please try again shortly."
        >
          <ProductGrid
            filters={{ status: "active", sort_by: "newest" }}
            showWishlist
            showAddToCart
            autoLoad
            className="mb-8"
          />
        </SectionErrorBoundary>

        <div className="text-center">
          <Link href="/new-arrivals">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              View all New Arrivals
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
