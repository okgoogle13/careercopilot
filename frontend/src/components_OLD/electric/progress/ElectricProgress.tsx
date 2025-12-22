/**
 * ELECTRIC ALCHEMIST: PROGRESS COMPONENT
 * Linear and circular progress indicators
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/cn';

const progressVariants = cva(
  'overflow-hidden rounded-badge bg-surface-container',
  {
    variants: {
      variant: {
        linear: 'w-full h-2',
        thick: 'w-full h-4',
      },
    },
    defaultVariants: {
      variant: 'linear',
    },
  }
);

export interface ElectricProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number; // 0-100
  max?: number;
}

export const ElectricProgress = React.forwardRef<HTMLDivElement, ElectricProgressProps>(
  ({ className, variant, value = 0, max = 100, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div
        ref={ref}
        className={cn(progressVariants({ variant }), className)}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        <div
          className="h-full bg-tertiary transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

ElectricProgress.displayName = 'ElectricProgress';
