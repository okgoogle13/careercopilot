import React, { forwardRef } from 'react';

export interface ShimmerSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'list-item';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const ShimmerSkeleton = forwardRef<HTMLDivElement, ShimmerSkeletonProps>(
  ({ className = '', variant = 'rectangular', width, height, lines = 1 }, ref) => {
    const baseClasses = `
      shimmer relative overflow-hidden
      bg-gradient-to-r from-[var(--glass-bg)] via-[var(--glass-border)] to-[var(--glass-bg)]
      bg-[length:200%_100%]
      animate-shimmer
    `;

    const getVariantClasses = () => {
      switch (variant) {
        case 'text':
          return 'h-4 rounded-[var(--radius-md)]';
        case 'circular':
          return 'rounded-full aspect-square';
        case 'rectangular':
          return 'rounded-[var(--radius-lg)]';
        case 'card':
          return 'rounded-[var(--radius-lg)] h-48';
        case 'list-item':
          return 'rounded-[var(--radius-lg)] h-16';
        default:
          return 'rounded-[var(--radius-lg)]';
      }
    };

    const style: React.CSSProperties = {
      width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
      height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    };

    if (variant === 'text' && lines > 1) {
      return (
        <div ref={ref} className={`space-y-2 ${className}`}>
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={`${baseClasses} ${getVariantClasses()}`}
              style={{
                ...style,
                width: index === lines - 1 ? '70%' : style.width,
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`${baseClasses} ${getVariantClasses()} ${className}`}
        style={style}
      />
    );
  }
);

ShimmerSkeleton.displayName = 'ShimmerSkeleton';

// Predefined skeleton components for common use cases

export const SkeletonCard = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className = '' }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          p-6 rounded-[var(--radius-lg)]
          bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
          border-2 border-[var(--glass-border)]
          ${className}
        `}
      >
        <div className="flex items-start gap-4">
          <ShimmerSkeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-3">
            <ShimmerSkeleton variant="text" width="60%" />
            <ShimmerSkeleton variant="text" width="80%" />
            <ShimmerSkeleton variant="text" width="40%" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <ShimmerSkeleton variant="text" lines={3} />
        </div>
      </div>
    );
  }
);

SkeletonCard.displayName = 'SkeletonCard';

export const SkeletonListItem = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className = '' }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          p-4 rounded-[var(--radius-lg)]
          bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
          border-2 border-[var(--glass-border)]
          flex items-center gap-4
          ${className}
        `}
      >
        <ShimmerSkeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <ShimmerSkeleton variant="text" width="70%" />
          <ShimmerSkeleton variant="text" width="40%" />
        </div>
        <ShimmerSkeleton variant="rectangular" width={80} height={32} />
      </div>
    );
  }
);

SkeletonListItem.displayName = 'SkeletonListItem';

// Add shimmer animation to globals.css if not already present
const shimmerStyles = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.shimmer {
  background: linear-gradient(
    90deg,
    rgba(30, 30, 35, 0.7) 0%,
    rgba(167, 139, 250, 0.1) 50%,
    rgba(30, 30, 35, 0.7) 100%
  );
  background-size: 200% 100%;
}
`;
