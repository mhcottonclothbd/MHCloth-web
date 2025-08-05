import { ProductDisplay } from "@/app/components/ProductDisplay";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | MHCloth",
  description: "Discover our complete collection of premium clothing with real-time updates",
};

/**
 * Products page with mock data integration
 * Automatically updates when new products are added via admin dashboard
 */
export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Our Products
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our complete collection of premium clothing. 
            New products appear instantly when added by our team.
          </p>
        </div>

        {/* Real-time Product Display */}
        <ProductDisplay
          showFilters={true}
          gridCols={4}
          showPagination={true}
        />
      </div>
    </div>
  );
}