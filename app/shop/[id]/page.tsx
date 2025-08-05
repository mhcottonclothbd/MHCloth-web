import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetails from "./widget/ProductDetails";
import ProductGallery from "./widget/ProductGallery";
import RelatedProducts from "./widget/RelatedProducts";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generates metadata for the product page
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/products/${id}`
    );
    if (!response.ok) {
      return {
        title: "Product Not Found - MHCloth",
        description: "The product you're looking for could not be found.",
      };
    }

    const product = await response.json();

    return {
      title: `${product.name} - MHCloth`,
      description: product.description,
      keywords: `${product.name}, ${product.category}, premium products, online store`,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.image_url
          ? [product.image_url]
          : ["/placeholder-image.jpg"],
        type: "website",
      },
    };
  } catch (error) {
    return {
      title: "Product Not Found - MHCloth",
      description: "The product you're looking for could not be found.",
    };
  }
}

/**
 * Product details page with comprehensive product information
 * Features responsive design, image gallery, reviews, and related products
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  try {
    // Fetch product from API
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/products/${id}`
    );
    if (!response.ok) {
      notFound();
    }

    const product = await response.json();

    // Fetch related products from the same category
    const relatedResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/products?category=${product.category}`
    );
    let relatedProducts = [];
    if (relatedResponse.ok) {
      const allCategoryProducts = await relatedResponse.json();
      relatedProducts = allCategoryProducts
        .filter((p: any) => p.id !== product.id)
        .slice(0, 4);
    }

    return (
      <div className="min-h-screen bg-white">
        {/* Product Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Gallery */}
            <ProductGallery product={product} />

            {/* Product Details */}
            <ProductDetails product={product} />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    );
  } catch (error) {
    notFound();
  }
}

/**
 * Generate static params for static generation
 */
export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/products`
    );
    if (!response.ok) {
      return [];
    }

    const products = await response.json();
    return products.map((product: any) => ({
      id: product.id,
    }));
  } catch (error) {
    return [];
  }
}
