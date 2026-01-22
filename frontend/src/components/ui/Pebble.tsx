import React from 'react';

export type PebbleVariant = 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
export type M3ButtonColor = 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning';
export type PebbleSize = 'small' | 'medium' | 'large';

export interface PebbleProps {
    /** Button label */
    children: React.ReactNode;

    /** Visual style variant */
    variant?: PebbleVariant;

    /** Semantic color theme */
    color?: M3ButtonColor;

    /** Button size */
    size?: PebbleSize;

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
 * - Shape: pill shape using `rounded-full` token
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
 * <Pebble variant="filled" color="primary" startIcon={<PlayIcon />}>
 *   Get Started
 * </Pebble>
 * 
 * <Pebble variant="outlined" color="secondary" loading>
 *   Loading...
 * </Pebble>
 * 
 * <Pebble variant="text" href="/docs" target="_blank">
 *   Learn More
 * </Pebble>
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
}: PebbleProps) {
    // Base classes for Northcote Curio buttons
    const baseClasses = [
        'inline-flex items-center justify-center gap-2',
        'font-bold',
        'transition-all duration-300',
        disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        fullWidth ? 'w-full' : '',
    ].join(' ');

    // Size-specific classes
    const sizeClasses: Record<PebbleSize, string> = {
        small: 'px-4 py-2 text-sm',
        medium: 'px-6 py-3 text-base',
        large: 'px-8 py-4 text-lg',
    };

    // Northcote Curio Variant & Color Mapping
    const getVariantStyles = () => {
        const styles: React.CSSProperties = {
            borderRadius: 'var(--radius-pebble)',
            transition: 'all var(--duration-standard) var(--ease-viscous-breeze)',
        };

        if (variant === 'filled') {
            styles.backgroundColor = `var(--ref-palette-${color}-40)`;
            styles.color = `var(--ref-palette-${color}-100)`;
            styles.boxShadow = 'var(--shadow-subtle)';
        } else if (variant === 'tonal') {
            styles.backgroundColor = `var(--ref-palette-${color}-90)`;
            styles.color = `var(--ref-palette-${color}-10)`;
        } else if (variant === 'outlined') {
            styles.border = `2px solid var(--ref-palette-${color}-40)`;
            styles.color = `var(--ref-palette-${color}-40)`;
            styles.backgroundColor = 'transparent';
        } else if (variant === 'elevated') {
            styles.backgroundColor = `var(--ref-palette-${color}-40)`;
            styles.color = `var(--ref-palette-${color}-100)`;
            styles.boxShadow = 'var(--shadow-elevated)';
        } else { // text
            styles.backgroundColor = 'transparent';
            styles.color = `var(--ref-palette-${color}-40)`;
        }

        return styles;
    };

    const hoverStyle: React.CSSProperties = disabled || loading ? {} : {
        transform: 'translateY(-4px) scale(1.02)',
        boxShadow: color === 'primary' ? 'var(--elevation-shadow-glow-gold)' : 'var(--shadow-elevated)',
    };

    const [isHovered, setIsHovered] = React.useState(false);

    const combinedStyle = {
        ...getVariantStyles(),
        ...(isHovered ? hoverStyle : {}),
    };

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

    // Render logic
    const commonProps = {
        style: combinedStyle,
        className: `${baseClasses} ${sizeClasses[size]} ${className}`,
        onMouseEnter: () => !disabled && !loading && setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        'aria-disabled': disabled || loading,
    };

    if (href) {
        return (
            <a
                href={href}
                target={target}
                rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
                {...commonProps}
                onClick={(e) => {
                    if (disabled || loading) {
                        e.preventDefault();
                        return;
                    }
                    if (onClick) onClick(e as any);
                }}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            type={type}
            {...commonProps}
            disabled={disabled || loading}
            onClick={onClick}
            aria-busy={loading}
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
    size?: PebbleSize;

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
    const sizeClasses: Record<PebbleSize, string> = {
        small: 'w-8 h-8',
        medium: 'w-10 h-10',
        large: 'w-12 h-12',
    };

    const colorClasses: Record<PebbleColor, string> = {
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
        rounded-full
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
