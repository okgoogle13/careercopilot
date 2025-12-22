/**
 * ELECTRIC ALCHEMIST: DIVIDER COMPONENT
 * Visual separator using outline-variant color
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/cn';

const dividerVariants = cva(
  'border-outline-variant',
  {
    variants: {
      orientation: {
        horizontal: 'w-full border-t',
        vertical: 'h-full border-l',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
);

export interface ElectricDividerProps
  extends React.HTMLAttributes<HTMLHRElement>,
    VariantProps<typeof dividerVariants> {}

export const ElectricDivider = React.forwardRef<HTMLHRElement, ElectricDividerProps>(
  ({ className, orientation, ...props }, ref) => {
    return (
      <hr
        ref={ref}
        className={cn(dividerVariants({ orientation }), className)}
        {...props}
      />
    );
  }
);

ElectricDivider.displayName = 'ElectricDivider';
