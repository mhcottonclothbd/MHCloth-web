import SectionHero from "@/components/SectionHero";
import { getCategoriesByGender } from "@/lib/services/categories";
import { Metadata } from "next";
import ProductGridWithDropdown from "./widget/ProductGridWithDropdown";

export const metadata: Metadata = {
  title: "Women's Collection - MHCloth | Premium Women's Products",
  description:
    "Discover our elegant women's collection featuring premium clothing, accessories, and lifestyle products designed for the modern woman.",
  keywords:
    "women's fashion, women's accessories, women's clothing, premium women's products, elegant collection",
};

interface WomensPageProps {
  searchParams: Promise<{
    search?: string;
    sort?: string;
    filter?: string;
    category?: string;
  }>;
}

/**
 * Women's category page with product grid and category filtering
 */
export const dynamic = "force-dynamic";

export default async function WomensPage({ searchParams }: WomensPageProps) {
  const resolvedSearchParams = await searchParams;
  const categories = await getCategoriesByGender("womens");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <SectionHero
        eyebrow="Elegance redefined"
        title="Women's Collection"
        subtitle="Thoughtfully curated styles for everyday and special moments."
        imageSrc="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&auto=format&fit=crop"
        primaryCta={{ label: "Shop Womens", href: "/womens" }}
        secondaryCta={{ label: "Bestsellers", href: "/on-sale" }}
        overlayClassName="bg-gradient-to-t from-black/60 via-black/35 to-black/20"
      />

      {/* Product Grid with Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGridWithDropdown
          searchParams={resolvedSearchParams}
          categories={categories}
          category="womens"
          title="Women's Collection"
        />
      </div>
    </div>
  );
}
