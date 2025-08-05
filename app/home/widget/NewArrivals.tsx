"use client";

import { motion } from "framer-motion";
import { Package, Sparkles } from "lucide-react";

// No new arrivals - all products have been removed
const newArrivals = [];

/**
 * New Arrivals section - Currently showing empty state
 * All products have been removed from the website
 */
export default function NewArrivals() {
  return (
    <section className="py-20 bg-white">
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
            <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              New Arrivals
            </h2>
            <Sparkles className="w-6 h-6 text-blue-600 ml-2" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our new arrivals section is currently being updated.
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
            No New Arrivals
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            We're currently updating our inventory. Stay tuned for exciting new products coming soon!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
