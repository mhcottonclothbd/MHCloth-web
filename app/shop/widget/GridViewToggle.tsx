'use client'

import { motion } from 'framer-motion'
import { Grid3X3, List } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GridViewToggleProps {
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

export default function GridViewToggle({ viewMode, onViewModeChange }: GridViewToggleProps) {
  return (
    <div className="flex items-center bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-1 shadow-sm">
      <motion.button
        onClick={() => onViewModeChange('grid')}
        className={cn(
          'relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200',
          viewMode === 'grid' 
            ? 'text-blue-600 bg-blue-50' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Grid3X3 className="w-4 h-4" />
        {viewMode === 'grid' && (
          <motion.div
            layoutId="activeView"
            className="absolute inset-0 bg-blue-50 border border-blue-200 rounded-lg"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </motion.button>

      <motion.button
        onClick={() => onViewModeChange('list')}
        className={cn(
          'relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200',
          viewMode === 'list' 
            ? 'text-blue-600 bg-blue-50' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <List className="w-4 h-4" />
        {viewMode === 'list' && (
          <motion.div
            layoutId="activeView"
            className="absolute inset-0 bg-blue-50 border border-blue-200 rounded-lg"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </motion.button>
    </div>
  )
}
