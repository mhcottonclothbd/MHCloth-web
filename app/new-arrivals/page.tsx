import type { Metadata } from "next";
import { Suspense } from "react";
import NewArrivalsClient from "./widget/NewArrivalsClient";

export const metadata: Metadata = {
  title: "New Arrivals - MHCloth | Latest Premium Products",
  description:
    "Discover our newest collection of premium products. Be the first to explore our latest arrivals featuring cutting-edge design and exceptional quality.",
  keywords:
    "new arrivals, latest products, new collection, premium goods, fresh inventory",
};

export default function NewArrivalsPage() {
  return (
    <Suspense fallback={null}>
      <NewArrivalsClient />
    </Suspense>
  );
}
