import React from 'react';
import { M3Badge } from '../M3Badge/M3Badge';
import type { M3BadgeProps, M3BadgeColor, M3BadgeVariant } from '../M3Badge/M3Badge';

export interface BadgeProps extends Omit<M3BadgeProps, 'variant'> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

/**
 * Migrated to M3Badge - uses M3 design tokens instead of MUI theme
 * Maps old BadgeProps variants to M3Badge color and variant system
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', children, ...props }, ref) => {
    const getColor = (variant: string): M3BadgeColor => {
      switch (variant) {
        case 'destructive':
          return 'error';
        case 'secondary':
          return 'secondary';
        default:
          return 'primary';
      }
    };

    const getVariant = (variant: string): M3BadgeVariant => {
      return variant === 'outline' ? 'outlined' : 'filled';
    };

    return (
      <M3Badge
        ref={ref}
        variant={getVariant(variant)}
        color={getColor(variant)}
        size="small"
        {...props}
      >
        {children}
      </M3Badge>
    );
  }
);

Badge.displayName = 'Badge';
