import React from 'react';

export type StatusBadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type StatusBadgeMode = 'KrDark' | 'KrLight';

export interface StatusBadgeProps {
    /** The text label to display */
    label: string;
    /** Semantic status variant */
    variant?: StatusBadgeVariant;
    /** Theme mode: KrDark (warm, botanical) or KrDark (clinical, precise) */
    mode?: StatusBadgeMode;
    /** Optional dot indicator */
    showDot?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
 * StatusBadge - KeralaRage KrSolidarity Status Indicator
 *
 * Supports both KrDark (warm, botanical) and KrDark (clinical, precise) modes.
 *
 * **KeralaRage Token Usage:**
 * - Typography: `font-annotation` (Uppercase, tracked)
 * - Color: Semantic status colors (success, warning, error, info)
 * - Shape: `radius-seed` (Organic asymmetry for badges)
 * - Motion: `ease-viscous` (Hover animation)
 *
 * **Variants:**
 * - success: Solidarity Green (green)
 * - warning: KrFlower (orange)
 * - error: Solidarity Red (red)
 * - info: Ink Gold (yellow)
 * - neutral: Concrete Grey (gray)
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
    label,
    variant = 'neutral',
    mode: _mode = 'KrDark',
    showDot = false,
    className = '',
}) => {
    // KeralaRage KrSolidarity Palette Mappings
    const getVariantStyles = () => {
        const colorMap: Record<StatusBadgeVariant, string> = {
            success: 'primary',    // Sage (Botanical)
            warning: 'warning',    // Gold (Highlight)
            error: 'error',        // Crimson (Alert)
            info: 'secondary',     // Coral (Dynamic)
            neutral: 'neutral',    // Charcoal (Recessed)
        };

        const base = colorMap[variant];

        // Mode-aware colors using palette tokens
        const styles = {
            bg: `var(--ref-palette-${base}-90)`,
            text: `var(--on-${base}-container)`,
            dot: `var(--ref-palette-${base}-40)`,
            border: `var(--ref-palette-${base}-80)`,
        };

        // Dark mode overrides (KrDark/KrDark root is deep charcoal)
        // Adjusting for high contrast on dark backgrounds
        if (base === 'neutral') {
            styles.bg = 'rgba(230, 225, 214, 0.1)';
            styles.text = 'var(--color-concrete-grey)';
            styles.dot = 'var(--color-concrete-grey-dark)';
            styles.border = 'rgba(230, 225, 214, 0.2)';
        } else if (base === 'warning') {
            styles.text = 'var(--color-ink-gold)';
            styles.bg = 'rgba(212, 168, 75, 0.15)';
            styles.border = 'rgba(212, 168, 75, 0.3)';
            styles.dot = 'var(--color-ink-gold)';
        }

        return styles;
    };

    const currentStyle = getVariantStyles();

    return (
        <div
            className={`
                inline-flex items-center gap-2
                px-3 py-1
                border
                transition-all duration-300 var(--ease-viscous-breeze)
                hover:scale-105 hover:brightness-110
                ${className}
            `}
            style={{
                borderRadius: 'var(--radius-seed)',
                backgroundColor: currentStyle.bg,
                color: currentStyle.text,
                borderColor: currentStyle.border,
            }}
        >
            {showDot && (
                <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: currentStyle.dot }}
                />
            )}
            <span className="text-xs font-annotation font-bold tracking-widest uppercase">
                {label}
            </span>
        </div>
    );
};