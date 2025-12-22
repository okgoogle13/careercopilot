/**
 * ELECTRIC ALCHEMIST: BADGE COMPONENT
 * Small status indicators with Data tier typography
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/cn';

const badgeVariants = cva(
  [
    'inline-flex items-center justify-center',
    'text-data font-data',
    'rounded-badge', // 8px
    'px-2 py-1',
    'text-xs uppercase tracking-wide',
    'border border-solid',
    'transition-colors duration-150',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-surface-container-high text-primary',
          'border-outline-variant',
        ],
        primary: [
          'bg-primary-container text-on-primary-container',
          'border-primary-container',
        ],
        tertiary: [
          'bg-tertiary-container text-on-tertiary',
          'border-tertiary-container',
        ],
        outline: [
          'bg-transparent text-primary',
          'border-outline',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ElectricBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

export const ElectricBadge = React.forwardRef<HTMLSpanElement, ElectricBadgeProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

ElectricBadge.displayName = 'ElectricBadge';
