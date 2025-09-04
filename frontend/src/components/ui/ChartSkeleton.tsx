import React from 'react';
import { Skeleton } from './skeleton';

type ChartSkeletonProps = {
  className?: string;
  width?: number | string;
  height?: number | string;
  showLegend?: boolean;
  legendItems?: number;
};

export function ChartSkeleton({
  className = '',
  width = '100%',
  height = 300,
  showLegend = true,
  legendItems = 3,
}: ChartSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div
        className='relative overflow-hidden rounded-lg bg-muted/30'
        style={{ width, height }}
        aria-busy='true'
        aria-label='Loading chart...'
      >
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='animate-pulse flex flex-col items-center gap-2'>
            <div className='h-8 w-8 rounded-full bg-muted-foreground/20' />
            <div className='h-2 w-24 rounded-full bg-muted-foreground/20' />
          </div>
        </div>
      </div>

      {showLegend && (
        <div className='flex flex-wrap items-center justify-center gap-4'>
          {Array.from({ length: legendItems }).map((_, i) => (
            <div key={i} className='flex items-center gap-2'>
              <Skeleton className='h-3 w-3 rounded-full' />
              <Skeleton className='h-4 w-16' />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
