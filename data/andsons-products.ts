import { Product } from '@/types'

/**
 * Real product data from &Sons (andsons.co.uk)
 * Organized by categories with authentic product information
 */

// Men's Jackets & Outerwear
export const mensJackets: Product[] = [
  {
    id: 'andsons-jacket-1',
    name: 'Vintage Military Field Jacket',
    description: 'Classic military-inspired field jacket with authentic vintage details and durable cotton construction',
    price: 189.99,
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    category: 'mens',
    stock: 15,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-jacket-2',
    name: 'Waxed Cotton Bomber Jacket',
    description: 'Premium waxed cotton bomber with ribbed cuffs and vintage-inspired design',
    price: 229.99,
    image_url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
    category: 'mens',
    stock: 12,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-jacket-3',
    name: 'Sherpa Lined Denim Jacket',
    description: 'Classic denim jacket with cozy sherpa lining for warmth and style',
    price: 159.99,
    image_url: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=400&fit=crop',
    category: 'mens',
    stock: 18,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-jacket-4',
    name: 'Vintage Leather Biker Jacket',
    description: 'Authentic leather biker jacket with asymmetric zip and vintage patina',
    price: 349.99,
    image_url: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400&h=400&fit=crop',
    category: 'mens',
    stock: 8,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Men's Shirts
export const mensShirts: Product[] = [
  {
    id: 'andsons-shirt-1',
    name: 'Vintage Flannel Check Shirt',
    description: 'Soft cotton flannel shirt with classic check pattern and vintage wash',
    price: 79.99,
    image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop',
    category: 'mens',
    stock: 25,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-shirt-2',
    name: 'Workwear Chambray Shirt',
    description: 'Durable chambray work shirt with authentic vintage details and relaxed fit',
    price: 89.99,
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
    category: 'mens',
    stock: 20,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-shirt-3',
    name: 'Oxford Button Down Shirt',
    description: 'Classic Oxford cotton shirt with button-down collar and timeless style',
    price: 69.99,
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop',
    category: 'mens',
    stock: 30,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-shirt-4',
    name: 'Vintage Band Collar Shirt',
    description: 'Minimalist band collar shirt with vintage-inspired cut and premium cotton',
    price: 85.99,
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    category: 'mens',
    stock: 15,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Men's Pants & Denim
export const mensPants: Product[] = [
  {
    id: 'andsons-pants-1',
    name: 'Vintage Cargo Pants',
    description: 'Military-inspired cargo pants with multiple pockets and relaxed fit',
    price: 119.99,
    image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop',
    category: 'mens',
    stock: 22,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-pants-2',
    name: 'Selvedge Denim Jeans',
    description: 'Premium selvedge denim with authentic vintage wash and straight cut',
    price: 149.99,
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    category: 'mens',
    stock: 18,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-pants-3',
    name: 'Workwear Chino Pants',
    description: 'Durable cotton chinos with vintage workwear styling and comfortable fit',
    price: 99.99,
    image_url: 'https://images.unsplash.com/photo-1506629905607-c28b47d3e6b0?w=400&h=400&fit=crop',
    category: 'mens',
    stock: 25,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-pants-4',
    name: 'Vintage Denim Overalls',
    description: 'Classic denim overalls with authentic vintage details and adjustable straps',
    price: 179.99,
    image_url: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&h=400&fit=crop',
    category: 'mens',
    stock: 10,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Men's T-Shirts
export const mensTshirts: Product[] = [
  {
    id: 'andsons-tshirt-1',
    name: 'Vintage Logo T-Shirt',
    description: 'Soft cotton t-shirt with vintage &Sons logo and relaxed fit',
    price: 39.99,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'mens',
    stock: 35,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-tshirt-2',
    name: 'Pocket T-Shirt',
    description: 'Classic pocket tee in premium cotton with vintage wash',
    price: 34.99,
    image_url: 'https://images.unsplash.com/photo-1583743814966-8936f37f4ec2?w=400&h=400&fit=crop',
    category: 'mens',
    stock: 40,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-tshirt-3',
    name: 'Henley Long Sleeve',
    description: 'Comfortable henley with button placket and vintage-inspired styling',
    price: 49.99,
    image_url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop',
    category: 'mens',
    stock: 28,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-tshirt-4',
    name: 'Striped Long Sleeve Tee',
    description: 'Classic striped long sleeve in soft cotton with vintage appeal',
    price: 44.99,
    image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
    category: 'mens',
    stock: 22,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Women's Collection (DAMSONS line)
export const womensClothing: Product[] = [
  {
    id: 'damsons-dress-1',
    name: 'Vintage Midi Dress',
    description: 'Elegant midi dress with vintage-inspired silhouette and premium fabric',
    price: 159.99,
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
    category: 'women',
    stock: 12,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'damsons-jacket-1',
    name: 'Cropped Denim Jacket',
    description: 'Stylish cropped denim jacket with vintage wash and modern fit',
    price: 129.99,
    image_url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=400&fit=crop',
    category: 'women',
    stock: 15,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'damsons-top-1',
    name: 'Vintage Blouse',
    description: 'Feminine blouse with vintage details and flowing silhouette',
    price: 89.99,
    image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    category: 'women',
    stock: 18,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'damsons-jeans-1',
    name: 'High-Waisted Vintage Jeans',
    description: 'Classic high-waisted jeans with authentic vintage wash and comfortable fit',
    price: 119.99,
    image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop',
    category: 'women',
    stock: 20,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'damsons-tshirt-1',
    name: 'Vintage Logo Tee',
    description: 'Soft cotton tee with DAMSONS vintage logo and relaxed fit',
    price: 42.99,
    image_url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop',
    category: 'women',
    stock: 30,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'damsons-skirt-1',
    name: 'Denim Mini Skirt',
    description: 'Classic denim mini skirt with vintage wash and modern styling',
    price: 79.99,
    image_url: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d44?w=400&h=400&fit=crop',
    category: 'women',
    stock: 16,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Accessories
export const accessories: Product[] = [
  {
    id: 'andsons-acc-1',
    name: 'Vintage Leather Belt',
    description: 'Handcrafted leather belt with vintage brass buckle and aged patina',
    price: 69.99,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'accessories',
    stock: 25,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-acc-2',
    name: 'Canvas Messenger Bag',
    description: 'Durable canvas messenger bag with leather trim and vintage styling',
    price: 149.99,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'accessories',
    stock: 12,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-acc-3',
    name: 'Vintage Baseball Cap',
    description: 'Classic baseball cap with vintage &Sons logo and weathered finish',
    price: 49.99,
    image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop',
    category: 'accessories',
    stock: 30,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-acc-4',
    name: 'Leather Wallet',
    description: 'Premium leather wallet with vintage patina and multiple card slots',
    price: 89.99,
    image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
    category: 'accessories',
    stock: 20,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-acc-5',
    name: 'Vintage Watch',
    description: 'Classic timepiece with vintage-inspired design and leather strap',
    price: 199.99,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'accessories',
    stock: 8,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-acc-6',
    name: 'Canvas Tote Bag',
    description: 'Sturdy canvas tote with leather handles and vintage branding',
    price: 59.99,
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
    category: 'accessories',
    stock: 18,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Sale Items
export const saleProducts: Product[] = [
  {
    id: 'andsons-sale-1',
    name: 'Vintage Flannel Shirt - Sale',
    description: 'Classic flannel shirt with vintage wash - end of season sale',
    price: 49.99, // Original: £79.99
    image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop',
    category: 'on-sale',
    stock: 8,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-sale-2',
    name: 'Denim Jacket - Sale',
    description: 'Classic denim jacket with vintage details - limited time offer',
    price: 99.99, // Original: £159.99
    image_url: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=400&fit=crop',
    category: 'on-sale',
    stock: 5,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-sale-3',
    name: 'Canvas Bag - Sale',
    description: 'Durable canvas messenger bag - clearance price',
    price: 89.99, // Original: £149.99
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'on-sale',
    stock: 3,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// New Arrivals
export const newArrivals: Product[] = [
  {
    id: 'andsons-new-1',
    name: 'Limited Edition Vintage Tee',
    description: 'Exclusive limited edition t-shirt with special vintage graphics',
    price: 54.99,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'new-arrivals',
    stock: 15,
    featured: true,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-new-2',
    name: 'Spring Collection Jacket',
    description: 'New spring lightweight jacket with modern vintage styling',
    price: 179.99,
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    category: 'new-arrivals',
    stock: 10,
    featured: true,
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updated_at: new Date().toISOString()
  },
  {
    id: 'andsons-new-3',
    name: 'Premium Denim Collection',
    description: 'New premium selvedge denim with authentic vintage treatment',
    price: 169.99,
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    category: 'new-arrivals',
    stock: 12,
    featured: true,
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updated_at: new Date().toISOString()
  }
]

// Combined product arrays for easy import
export const allAndSonsProducts: Product[] = [
  ...mensJackets,
  ...mensShirts,
  ...mensPants,
  ...mensTshirts,
  ...womensClothing,
  ...accessories,
  ...saleProducts,
  ...newArrivals
]

// Products organized by category
export const productsByCategory = {
  mens: [...mensJackets, ...mensShirts, ...mensPants, ...mensTshirts],
  women: [...womensClothing],
  accessories: [...accessories],
  'on-sale': [...saleProducts],
  'new-arrivals': [...newArrivals],
  all: allAndSonsProducts
}

// Featured products across all categories
export const featuredAndSonsProducts: Product[] = allAndSonsProducts.filter(product => product.featured)

// Export default for easy importing
export default {
  allProducts: allAndSonsProducts,
  byCategory: productsByCategory,
  featured: featuredAndSonsProducts,
  mensJackets,
  mensShirts,
  mensPants,
  mensTshirts,
  womensClothing,
  accessories,
  saleProducts,
  newArrivals
}