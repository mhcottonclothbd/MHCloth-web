import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price to currency string
 * @param price - Price in cents
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
  }).format(price / 100)
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param length - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}