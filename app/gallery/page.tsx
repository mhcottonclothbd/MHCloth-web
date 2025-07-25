import { Metadata } from 'next'
import { Suspense } from 'react'
import HeroSection from './widget/HeroSection'
import CollectionGrid from './widget/CollectionGrid'
import FeaturedCollection from './widget/FeaturedCollection'
import LoadingSkeleton from './widget/LoadingSkeleton'

export const metadata: Metadata = {
  title: 'Gallery - MHCloth | Product Collections & Inspiration',
  description: 'Explore our visual gallery showcasing our premium product collections, styling inspiration, and brand aesthetic.',
  keywords: 'gallery, product showcase, collections, inspiration, premium products',
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
    </div>
  )
}