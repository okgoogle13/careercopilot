'use client';
import * as React from 'react';
import { cn } from './utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

// Application Card Skeleton
const ApplicationCardSkeleton: React.FC = () => (
  <div className="border border-gray-200 rounded-lg p-6 space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-20 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

// Profile Section Skeleton
const ProfileSectionSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <Skeleton className="h-5 w-5 rounded" />
      <Skeleton className="h-6 w-48" />
    </div>
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Dashboard Stats Skeleton
const DashboardStatsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="border border-gray-200 rounded-lg p-6 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-full" />
      </div>
    ))}
  </div>
);

// Table Skeleton
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4
}) => (
  <div className="space-y-3">
    {/* Table Header */}
    <div className="flex gap-4 pb-2 border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-24" />
      ))}
    </div>
    {/* Table Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4 py-2">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            className={cn(
              'h-4',
              colIndex === 0 ? 'w-32' : 'w-20'
            )}
          />
        ))}
      </div>
    ))}
  </div>
);

// Page Loading Skeleton
const PageLoadingSkeleton: React.FC<{ type?: 'dashboard' | 'profile' | 'applications' }> = ({
  type = 'dashboard'
}) => {
  if (type === 'dashboard') {
    return (
      <div className="space-y-8 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <DashboardStatsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="space-y-8 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 space-y-6">
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          </div>
          <div className="col-span-9">
            <ProfileSectionSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'applications') {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>

        {/* Applications */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <ApplicationCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return <DashboardStatsSkeleton />;
};

// Loading Dots Animation
const LoadingDots: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex items-center space-x-1', className)}>
    <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
    <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
  </div>
);

export {
  Skeleton,
  ApplicationCardSkeleton,
  ProfileSectionSkeleton,
  DashboardStatsSkeleton,
  TableSkeleton,
  PageLoadingSkeleton,
  LoadingDots
};
