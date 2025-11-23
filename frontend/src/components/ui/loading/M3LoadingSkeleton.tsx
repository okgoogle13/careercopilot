/**
 * M3 Expressive LoadingSkeleton Component  
 * Composition of M3Skeleton for common loading patterns
 */
import React from 'react';
import { M3Skeleton } from '../M3Skeleton';
import './M3LoadingSkeleton.css';

export interface M3LoadingSkeletonProps {
  /**
   * Number of skeleton lines to show
   * @default 3
   */
  lines?: number;

  /**
   * Custom className
   */
  className?: string;
}

export const M3LoadingSkeleton: React.FC<M3LoadingSkeletonProps> = ({
  lines = 3,
  className = '',
}) => {
  return (
    <div className={`m3-loading-skeleton ${className}`} data-testid="m3-loading-skeleton">
      {Array.from({ length: lines }).map((_, index) => (
        <M3Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
};

M3LoadingSkeleton.displayName = 'M3LoadingSkeleton';

export default M3LoadingSkeleton;
