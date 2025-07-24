import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductGrid from '../widget/ProductGrid'
import CategoryHero from '../widget/CategoryHero'
import { kidsCategories } from '../../../data/categories'

interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{
    search?: string
    sort?: string
    filter?: string
  }>
}

/**
 * Generates metadata for kids category pages
 */
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryData = kidsCategories.find(cat => cat.id === category)
  
  if (!categoryData) {
    return {
      title: 'Category Not Found - Physical Store',
      description: 'The requested category could not be found.'
    }
  }
  
  return {
    title: `Kids ${categoryData.name} - Physical Store`,
    description: `Shop our collection of kids ${categoryData.name.toLowerCase()}. ${categoryData.description}`,
    keywords: `kids ${categoryData.name.toLowerCase()}, ${categoryData.name}, children's products, kids items`,
    openGraph: {
      title: `Kids ${categoryData.name}`,
      description: categoryData.description,
      type: 'website'
    }
  }
}

/**
 * Kids category page with filtered products
 * Features category-specific hero section and filtered product grid
 */
export default async function KidsCategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params
  const resolvedSearchParams = await searchParams
  const categoryData = kidsCategories.find(cat => cat.id === category)
  
  if (!categoryData) {
    notFound()
  }
  
  // Add category to search params for filtering
  const searchParamsWithCategory = {
    ...resolvedSearchParams,
    category
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Category Hero */}
      <CategoryHero 
        title={`Kids ${categoryData.name}`}
        subtitle={categoryData.description}
        description={categoryData.description}
        backgroundImage="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=400&fit=crop"
      />
      
      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGrid 
          searchParams={searchParamsWithCategory}
          category="kids"
          title={categoryData.name}
        />
      </div>
    </div>
  )
}

/**
 * Generate static params for static generation
 */
export async function generateStaticParams() {
  return kidsCategories.map((category) => ({
    category: category.id,
  }))
}