/**
 * ELECTRIC ALCHEMIST: SELECT COMPONENT
 * Dropdown select with AI tier typography
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/cn';

const selectVariants = cva(
  [
    'flex w-full rounded-button',
    'border border-solid border-outline-variant',
    'bg-surface-container text-primary',
    'px-4 py-3',
    'text-ai font-ai',
    'cursor-pointer',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: '',
        error: 'border-red-500 focus-visible:ring-red-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ElectricSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {}

export const ElectricSelect = React.forwardRef<HTMLSelectElement, ElectricSelectProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(selectVariants({ variant }), className)}
        {...props}
      >
        {children}
      </select>
    );
  }
);

ElectricSelect.displayName = 'ElectricSelect';
