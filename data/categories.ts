/**
 * Category data for different sections
 * Now uses database-driven categories with fallback to hardcoded data
 */

export interface CategoryItem {
  id: string
  name: string
  description: string
  icon: string
  count: number
}

// Re-export only typed helpers; mock fallback removed to enforce Supabase-only data
export { getCategories, getCategoriesByGender, getCategory } from '@/lib/services/categories';

// Fallback categories for when API is not available
// Hardcoded fallbacks removed. Consumers must fetch categories via /api/categories.