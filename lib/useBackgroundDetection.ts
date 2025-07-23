'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to detect background color and determine appropriate text/icon colors
 * Returns true if background is light (requiring dark text), false if dark (requiring light text)
 */
export const useBackgroundDetection = () => {
  const [isLightBackground, setIsLightBackground] = useState(false);

  useEffect(() => {
    const detectBackgroundColor = () => {
      // Get the computed background color of the body or main container
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      const backgroundColor = computedStyle.backgroundColor;
      
      // Convert RGB to determine if it's light or dark
      const isLight = isLightColor(backgroundColor);
      setIsLightBackground(isLight);
    };

    // Initial detection
    detectBackgroundColor();

    // Create a MutationObserver to watch for style changes
    const observer = new MutationObserver(() => {
      detectBackgroundColor();
    });

    // Observe changes to the body's attributes and style
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      subtree: true
    });

    // Also listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = () => {
      setTimeout(detectBackgroundColor, 100); // Small delay to ensure styles are applied
    };
    
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  return isLightBackground;
};

/**
 * Utility function to determine if a color is light or dark
 * @param color - CSS color string (rgb, rgba, hex, or named color)
 * @returns true if the color is light, false if dark
 */
function isLightColor(color: string): boolean {
  // Handle different color formats
  let r = 0, g = 0, b = 0;

  // RGB or RGBA format
  if (color.startsWith('rgb')) {
    const matches = color.match(/\d+/g);
    if (matches && matches.length >= 3) {
      r = parseInt(matches[0]);
      g = parseInt(matches[1]);
      b = parseInt(matches[2]);
    }
  }
  // Hex format
  else if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
  }
  // Named colors or other formats - default to checking common cases
  else if (color === 'white' || color === 'transparent') {
    return true;
  } else if (color === 'black') {
    return false;
  }
  // For other cases, try to get RGB values from a canvas
  else {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const imageData = ctx.getImageData(0, 0, 1, 1);
        r = imageData.data[0];
        g = imageData.data[1];
        b = imageData.data[2];
      }
    } catch (e) {
      // Fallback to assuming dark background
      return false;
    }
  }

  // Calculate relative luminance using the formula from WCAG
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return true if luminance is greater than 0.5 (light background)
  return luminance > 0.5;
}

/**
 * Get appropriate text color classes based on background
 * @param isLightBackground - Whether the background is light
 * @returns Tailwind CSS classes for text color
 */
export const getTextColorClasses = (isLightBackground: boolean): string => {
  return isLightBackground 
    ? 'text-gray-900 hover:text-gray-700' 
    : 'text-white hover:text-gray-200';
};

/**
 * Get appropriate icon color classes based on background
 * @param isLightBackground - Whether the background is light
 * @returns Tailwind CSS classes for icon color
 */
export const getIconColorClasses = (isLightBackground: boolean): string => {
  return isLightBackground 
    ? 'text-gray-900 hover:text-gray-700' 
    : 'text-white hover:text-gray-200';
};

/**
 * Get appropriate border color classes based on background
 * @param isLightBackground - Whether the background is light
 * @returns Tailwind CSS classes for border color
 */
export const getBorderColorClasses = (isLightBackground: boolean): string => {
  return isLightBackground 
    ? 'border-gray-200 hover:border-gray-300' 
    : 'border-white/20 hover:border-white/30';
};