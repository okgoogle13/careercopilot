import React from 'react';

export type M3CardVariant = 'pebble' | 'tech' | 'leaf' | 'gem';
export type M3CardElevation = 0 | 1 | 2 | 3 | 4 | 5;
export type M3CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface M3CardProps {
    /** Card content */
    children: React.ReactNode;

    /** M3 shape variant */
    variant?: M3CardVariant;

    /** M3 elevation level (0-5) */
    elevation?: M3CardElevation;

    /** Enable hover elevation increase */
    hoverable?: boolean;

    /** Padding size using M3 spacing scale */
    padding?: M3CardPadding;

    /** Additional CSS classes */
    className?: string;

    /** Click handler */
    onClick?: () => void;

    /** Accessible role (default: 'article') */
    role?: string;
}

/**
 * M3Card - Material Design 3 Compliant Card Component
 * 
 * A flexible card component using the Electric Alchemist M3 design system.
 * Provides organic shapes, proper elevation, and semantic theming.
 * 
 * **M3 Design Token Usage:**
 * - Shape: Choose from pebble (friendly), tech (precision), leaf (growth), or gem (highlight)
 * - Elevation: Uses M3 shadow system (shadow-elevation-0 through shadow-elevation-5)
 * - Spacing: M3 spacing scale (p-space-sm through p-space-xl)
 * - Colors: Semantic surface tokens (surface-container, outline-variant)
 * - Motion: M3 spring easing for smooth hover transitions
 * 
 * @example
 * ```tsx
 * <M3Card variant="pebble" elevation={1} padding="lg" hoverable>
 *   <h3 className="text-headline-large">Card Title</h3>
 *   <p className="text-body-large">Card content goes here</p>
 * </M3Card>
 * ```
 * 
 * @see frontend/src/theme/design-tokens.css - M3 token definitions
 */
export function M3Card({
    children,
    variant = 'pebble',
    elevation = 1,
    hoverable = false,
    padding = 'lg',
    className = '',
    onClick,
    role = 'article',
}: M3CardProps) {
    // Map variant to M3 shape token
    const shapeClasses: Record<M3CardVariant, string> = {
        pebble: 'rounded-pebble', // 20px 20px 32px 32px - Friendly organic
        tech: 'rounded-tech',     // 24px 4px 24px 20px - Precision
        leaf: 'rounded-leaf',     // 32px 12px 32px 12px - Growth motif
        gem: 'rounded-gem',       // 40px 8px 40px 8px - Highlight
    };

    // Map padding to M3 spacing tokens
    const paddingClasses: Record<M3CardPadding, string> = {
        none: '',
        sm: 'p-space-md',   // 16px
        md: 'p-space-lg',   // 24px
        lg: 'p-space-xl',   // 32px
        xl: 'p-space-2xl',  // 48px
    };

    // M3 elevation classes
    const elevationClass = elevation > 0 ? `shadow-elevation-${elevation}` : '';
    const hoverElevationClass = hoverable && elevation < 5
        ? `hover:shadow-elevation-${Math.min(elevation + 1, 5)}`
        : '';

    // Interactive styles
    const interactiveClasses = onClick
        ? 'cursor-pointer active:scale-[0.98]'
        : '';

    return (
        <div
            className={`
        bg-surface-container border border-outline-variant
        ${shapeClasses[variant]}
        ${paddingClasses[padding]}
        ${elevationClass}
        ${hoverElevationClass}
        ${interactiveClasses}
        transition-all duration-medium-1 ease-spring
        ${className}
      `}
            onClick={onClick}
            role={role}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
        >
            {children}
        </div>
    );
}

/**
 * M3CardHeader - Semantic header section for M3Card
 * 
 * Provides consistent styling for card headers with optional icon/badge.
 */
export interface M3CardHeaderProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

export function M3CardHeader({
    title,
    subtitle,
    icon,
    action,
    className = '',
}: M3CardHeaderProps) {
    return (
        <div className={`flex items-start justify-between mb-4 ${className}`}>
            <div className="flex items-start gap-3 flex-1">
                {icon && (
                    <div className="flex-shrink-0 mt-1">
                        {icon}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h3 className="text-headline-large font-bold text-on-surface mb-1">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-body-large text-on-surface-variant">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            {action && (
                <div className="flex-shrink-0 ml-4">
                    {action}
                </div>
            )}
        </div>
    );
}

/**
 * M3CardContent - Semantic content section for M3Card
 * 
 * Provides consistent spacing and typography for card body content.
 */
export interface M3CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export function M3CardContent({
    children,
    className = '',
}: M3CardContentProps) {
    return (
        <div className={`text-body-large text-on-surface ${className}`}>
            {children}
        </div>
    );
}

/**
 * M3CardActions - Semantic actions section for M3Card
 * 
 * Provides consistent styling for card action buttons.
 */
export interface M3CardActionsProps {
    children: React.ReactNode;
    align?: 'left' | 'right' | 'center' | 'between';
    className?: string;
}

export function M3CardActions({
    children,
    align = 'right',
    className = '',
}: M3CardActionsProps) {
    const alignClasses: Record<typeof align, string> = {
        left: 'justify-start',
        right: 'justify-end',
        center: 'justify-center',
        between: 'justify-between',
    };

    return (
        <div className={`flex items-center gap-2 mt-4 ${alignClasses[align]} ${className}`}>
            {children}
        </div>
    );
}
