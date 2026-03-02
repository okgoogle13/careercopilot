import React from 'react';

export type StatusBadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
<<<<<<< HEAD
export type StatusBadgeMode = 'gallery' | 'laboratory';
=======
export type StatusBadgeMode = 'KrDark' | 'KrLight';
>>>>>>> restoration-KR-Rage-Figma-v2.0

export interface StatusBadgeProps {
    /** The text label to display */
    label: string;
    /** Semantic status variant */
    variant?: StatusBadgeVariant;
<<<<<<< HEAD
    /** Theme mode: Gallery (warm, botanical) or Laboratory (clinical, precise) */
=======
    /** Theme mode: KrDark (warm) or KrLight (clinical, precise) */
>>>>>>> restoration-KR-Rage-Figma-v2.0
    mode?: StatusBadgeMode;
    /** Optional dot indicator */
    showDot?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
<<<<<<< HEAD
 * StatusBadge -  Status Indicator
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
=======
 * StatusBadge - KeralaRage KrSolidarity Status Indicator
 *
 * Supports both KrDark (warm) and KrLight (clinical, precise) modes.
 *
 * **KeralaRage Token Usage:**
 * - Typography: `font-annotation` (Uppercase, tracked)
 * - Color: Semantic status colors (success, warning, error, info)
 * - Shape: `radius-seed` (subtle asymmetry for badges)
 * - Motion: `ease-viscous` (Hover animation)
 *
 * **Variants:**
 * - success: Solidarity Green (green)
 * - warning: KrFlower (orange)
 * - error: Solidarity Red (red)
 * - info: Ink Gold (yellow)
 * - neutral: Concrete Grey (gray)
>>>>>>> restoration-KR-Rage-Figma-v2.0
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
    label,
    variant = 'neutral',
<<<<<<< HEAD
    mode = 'gallery',
    showDot = false,
    className = '',
}) => {
    //  Palette Mappings
    const getVariantStyles = () => {
        const colorMap: Record<StatusBadgeVariant, string> = {
            success: 'primary',    // Sage (Botanical)
=======
    mode: _mode = 'KrDark',
    showDot = false,
    className = '',
}) => {
    // KeralaRage KrSolidarity Palette Mappings
    const getVariantStyles = () => {
        const colorMap: Record<StatusBadgeVariant, string> = {
            success: 'primary',    // Sage
>>>>>>> restoration-KR-Rage-Figma-v2.0
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

<<<<<<< HEAD
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
=======
        // Solidarity mode color overrides using semantic tokens
        if (base === 'neutral') {
            styles.bg = 'var(--sys-color-concreteGrey-steps-0)';
            styles.text = 'var(--sys-color-concreteGrey-base)';
            styles.dot = 'var(--sys-color-concreteGrey-steps-4)';
            styles.border = 'var(--sys-color-concreteGrey-steps-1)';
        } else if (base === 'warning') {
            styles.text = 'var(--sys-color-inkGold-base)';
            styles.bg = 'var(--sys-color-inkGold-steps-0)';
            styles.border = 'var(--sys-color-inkGold-steps-2)';
            styles.dot = 'var(--sys-color-inkGold-base)';
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
