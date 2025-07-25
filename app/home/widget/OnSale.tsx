"use client";

import Button from "@/components/Button";
import { Card, CardContent } from "@/components/Card";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Percent, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Updated with real product IDs from andsons-products.ts
const onSaleProducts = [
  {
    id: "andsons-sale-1",
    name: "Vintage Denim Jacket",
    originalPrice: 15999,
    salePrice: 11999,
    discount: 25,
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop&q=80",
    onSale: true,
  },
  {
    id: "andsons-sale-2",
    name: "Workwear Chambray Shirt",
    originalPrice: 8999,
    salePrice: 5399,
    discount: 40,
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop&q=80",
    onSale: true,
  },
  {
    id: "andsons-sale-3",
    name: "Vintage Leather Belt",
    originalPrice: 4599,
    salePrice: 3219,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop&q=80",
    onSale: true,
  },
  {
    id: "andsons-acc-3",
    name: "Canvas Tote Bag",
    originalPrice: 3500,
    salePrice: 2100,
    discount: 40,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&q=80",
    onSale: true,
  },
];

/**
 * On Sale section showcasing discounted products
 * Features animated cards with sale badges and crossed-out original prices
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
            <Tag className="w-6 h-6 text-red-600 mr-2" />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              On Sale
            </h2>
            <Percent className="w-6 h-6 text-red-600 ml-2" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these amazing deals! Limited time offers on
            selected premium items.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {onSaleProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/shop/${product.id}`} className="block">
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden relative cursor-pointer">
                  {/* Sale Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                      -{product.discount}%
                    </span>
                  </div>

                  <div className="relative overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={500}
                      height={400}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-red-600">
                          {formatPrice(product.salePrice)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="md:opacity-0 md:group-hover:opacity-100 transition-opacity border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/shop/${product.id}`;
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link href="/shop?filter=sale">
            <Button
              size="lg"
              className="group bg-red-600 hover:bg-red-700 text-white"
            >
              Shop All Sale Items
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
