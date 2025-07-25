import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetails from "./widget/ProductDetails";
import ProductGallery from "./widget/ProductGallery";

import { allAndSonsProducts } from "@/data/andsons-products";
import { kidsProducts } from "@/data/kids-products";
import { mensProducts } from "@/data/mens-products";
import { womensProducts } from "@/data/womens-products";
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
  const product = allAndSonsProducts.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Product Not Found - MHCloth",
      description: "The product you're looking for could not be found.",
    }
  }

  return {
    title: `${product.name} - MHCloth`,
    description: product.description,
    keywords: `${product.name}, ${product.category}, premium products, online store`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image_url],
      type: "website",
    },
  };
}

// Combine all product data sources
const allProducts = [
  ...allAndSonsProducts,
  ...mensProducts.map((p) => ({
    id: p.id.toString(),
    name: p.name,
    description: `${p.name} - Premium quality product`,
    price: p.price,
    image_url: p.image,
    category: "mens",
    stock: (p as any).stock || ((p as any).inStock ? 10 : 0),
    featured: p.featured || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })),
  ...womensProducts.map((p) => ({
    id: p.id.toString(),
    name: p.name,
    description: `${p.name} - Premium quality product`,
    price: p.price,
    image_url: p.image,
    category: "womens",
    stock: (p as any).stock || ((p as any).inStock ? 10 : 0),
    featured: p.featured || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })),
  ...kidsProducts.map((p) => ({
    id: p.id.toString(),
    name: p.name,
    description: `${p.name} - Premium quality product`,
    price: p.price,
    image_url: p.image,
    category: "kids",
    stock: p.inStock ? 10 : 0,
    featured: p.featured || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })),
];

/**
 * Product details page with comprehensive product information
 * Features responsive design, image gallery, reviews, and related products
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = allProducts.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  // Get related products from the same category
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

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
}

/**
 * Generate static params for static generation
 */
export async function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id,
  }));
}
