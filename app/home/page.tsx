import { Metadata } from 'next'
import HeroSection from './widget/HeroSection'
import FeaturedProducts from './widget/FeaturedProducts'
import OnSale from './widget/OnSale'
import NewArrivals from './widget/NewArrivals'
import AboutPreview from './widget/AboutPreview'
import Newsletter from './widget/Newsletter'

export const metadata: Metadata = {
  title: 'Home - MHCloth | Premium Quality Products',
  description: 'Discover unique, high-quality products that blend timeless style with modern functionality. Shop our curated collection of premium items.',
  keywords: 'premium products, quality goods, modern design, timeless style',
}

/**
 * Home page component featuring hero section, featured products, and company preview
 * Implements responsive design with smooth animations and glass morphism effects
 */
export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      <HeroSection />
      <FeaturedProducts />
      <NewArrivals />
      <OnSale />
      <AboutPreview />
      <Newsletter />
    </div>
  )
}