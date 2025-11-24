/**
 * ELECTRIC ALCHEMIST: CHECKBOX COMPONENT
 * Checkbox with Tactile Press physics
 */

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/cn';

export interface ElectricCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const ElectricCheckbox = React.forwardRef<HTMLInputElement, ElectricCheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkboxId = id || React.useId();

    return (
      <div className="flex items-center gap-2">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={cn(
              'peer h-5 w-5 shrink-0 rounded-badge',
              'border border-outline-variant',
              'bg-surface-container',
              'cursor-pointer',
              'transition-all duration-150',
              'checked:bg-primary-container checked:border-primary-container',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            {...props}
          />
          <svg
            className={cn(
              'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              'h-3 w-3 text-on-primary-container',
              'opacity-0 peer-checked:opacity-100',
              'transition-opacity duration-150'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-ai cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

ElectricCheckbox.displayName = 'ElectricCheckbox';
