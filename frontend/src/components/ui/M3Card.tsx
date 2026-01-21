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
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;

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
    // Map variant to Northcote Curio shape tokens
    const shapeStyles: Record<M3CardVariant, React.CSSProperties> = {
        pebble: { borderRadius: 'var(--radius-pebble)' },
        tech: { borderRadius: 'var(--radius-stone)' },
        leaf: { borderRadius: 'var(--radius-leaf)' },
        gem: { borderRadius: 'var(--radius-pebble)' }, // Consolidating gem to pebble for consistency
    };

    // Map padding to Northcote spacing tokens
    const paddingClasses: Record<M3CardPadding, string> = {
        none: '',
        sm: 'p-[var(--spacing-sm)]',
        md: 'p-[var(--spacing-md)]',
        lg: 'p-[var(--spacing-lg)]',
        xl: 'p-[var(--spacing-xl)]',
    };

    // Northcote elevation mapping
    const getShadow = (lev: M3CardElevation) => {
        if (lev === 0) return 'none';
        if (lev === 1) return 'var(--shadow-subtle)';
        if (lev === 2) return 'var(--shadow-standard)';
        if (lev === 3) return 'var(--shadow-elevated)';
        return 'var(--shadow-maximum)';
    };

    const [isHovered, setIsHovered] = React.useState(false);

    const cardStyle: React.CSSProperties = {
        ...shapeStyles[variant],
        backgroundColor: 'var(--color-specimen-night)',
        border: '1px solid rgba(240, 234, 214, 0.1)',
        boxShadow: getShadow(isHovered && hoverable ? (Math.min(elevation + 1, 5) as M3CardElevation) : elevation),
        transition: 'all var(--duration-standard) var(--ease-viscous-breeze)',
        position: 'relative',
        overflow: 'hidden',
        ...(isHovered && hoverable ? { transform: 'translateY(-4px)' } : {}),
        ...(onClick ? { cursor: 'pointer' } : {}),
    };

    return (
        <div
            style={cardStyle}
            className={`
        ${paddingClasses[padding]}
        ${onClick ? 'active:scale-[0.98]' : ''}
        ${className}
      `}
            onMouseEnter={() => hoverable && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            role={role}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e as any) : undefined}
        >
            {/* Background texture pattern if in tech variant */}
            {variant === 'tech' && (
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(var(--color-parchment) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                />
            )}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

/**
 * M3CardHeader - Semantic header section for M3Card
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
            <div className="flex items-start gap-4 flex-1">
                {icon && (
                    <div className="flex-shrink-0 mt-1 text-[var(--color-wattle-gold)]">
                        {icon}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bloom text-2xl font-bold text-[var(--color-parchment)] mb-1">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-sm text-[var(--color-flannel-flower-dark)] font-field-note font-medium">
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
