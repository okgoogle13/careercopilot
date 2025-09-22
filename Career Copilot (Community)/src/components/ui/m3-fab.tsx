import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from './utils';

interface M3FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'surface';
  size?: 'small' | 'medium' | 'large';
  extended?: boolean;
  icon: React.ReactNode;
  asChild?: boolean;
}

const M3FAB = React.forwardRef<HTMLButtonElement, M3FABProps>(
  ({
    className,
    variant = 'primary',
    size = 'medium',
    extended = false,
    icon,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(
          // Base FAB Styles
          'inline-flex items-center justify-center gap-2',
          'font-medium text-sm leading-5',
          'transition-all cursor-pointer',
          'duration-[var(--motion-duration-short4)] ease-[var(--motion-easing-standard)]',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          'disabled:pointer-events-none',
          'shadow-[var(--elevation-level3)]',
          'hover:shadow-[var(--elevation-level4)]',
          'active:shadow-[var(--elevation-level2)]',
          
          // Shape - Extended vs Regular
          extended ? 'rounded-2xl px-4' : 'rounded-full',
          
          // Size variants
          size === 'small' && (extended ? 'h-10' : 'h-10 w-10'),
          size === 'medium' && (extended ? 'h-14' : 'h-14 w-14'),
          size === 'large' && (extended ? 'h-16' : 'h-16 w-16'),
          
          // Primary variant
          variant === 'primary' && [
            'bg-[var(--md-sys-color-primary-container)]',
            'text-[var(--md-sys-color-on-primary-container)]',
            'focus:ring-[var(--md-sys-color-primary)]',
            'focus:ring-opacity-20'
          ],
          
          // Secondary variant
          variant === 'secondary' && [
            'bg-[var(--md-sys-color-secondary-container)]',
            'text-[var(--md-sys-color-on-secondary-container)]',
            'focus:ring-[var(--md-sys-color-secondary)]',
            'focus:ring-opacity-20'
          ],
          
          // Tertiary variant
          variant === 'tertiary' && [
            'bg-[var(--md-sys-color-tertiary-container)]',
            'text-[var(--md-sys-color-on-tertiary-container)]',
            'focus:ring-[var(--md-sys-color-tertiary)]',
            'focus:ring-opacity-20'
          ],
          
          // Surface variant
          variant === 'surface' && [
            'bg-[var(--md-sys-color-surface-container-high)]',
            'text-[var(--md-sys-color-primary)]',
            'focus:ring-[var(--md-sys-color-primary)]',
            'focus:ring-opacity-20'
          ],
          
          className
        )}
        {...props}
      >
        <span className={cn(
          'flex items-center justify-center',
          size === 'small' ? 'w-5 h-5' : size === 'medium' ? 'w-6 h-6' : 'w-7 h-7'
        )}>
          {icon}
        </span>
        {extended && children && (
          <span className="text-sm font-medium">
            {children}
          </span>
        )}
      </Comp>
    );
  }
);

M3FAB.displayName = 'M3FAB';

export { M3FAB };