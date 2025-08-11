import SectionHero from "@/components/SectionHero";
import { getCategoriesByGender } from "@/lib/services/categories";
import { Metadata } from "next";
import ProductGridWithDropdown from "./widget/ProductGridWithDropdown";

export const metadata: Metadata = {
  title: "Kids Collection - MHCloth | Premium Children's Products",
  description:
    "Explore our delightful kids collection featuring premium clothing, accessories, and lifestyle products designed for children.",
  keywords:
    "kids fashion, children's clothing, kids accessories, premium children's products, kids collection",
};

interface KidsPageProps {
  searchParams: Promise<{
    search?: string;
    sort?: string;
    filter?: string;
    category?: string;
  }>;
}

/**
 * Kids category page with product grid and category filtering
 */
export const dynamic = "force-dynamic";

export default async function KidsPage({ searchParams }: KidsPageProps) {
  const resolvedSearchParams = await searchParams;
  const categories = await getCategoriesByGender("kids");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <SectionHero
        eyebrow="Fun and comfortable"
        title="Kids Collection"
        subtitle="Playful pieces built for movement and comfort."
        imageSrc="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&auto=format&fit=crop"
        primaryCta={{ label: "Shop Kids", href: "/kids" }}
        secondaryCta={{ label: "New In", href: "/new-arrivals" }}
        overlayClassName="bg-gradient-to-t from-black/60 via-black/35 to-black/20"
      />

      {/* Product Grid with Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGridWithDropdown
          searchParams={resolvedSearchParams}
          categories={categories}
          category="kids"
          title="Kids Collection"
        />
      </div>
    </div>
  );
}
