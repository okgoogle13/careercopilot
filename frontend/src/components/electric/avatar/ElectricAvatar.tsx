/**
 * ELECTRIC ALCHEMIST: AVATAR COMPONENT
 * User avatar with fallback initials
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/cn';

const avatarVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-full',
    'bg-surface-container-high',
    'text-data font-data uppercase',
    'border-2 border-outline-variant',
    'overflow-hidden',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-12 w-12 text-sm',
        lg: 'h-16 w-16 text-base',
        xl: 'h-24 w-24 text-xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface ElectricAvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export const ElectricAvatar = React.forwardRef<HTMLDivElement, ElectricAvatarProps>(
  ({ className, size, src, alt, fallback, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-primary">
            {fallback || alt?.slice(0, 2).toUpperCase() || '??'}
          </span>
        )}
      </div>
    );
  }
);

ElectricAvatar.displayName = 'ElectricAvatar';
