import { Metadata } from 'next'
import { Suspense } from 'react'
import HeroSection from './widget/HeroSection'
import CollectionGrid from './widget/CollectionGrid'
import FeaturedCollection from './widget/FeaturedCollection'
import InstagramFeed from './widget/InstagramFeed'
import LoadingSkeleton from './widget/LoadingSkeleton'

export const metadata: Metadata = {
  title: 'Gallery - Physical Store | Product Collections & Inspiration',
  description: 'Explore our curated collections and discover inspiration through beautiful product photography and lifestyle imagery.',
  keywords: 'gallery, collections, product photography, lifestyle, inspiration, curated products',
}

interface GalleryPageProps {
  searchParams: Promise<{
    collection?: string
    category?: string
  }>
}

/**
 * Gallery page showcasing product collections and visual inspiration
 * Features masonry layout, collection filtering, and social media integration
 */
export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const resolvedSearchParams = await searchParams
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Collection */}
      <FeaturedCollection />
      
      {/* Collection Grid */}
      <Suspense fallback={<LoadingSkeleton />}>
        <CollectionGrid searchParams={resolvedSearchParams} />
      </Suspense>
      
      {/* Instagram Feed */}
      <InstagramFeed />
    </div>
  )
}