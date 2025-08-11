"use client";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ProductManagement = dynamic(
  () =>
    import("../../components/ProductManagement").then(
      (m) => m.ProductManagement
    ),
  { ssr: false }
);

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    setSelected(params?.id || null);
  }, [params]);
  return (
    <div className="p-6">
      <ProductManagement />
    </div>
  );
}
