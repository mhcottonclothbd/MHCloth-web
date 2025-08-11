"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

const ProductManagement = dynamic(
  () =>
    import("../../components/ProductManagement").then(
      (m) => m.ProductManagement
    ),
  { ssr: false }
);

export default function NewProductPage() {
  // Use ProductManagement with open dialog by default
  const [key] = useState(() => Math.random());
  return (
    <div className="p-6">
      {/* ProductManagement already includes add product modal */}
      <ProductManagement key={key} />
    </div>
  );
}
