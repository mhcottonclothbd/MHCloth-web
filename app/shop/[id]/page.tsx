import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetails from './widget/ProductDetails'
import ProductGallery from './widget/ProductGallery'

import RelatedProducts from './widget/RelatedProducts'
import { Product } from '@/types'
import { allAndSonsProducts } from '@/data/andsons-products'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

/**
 * Generates metadata for the product page
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = allAndSonsProducts.find(p => p.id === id)
  
  if (!product) {
    return {
      title: 'Product Not Found - Physical Store',
      description: 'The requested product could not be found.'
    }
  }
  
  return {
    title: `${product.name} - Physical Store`,
    description: product.description,
    keywords: `${product.name}, ${product.category}, premium products, online store`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image_url],
      type: 'website'
    }
  }
}

/**
 * Product details page with comprehensive product information
 * Features responsive design, image gallery, reviews, and related products
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = allAndSonsProducts.find(p => p.id === id)
  
  if (!product) {
    notFound()
  }
  
  // Get related products from the same category
  const relatedProducts = allAndSonsProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4)
  
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
  )
}

/**
 * Generate static params for static generation
 */
export async function generateStaticParams() {
  return allAndSonsProducts.map((product) => ({
    id: product.id,
  }))
}