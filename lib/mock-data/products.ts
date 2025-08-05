import { Product, Category } from '@/types'
import { DASHBOARD_CONFIG } from '@/lib/dashboard-config'

/**
 * Mock product data to replace Supabase database
 * This file provides static product data for the application
 */

// Mock categories
export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Men',
    description: 'Premium clothing for men',
    image_url: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500&h=500&fit=crop'
  },
  {
    id: 'cat-2',
    name: 'Women',
    description: 'Stylish clothing for women',
    image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=500&fit=crop'
  },
  {
    id: 'cat-3',
    name: 'Kids',
    description: 'Comfortable clothing for kids',
    image_url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&h=500&fit=crop'
  },
  {
    id: 'cat-4',
    name: 'Accessories',
    description: 'Stylish accessories to complete your look',
    image_url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=500&h=500&fit=crop'
  },
  {
    id: 'cat-5',
    name: 'On Sale',
    description: 'Special discounts on premium items',
    image_url: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=500&h=500&fit=crop'
  }
]

// Mock products
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Classic Oxford Shirt',
    description: 'A timeless oxford shirt made from premium cotton with a comfortable fit.',
    price: 89.99,
    original_price: 119.99,
    image_url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&h=500&fit=crop',
    image_urls: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=500&h=500&fit=crop'
    ],
    category: 'Men',
    sku: 'MS-001',
    stock_quantity: 45,
    low_stock_threshold: 10,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue', 'White', 'Black'],
    brand: 'MHCloth',
    status: 'active',
    is_featured: true,
    is_on_sale: true,
    tags: ['shirt', 'formal', 'cotton'],
    created_at: '2023-09-15T10:30:00Z',
    updated_at: '2023-09-15T10:30:00Z'
  },
  {
    id: 'prod-2',
    name: 'Slim Fit Jeans',
    description: 'Modern slim fit jeans with stretch comfort technology.',
    price: 79.99,
    image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=500&fit=crop',
    image_urls: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop'
    ],
    category: 'Men',
    sku: 'MS-002',
    stock_quantity: 38,
    sizes: ['30', '32', '34', '36'],
    colors: ['Blue', 'Black'],
    brand: 'MHCloth',
    status: 'active',
    is_featured: false,
    is_on_sale: false,
    tags: ['jeans', 'casual', 'denim'],
    created_at: '2023-09-10T14:20:00Z',
    updated_at: '2023-09-10T14:20:00Z'
  },
  {
    id: 'prod-3',
    name: 'Floral Summer Dress',
    description: 'Light and breezy floral dress perfect for summer days.',
    price: 69.99,
    original_price: 99.99,
    image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=500&fit=crop',
    image_urls: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&h=500&fit=crop'
    ],
    category: 'Women',
    sku: 'WS-001',
    stock_quantity: 25,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral', 'Blue', 'Pink'],
    brand: 'MHCloth',
    status: 'active',
    is_featured: true,
    is_on_sale: true,
    tags: ['dress', 'summer', 'floral'],
    created_at: '2023-09-05T09:15:00Z',
    updated_at: '2023-09-05T09:15:00Z'
  },
  {
    id: 'prod-4',
    name: 'Leather Crossbody Bag',
    description: 'Elegant leather crossbody bag with adjustable strap and multiple compartments.',
    price: 129.99,
    image_url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&h=500&fit=crop',
    image_urls: [
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop'
    ],
    category: 'Accessories',
    sku: 'AC-001',
    stock_quantity: 15,
    colors: ['Brown', 'Black'],
    brand: 'MHCloth',
    status: 'active',
    is_featured: true,
    is_on_sale: false,
    tags: ['bag', 'leather', 'accessory'],
    created_at: '2023-08-28T11:45:00Z',
    updated_at: '2023-08-28T11:45:00Z'
  },
  {
    id: 'prod-5',
    name: 'Kids Dinosaur T-Shirt',
    description: 'Fun and colorful dinosaur print t-shirt for kids.',
    price: 24.99,
    original_price: 34.99,
    image_url: 'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=500&h=500&fit=crop',
    image_urls: [
      'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1519278404037-1d69ca9a0c45?w=500&h=500&fit=crop'
    ],
    category: 'Kids',
    sku: 'KS-001',
    stock_quantity: 50,
    sizes: ['3-4Y', '5-6Y', '7-8Y'],
    colors: ['Green', 'Blue'],
    brand: 'MHCloth',
    status: 'active',
    is_featured: false,
    is_on_sale: true,
    tags: ['kids', 't-shirt', 'dinosaur'],
    created_at: '2023-08-20T13:10:00Z',
    updated_at: '2023-08-20T13:10:00Z'
  },
  {
    id: 'prod-6',
    name: 'Wool Winter Coat',
    description: 'Premium wool coat to keep you warm during winter months.',
    price: 199.99,
    original_price: 249.99,
    image_url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=500&fit=crop',
    image_urls: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500&h=500&fit=crop'
    ],
    category: 'Women',
    sku: 'WS-002',
    stock_quantity: 18,
    sizes: ['S', 'M', 'L'],
    colors: ['Camel', 'Black', 'Gray'],
    brand: 'MHCloth',
    status: 'active',
    is_featured: true,
    is_on_sale: true,
    tags: ['coat', 'winter', 'wool'],
    created_at: '2023-08-15T16:30:00Z',
    updated_at: '2023-08-15T16:30:00Z'
  },
  {
    id: 'prod-7',
    name: 'Leather Derby Shoes',
    description: 'Classic leather derby shoes with comfortable insoles.',
    price: 149.99,
    image_url: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=500&h=500&fit=crop',
    image_urls: [
      'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop'
    ],
    category: 'Men',
    sku: 'MS-003',
    stock_quantity: 22,
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: ['Brown', 'Black'],
    brand: 'MHCloth',
    status: 'active',
    is_featured: false,
    is_on_sale: false,
    tags: ['shoes', 'formal', 'leather'],
    created_at: '2023-08-10T10:00:00Z',
    updated_at: '2023-08-10T10:00:00Z'
  },
  {
    id: 'prod-8',
    name: 'Kids Denim Overalls',
    description: 'Durable and cute denim overalls for active kids.',
    price: 39.99,
    image_url: 'https://images.unsplash.com/photo-1543854589-fdd815f176e0?w=500&h=500&fit=crop',
    image_urls: [
      'https://images.unsplash.com/photo-1543854589-fdd815f176e0?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500&h=500&fit=crop'
    ],
    category: 'Kids',
    sku: 'KS-002',
    stock_quantity: 35,
    sizes: ['3-4Y', '5-6Y', '7-8Y'],
    colors: ['Blue', 'Light Blue'],
    brand: 'MHCloth',
    status: 'active',
    is_featured: true,
    is_on_sale: false,
    tags: ['kids', 'overalls', 'denim'],
    created_at: '2023-08-05T14:45:00Z',
    updated_at: '2023-08-05T14:45:00Z'
  },
  {
    id: 'prod-9',
    name: 'Silk Scarf',
    description: 'Luxurious silk scarf with elegant pattern.',
    price: 59.99,
    original_price: 79.99,
    image_url: 'https://images.unsplash.com/photo-1584187839579-d9c8b1b7b8b8?w=500&h=500&fit=crop',
    image_urls: [
      'https://images.unsplash.com/photo-1584187839579-d9c8b1b7b8b8?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500&h=500&fit=crop'
    ],
    category: 'Accessories',
    sku: 'AC-002',
    stock_quantity: 40,
    colors: ['Multicolor', 'Blue', 'Red'],
    brand: 'MHCloth',
    status: 'active',
    is_featured: false,
    is_on_sale: true,
    tags: ['scarf', 'silk', 'accessory'],
    created_at: '2023-08-01T09:30:00Z',
    updated_at: '2023-08-01T09:30:00Z'
  },
  {
    id: 'prod-10',
    name: 'Casual Linen Shirt',
    description: 'Breathable linen shirt for casual summer days.',
    price: 69.99,
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop',
    image_urls: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=500&h=500&fit=crop'
    ],
    category: 'Men',
    sku: 'MS-004',
    stock_quantity: 30,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Beige', 'Light Blue'],
    brand: 'MHCloth',
    status: 'active',
    is_featured: true,
    is_on_sale: false,
    tags: ['shirt', 'linen', 'summer'],
    created_at: '2023-07-25T11:20:00Z',
    updated_at: '2023-07-25T11:20:00Z'
  }
]

// Helper function to get products by category
export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return mockProducts
  return mockProducts.filter(product => product.category.toLowerCase() === category.toLowerCase())
}

// Helper function to get products by ID
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id)
}

// Helper function to get featured products
export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter(product => product.is_featured)
}

// Helper function to get on sale products
export const getOnSaleProducts = (): Product[] => {
  return mockProducts.filter(product => product.is_on_sale)
}

// Helper function to search products
export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase()
  return mockProducts.filter(
    product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
  )
}

// Organize products by category for easy access
export const productsByCategory: Record<string, Product[]> = {
  'men': getProductsByCategory('Men'),
  'women': getProductsByCategory('Women'),
  'kids': getProductsByCategory('Kids'),
  'accessories': getProductsByCategory('Accessories'),
  'on-sale': getOnSaleProducts(),
  'featured': getFeaturedProducts()
}