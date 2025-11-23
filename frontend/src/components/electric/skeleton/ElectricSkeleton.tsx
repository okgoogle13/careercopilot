/**
 * ELECTRIC ALCHEMIST: SKELETON COMPONENT
 * Loading placeholder with subtle pulse animation
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/cn';

const skeletonVariants = cva(
  [
    'animate-pulse rounded-badge',
    'bg-surface-container-high',
  ],
  {
    variants: {
      variant: {
        text: 'h-4 w-full',
        title: 'h-8 w-3/4',
        circle: 'h-12 w-12 rounded-full',
        rect: 'h-24 w-full',
        button: 'h-11 w-32 rounded-button',
      },
    },
    defaultVariants: {
      variant: 'text',
    },
  }
);

export interface ElectricSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

export const ElectricSkeleton = React.forwardRef<HTMLDivElement, ElectricSkeletonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        {...props}
      />
    );
  }
);

ElectricSkeleton.displayName = 'ElectricSkeleton';
