/**
 * ELECTRIC ALCHEMIST: GRID COMPONENT
 * Bento grid system with 24px spacing
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/cn';

const gridVariants = cva(
  'grid',
  {
    variants: {
      cols: {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
        12: 'grid-cols-12',
      },
      gap: {
        sm: 'gap-4',
        md: 'gap-6', // 24px (grid base)
        lg: 'gap-8',
        xl: 'gap-12',
      },
    },
    defaultVariants: {
      cols: 3,
      gap: 'md',
    },
  }
);

export interface ElectricGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

export const ElectricGrid = React.forwardRef<HTMLDivElement, ElectricGridProps>(
  ({ className, cols, gap, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(gridVariants({ cols, gap }), className)}
        {...props}
      />
    );
  }
);

ElectricGrid.displayName = 'ElectricGrid';
