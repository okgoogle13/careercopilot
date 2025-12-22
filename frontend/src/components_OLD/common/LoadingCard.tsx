/**
 * ELECTRIC ALCHEMIST: LOADING CARD COMPONENT
 *
 * Loading state card using Electric Alchemist Design System v4.4.
 * Composed of Card and Skeleton atoms.
 */

import React from 'react';
import { Card } from '@/components';
import { Skeleton } from '@/components/electric';

export function LoadingCard() {
  return (
    <Card className="p-6">
      {/* Profile Header Section */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Profile Stats Section */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-8" />
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-8" />
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="flex gap-2 pt-4 border-t border-outline-variant">
        <Skeleton className="h-9 flex-1 rounded-[24px]" />
        <Skeleton className="h-9 flex-1 rounded-[24px]" />
      </div>
    </Card>
  );
}

export function LoadingProfileCard() {
  return <LoadingCard />;
}

export default LoadingCard;



