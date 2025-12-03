/**
 * ELECTRIC ALCHEMIST: AVATAR COMPONENT
 *
 * Avatar component with initials fallback and design system tokens.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  initials?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, size = 'md', initials, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center',
          'rounded-full overflow-hidden',
          'bg-surface-container border border-outline-variant',
          'text-on-surface-variant',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || 'avatar'}
            className="h-full w-full object-cover"
          />
        ) : initials ? (
          <span className="text-human font-medium text-on-surface">
            {initials}
          </span>
        ) : (
          <User className="h-1/2 w-1/2 text-on-surface-variant" />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;



