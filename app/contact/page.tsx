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
  title: "Contact Us - MHCloth | Get in Touch",
  description:
    "Contact MHCloth for any inquiries, support, or feedback. Visit our store, call us, or send us an email. We're here to help!",
  keywords:
    "contact, MHCloth, customer service, support, store location, phone, email",
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