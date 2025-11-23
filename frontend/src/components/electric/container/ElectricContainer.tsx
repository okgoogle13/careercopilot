/**
 * ELECTRIC ALCHEMIST: CONTAINER COMPONENT
 * Responsive container with max-width breakpoints
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/cn';

const containerVariants = cva(
  'w-full mx-auto px-4',
  {
    variants: {
      size: {
        sm: 'max-w-screen-sm',
        md: 'max-w-screen-md',
        lg: 'max-w-screen-lg',
        xl: 'max-w-screen-xl',
        '2xl': 'max-w-screen-2xl',
        full: 'max-w-full',
      },
    },
    defaultVariants: {
      size: 'xl',
    },
  }
);

export interface ElectricContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export const ElectricContainer = React.forwardRef<HTMLDivElement, ElectricContainerProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(containerVariants({ size }), className)}
        {...props}
      />
    );
  }
);

ElectricContainer.displayName = 'ElectricContainer';
