import React from 'react';

interface BaseSkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const BaseSkeleton: React.FC<BaseSkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-gray-300';
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full'
  };
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse', // Can be enhanced with CSS for wave animation
    none: ''
  };
  
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;
  
  // Default dimensions for text variant
  if (variant === 'text' && !height) {
    style.height = '1em';
  }
  
  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${className}
      `.trim()}
      style={style}
    />
  );
};

// Predefined skeleton components for common use cases
export const SkeletonText: React.FC<Omit<BaseSkeletonProps, 'variant'>> = (props) => (
  <BaseSkeleton {...props} variant="text" />
);

export const SkeletonRect: React.FC<Omit<BaseSkeletonProps, 'variant'>> = (props) => (
  <BaseSkeleton {...props} variant="rectangular" />
);

export const SkeletonCircle: React.FC<Omit<BaseSkeletonProps, 'variant'>> = (props) => (
  <BaseSkeleton {...props} variant="circular" />
);

// Common skeleton layouts
export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <SkeletonCircle width={size} height={size} />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-4 bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    <div className="flex items-center space-x-3 mb-4">
      <SkeletonAvatar size={40} />
      <div className="flex-1">
        <SkeletonText className="h-4 mb-2" width="60%" />
        <SkeletonText className="h-3" width="40%" />
      </div>
    </div>
    <SkeletonRect className="h-48 mb-4" />
    <SkeletonText className="h-4 mb-2" />
    <SkeletonText className="h-4" width="80%" />
  </div>
);

export const SkeletonList: React.FC<{ 
  items?: number; 
  itemHeight?: number;
  className?: string;
}> = ({ items = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3">
        <SkeletonAvatar size={40} />
        <div className="flex-1">
          <SkeletonText className="h-4 mb-2" width="70%" />
          <SkeletonText className="h-3" width="50%" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonPost: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 ${className}`}>
    {/* Header */}
    <div className="flex items-center space-x-3 mb-4">
      <SkeletonAvatar size={50} />
      <div className="flex-1">
        <SkeletonText className="h-4 mb-2" width="40%" />
        <SkeletonText className="h-3" width="60%" />
      </div>
    </div>
    
    {/* Content */}
    <div className="mb-4">
      <SkeletonText className="h-4 mb-2" />
      <SkeletonText className="h-4 mb-2" width="90%" />
      <SkeletonText className="h-4" width="70%" />
    </div>
    
    {/* Media placeholder */}
    <SkeletonRect className="h-64 mb-4" />
    
    {/* Actions */}
    <div className="flex items-center justify-between">
      <div className="flex space-x-4">
        <SkeletonRect className="h-8" width={60} />
        <SkeletonRect className="h-8" width={60} />
      </div>
      <SkeletonRect className="h-8" width={80} />
    </div>
  </div>
);

export const SkeletonGrid: React.FC<{
  items?: number;
  columns?: number;
  aspectRatio?: string;
  className?: string;
}> = ({ items = 6, columns = 3, aspectRatio = 'aspect-square', className = '' }) => (
  <div className={`grid grid-cols-${columns} gap-4 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <SkeletonRect 
        key={index} 
        className={`w-full ${aspectRatio}`} 
      />
    ))}
  </div>
);

export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
    {/* Header */}
    <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b">
      {Array.from({ length: columns }).map((_, index) => (
        <SkeletonText key={index} className="h-4" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4 border-b last:border-b-0">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonText key={colIndex} className="h-4" />
        ))}
      </div>
    ))}
  </div>
);

export default BaseSkeleton;