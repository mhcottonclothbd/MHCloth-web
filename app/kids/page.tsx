import { Metadata } from 'next'
import CategoryHero from './widget/CategoryHero'
import ProductGridWithDropdown from './widget/ProductGridWithDropdown'
import { kidsCategories } from '@/data/categories'

export const metadata: Metadata = {
  title: "Kids Collection - MHCloth | Premium Children's Products",
  description: "Explore our delightful kids collection featuring premium clothing, toys, and accessories designed for children of all ages.",
  keywords: "kids fashion, children's clothing, kids accessories, premium kids products, children's collection",
}

interface KidsPageProps {
  searchParams: Promise<{
    search?: string
    sort?: string
    filter?: string
    category?: string
  }>
}

/**
 * Kids category page with playful design and kid-friendly products
 * Features colorful hero section and categorized product display
 */
export default async function KidsPage({ searchParams }: KidsPageProps) {
  const resolvedSearchParams = await searchParams
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <CategoryHero
        title="Kids Collection"
        subtitle="Fun & Playful"
        description="Discover our amazing collection of kids' clothing designed for comfort, style, and endless adventures!"
        backgroundImage="/images/kids-hero.jpg"
      />
      
      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGridWithDropdown
          searchParams={resolvedSearchParams}
          categories={kidsCategories}
          category="kids"
          title="Kids Collection"
        />
      </div>
    </div>
  )
}