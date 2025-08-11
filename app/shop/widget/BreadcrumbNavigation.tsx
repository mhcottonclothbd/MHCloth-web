'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbNavigationProps {
  items?: BreadcrumbItem[]
}

/**
 * Breadcrumb navigation component for shop pages
 * Shows the current page hierarchy and navigation path
 */
export default function BreadcrumbNavigation({ items = [] }: BreadcrumbNavigationProps) {
  const defaultItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' }
  ]

  const breadcrumbItems = items.length > 0 ? items : defaultItems

  return (
    <motion.nav
      className="mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index === 0 && (
              <Home className="w-4 h-4 mr-2 text-gray-500" />
            )}
            
            {index < breadcrumbItems.length - 1 ? (
              <>
                <Link
                  href={item.href}
                  className="hover:text-gray-900 transition-colors duration-200 font-medium"
                >
                  {item.label}
                </Link>
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              </>
            ) : (
              <span className="text-gray-900 font-semibold" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </motion.nav>
  )
}