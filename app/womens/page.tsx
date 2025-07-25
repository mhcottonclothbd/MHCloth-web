import { Metadata } from 'next'
import CategoryHero from './widget/CategoryHero'
import ProductGridWithDropdown from './widget/ProductGridWithDropdown'
import { womensCategories } from '@/data/categories'

export const metadata: Metadata = {
  title: "Women's Collection - MHCloth | Premium Women's Products",
  description: "Discover our elegant women's collection featuring premium clothing, accessories, and lifestyle products designed for the modern woman.",
  keywords: "women's fashion, women's accessories, women's clothing, premium women's products, elegant collection",
}

interface WomensPageProps {
  searchParams: Promise<{
    search?: string
    sort?: string
    filter?: string
    category?: string
  }>
}

/**
 * Women's category page with elegant design and premium products
 * Features sophisticated hero section and categorized product display
 */
export default async function WomensPage({ searchParams }: WomensPageProps) {
  const resolvedSearchParams = await searchParams
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Hero Section */}
      <CategoryHero
        title="Women's Collection"
        subtitle="Elegant & Sophisticated"
        description="Discover our curated selection of premium women's fashion, designed for the modern, confident woman."
        backgroundImage="/images/womens-hero.jpg"
      />
      
      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGridWithDropdown
          searchParams={resolvedSearchParams}
          categories={womensCategories}
          category="womens"
          title="Women's Collection"
        />
      </div>
    </div>
  )
}