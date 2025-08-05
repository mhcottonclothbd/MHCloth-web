/**
 * Currency formatting utilities for Bangladeshi Taka (BDT)
 * Provides consistent currency formatting across the application
 */

/**
 * Format a number as Bangladeshi Taka (BDT) currency
 * @param amount - The amount to format
 * @param showSymbol - Whether to show the currency symbol (default: true)
 * @returns Formatted currency string
 */
export function formatBDT(amount: number, showSymbol: boolean = true): string {
  const formatted = new Intl.NumberFormat('bn-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  
  return showSymbol ? `৳${formatted}` : formatted;
}

/**
 * Format a number as Bangladeshi Taka with compact notation for large numbers
 * @param amount - The amount to format
 * @returns Formatted currency string with compact notation (e.g., ৳1.2K, ৳1.5M)
 */
export function formatBDTCompact(amount: number): string {
  const formatted = new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    notation: 'compact',
    compactDisplay: 'short',
  }).format(amount);
  
  // Replace the default BDT symbol with ৳
  return formatted.replace('BDT', '৳');
}

/**
 * Parse a BDT currency string back to a number
 * @param currencyString - The currency string to parse
 * @returns Parsed number or null if invalid
 */
export function parseBDT(currencyString: string): number | null {
  // Remove currency symbols and spaces
  const cleanString = currencyString.replace(/[৳,\s]/g, '');
  const parsed = parseFloat(cleanString);
  
  return isNaN(parsed) ? null : parsed;
}

/**
 * Convert USD to BDT (for legacy data migration)
 * @param usdAmount - Amount in USD
 * @param exchangeRate - USD to BDT exchange rate (default: 110)
 * @returns Amount in BDT
 */
export function convertUSDToBDT(usdAmount: number, exchangeRate: number = 110): number {
  return usdAmount * exchangeRate;
}

/**
 * Format price range in BDT
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @returns Formatted price range string
 */
export function formatBDTPriceRange(minPrice: number, maxPrice: number): string {
  if (minPrice === maxPrice) {
    return formatBDT(minPrice);
  }
  return `${formatBDT(minPrice)} - ${formatBDT(maxPrice)}`;
}