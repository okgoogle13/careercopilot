import React from 'react';
import { cn } from './utils';

interface M3CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'selected';
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  children: React.ReactNode;
}

const M3Card = React.forwardRef<HTMLDivElement, M3CardProps>(
  ({ className, variant = 'default', elevation = 1, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base Material 3 Card Styles
          'rounded-2xl border transition-all',
          'duration-[var(--motion-duration-medium2)] ease-[var(--motion-easing-standard)]',
          
          // Default variant
          variant === 'default' && [
            'bg-[var(--md-sys-color-surface-container)]',
            'border-[var(--md-sys-color-outline-variant)]',
            'text-[var(--md-sys-color-on-surface)]'
          ],
          
          // Interactive variant
          variant === 'interactive' && [
            'bg-[var(--md-sys-color-surface-container)]',
            'border-[var(--md-sys-color-outline-variant)]',
            'text-[var(--md-sys-color-on-surface)]',
            'cursor-pointer',
            'hover:bg-[var(--md-sys-color-surface-container-high)]',
            'hover:border-[var(--md-sys-color-outline)]',
            'hover:shadow-[0px_4px_12px_4px_rgba(193,193,255,0.1)]',
            'hover:duration-[var(--motion-duration-short4)]',
            'hover:ease-[var(--motion-easing-emphasized-decelerate)]'
          ],
          
          // Selected variant
          variant === 'selected' && [
            'bg-[var(--md-sys-color-primary-container)]',
            'border-2 border-[var(--md-sys-color-primary)]',
            'text-[var(--md-sys-color-on-primary-container)]'
          ],
          
          // Elevation levels
          elevation === 0 && 'shadow-none',
          elevation === 1 && 'shadow-[var(--elevation-level1)]',
          elevation === 2 && 'shadow-[var(--elevation-level2)]',
          elevation === 3 && 'shadow-[var(--elevation-level3)]',
          elevation === 4 && 'shadow-[var(--elevation-level4)]',
          elevation === 5 && 'shadow-[var(--elevation-level5)]',
          
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

M3Card.displayName = 'M3Card';

const M3CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
M3CardHeader.displayName = 'M3CardHeader';

const M3CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      'text-[var(--md-sys-color-on-surface)]',
      className
    )}
    {...props}
  />
));
M3CardTitle.displayName = 'M3CardTitle';

const M3CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm text-[var(--md-sys-color-on-surface-variant)]',
      className
    )}
    {...props}
  />
));
M3CardDescription.displayName = 'M3CardDescription';

const M3CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
M3CardContent.displayName = 'M3CardContent';

const M3CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
M3CardFooter.displayName = 'M3CardFooter';

export {
  M3Card,
  M3CardHeader,
  M3CardFooter,
  M3CardTitle,
  M3CardDescription,
  M3CardContent,
};