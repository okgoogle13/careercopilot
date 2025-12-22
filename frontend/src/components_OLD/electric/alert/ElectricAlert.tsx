/**
 * ELECTRIC ALCHEMIST: ALERT COMPONENT
 * Status alerts with variants
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/cn';

const alertVariants = cva(
  [
    'relative w-full rounded-card',
    'border border-solid',
    'p-4',
    'text-ai font-ai',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-surface-container text-primary',
          'border-outline-variant',
        ],
        info: [
          'bg-primary-container/20 text-primary',
          'border-primary-container',
        ],
        success: [
          'bg-green-900/20 text-green-300',
          'border-green-700',
        ],
        warning: [
          'bg-yellow-900/20 text-yellow-300',
          'border-yellow-700',
        ],
        error: [
          'bg-red-900/20 text-red-300',
          'border-red-700',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ElectricAlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  onClose?: () => void;
}

export const ElectricAlert = React.forwardRef<HTMLDivElement, ElectricAlertProps>(
  ({ className, variant, title, children, onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-current opacity-70 hover:opacity-100 transition-opacity"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        {title && (
          <div className="font-bold mb-1 text-data uppercase">{title}</div>
        )}
        <div>{children}</div>
      </div>
    );
  }
);

ElectricAlert.displayName = 'ElectricAlert';
