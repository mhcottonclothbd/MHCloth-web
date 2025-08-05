"use client";

import { motion } from "framer-motion";
import { FeaturedProducts as RealTimeFeaturedProducts } from "@/app/components/ProductDisplay";

/**
 * Featured products section with mock data integration
 * Automatically updates when new featured products are added via admin dashboard
 */
export default function FeaturedProducts() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium clothing. New products appear instantly when added by our team.
          </p>
        </motion.div>

        {/* Real-time Featured Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <RealTimeFeaturedProducts />
        </motion.div>
      </div>
    </section>
  );
}
