'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, Heart, ShoppingBag } from 'lucide-react'
import Button from '@/components/Button'
import { Card } from '@/components/Card'
import { cn } from '@/lib/utils'

interface CollectionItem {
  id: string
  title: string
  description: string
  image: string
  category: string
  products: number
  featured: boolean
  aspectRatio: 'square' | 'portrait' | 'landscape'
}

interface CollectionGridProps {
  searchParams: {
    collection?: string
    category?: string
  }
}

// Mock collection data - will be replaced with Supabase data
const mockCollections: CollectionItem[] = [
  {
    id: '1',
    title: 'Minimalist Living',
    description: 'Clean lines and functional beauty for modern homes',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&q=80',
    category: 'home',
    products: 24,
    featured: true,
    aspectRatio: 'square'
  },
  {
    id: '2',
    title: 'Urban Essentials',
    description: 'Curated pieces for the modern professional',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop&q=80',
    category: 'clothing',
    products: 18,
    featured: false,
    aspectRatio: 'portrait'
  },
  {
    id: '3',
    title: 'Artisan Crafts',
    description: 'Handmade treasures from skilled craftspeople',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=800&h=600&fit=crop&q=80',
    category: 'accessories',
    products: 32,
    featured: true,
    aspectRatio: 'landscape'
  },
  {
    id: '4',
    title: 'Sustainable Style',
    description: 'Eco-conscious fashion that doesn\'t compromise on style',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80',
    category: 'clothing',
    products: 15,
    featured: false,
    aspectRatio: 'square'
  },
  {
    id: '5',
    title: 'Tech & Innovation',
    description: 'Smart accessories for the digital age',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=800&fit=crop&q=80',
    category: 'accessories',
    products: 12,
    featured: true,
    aspectRatio: 'portrait'
  },
  {
    id: '6',
    title: 'Cozy Comfort',
    description: 'Soft textures and warm tones for relaxation',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80',
    category: 'home',
    products: 28,
    featured: false,
    aspectRatio: 'landscape'
  }
]

const categories = [
  { id: 'all', name: 'All Collections' },
  { id: 'home', name: 'Home & Living' },
  { id: 'clothing', name: 'Fashion' },
  { id: 'accessories', name: 'Accessories' }
]

/**
 * Collection grid component with masonry layout and filtering
 * Displays curated product collections with smooth animations
 */
export default function CollectionGrid({ searchParams }: CollectionGridProps) {
  const [collections, setCollections] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || 'all')

  useEffect(() => {
    // Simulate API call - replace with Supabase query
    const fetchCollections = async () => {
      setLoading(true)
      
      // Filter collections based on category
      let filteredCollections = [...mockCollections]
      
      if (selectedCategory !== 'all') {
        filteredCollections = filteredCollections.filter(
          collection => collection.category === selectedCategory
        )
      }
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setCollections(filteredCollections)
      setLoading(false)
    }

    fetchCollections()
  }, [selectedCategory])

  const updateCategory = (category: string) => {
    setSelectedCategory(category)
    // Update URL without page reload
    const url = new URL(window.location.href)
    if (category === 'all') {
      url.searchParams.delete('category')
    } else {
      url.searchParams.set('category', category)
    }
    window.history.pushState({}, '', url.toString())
  }

  return (
    <section id="collections" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Curated Collections
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our thoughtfully assembled collections, each telling a unique story 
            through carefully selected products.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => updateCategory(category.id)}
              className={cn(
                'px-6 py-3 rounded-full font-medium transition-all duration-300',
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        )}

        {/* Collections Grid */}
        {!loading && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {collections.map((collection, index) => (
              <CollectionCard 
                key={collection.id} 
                collection={collection} 
                index={index}
              />
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && collections.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No collections found
            </h3>
            <p className="text-gray-600">
              Try selecting a different category to see more collections.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * Individual collection card component with hover effects
 */
function CollectionCard({ 
  collection, 
  index 
}: { 
  collection: CollectionItem
  index: number 
}) {
  const [isHovered, setIsHovered] = useState(false)

  const getAspectRatioClass = (aspectRatio: string) => {
    switch (aspectRatio) {
      case 'portrait':
        return 'aspect-[3/4]'
      case 'landscape':
        return 'aspect-[4/3]'
      default:
        return 'aspect-square'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500">
        <div className={cn('relative overflow-hidden', getAspectRatioClass(collection.aspectRatio))}>
          <Image
            src={collection.image}
            alt={collection.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: isHovered ? 0.8 : 0.6 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Featured Badge */}
          {collection.featured && (
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 text-xs font-medium rounded-full">
              Featured
            </div>
          )}
          
          {/* Product Count */}
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 text-xs font-medium rounded-full">
            {collection.products} items
          </div>
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <motion.h3
              className="text-xl font-bold mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {collection.title}
            </motion.h3>
            
            <motion.p
              className="text-sm text-gray-200 mb-4 line-clamp-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {collection.description}
            </motion.p>
            
            {/* Action Buttons */}
            <motion.div
              className="flex gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Link href={`/gallery/${collection.id}`}>
                <Button
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/30"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </Link>
              
              <Link href={`/shop?collection=${collection.id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/30 text-white"
                >
                  <ShoppingBag className="w-4 h-4 mr-1" />
                  Shop
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}