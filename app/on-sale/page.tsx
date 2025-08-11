import type { Metadata } from "next";
import { Suspense } from "react";
import OnSaleClient from "./widget/OnSaleClient";

export const metadata: Metadata = {
  title: "On Sale - MHCloth | Premium Products at Great Prices",
  description:
    "Discover amazing deals on our premium product collection. Shop high-quality items at discounted prices for a limited time.",
  keywords:
    "sale, discounts, deals, premium products, special offers, clearance",
};

interface OnSalePageProps {
  searchParams: Promise<{
    search?: string;
    sort?: string;
    filter?: string;
  }>;
}

/**
 * On Sale page - Currently showing empty state
 * All sale products have been removed from the website
 */
export default async function OnSalePage() {
  return (
    <Suspense fallback={null}>
      <OnSaleClient />
    </Suspense>
  );
}
