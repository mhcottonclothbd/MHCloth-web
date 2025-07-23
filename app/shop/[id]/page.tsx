import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetails from './widget/ProductDetails'
import ProductGallery from './widget/ProductGallery'

import RelatedProducts from './widget/RelatedProducts'
import { Product } from '@/types'

// Mock data - will be replaced with Supabase data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Leather Jacket',
    description: 'Handcrafted leather jacket with timeless design. Made from premium Italian leather, this jacket features a classic silhouette with modern details. Perfect for both casual and formal occasions.',
    price: 299.99,
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
    category: 'clothing',
    stock: 10,
    featured: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: '2',
    name: 'Minimalist Watch',
    description: 'Clean design meets precision engineering. This minimalist timepiece features a Swiss movement, sapphire crystal, and premium leather strap.',
    price: 199.99,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
    category: 'accessories',
    stock: 5,
    featured: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: '3',
    name: 'Artisan Coffee Mug',
    description: 'Handmade ceramic mug for the perfect brew. Each piece is unique, crafted by skilled artisans using traditional techniques.',
    price: 24.99,
    image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=800&fit=crop',
    category: 'home',
    stock: 15,
    featured: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: '4',
    name: 'Designer Sunglasses',
    description: 'UV protection with sophisticated style. Premium acetate frames with polarized lenses for ultimate clarity and protection.',
    price: 149.99,
    image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=800&fit=crop',
    category: 'accessories',
    stock: 0,
    featured: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: '5',
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainable comfort for everyday wear. Made from 100% organic cotton with a relaxed fit and soft hand feel.',
    price: 39.99,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
    category: 'clothing',
    stock: 8,
    featured: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: '6',
    name: 'Wooden Desk Organizer',
    description: 'Keep your workspace tidy with natural materials. Handcrafted from sustainable bamboo with multiple compartments.',
    price: 79.99,
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop',
    category: 'home',
    stock: 12,
    featured: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
]

interface ProductPageProps {
  params: Promise<{ id: string }>
}

/**
 * Generates metadata for the product page
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = mockProducts.find(p => p.id === id)
  
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
  const product = mockProducts.find(p => p.id === id)
  
  if (!product) {
    notFound()
  }
  
  // Get related products from the same category
  const relatedProducts = mockProducts
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
  return mockProducts.map((product) => ({
    id: product.id,
  }))
}