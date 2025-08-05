import { Product } from '@/types';
import { mockProducts, getProductsByCategory, searchProducts, getFeaturedProducts, getOnSaleProducts } from '@/lib/mock-data/products';

/**
 * Mock API service to replace Supabase integration
 * Provides the same interface as the original Supabase-based API
 */

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

export interface ApiError {
  error: string;
  success: false;
}

// Product API parameters
export interface GetProductsParams {
  category?: string;
  limit?: number;
  search?: string;
  sort?: 'name' | 'price' | 'created_at';
  order?: 'asc' | 'desc';
}

/**
 * Simulates API delay for realistic behavior
 */
const simulateDelay = (ms: number = 300): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Check if response is an API error
 */
export const isApiError = (response: any): response is ApiError => {
  return response && response.success === false && response.error;
};

/**
 * Handle API errors with user-friendly messages
 */
export const handleApiError = (error: ApiError): string => {
  return error.error || 'An unexpected error occurred';
};

/**
 * Mock Product API
 */
export const productApi = {
  /**
   * Get products with filtering and search capabilities
   */
  async getProducts(params: GetProductsParams = {}): Promise<ApiResponse<Product[]> | ApiError> {
    try {
      await simulateDelay();
      
      let products = [...mockProducts];
      
      // Filter by category
      if (params.category && params.category !== 'all') {
        products = getProductsByCategory(params.category);
      }
      
      // Apply search filter
      if (params.search) {
        products = searchProducts(params.search).filter(product => 
          !params.category || params.category === 'all' || product.category === params.category
        );
      }
      
      // Sort products
      if (params.sort) {
        products.sort((a, b) => {
          let aValue: any, bValue: any;
          
          switch (params.sort) {
            case 'name':
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case 'price':
              aValue = a.price;
              bValue = b.price;
              break;
            case 'created_at':
              aValue = new Date(a.created_at);
              bValue = new Date(b.created_at);
              break;
            default:
              return 0;
          }
          
          if (params.order === 'desc') {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        });
      }
      
      // Apply limit
      if (params.limit) {
        products = products.slice(0, params.limit);
      }
      
      return {
        data: products,
        success: true
      };
    } catch (error) {
      return {
        error: 'Failed to fetch products',
        success: false
      };
    }
  },

  /**
   * Get a single product by ID
   */
  async getProduct(id: string): Promise<ApiResponse<Product | null> | ApiError> {
    try {
      await simulateDelay(200);
      
      const product = mockProducts.find(p => p.id === id);
      
      return {
        data: product || null,
        success: true
      };
    } catch (error) {
      return {
        error: 'Failed to fetch product',
        success: false
      };
    }
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit?: number): Promise<ApiResponse<Product[]> | ApiError> {
    try {
      await simulateDelay(250);
      
      let products = getFeaturedProducts();
      
      if (limit) {
        products = products.slice(0, limit);
      }
      
      return {
        data: products,
        success: true
      };
    } catch (error) {
      return {
        error: 'Failed to fetch featured products',
        success: false
      };
    }
  },

  /**
   * Get products on sale
   */
  async getOnSaleProducts(limit?: number): Promise<ApiResponse<Product[]> | ApiError> {
    try {
      await simulateDelay(250);
      
      let products = getOnSaleProducts();
      
      if (limit) {
        products = products.slice(0, limit);
      }
      
      return {
        data: products,
        success: true
      };
    } catch (error) {
      return {
        error: 'Failed to fetch sale products',
        success: false
      };
    }
  },

  /**
   * Search products
   */
  async searchProducts(query: string, limit?: number): Promise<ApiResponse<Product[]> | ApiError> {
    try {
      await simulateDelay(400);
      
      let products = searchProducts(query);
      
      if (limit) {
        products = products.slice(0, limit);
      }
      
      return {
        data: products,
        success: true
      };
    } catch (error) {
      return {
        error: 'Failed to search products',
        success: false
      };
    }
  }
};

/**
 * Category API (if needed)
 */
export const categoryApi = {
  /**
   * Get all categories
   */
  async getCategories(): Promise<ApiResponse<any[]> | ApiError> {
    try {
      await simulateDelay(200);
      
      // This would typically come from a categories mock file
      const categories = [
        { id: 'men', name: 'Men', description: 'Premium clothing for men' },
        { id: 'women', name: 'Women', description: 'Stylish clothing for women' },
        { id: 'kids', name: 'Kids', description: 'Comfortable clothing for kids' },
        { id: 'accessories', name: 'Accessories', description: 'Stylish accessories' }
      ];
      
      return {
        data: categories,
        success: true
      };
    } catch (error) {
      return {
        error: 'Failed to fetch categories',
        success: false
      };
    }
  }
};

// Export default API object
export default {
  products: productApi,
  categories: categoryApi
};