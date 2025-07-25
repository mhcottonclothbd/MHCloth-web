'use client';

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CategoryItem } from '@/data/categories'

interface CategoryDropdownProps {
  categories: CategoryItem[]
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  title?: string
  placeholder?: string
}

/**
 * Reusable category dropdown component
 * Allows users to select categories from a dropdown menu
 * Features smooth animations and responsive design
 */
export default function CategoryDropdown({
  categories,
  selectedCategory,
  onCategoryChange,
  title = "Filter by Category",
  placeholder = "All Categories"
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategoryData, setSelectedCategoryData] = useState<CategoryItem | null>(null)

  // Update selected category data when selectedCategory changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      const categoryData = categories.find(cat => cat.id === selectedCategory)
      setSelectedCategoryData(categoryData || null)
    } else {
      setSelectedCategoryData(null)
    }
  }, [selectedCategory, categories])

  const handleCategorySelect = (categoryId: string) => {
    onCategoryChange(categoryId)
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.category-dropdown')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="category-dropdown relative w-full max-w-md mx-auto mb-8">
      {/* Title */}
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200",
          isOpen && "border-blue-500 ring-2 ring-blue-500"
        )}
      >
        <div className="flex items-center gap-3">
          {selectedCategoryData ? (
            <>
              <span className="text-xl">{selectedCategoryData.icon}</span>
              <div className="text-left">
                <div className="font-medium text-gray-900">{selectedCategoryData.name}</div>
                <div className="text-sm text-gray-500">
                  {selectedCategoryData.count} {selectedCategoryData.count === 1 ? 'item' : 'items'}
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-600">{placeholder}</div>
          )}
        </div>
        <ChevronDown 
          className={cn(
            "w-5 h-5 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {/* All Categories Option */}
            <button
              onClick={() => handleCategorySelect('all')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100",
                selectedCategory === 'all' && "bg-blue-50 text-blue-600"
              )}
            >
              <span className="text-xl">🏪</span>
              <div>
                <div className="font-medium">All Categories</div>
                <div className="text-sm text-gray-500">View all products</div>
              </div>
            </button>

            {/* Category Options */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150",
                  selectedCategory === category.id && "bg-blue-50 text-blue-600",
                  category.id !== categories[categories.length - 1].id && "border-b border-gray-100"
                )}
              >
                <span className="text-xl">{category.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{category.name}</div>
                  <div className="text-sm text-gray-500">{category.description}</div>
                </div>
                <div className="text-sm text-gray-400">
                  {category.count} {category.count === 1 ? 'item' : 'items'}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}