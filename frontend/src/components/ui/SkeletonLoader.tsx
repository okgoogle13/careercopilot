/**
 * ELECTRIC ALCHEMIST: SKELETON LOADER
 *
 * Animated placeholder for loading content using Electric Alchemist design system.
 * Replaces MUI Skeleton with design system components.
 */

import React from 'react';
import { Card } from './Card';
import { Skeleton, SkeletonText, SkeletonCircle } from './Skeleton';
import { cn } from '@/lib/utils';

export interface SkeletonLoaderProps {
  type?: 'card' | 'table' | 'list' | 'profile' | 'content';
  count?: number;
  fullHeight?: boolean;
}

/**
 * SkeletonLoader Component
 *
 * Animated placeholder for loading content.
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'card',
  count = 3,
  fullHeight = false,
}) => {
  const renderCardSkeleton = () => (
    <Card variant="default" className="p-6">
      <Skeleton variant="text" height={40} className="mb-2" />
      <Skeleton variant="text" height={20} className="mb-4" />
      <Skeleton variant="rectangular" height={100} className="rounded-[8px]" />
    </Card>
  );

  const renderTableSkeleton = () => (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-4 gap-4 mb-4 p-4 border border-outline-variant rounded-[8px] bg-surface-container-low"
        >
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </div>
      ))}
    </div>
  );

  const renderListSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 p-4 border border-outline-variant rounded-[8px] bg-surface-container-low"
        >
          <SkeletonCircle size={40} />
          <div className="flex-1">
            <Skeleton variant="text" height={24} className="mb-2" />
            <Skeleton variant="text" height={16} width="80%" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderProfileSkeleton = () => (
    <div>
      <div className="flex items-center mb-6">
        <SkeletonCircle size={64} className="mr-4" />
        <div className="flex-1">
          <Skeleton variant="text" height={32} className="mb-2" />
          <Skeleton variant="text" height={20} width="60%" />
        </div>
      </div>
      <Skeleton variant="rectangular" height={150} className="rounded-[8px] mb-4" />
      <div className="space-y-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
      </div>
    </div>
  );

  const renderContentSkeleton = () => (
    <div>
      <Skeleton variant="text" height={40} className="mb-4" />
      <div className="space-y-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="90%" />
      </div>
    </div>
  );

  const getSkeletonContent = () => {
    switch (type) {
      case 'card':
        return Array.from({ length: count }).map((_, i) => (
          <div key={i} className="mb-4">
            {renderCardSkeleton()}
          </div>
        ));
      case 'table':
        return renderTableSkeleton();
      case 'list':
        return renderListSkeleton();
      case 'profile':
        return renderProfileSkeleton();
      case 'content':
        return renderContentSkeleton();
      default:
        return renderCardSkeleton();
    }
  };

  return (
    <div
      className={cn('py-4', fullHeight && 'min-h-screen')}
      role="status"
      aria-label="Loading content"
      aria-busy={true}
    >
      {type === 'card' ? (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {getSkeletonContent()}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">{getSkeletonContent()}</div>
      )}
    </div>
  );
};

