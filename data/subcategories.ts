/**
 * Subcategory data for different main categories
 * Organized by parent category for easy filtering
 */

import type { Subcategory } from '@/types';

// Men's subcategories
export const mensSubcategories: Subcategory[] = [
  // T-Shirts subcategories
  { id: 'basic-tees', name: 'Basic T-Shirts', description: 'Essential everyday tees', category_id: 't-shirts' },
  { id: 'graphic-tees', name: 'Graphic T-Shirts', description: 'T-shirts with prints and designs', category_id: 't-shirts' },
  { id: 'v-neck-tees', name: 'V-Neck T-Shirts', description: 'Classic v-neck style tees', category_id: 't-shirts' },
  { id: 'long-sleeve-tees', name: 'Long Sleeve T-Shirts', description: 'Long sleeve casual tees', category_id: 't-shirts' },

  // Polo Shirts subcategories
  { id: 'classic-polo', name: 'Classic Polo', description: 'Traditional polo shirts', category_id: 'polo-shirts' },
  { id: 'performance-polo', name: 'Performance Polo', description: 'Athletic and moisture-wicking polo shirts', category_id: 'polo-shirts' },
  { id: 'long-sleeve-polo', name: 'Long Sleeve Polo', description: 'Long sleeve polo shirts', category_id: 'polo-shirts' },

  // Shirts subcategories
  { id: 'dress-shirts', name: 'Dress Shirts', description: 'Formal business shirts', category_id: 'shirts' },
  { id: 'casual-shirts', name: 'Casual Shirts', description: 'Relaxed fit casual shirts', category_id: 'shirts' },
  { id: 'flannel-shirts', name: 'Flannel Shirts', description: 'Comfortable flannel shirts', category_id: 'shirts' },
  { id: 'denim-shirts', name: 'Denim Shirts', description: 'Classic denim button-up shirts', category_id: 'shirts' },

  // Hoodies subcategories
  { id: 'pullover-hoodies', name: 'Pullover Hoodies', description: 'Classic pullover style hoodies', category_id: 'hoodies' },
  { id: 'zip-up-hoodies', name: 'Zip-Up Hoodies', description: 'Full-zip hoodies and sweatshirts', category_id: 'hoodies' },
  { id: 'crewneck-sweatshirts', name: 'Crewneck Sweatshirts', description: 'Classic crewneck sweatshirts', category_id: 'hoodies' },

  // Jackets subcategories
  { id: 'bomber-jackets', name: 'Bomber Jackets', description: 'Classic bomber style jackets', category_id: 'jackets' },
  { id: 'denim-jackets', name: 'Denim Jackets', description: 'Timeless denim jackets', category_id: 'jackets' },
  { id: 'leather-jackets', name: 'Leather Jackets', description: 'Premium leather jackets', category_id: 'jackets' },
  { id: 'winter-coats', name: 'Winter Coats', description: 'Warm winter outerwear', category_id: 'jackets' },

  // Jeans subcategories
  { id: 'skinny-jeans', name: 'Skinny Jeans', description: 'Slim fit skinny jeans', category_id: 'jeans' },
  { id: 'straight-jeans', name: 'Straight Jeans', description: 'Classic straight leg jeans', category_id: 'jeans' },
  { id: 'relaxed-jeans', name: 'Relaxed Jeans', description: 'Comfortable relaxed fit jeans', category_id: 'jeans' },
  { id: 'bootcut-jeans', name: 'Bootcut Jeans', description: 'Bootcut style jeans', category_id: 'jeans' },

  // Trousers subcategories
  { id: 'dress-pants', name: 'Dress Pants', description: 'Formal dress trousers', category_id: 'trousers' },
  { id: 'chinos', name: 'Chinos', description: 'Casual chino pants', category_id: 'trousers' },
  { id: 'khakis', name: 'Khakis', description: 'Classic khaki trousers', category_id: 'trousers' },

  // Shorts subcategories
  { id: 'casual-shorts', name: 'Casual Shorts', description: 'Everyday casual shorts', category_id: 'shorts' },
  { id: 'athletic-shorts', name: 'Athletic Shorts', description: 'Sports and workout shorts', category_id: 'shorts' },
  { id: 'board-shorts', name: 'Board Shorts', description: 'Beach and swim shorts', category_id: 'shorts' },
];

// Women's subcategories
export const womensSubcategories: Subcategory[] = [
  // Hoodies subcategories
  { id: 'womens-pullover-hoodies', name: 'Pullover Hoodies', description: 'Cozy pullover hoodies', category_id: 'hoodies' },
  { id: 'womens-zip-hoodies', name: 'Zip-Up Hoodies', description: 'Stylish zip-up hoodies', category_id: 'hoodies' },
  { id: 'womens-crop-hoodies', name: 'Crop Hoodies', description: 'Trendy cropped hoodies', category_id: 'hoodies' },

  // Sweaters subcategories
  { id: 'cardigans', name: 'Cardigans', description: 'Elegant button-up cardigans', category_id: 'sweaters' },
  { id: 'pullover-sweaters', name: 'Pullover Sweaters', description: 'Cozy pullover sweaters', category_id: 'sweaters' },
  { id: 'turtleneck-sweaters', name: 'Turtleneck Sweaters', description: 'Classic turtleneck sweaters', category_id: 'sweaters' },

  // Tops subcategories
  { id: 'blouses', name: 'Blouses', description: 'Elegant blouses for work and casual', category_id: 'tops' },
  { id: 'tank-tops', name: 'Tank Tops', description: 'Comfortable tank tops', category_id: 'tops' },
  { id: 'camisoles', name: 'Camisoles', description: 'Delicate camisole tops', category_id: 'tops' },
  { id: 'crop-tops', name: 'Crop Tops', description: 'Trendy crop tops', category_id: 'tops' },

  // Tunics subcategories
  { id: 'casual-tunics', name: 'Casual Tunics', description: 'Comfortable everyday tunics', category_id: 'tunics' },
  { id: 'ethnic-kurtis', name: 'Ethnic Kurtis', description: 'Traditional ethnic kurtis', category_id: 'tunics' },
  { id: 'long-tunics', name: 'Long Tunics', description: 'Flowing long tunics', category_id: 'tunics' },

  // Shorts subcategories
  { id: 'womens-casual-shorts', name: 'Casual Shorts', description: 'Everyday casual shorts', category_id: 'shorts' },
  { id: 'womens-athletic-shorts', name: 'Athletic Shorts', description: 'Workout and sports shorts', category_id: 'shorts' },
  { id: 'high-waisted-shorts', name: 'High-Waisted Shorts', description: 'Trendy high-waisted shorts', category_id: 'shorts' },

  // Bras subcategories
  { id: 'everyday-bras', name: 'Everyday Bras', description: 'Comfortable daily wear bras', category_id: 'bras' },
  { id: 'sports-bras', name: 'Sports Bras', description: 'Athletic and workout bras', category_id: 'bras' },
  { id: 'push-up-bras', name: 'Push-Up Bras', description: 'Enhancing push-up bras', category_id: 'bras' },
  { id: 'wireless-bras', name: 'Wireless Bras', description: 'Comfortable wireless bras', category_id: 'bras' },

  // Panties subcategories
  { id: 'briefs', name: 'Briefs', description: 'Classic brief underwear', category_id: 'panties' },
  { id: 'bikini-panties', name: 'Bikini Panties', description: 'Comfortable bikini style panties', category_id: 'panties' },
  { id: 'thongs', name: 'Thongs', description: 'Seamless thong underwear', category_id: 'panties' },
  { id: 'boyshorts', name: 'Boyshorts', description: 'Comfortable boyshort underwear', category_id: 'panties' },
];

// Kids subcategories
export const kidsSubcategories: Subcategory[] = [
  // T-Shirts subcategories
  { id: 'kids-basic-tees', name: 'Basic T-Shirts', description: 'Essential kids tees', category_id: 't-shirts' },
  { id: 'kids-graphic-tees', name: 'Graphic T-Shirts', description: 'Fun printed tees for kids', category_id: 't-shirts' },
  { id: 'kids-character-tees', name: 'Character T-Shirts', description: 'Cartoon and character themed tees', category_id: 't-shirts' },

  // Hoodies subcategories
  { id: 'kids-pullover-hoodies', name: 'Pullover Hoodies', description: 'Cozy kids hoodies', category_id: 'hoodies' },
  { id: 'kids-zip-hoodies', name: 'Zip-Up Hoodies', description: 'Easy-wear zip hoodies', category_id: 'hoodies' },

  // Jeans subcategories
  { id: 'kids-skinny-jeans', name: 'Skinny Jeans', description: 'Trendy skinny jeans for kids', category_id: 'jeans' },
  { id: 'kids-straight-jeans', name: 'Straight Jeans', description: 'Classic straight leg jeans', category_id: 'jeans' },
  { id: 'kids-elastic-jeans', name: 'Elastic Waist Jeans', description: 'Comfortable elastic waist jeans', category_id: 'jeans' },

  // Shorts subcategories
  { id: 'kids-play-shorts', name: 'Play Shorts', description: 'Durable shorts for active play', category_id: 'shorts' },
  { id: 'kids-athletic-shorts', name: 'Athletic Shorts', description: 'Sports shorts for kids', category_id: 'shorts' },

  // Dresses subcategories
  { id: 'casual-dresses', name: 'Casual Dresses', description: 'Everyday casual dresses', category_id: 'dresses' },
  { id: 'party-dresses', name: 'Party Dresses', description: 'Special occasion dresses', category_id: 'dresses' },
  { id: 'summer-dresses', name: 'Summer Dresses', description: 'Light and airy summer dresses', category_id: 'dresses' },

  // Jackets subcategories
  { id: 'kids-winter-jackets', name: 'Winter Jackets', description: 'Warm winter jackets for kids', category_id: 'jackets' },
  { id: 'kids-rain-jackets', name: 'Rain Jackets', description: 'Waterproof rain jackets', category_id: 'jackets' },
  { id: 'kids-denim-jackets', name: 'Denim Jackets', description: 'Stylish denim jackets for kids', category_id: 'jackets' },
];

// Combined subcategories by main category
export const subcategoriesByCategory = {
  mens: mensSubcategories,
  womens: womensSubcategories,
  kids: kidsSubcategories,
};

/**
 * Get subcategories for a specific main category
 */
export const getSubcategoriesForCategory = (categoryId: string): Subcategory[] => {
  const allSubcategories = [...mensSubcategories, ...womensSubcategories, ...kidsSubcategories];
  return allSubcategories.filter(sub => sub.category_id === categoryId);
};

/**
 * Get subcategories for a main category type (mens, womens, kids)
 */
export const getSubcategoriesByMainCategory = (mainCategory: 'mens' | 'womens' | 'kids'): Subcategory[] => {
  return subcategoriesByCategory[mainCategory] || [];
};

/**
 * Get all subcategories
 */
export const getAllSubcategories = (): Subcategory[] => {
  return [...mensSubcategories, ...womensSubcategories, ...kidsSubcategories];
};

/**
 * Find subcategory by ID
 */
export const getSubcategoryById = (id: string): Subcategory | undefined => {
  const allSubcategories = getAllSubcategories();
  return allSubcategories.find(sub => sub.id === id);
};