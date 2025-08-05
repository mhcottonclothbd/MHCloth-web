"use client";

import { motion } from "framer-motion";
import { Package, Percent } from "lucide-react";

// No sale products - all products have been removed
const onSaleProducts = [];

/**
 * On Sale section - Currently showing empty state
 * All products have been removed from the website
 */
export default function OnSale() {
  return (
    <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-4">
            <Percent className="w-6 h-6 text-red-600 mr-2" />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              On Sale
            </h2>
            <Percent className="w-6 h-6 text-red-600 ml-2" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our sale section is currently being updated.
          </p>
        </motion.div>

        {/* Empty State */}
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No Sale Items
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            We're currently updating our sale offerings. Check back soon for amazing deals and discounts!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
