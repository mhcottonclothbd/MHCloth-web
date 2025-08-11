/**
 * Categories Service
 * Handles category data fetching and transformation
 */

import { categoryApi, handleApiError, isApiError } from './api';

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  slug?: string;
  parent_id?: string;
}

export interface CategoryData {
  mens: CategoryItem[];
  womens: CategoryItem[];
  kids: CategoryItem[];
}

function slugify(input?: string): string {
  if (!input) return ''
  return input
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function resolveIcon(gender: 'mens' | 'womens' | 'kids', slugOrName?: string, fallback?: string): string {
  const slug = slugify(slugOrName)

  const mensIcons: Record<string, string> = {
    't-shirts': '/assets/men-catagerory--icon/t-shirts.png',
    'polo': '/assets/men-catagerory--icon/polo.jpg',
    'polo-shirts': '/assets/men-catagerory--icon/polo.jpg',
    'shirts': '/assets/men-catagerory--icon/shirts-formal-casual.jpg',
    'shirts-formal-casual': '/assets/men-catagerory--icon/shirts-formal-casual.jpg',
    'jeans': '/assets/men-catagerory--icon/jeans.jpg',
    'jackets': '/assets/men-catagerory--icon/jackets-coats.jpg',
    'coats': '/assets/men-catagerory--icon/jackets-coats.jpg',
    'jackets-coats': '/assets/men-catagerory--icon/jackets-coats.jpg',
    'hoodies-sweatshirts': '/assets/men-catagerory--icon/hoodies-sweatshirts.png',
    // alias to tolerate slug variants produced by name normalization ("&" -> "and")
    'hoodies-and-sweatshirts': '/assets/men-catagerory--icon/hoodies-sweatshirts.png',
    'sweaters-cardigans': '/assets/men-catagerory--icon/sweaters-cardigans.jpg',
    'sweaters-and-cardigans': '/assets/men-catagerory--icon/sweaters-cardigans.jpg',
    'shorts': '/assets/men-catagerory--icon/shorts.png',
    'trousers': '/assets/men-catagerory--icon/trousers.jpg',
    'joggers': '/assets/men-catagerory--icon/Joggers.jpg',
    'cargo-pants': '/assets/men-catagerory--icon/cargo-pants.jpg',
    'blazers-suits': '/assets/men-catagerory--icon/Blazers & Suits.jpg',
    'blazers-and-suits': '/assets/men-catagerory--icon/Blazers & Suits.jpg',
    'undergarments': '/assets/men-catagerory--icon/undergarments.png',
  }

  const womensIcons: Record<string, string> = {
    'bras': '/assets/women/Bras.png',
    'panties': '/assets/women/Panties.jpg',
    'shorts': '/assets/women/Shorts.jpg',
    'sweaters-cardigans': '/assets/women/Sweaters & Cardigans.png',
    'sweaters-and-cardigans': '/assets/women/Sweaters & Cardigans.png',
    'hoodies-sweatshirts': '/assets/women/Hoodies & Sweatshirts.jpg',
    'hoodies-and-sweatshirts': '/assets/women/Hoodies & Sweatshirts.jpg',
    'tops': '/assets/women/Tops.jpg',
    'tunics-kurtis': '/assets/women/Tunics & Kurtis.jpg',
    'tunics-and-kurtis': '/assets/women/Tunics & Kurtis.jpg',
  }

  // Reuse the men's icon set for kids where slugs match
  const kidsIcons: Record<string, string> = mensIcons

  const maps = gender === 'mens' ? mensIcons : gender === 'womens' ? womensIcons : kidsIcons
  // Prefer provided fallback (DB image), otherwise gender map, then fall back to men's icons for missing womens/kids slugs
  if (fallback) return fallback
  if (maps[slug]) return maps[slug]
  // Fallback to men's icon set when slug not present in current gender map
  if (gender !== 'mens' && mensIcons[slug]) return mensIcons[slug]
  return '/placeholder-image.svg'
}

/**
 * Default Men's categories derived from images in public/assets/men-catagerory--icon
 * Used as a non-blocking fallback to ensure the Men's page has a complete set
 * of categories even when the database is missing some entries.
 */
const DEFAULT_MENS_CATEGORY_SPECS: Array<{ slug: string; name: string; description: string }> = [
  { slug: 't-shirts', name: 'T-Shirts', description: 'Essential tees for everyday wear' },
  { slug: 'polo-shirts', name: 'Polo Shirts', description: 'Classic polo shirts' },
  { slug: 'shirts-formal-casual', name: 'Shirts', description: 'Formal and casual shirts' },
  { slug: 'hoodies-sweatshirts', name: 'Hoodies & Sweatshirts', description: 'Cozy hoodies and sweatshirts' },
  { slug: 'jackets-coats', name: 'Jackets & Coats', description: 'Outerwear for every season' },
  { slug: 'jeans', name: 'Jeans', description: 'Timeless denim fits' },
  { slug: 'trousers', name: 'Trousers', description: 'Smart and casual trousers' },
  { slug: 'cargo-pants', name: 'Cargo Pants', description: 'Utility-inspired cargo pants' },
  { slug: 'joggers', name: 'Joggers', description: 'Comfort-first joggers' },
  { slug: 'shorts', name: 'Shorts', description: 'Warm-weather essentials' },
  { slug: 'sweaters-cardigans', name: 'Sweaters & Cardigans', description: 'Layer-ready knitwear' },
  { slug: 'blazers-suits', name: 'Blazers & Suits', description: 'Tailored blazers and suits' },
  { slug: 'undergarments', name: 'Undergarments', description: 'Everyday essentials' },
]

function buildMensFallbackCategories(): CategoryItem[] {
  return DEFAULT_MENS_CATEGORY_SPECS.map((spec) => ({
    id: spec.slug,
    name: spec.name,
    description: spec.description,
    icon: resolveIcon('mens', spec.slug),
    count: 0,
    slug: spec.slug,
  }))
}

/**
 * Default Women's categories based on images in public/assets/women
 */
const DEFAULT_WOMENS_CATEGORY_SPECS: Array<{ slug: string; name: string; description: string }> = [
  { slug: 'tops', name: 'Tops', description: 'Essential tops for every style' },
  { slug: 'hoodies-sweatshirts', name: 'Hoodies & Sweatshirts', description: 'Cozy layers for comfort' },
  { slug: 'sweaters-cardigans', name: 'Sweaters & Cardigans', description: 'Chic knitwear staples' },
  { slug: 'tunics-kurtis', name: 'Tunics & Kurtis', description: 'Elegant tunics and kurtis' },
  { slug: 'shorts', name: 'Shorts', description: 'Warm-weather essentials' },
  { slug: 'bras', name: 'Bras', description: 'Comfort and support' },
  { slug: 'panties', name: 'Panties', description: 'Everyday underwear' },
  // Newly requested: reuse men's icons if womens-specific icons are missing
  { slug: 't-shirts', name: 'T-Shirts', description: 'Everyday essential tees' },
  { slug: 'shirts', name: 'Shirts', description: 'Smart and casual shirts' },
  { slug: 'trousers', name: 'Pants', description: 'Tailored and casual pants' },
]

function buildWomensFallbackCategories(): CategoryItem[] {
  return DEFAULT_WOMENS_CATEGORY_SPECS.map((spec) => ({
    id: spec.slug,
    name: spec.name,
    description: spec.description,
    icon: resolveIcon('womens', spec.slug),
    count: 0,
    slug: spec.slug,
  }))
}

/**
 * Fetch categories from mock data and transform them to the expected format
 */
export const getCategories = async (): Promise<CategoryData> => {
  const [mensRes, womensRes, kidsRes] = await Promise.all([
    categoryApi.getCategories({ gender: 'mens' }),
    categoryApi.getCategories({ gender: 'womens' }),
    categoryApi.getCategories({ gender: 'kids' }),
  ])

  const toItems = (res: any, gender: 'mens' | 'womens' | 'kids'): CategoryItem[] => {
    if (isApiError(res)) return []
    const rows = Array.isArray(res?.data) ? res.data : []
    return rows.map((c: any) => ({
      id: c.slug || c.id,
      name: c.name,
      description: c.description || `${c.name} collection`,
      icon: resolveIcon(gender, c.slug || c.name, c.image_url),
      count: c.count || 0,
      slug: c.slug,
    }))
  }

  const mens = toItems(mensRes, 'mens')
  const womens = toItems(womensRes, 'womens')
  const kids = toItems(kidsRes, 'kids')

  // Ensure Men's categories include our full default set where missing
  const mensExisting = new Set(mens.map((c) => (c.slug || c.id).toString().toLowerCase()))
  const mensWithFallback = [
    ...mens,
    ...buildMensFallbackCategories().filter((c) => !mensExisting.has((c.slug || c.id).toString().toLowerCase())),
  ]

  // Ensure Women's categories include defaults where missing
  const womensExisting = new Set(womens.map((c) => (c.slug || c.id).toString().toLowerCase()))
  const womensWithFallback = [
    ...womens,
    ...buildWomensFallbackCategories().filter((c) => !womensExisting.has((c.slug || c.id).toString().toLowerCase())),
  ]

  // For Kids, include all Men's defaults as a convenience (icons re-used)
  const kidsExisting = new Set(kids.map((c) => (c.slug || c.id).toString().toLowerCase()))
  const kidsWithMensDefaults = [
    ...kids,
    ...buildMensFallbackCategories().filter((c) => !kidsExisting.has((c.slug || c.id).toString().toLowerCase())),
  ]

  return { mens: mensWithFallback, womens: womensWithFallback, kids: kidsWithMensDefaults }
};

/**
 * Get categories for a specific gender/category
 */
export const getCategoriesByGender = async (gender: 'mens' | 'womens' | 'kids'): Promise<CategoryItem[]> => {
  const res = await categoryApi.getCategories({ gender })
  if (isApiError(res)) {
    // Provide sensible fallbacks when API is unavailable or returns non-JSON/HTML errors
    if (gender === 'womens') return buildWomensFallbackCategories()
    // Reuse Men's defaults for Kids, as elsewhere in the app
    if (gender === 'kids') return buildMensFallbackCategories()
    return buildMensFallbackCategories()
  }
  const rows = Array.isArray((res as any).data) ? (res as any).data : []
  const items = rows.map((c: any) => ({
    id: c.slug || c.id,
    name: c.name,
    description: c.description || `${c.name} collection`,
    icon: resolveIcon(gender, c.slug || c.name, c.image_url),
    count: c.count || 0,
    slug: c.slug || slugify(c.name),
  }))
  if (gender === 'womens') {
    const existing = new Set(items.map((c: CategoryItem) => (c.slug || c.id).toString().toLowerCase()))
    return [
      ...items,
      ...buildWomensFallbackCategories().filter((c: CategoryItem) => !existing.has((c.slug || c.id).toString().toLowerCase())),
    ]
  }
  if (gender === 'kids') {
    // Include Men's defaults for Kids as requested
    const existing = new Set(items.map((c: CategoryItem) => (c.slug || c.id).toString().toLowerCase()))
    return [
      ...items,
      ...buildMensFallbackCategories().filter((c: CategoryItem) => !existing.has((c.slug || c.id).toString().toLowerCase())),
    ]
  }
  if (gender !== 'mens') return items

  // Merge in any missing Men's defaults so the UI has a complete set
  const existing = new Set(items.map((c: CategoryItem) => (c.slug || c.id).toString().toLowerCase()))
  const withFallback = [
    ...items,
    ...buildMensFallbackCategories().filter((c: CategoryItem) => !existing.has((c.slug || c.id).toString().toLowerCase())),
  ]
  return withFallback
};

/**
 * Get a single category by ID
 */
export const getCategory = async (id: string): Promise<CategoryItem | null> => {
  try {
    const response = await categoryApi.getCategory(id);

    if (isApiError(response)) {
      console.error('Failed to fetch category:', handleApiError(response));
      return null;
    }

    const category = response.data;
    return {
      id: category.slug || category.id,
      name: category.name,
      description: category.description || `${category.name} collection`,
      icon: resolveIcon('mens', category.slug || category.name, category.image_url),
      count: category.count || 0,
      slug: category.slug || slugify(category.name),
      parent_id: category.parent_id
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
};