import { ProductGrid } from "@/components/ProductGrid";
import { fetchProducts } from "@/lib/services/product-service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | MHCloth",
  description:
    "Discover our complete collection of premium clothing with real-time updates",
};

/**
 * Products page with mock data integration
 * Automatically updates when new products are added via admin dashboard
 */
export default async function ProductsPage() {
  const initial = await fetchProducts({
    status: "active",
    limit: 12,
    offset: 0,
  });
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Our Products</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our complete collection of premium clothing.
          </p>
        </div>
        <ProductGrid
          filters={{ status: "active" } as any}
          products={initial.success ? initial.data : []}
          autoLoad={!initial.success}
        />
      </div>
    </div>
  );
}
