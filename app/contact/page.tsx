import { Metadata } from 'next'
import { Suspense } from 'react'
import HeroSection from './widget/HeroSection'
import ContactForm from './widget/ContactForm'
import ContactInfo from './widget/ContactInfo'
import LocationMap from './widget/LocationMap'
import FAQ from './widget/FAQ'
import LoadingSkeleton from './widget/LoadingSkeleton'

/**
 * Contact page metadata for SEO optimization
 */
export const metadata: Metadata = {
  title: 'Contact Us | Get in Touch',
  description: 'Contact our team for questions, support, or custom orders. Visit our store, call us, or send a message through our contact form.',
  keywords: ['contact', 'support', 'customer service', 'store location', 'help'],
  openGraph: {
    title: 'Contact Us | Get in Touch',
    description: 'Contact our team for questions, support, or custom orders. Visit our store, call us, or send a message.',
    type: 'website',
  },
}

/**
 * Contact page component
 * Provides multiple ways for customers to get in touch
 * Includes contact form, store information, location map, and FAQ
 */
export default function ContactPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f3' }}>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Main Content */}
      <Suspense fallback={<LoadingSkeleton />}>
        {/* Contact Form and Info */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ContactForm />
              <ContactInfo />
            </div>
          </div>
        </section>
        
        {/* Location Map */}
        <LocationMap />
        
        {/* FAQ Section */}
        <FAQ />
      </Suspense>
    </div>
  )
}