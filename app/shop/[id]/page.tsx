import { redirect } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generates metadata for the product page
 */
// No metadata; we immediately redirect to unified details route

/**
 * Product details page with comprehensive product information
 * Features responsive design, image gallery, reviews, and related products
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  // Redirect to unified details page using slug when possible, fallback to id
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/products/${id}`,
      { cache: "no-store" }
    );
    if (response.ok) {
      const raw = await response.json();
      const product = raw?.data ?? raw;
      const target = product?.slug
        ? `/products/${product.slug}`
        : `/products/${id}`;
      redirect(target);
    }
  } catch {}
  redirect(`/products/${id}`);
}

/**
 * Generate static params for static generation
 */
export async function generateStaticParams() {
  return [];
}
