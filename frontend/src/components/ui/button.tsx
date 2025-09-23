import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { CircularProgress } from '@mui/material';
import { cn } from './utils';

interface M3ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal' | 'aurora' | 'default' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'small' | 'medium' | 'large' | 'default' | 'sm' | 'lg' | 'icon';
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

// Map legacy button variants to M3 variants
const mapLegacyVariant = (variant?: string) => {
  switch (variant) {
    case 'default': return 'filled';
    case 'destructive': return 'filled';
    case 'secondary': return 'tonal';
    case 'ghost': return 'text';
    case 'link': return 'text';
    case 'outline': return 'outlined';
    default: return variant as 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal' | 'aurora';
  }
};

// Map legacy button sizes to M3 sizes
const mapLegacySize = (size?: string) => {
  switch (size) {
    case 'default': return 'medium';
    case 'sm': return 'small';
    case 'lg': return 'large';
    case 'icon': return 'icon';
    default: return size as 'small' | 'medium' | 'large' | 'icon';
  }
};

const M3Button = React.forwardRef<HTMLButtonElement, M3ButtonProps>(
  ({
    className,
    variant = 'filled',
    size = 'medium',
    icon,
    trailingIcon,
    asChild = false,
    disabled,
    isLoading = false,
    loadingText,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const mappedVariant = mapLegacyVariant(variant);
    const mappedSize = mapLegacySize(size);
    const isDisabled = disabled || isLoading;

    return (
      <Comp
        ref={ref}
        className={cn(
          // Base Material 3 Button Styles
          'inline-flex items-center justify-center gap-2',
          'rounded-3xl font-medium text-sm leading-5',
          'transition-all cursor-pointer',
          'duration-[var(--motion-duration-short4)] ease-[var(--motion-easing-standard)]',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          'disabled:pointer-events-none',
          
          // Size variants
          mappedSize === 'small' && 'h-10 px-6 text-sm',
          mappedSize === 'medium' && 'h-12 px-6 text-base',
          mappedSize === 'large' && 'h-14 px-8 text-base',
          mappedSize === 'icon' && 'h-10 w-10 p-0',

          // Loading state
          isLoading && 'cursor-wait relative overflow-hidden',

          // Filled variant (Primary)
          mappedVariant === 'filled' && variant !== 'destructive' && [
            'bg-[var(--md-sys-color-primary)]',
            'text-[var(--md-sys-color-on-primary)]',
            'shadow-[var(--elevation-level1)]',
            'hover:shadow-[var(--elevation-level3)]',
            'hover:shadow-[0_0_20px_rgba(193,193,255,0.4)]',
            'active:shadow-[var(--elevation-level1)]',
            'focus:ring-[var(--md-sys-color-primary)]',
            'focus:ring-opacity-20'
          ],
          
          // Destructive variant (special case)
          variant === 'destructive' && [
            'bg-[var(--md-sys-color-error)]',
            'text-[var(--md-sys-color-on-error)]',
            'shadow-[var(--elevation-level1)]',
            'hover:shadow-[var(--elevation-level3)]',
            'active:shadow-[var(--elevation-level1)]',
            'focus:ring-[var(--md-sys-color-error)]',
            'focus:ring-opacity-20'
          ],

          // Outlined variant
          mappedVariant === 'outlined' && [
            'bg-transparent',
            'text-[var(--md-sys-color-primary)]',
            'border border-[var(--md-sys-color-outline)]',
            'hover:bg-[var(--md-sys-color-primary)]',
            'hover:bg-opacity-8',
            'hover:border-[var(--md-sys-color-primary)]',
            'focus:ring-[var(--md-sys-color-primary)]',
            'focus:ring-opacity-20'
          ],

          // Text variant
          mappedVariant === 'text' && [
            'bg-transparent',
            'text-[var(--md-sys-color-primary)]',
            'hover:bg-[var(--md-sys-color-primary)]',
            'hover:bg-opacity-8',
            'focus:ring-[var(--md-sys-color-primary)]',
            'focus:ring-opacity-20'
          ],

          // Elevated variant
          mappedVariant === 'elevated' && [
            'bg-[var(--md-sys-color-surface-container-low)]',
            'text-[var(--md-sys-color-primary)]',
            'shadow-[var(--elevation-level1)]',
            'hover:bg-[var(--md-sys-color-surface-container-high)]',
            'hover:shadow-[var(--elevation-level2)]',
            'focus:ring-[var(--md-sys-color-primary)]',
            'focus:ring-opacity-20'
          ],

          // Tonal variant
          mappedVariant === 'tonal' && [
            'bg-[var(--md-sys-color-secondary-container)]',
            'text-[var(--md-sys-color-on-secondary-container)]',
            'hover:shadow-[var(--elevation-level1)]',
            'focus:ring-[var(--md-sys-color-secondary)]',
            'focus:ring-opacity-20'
          ],

          // Aurora variant
          mappedVariant === 'aurora' && [
            'bg-aurora-full',
            'text-white',
            'shadow-glow-aurora',
            'hover:shadow-glow-aurora',
            'hover:transform',
            'hover:-translate-y-0.5',
            'transition-all',
            'duration-300',
            'focus:ring-aurora',
            'focus:ring-opacity-30'
          ],
          
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center bg-inherit">
            <CircularProgress size={16} />
            {loadingText && <span className="ms-2">{loadingText}</span>}
          </span>
        )}
        <span className={cn('flex items-center gap-2', isLoading && 'invisible')}>
          {mappedSize === 'icon' ? (
            // Icon-only mode: center the icon without text
            <span className="flex items-center justify-center w-5 h-5">
              {icon || children}
            </span>
          ) : (
            // Regular mode: show icon, text, and trailing icon
            <>
              {icon && (
                <span className="flex items-center justify-center w-4 h-4">
                  {icon}
                </span>
              )}
              {children}
              {trailingIcon && (
                <span className="flex items-center justify-center w-4 h-4">
                  {trailingIcon}
                </span>
              )}
            </>
          )}
        </span>
      </Comp>
    );
  }
);

M3Button.displayName = 'M3Button';

// Create aliases for legacy components
const Button = M3Button;
const AuroraButton = React.forwardRef<HTMLButtonElement, M3ButtonProps>(
  (props, ref) => <M3Button {...props} variant="aurora" ref={ref} />
);
AuroraButton.displayName = 'AuroraButton';

export { M3Button, Button, AuroraButton };
export type { M3ButtonProps };