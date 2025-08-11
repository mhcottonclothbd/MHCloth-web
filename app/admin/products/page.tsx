import { Metadata } from "next";
import { ProductManagement } from "../components/ProductManagement";

export const metadata: Metadata = {
  title: "Admin Products - MHCloth",
};

export default function AdminProductsPage() {
  return (
    <div className="p-6">
      <ProductManagement />
    </div>
  );
}
