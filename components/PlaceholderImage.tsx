'use client';

import React from 'react';

interface PlaceholderImageProps {
  width?: number;
  height?: number;
  text?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Reusable placeholder image component for missing product images
 * Provides a clean fallback when product images fail to load
 */
const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ 
  width = 300, 
  height = 200, 
  text = 'No Image', 
  className = '',
  style = {} 
}) => {
  return (
    <div 
      className={`bg-gray-200 flex items-center justify-center text-gray-500 ${className}`}
      style={{ width: `${width}px`, height: `${height}px`, ...style }}
    >
      <div className="text-center">
        <div className="text-4xl mb-2">📷</div>
        <div className="text-sm font-medium">{text}</div>
      </div>
    </div>
  );
};

export default PlaceholderImage;