/**
 * ELECTRIC ALCHEMIST: BADGE COMPONENT
 *
 * Badge component with variants using design system tokens.
 * Uses rounded-[8px] for small items as per migration rules.
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const badgeVariants = cva(
  [
    'inline-flex items-center gap-1.5',
    'text-ai font-ai text-xs font-medium',
    'rounded-[8px]',
    'border border-solid',
    'transition-colors duration-150',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-primary-container text-on-primary-container',
          'border-primary-container',
        ],
        secondary: [
          'bg-surface-container text-primary',
          'border-outline-variant',
        ],
        destructive: [
          'bg-error-container text-on-error',
          'border-error-container',
        ],
        outline: [
          'bg-transparent text-primary',
          'border-outline-variant',
        ],
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Icon to display before text
   */
  startIcon?: React.ReactNode;
  /**
   * Icon to display after text
   */
  endIcon?: React.ReactNode;
  /**
   * If true, badge is clickable
   */
  clickable?: boolean;
  /**
   * Delete/close handler
   */
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant,
      size,
      children,
      className,
      startIcon,
      endIcon,
      clickable = false,
      onDelete,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        {...props}
      >
        {startIcon && (
          <span className="inline-flex items-center">{startIcon}</span>
        )}
        <span>{children}</span>
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="ml-1 rounded-full p-0.5 hover:bg-black/10 transition-colors"
            aria-label="Remove"
          >
            <X className="h-3 w-3" />
          </button>
        ) : (
          endIcon && (
            <span className="inline-flex items-center">{endIcon}</span>
          )
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
