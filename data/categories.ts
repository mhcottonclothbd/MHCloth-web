/**
 * Category data for different sections
 * Separated from components to avoid import conflicts
 */

export interface CategoryItem {
  id: string
  name: string
  description: string
  icon: string
  count: number
}

export const mensCategories: CategoryItem[] = [
  {
    id: 'jackets',
    name: 'Jackets & Outerwear',
    description: 'Premium jackets and coats for every season',
    icon: '🧥',
    count: 8
  },
  {
    id: 'shirts',
    name: 'Shirts',
    description: 'Classic and contemporary shirt styles',
    icon: '👔',
    count: 6
  },
  {
    id: 'pants',
    name: 'Pants & Trousers',
    description: 'Comfortable and stylish bottoms',
    icon: '👖',
    count: 6
  },
  {
    id: 'denim',
    name: 'Denim',
    description: 'Premium denim jeans and jackets',
    icon: '👕',
    count: 4
  },
  {
    id: 't-shirts',
    name: 'T-Shirts',
    description: 'Casual and comfortable tees',
    icon: '👕',
    count: 4
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Complete your look with our accessories',
    icon: '🎒',
    count: 4
  }
]

export const womensCategories: CategoryItem[] = [
  {
    id: 'jackets',
    name: 'Jackets & Outerwear',
    description: 'Elegant outerwear for sophisticated style',
    icon: '🧥',
    count: 6
  },
  {
    id: 'shirts',
    name: 'Shirts & Blouses',
    description: 'Feminine tops and elegant blouses',
    icon: '👚',
    count: 5
  },
  {
    id: 'pants',
    name: 'Pants & Trousers',
    description: 'Chic bottoms for every occasion',
    icon: '👖',
    count: 4
  },
  {
    id: 'denim',
    name: 'Denim',
    description: 'Premium women\'s denim collection',
    icon: '👖',
    count: 3
  },
  {
    id: 't-shirts',
    name: 'T-Shirts & Tops',
    description: 'Casual and comfortable everyday wear',
    icon: '👕',
    count: 4
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Beautiful accessories to complement your style',
    icon: '👜',
    count: 3
  }
]

export const kidsCategories: CategoryItem[] = [
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Comfortable and fun clothing for kids',
    icon: '👕',
    count: 8
  },
  {
    id: 'toys',
    name: 'Toys & Games',
    description: 'Educational and entertaining toys',
    icon: '🧸',
    count: 6
  },
  {
    id: 'books',
    name: 'Books',
    description: 'Inspiring stories and learning materials',
    icon: '📚',
    count: 4
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Fun accessories for little ones',
    icon: '🎒',
    count: 3
  },
  {
    id: 'outdoor',
    name: 'Outdoor & Sports',
    description: 'Active play and outdoor adventure gear',
    icon: '⚽',
    count: 4
  },
  {
    id: 'arts-crafts',
    name: 'Arts & Crafts',
    description: 'Creative supplies for artistic expression',
    icon: '🎨',
    count: 3
  }
]