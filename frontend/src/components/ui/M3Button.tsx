import React from 'react';

export type M3ButtonVariant = 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
export type M3ButtonColor = 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning';
export type M3ButtonSize = 'small' | 'medium' | 'large';

export interface M3ButtonProps {
  /** Button label */
  children: React.ReactNode;

  /** Visual style variant */
  variant?: M3ButtonVariant;

  /** Semantic color theme */
  color?: M3ButtonColor;

  /** Button size */
  size?: M3ButtonSize;

  /** Start icon */
  startIcon?: React.ReactNode;

  /** End icon */
  endIcon?: React.ReactNode;

  /** Full width button */
  fullWidth?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Loading state (shows spinner) */
  loading?: boolean;

  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /** Button type */
  type?: 'button' | 'submit' | 'reset';

  /** Additional CSS classes */
  className?: string;

  /** Link href (renders as <a>) */
  href?: string;

  /** Link target */
  target?: string;

  /** Link rel */
  rel?: string;
}

/**
 * M3Button - Material Design 3 Compliant Button Component
 *
 * A comprehensive button component using the Electric Alchemist M3 design system.
 * Supports all M3 button variants with proper semantic colors, motion, and accessibility.
 *
 * **M3 Design Token Usage:**
 * - Shape: pill shape using `rounded-sentry` token
 * - Colors: Semantic M3 color roles (primary, secondary, tertiary, error, warning)
 * - Motion: Spring easing with subtle scale on hover/active
 * - Typography: M3 label-large scale with proper font weight
 * - Elevation: Shadow elevation for filled/elevated variants
 *
 * **Variants:**
 * - `filled`: High emphasis (default), colored background
 * - `outlined`: Medium emphasis, outlined with border
 * - `text`: Low emphasis, no background
 * - `elevated`: Filled with elevation shadow
 * - `tonal`: Medium emphasis, tonal container background
 *
 * @example
 * ```tsx
 * <M3Button variant="filled" color="primary" startIcon={<PlayIcon />}>
 *   Get Started
 * </M3Button>
 *
 * <M3Button variant="outlined" color="secondary" loading>
 *   Loading...
 * </M3Button>
 *
 * <M3Button variant="text" href="/docs" target="_blank">
 *   Learn More
 * </M3Button>
 * ```
 *
 * @see frontend/src/theme/design-tokens.css - M3 token definitions
 */
export function M3Button({
  children,
  variant = 'filled',
  color = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  href,
  target,
  rel,
}: M3ButtonProps) {
  // Base classes for all variants
  const baseClasses = [
    'inline-flex items-center justify-center gap-2',
    'rounded-sentry font-medium',
    'transition-all duration-medium-1 ease-spring',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    fullWidth ? 'w-full' : '',
  ].join(' ');

  // Size-specific classes
  const sizeClasses: Record<M3ButtonSize, string> = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  // Variant and color-specific classes
  const variantClasses: Record<M3ButtonVariant, Record<M3ButtonColor, string>> = {
    filled: {
      primary:
        'bg-primary text-on-primary hover:brightness-110 focus:ring-primary shadow-elevation-1 hover:shadow-elevation-2',
      secondary:
        'bg-secondary text-on-secondary hover:brightness-110 focus:ring-secondary shadow-elevation-1 hover:shadow-elevation-2',
      tertiary:
        'bg-tertiary text-on-tertiary hover:brightness-110 focus:ring-tertiary shadow-elevation-1 hover:shadow-elevation-2',
      error:
        'bg-error text-on-error hover:brightness-110 focus:ring-error shadow-elevation-1 hover:shadow-elevation-2',
      warning:
        'bg-warning text-on-warning hover:brightness-110 focus:ring-warning shadow-elevation-1 hover:shadow-elevation-2',
    },
    elevated: {
      primary:
        'bg-primary text-on-primary hover:brightness-110 focus:ring-primary shadow-elevation-2 hover:shadow-elevation-3',
      secondary:
        'bg-secondary text-on-secondary hover:brightness-110 focus:ring-secondary shadow-elevation-2 hover:shadow-elevation-3',
      tertiary:
        'bg-tertiary text-on-tertiary hover:brightness-110 focus:ring-tertiary shadow-elevation-2 hover:shadow-elevation-3',
      error:
        'bg-error text-on-error hover:brightness-110 focus:ring-error shadow-elevation-2 hover:shadow-elevation-3',
      warning:
        'bg-warning text-on-warning hover:brightness-110 focus:ring-warning shadow-elevation-2 hover:shadow-elevation-3',
    },
    outlined: {
      primary:
        'border-2 border-primary text-primary hover:bg-primary hover:text-on-primary focus:ring-primary',
      secondary:
        'border-2 border-secondary text-secondary hover:bg-secondary hover:text-on-secondary focus:ring-secondary',
      tertiary:
        'border-2 border-tertiary text-tertiary hover:bg-tertiary hover:text-on-tertiary focus:ring-tertiary',
      error: 'border-2 border-error text-error hover:bg-error hover:text-on-error focus:ring-error',
      warning:
        'border-2 border-warning text-warning hover:bg-warning hover:text-on-warning focus:ring-warning',
    },
    tonal: {
      primary:
        'bg-primary-container text-on-primary-container hover:brightness-110 focus:ring-primary',
      secondary:
        'bg-secondary-container text-on-secondary-container hover:brightness-110 focus:ring-secondary',
      tertiary:
        'bg-tertiary-container text-on-tertiary-container hover:brightness-110 focus:ring-tertiary',
      error: 'bg-error-container text-on-error-container hover:brightness-110 focus:ring-error',
      warning:
        'bg-warning-container text-on-warning-container hover:brightness-110 focus:ring-warning',
    },
    text: {
      primary: 'text-primary hover:bg-primary-container focus:ring-primary',
      secondary: 'text-secondary hover:bg-secondary-container focus:ring-secondary',
      tertiary: 'text-tertiary hover:bg-tertiary-container focus:ring-tertiary',
      error: 'text-error hover:bg-error-container focus:ring-error',
      warning: 'text-warning hover:bg-warning-container focus:ring-warning',
    },
  };

  // Hover scale effect (except when disabled/loading)
  const hoverClasses = disabled || loading ? '' : 'hover:scale-[1.02] active:scale-[0.98]';

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant][color]} ${hoverClasses} ${className}`;

  // Loading spinner
  const loadingSpinner = (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Button content
  const content = (
    <>
      {loading ? loadingSpinner : startIcon}
      <span>{children}</span>
      {!loading && endIcon}
    </>
  );

  // Render as link if href is provided
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        className={combinedClasses}
        aria-disabled={disabled || loading}
        onClick={(e) => {
          if (disabled || loading) {
            e.preventDefault();
            return;
          }
          if (onClick) {
            onClick(e as any);
          }
        }}
      >
        {content}
      </a>
    );
  }

  // Render as button
  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
      aria-disabled={disabled}
    >
      {content}
    </button>
  );
}

/**
 * M3IconButton - Icon-only M3 Button variant
 *
 * Specialized button for icon-only actions (e.g., close, menu, more).
 */
export interface M3IconButtonProps {
  /** Icon element */
  icon: React.ReactNode;

  /** Accessible label */
  ariaLabel: string;

  /** Color theme */
  color?: M3ButtonColor;

  /** Button size */
  size?: M3ButtonSize;

  /** Disabled state */
  disabled?: boolean;

  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /** Additional CSS classes */
  className?: string;
}

export function M3IconButton({
  icon,
  ariaLabel,
  color = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  className = '',
}: M3IconButtonProps) {
  const sizeClasses: Record<M3ButtonSize, string> = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12',
  };

  const colorClasses: Record<M3ButtonColor, string> = {
    primary: 'text-primary hover:bg-primary-container',
    secondary: 'text-secondary hover:bg-secondary-container',
    tertiary: 'text-tertiary hover:bg-tertiary-container',
    error: 'text-error hover:bg-error-container',
    warning: 'text-warning hover:bg-warning-container',
  };

  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center
        rounded-sentry
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110 active:scale-95'}
        transition-all duration-medium-1 ease-spring
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
}
