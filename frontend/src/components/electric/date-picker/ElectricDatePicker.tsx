/**
 * ELECTRIC ALCHEMIST: DATE PICKER COMPONENT
 * Date selection input with AI tier typography
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/cn';

const datePickerVariants = cva(
  [
    'flex w-full rounded-button',
    'border border-solid border-outline-variant',
    'bg-surface-container text-primary',
    'px-4 py-3',
    'text-ai font-ai',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
    'disabled:cursor-not-allowed disabled:opacity-50',
    // Date input specific styles
    '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
    '[&::-webkit-calendar-picker-indicator]:opacity-70',
    '[&::-webkit-calendar-picker-indicator]:hover:opacity-100',
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

export interface ElectricDatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
    VariantProps<typeof datePickerVariants> {
  label?: string;
}

export const ElectricDatePicker = React.forwardRef<HTMLInputElement, ElectricDatePickerProps>(
  ({ className, variant, label, id, ...props }, ref) => {
    const datePickerId = id || React.useId();

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={datePickerId} className="block text-ai mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type="date"
          id={datePickerId}
          className={cn(datePickerVariants({ variant }), className)}
          {...props}
        />
      </div>
    );
  }
);

ElectricDatePicker.displayName = 'ElectricDatePicker';
