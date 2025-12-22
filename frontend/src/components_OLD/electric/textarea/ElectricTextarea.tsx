/**
 * ELECTRIC ALCHEMIST: TEXTAREA COMPONENT
 * Multi-line text input with Human tier typography
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/cn';

const textareaVariants = cva(
  [
    'flex w-full rounded-card',
    'border border-solid border-outline-variant',
    'bg-surface-container text-primary',
    'px-4 py-3',
    'text-human font-human', // Use Human tier for content input
    'min-h-[120px]',
    'resize-y',
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

export interface ElectricTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

export const ElectricTextarea = React.forwardRef<HTMLTextAreaElement, ElectricTextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(textareaVariants({ variant }), className)}
        {...props}
      />
    );
  }
);

ElectricTextarea.displayName = 'ElectricTextarea';
