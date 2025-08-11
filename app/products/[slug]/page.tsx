import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import ProductDetails from "./widget/ProductDetails";
import ProductGallery from "./widget/ProductGallery";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      slug
    );

  const base = supabase.from("products").select("*").eq("status", "active");
  const { data: product } = isUuid
    ? await base.eq("id", slug).maybeSingle()
    : await base.eq("slug", slug).maybeSingle();

  if (!product) {
    return { title: "Product not found - MHCloth" };
  }

  const title = `${product.name} | MHCloth`;
  const description =
    product.description?.slice(0, 160) ||
    "Premium product available at MHCloth.";
  const image =
    (Array.isArray(product.image_urls) && product.image_urls[0]) ||
    product.image_url ||
    "/placeholder-image.svg";
  const url = `${
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  }/products/${product.slug || product.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "website",
      url,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Treat the dynamic segment as either slug or UUID id
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      slug
    );

  const base = supabase.from("products").select("*").eq("status", "active");
  const { data: product, error } = isUuid
    ? await base.eq("id", slug).maybeSingle()
    : await base.eq("slug", slug).maybeSingle();

  if (error || !product) return notFound();

  // Use only images provided by admin: image_urls on product (or legacy image_url)
  const gallery: string[] = Array.isArray(product.image_urls)
    ? product.image_urls.filter(Boolean)
    : [];
  const main = gallery[0] || product.image_url || "/placeholder-image.svg";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery
            product={{ ...product, image_urls: gallery, image_url: main }}
          />
          <ProductDetails product={product} />
        </div>
      </div>
      <Script
        id="ld-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: gallery.length ? gallery : [main],
            description: product.description,
            brand: product.brand,
            sku: product.id,
            offers: {
              "@type": "Offer",
              priceCurrency: "BDT",
              price:
                product?.sale_price && product.sale_price > 0
                  ? product.sale_price
                  : product.price,
              availability:
                (product?.stock_quantity ?? product?.stock ?? 0) > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              url: `${
                process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
              }/products/${product.slug || product.id}`,
            },
          }),
        }}
      />
    </div>
  );
}
