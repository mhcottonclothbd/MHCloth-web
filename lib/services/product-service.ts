import type { Product } from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  status?: string;
  price_min?: number;
  price_max?: number;
  brand?: string;
  size?: string[];
  color?: string[];
  is_on_sale?: boolean;
  is_featured?: boolean;
  sort_by?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ProductResponse {
  success: boolean;
  data: Product[];
  count: number;
  error?: string;
}

/**
 * Fetch products with filters
 */
export async function fetchProducts(filters: ProductFilters = {}): Promise<ProductResponse> {
  try {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.subcategory) {
      query = query.eq('subcategory_id', filters.subcategory);
    }

    if (filters.brand) {
      query = query.eq('brand', filters.brand);
    }

    if (filters.price_min !== undefined) {
      query = query.gte('price', filters.price_min);
    }

    if (filters.price_max !== undefined) {
      query = query.lte('price', filters.price_max);
    }

    if (filters.is_on_sale !== undefined) {
      query = query.eq('is_on_sale', filters.is_on_sale);
    }

    if (filters.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
    }

    if (filters.size && filters.size.length > 0) {
      query = query.overlaps('sizes', filters.size);
    }

    if (filters.color && filters.color.length > 0) {
      query = query.overlaps('colors', filters.color);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Apply sorting
    if (filters.sort_by) {
      switch (filters.sort_by) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'name_asc':
          query = query.order('name', { ascending: true });
          break;
        case 'name_desc':
          query = query.order('name', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return {
      success: true,
      data: data || [],
      count: count || 0,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      data: [],
      count: 0,
      error: error instanceof Error ? error.message : 'Failed to fetch products',
    };
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Product not found
      }
      throw new Error(`Failed to fetch product: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Fetch featured products
 */
export async function fetchFeaturedProducts(limit: number = 8): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch featured products: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

/**
 * Fetch products on sale
 */
export async function fetchOnSaleProducts(limit: number = 8): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_on_sale', true)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch on-sale products: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching on-sale products:', error);
    return [];
  }
}

/**
 * Fetch new arrivals
 */
export async function fetchNewArrivals(limit: number = 8): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch new arrivals: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
}

/**
 * Search products
 */
export async function searchProducts(query: string, limit: number = 20): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to search products: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

/**
 * Get product categories
 */
export async function getProductCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('status', 'active');

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    const categories = [...new Set((data || []).map(item => item.category).filter(Boolean))] as string[];
    return categories.sort();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get product brands
 */
export async function getProductBrands(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('brand')
      .eq('status', 'active');

    if (error) {
      throw new Error(`Failed to fetch brands: ${error.message}`);
    }

    const brands = [...new Set((data || []).map(item => item.brand).filter(Boolean))] as string[];
    return brands.sort();
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

/**
 * Get distinct sizes across active products
 */
export async function getProductSizes(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('sizes')
      .eq('status', 'active');

    if (error) {
      throw new Error(`Failed to fetch sizes: ${error.message}`);
    }

    const set = new Set<string>();
    (data || []).forEach((row: any) => {
      if (Array.isArray(row.sizes)) {
        row.sizes.forEach((s: any) => {
          if (typeof s === 'string' && s.trim()) set.add(s.trim());
        });
      }
    });
    return Array.from(set).sort();
  } catch (error) {
    console.error('Error fetching sizes:', error);
    return [];
  }
}

/**
 * Get distinct colors across active products
 */
export async function getProductColors(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('colors')
      .eq('status', 'active');

    if (error) {
      throw new Error(`Failed to fetch colors: ${error.message}`);
    }

    const set = new Set<string>();
    (data || []).forEach((row: any) => {
      if (Array.isArray(row.colors)) {
        row.colors.forEach((c: any) => {
          if (typeof c === 'string' && c.trim()) set.add(c.trim());
        });
      }
    });
    return Array.from(set).sort();
  } catch (error) {
    console.error('Error fetching colors:', error);
    return [];
  }
}

/**
 * Get min/max price bounds efficiently
 */
export async function getProductPriceBounds(): Promise<{ min: number; max: number }> {
  try {
    const [{ data: minRow }, { data: maxRow }] = await Promise.all([
      supabase
        .from('products')
        .select('price')
        .eq('status', 'active')
        .order('price', { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('products')
        .select('price')
        .eq('status', 'active')
        .order('price', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const min = typeof minRow?.price === 'number' ? minRow.price : 0;
    const max = typeof maxRow?.price === 'number' ? maxRow.price : 0;
    if (min === 0 && max === 0) return { min: 0, max: 1000 };
    return { min, max };
  } catch (error) {
    console.error('Error fetching price bounds:', error);
    return { min: 0, max: 1000 };
  }
}