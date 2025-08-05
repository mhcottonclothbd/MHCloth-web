/**
 * Dashboard Configuration
 * Centralized configuration for admin dashboard settings and constants
 */

export const DASHBOARD_CONFIG = {
  // Stock thresholds
  LOW_STOCK_THRESHOLD: 20,
  
  // Default values
  DEFAULT_PRODUCT_NAME: 'Unnamed Product',
  DEFAULT_DESCRIPTION: 'No description available',
  DEFAULT_IMAGE: '/placeholder-image.svg',
  DEFAULT_CATEGORY: 'General',
  DEFAULT_SUBCATEGORY: 'General',
  
  // Stock range for random generation
  STOCK_RANGE: {
    MIN: 10,
    MAX: 100
  },
  
  // Featured product probability (0-1)
  FEATURED_PROBABILITY: 0.3,
  
  // Order generation settings
  ORDER_COUNT_RANGE: {
    MIN: 8,
    MAX: 15
  },
  
  // Quantity multiplier range for orders
  ORDER_QUANTITY_RANGE: {
    MIN: 1,
    MAX: 3
  },
  
  // Date ranges (in days)
  DATE_RANGES: {
    PRODUCT_CREATION_MAX_DAYS_AGO: 30,
    ORDER_CREATION_MAX_DAYS_AGO: 30,
    RECENT_ORDERS_DAYS: 7
  },
  
  // Analytics ranges
  ANALYTICS: {
    CONVERSION_RATE_RANGE: {
      MIN: 2,
      MAX: 7
    },
    MONTHLY_GROWTH_RANGE: {
      MIN: 5,
      MAX: 25
    },
    CUSTOMER_SATISFACTION_RANGE: {
      MIN: 6,
      MAX: 9
    },
    SALES_COUNT_RANGE: {
      MIN: 10,
      MAX: 100
    }
  },
  
  // Order statuses
  ORDER_STATUSES: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const,
  
  // Customer data generation
  CUSTOMER_DATA: {
    NAME_PREFIX: 'Customer',
    EMAIL_DOMAIN: 'example.com',
    EMAIL_PREFIX: 'customer'
  },
  
  // Order number format
  ORDER_NUMBER: {
    PREFIX: 'ORD-',
    PADDING: 4
  },
  
  // Product categories
  CATEGORIES: {
    KIDS: 'Kids',
    WOMEN: 'Women',
    MEN: 'Men'
  },
  
  // UI Settings
  UI: {
    PRODUCTS_PER_PAGE: 10,
    TOP_PRODUCTS_COUNT: 5,
    SKELETON_CARDS_COUNT: 4
  }
}

// Type definitions for configuration
export type OrderStatus = typeof DASHBOARD_CONFIG.ORDER_STATUSES[number]

// Utility functions for generating dynamic data
export const generateRandomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const generateRandomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

export const getRandomElement = <T>(array: readonly T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

export const generateCustomerName = (index: number): string => {
  return `${DASHBOARD_CONFIG.CUSTOMER_DATA.NAME_PREFIX} ${index + 1}`
}

export const generateCustomerEmail = (index: number): string => {
  return `${DASHBOARD_CONFIG.CUSTOMER_DATA.EMAIL_PREFIX}${index + 1}@${DASHBOARD_CONFIG.CUSTOMER_DATA.EMAIL_DOMAIN}`
}

export const generateOrderNumber = (index: number): string => {
  return `${DASHBOARD_CONFIG.ORDER_NUMBER.PREFIX}${String(index + 1).padStart(DASHBOARD_CONFIG.ORDER_NUMBER.PADDING, '0')}`
}

export const generateDateInPast = (maxDaysAgo: number): string => {
  const daysAgo = Math.random() * maxDaysAgo
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()
}

export const isLowStock = (stock: number): boolean => {
  return stock < DASHBOARD_CONFIG.LOW_STOCK_THRESHOLD
}

export const calculateRecentOrders = (orders: any[], daysBack: number = DASHBOARD_CONFIG.DATE_RANGES.RECENT_ORDERS_DAYS): number => {
  const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000)
  return orders.filter(order => new Date(order.created_at) > cutoffDate).length
}