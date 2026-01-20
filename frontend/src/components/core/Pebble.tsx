import * as React from 'react';
import { cn } from '../../lib/utils';

export type PebbleVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type PebbleSize = 'sm' | 'md' | 'lg';

export interface PebbleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PebbleVariant;
  size?: PebbleSize;
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantClasses: Record<PebbleVariant, string> = {
  primary: 'bg-primary-wattle-gold text-primary-on-primary',
  secondary: 'bg-surface-gallery-eucalypt-smoke-high text-secondary-flannel-flower border border-secondary-flannel-flower',
  ghost: 'bg-transparent text-secondary-flannel-flower border border-secondary-flannel-dim',
  destructive: 'bg-tertiary-waratah-crimson text-on-surface-parchment',
};

const sizeClasses: Record<PebbleSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
};

export const Pebble: React.FC<PebbleProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  iconLeft,
  iconRight,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}) => (
  <button
    type={type}
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-[var(--radius-pebble)] font-semibold transition-colors',
      'disabled:cursor-not-allowed disabled:opacity-50',
      variantClasses[variant],
      sizeClasses[size],
      className
    )}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading ? (
      <span className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    ) : iconLeft ? (
      <span className="flex items-center">{iconLeft}</span>
    ) : null}
    <span>{children}</span>
    {!isLoading && iconRight ? <span className="flex items-center">{iconRight}</span> : null}
  </button>
);
