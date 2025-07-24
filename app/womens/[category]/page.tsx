import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductGrid from '../widget/ProductGrid'
import CategoryHero from '../widget/CategoryHero'
import { womensCategories } from '../../../data/categories'

interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{
    search?: string
    sort?: string
    filter?: string
  }>
}

/**
 * Generates metadata for women's category pages
 */
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryData = womensCategories.find(cat => cat.id === category)
  
  if (!categoryData) {
    return {
      title: 'Category Not Found - Physical Store',
      description: 'The requested category could not be found.'
    }
  }
  
  return {
    title: `Women's ${categoryData.name} - Physical Store`,
    description: `Shop our collection of women's ${categoryData.name.toLowerCase()}. ${categoryData.description}`,
    keywords: `women's ${categoryData.name.toLowerCase()}, ${categoryData.name}, women's fashion, premium clothing`,
    openGraph: {
      title: `Women's ${categoryData.name}`,
      description: categoryData.description,
      type: 'website'
    }
  }
}

/**
 * Women's category page with filtered products
 * Features category-specific hero section and filtered product grid
 */
export default async function WomensCategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params
  const resolvedSearchParams = await searchParams
  const categoryData = womensCategories.find(cat => cat.id === category)
  
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
        title={`Women's ${categoryData.name}`}
        subtitle={categoryData.description}
        description={`Discover our exquisite collection of women's ${categoryData.name.toLowerCase()}. Each piece is carefully selected to bring you the perfect blend of style, comfort, and elegance.`}
        backgroundImage="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop"
      />
      
      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGrid 
          searchParams={searchParamsWithCategory}
          category="womens"
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
  return womensCategories.map((category) => ({
    category: category.id,
  }))
}