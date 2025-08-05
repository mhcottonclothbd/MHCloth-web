'use client'

import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

/**
 * Custom hook for managing theme state with localStorage persistence
 * Provides theme toggle functionality and system preference detection
 * Handles SSR/hydration properly to prevent console errors
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      const systemTheme =
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const initialTheme = savedTheme || systemTheme;
      setTheme(initialTheme);
    } catch (error) {
      console.warn('Failed to access localStorage or matchMedia:', error);
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Failed to update theme:', error);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return {
    theme,
    toggleTheme,
    setTheme,
    mounted, // Export mounted state for conditional rendering
  };
}