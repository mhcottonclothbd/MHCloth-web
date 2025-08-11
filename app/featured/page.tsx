import type { Metadata } from "next";
import { Suspense } from "react";
import FeaturedClient from "./widget/FeaturedClient";

export const metadata: Metadata = {
  title: "Featured Products - MHCloth",
  description:
    "Explore all featured products handpicked for quality and style.",
};

export default function FeaturedPage() {
  return (
    <Suspense fallback={null}>
      <FeaturedClient />
    </Suspense>
  );
}
