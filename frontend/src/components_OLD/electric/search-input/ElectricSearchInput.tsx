/**
 * ELECTRIC ALCHEMIST: SEARCH INPUT COMPONENT
 * Search input with icon and clear button
 */

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/cn';

export interface ElectricSearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

export const ElectricSearchInput = React.forwardRef<HTMLInputElement, ElectricSearchInputProps>(
  ({ className, onClear, value, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {/* Search Icon */}
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-outline"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        {/* Input */}
        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            'flex w-full rounded-button',
            'border border-solid border-outline-variant',
            'bg-surface-container text-primary',
            'pl-12 pr-12 py-3',
            'text-ai font-ai',
            'transition-colors duration-150',
            'placeholder:text-outline',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />

        {/* Clear Button */}
        {value && onClear && (
          <motion.button
            type="button"
            onClick={onClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </div>
    );
  }
);

ElectricSearchInput.displayName = 'ElectricSearchInput';
