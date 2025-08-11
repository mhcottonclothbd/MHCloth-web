import SectionHero from "@/components/SectionHero";
import { getCategoriesByGender } from "@/lib/services/categories";
import { Metadata } from "next";
import ProductGridWithDropdown from "./widget/ProductGridWithDropdown";

export const metadata: Metadata = {
  title: "Men's Collection - MHCloth | Premium Men's Products",
  description:
    "Explore our curated men's collection featuring premium clothing, accessories, and lifestyle products designed for the modern gentleman.",
  keywords:
    "men's fashion, men's accessories, men's clothing, premium men's products, gentleman's collection",
};

interface MensPageProps {
  searchParams: Promise<{
    search?: string;
    sort?: string;
    filter?: string;
    category?: string;
  }>;
}

/**
 * Men's category page with product grid and category filtering
 */
export const dynamic = "force-dynamic";

export default async function MensPage({ searchParams }: MensPageProps) {
  const resolvedSearchParams = await searchParams;
  const categories = await getCategoriesByGender("mens");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <SectionHero
        eyebrow="For the modern gentleman"
        title="Men's Collection"
        subtitle="Premium pieces, built to last and made to be worn."
        imageSrc="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop"
        primaryCta={{ label: "Shop Mens", href: "/mens" }}
        secondaryCta={{ label: "New Arrivals", href: "/new-arrivals" }}
        overlayClassName="bg-gradient-to-t from-black/60 via-black/35 to-black/20"
      />

      {/* Product Grid with Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGridWithDropdown
          searchParams={resolvedSearchParams}
          categories={categories}
          category="mens"
          title="Men's Collection"
        />
      </div>
    </div>
  );
}
