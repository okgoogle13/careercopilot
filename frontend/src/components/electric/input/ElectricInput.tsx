/**
 * ELECTRIC ALCHEMIST: INPUT COMPONENT
 * Text input with AI tier typography
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/cn';

const inputVariants = cva(
  [
    'flex w-full rounded-button',
    'border border-solid border-outline-variant',
    'bg-surface-container text-primary',
    'px-4 py-3',
    'text-ai font-ai',
    'transition-colors duration-150',
    'placeholder:text-outline',
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

export interface ElectricInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

export const ElectricInput = React.forwardRef<HTMLInputElement, ElectricInputProps>(
  ({ className, variant, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(inputVariants({ variant }), className)}
        {...props}
      />
    );
  }
);

ElectricInput.displayName = 'ElectricInput';
