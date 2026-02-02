import React from 'react';

export type StatusBadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type StatusBadgeMode = 'gallery' | 'laboratory';

export interface StatusBadgeProps {
    /** The text label to display */
    label: string;
    /** Semantic status variant */
    variant?: StatusBadgeVariant;
    /** Theme mode: Gallery (warm, botanical) or Laboratory (clinical, precise) */
    mode?: StatusBadgeMode;
    /** Optional dot indicator */
    showDot?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
 * StatusBadge - Northcote Curio Status Indicator
 *
 * Supports both Gallery (warm, botanical) and Laboratory (clinical, precise) modes.
 *
 * **Northcote Token Usage:**
 * - Typography: `font-annotation` (Uppercase, tracked)
 * - Color: Semantic status colors (success, warning, error, info)
 * - Shape: `radius-seed` (Organic asymmetry for badges)
 * - Motion: `ease-viscous` (Hover animation)
 *
 * **Variants:**
 * - success: Ghost Gum (green)
 * - warning: Banksia (orange)
 * - error: Waratah Crimson (red)
 * - info: Wattle Gold (yellow)
 * - neutral: Flannel Flower (gray)
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
    label,
    variant = 'neutral',
    mode = 'gallery',
    showDot = false,
    className = '',
}) => {
    // Northcote Curio Palette Mappings
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

        // Dark mode overrides (Laboratory/Gallery root is deep charcoal)
        // Adjusting for high contrast on dark backgrounds
        if (base === 'neutral') {
            styles.bg = 'rgba(230, 225, 214, 0.1)';
            styles.text = 'var(--color-flannel-flower)';
            styles.dot = 'var(--color-flannel-flower-dark)';
            styles.border = 'rgba(230, 225, 214, 0.2)';
        } else if (base === 'warning') {
            styles.text = 'var(--color-wattle-gold)';
            styles.bg = 'rgba(212, 168, 75, 0.15)';
            styles.border = 'rgba(212, 168, 75, 0.3)';
            styles.dot = 'var(--color-wattle-gold)';
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
