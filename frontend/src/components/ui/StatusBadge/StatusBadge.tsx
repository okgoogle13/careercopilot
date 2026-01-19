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
    // Variant color mappings
    const variantStyles = {
        success: {
            gallery: {
                bg: 'bg-[#4A7C59]/20',
                text: 'text-[#6B9A7A]',
                dot: 'bg-[#6B9A7A]',
                border: 'border-[#6B9A7A]/30',
            },
            laboratory: {
                bg: 'bg-[#4A7C59]/15',
                text: 'text-[#6B9A7A]',
                dot: 'bg-[#6B9A7A]',
                border: 'border-[#6B9A7A]/20',
            },
        },
        warning: {
            gallery: {
                bg: 'bg-[#D97A3C]/20',
                text: 'text-[#E89A5F]',
                dot: 'bg-[#E89A5F]',
                border: 'border-[#E89A5F]/30',
            },
            laboratory: {
                bg: 'bg-[#D97A3C]/15',
                text: 'text-[#E89A5F]',
                dot: 'bg-[#E89A5F]',
                border: 'border-[#E89A5F]/20',
            },
        },
        error: {
            gallery: {
                bg: 'bg-tertiary-waratah-crimson/20',
                text: 'text-tertiary-waratah-crimson',
                dot: 'bg-tertiary-waratah-crimson',
                border: 'border-tertiary-waratah-crimson/30',
            },
            laboratory: {
                bg: 'bg-tertiary-waratah-crimson/15',
                text: 'text-tertiary-waratah-crimson',
                dot: 'bg-tertiary-waratah-crimson',
                border: 'border-tertiary-waratah-crimson/20',
            },
        },
        info: {
            gallery: {
                bg: 'bg-primary-wattle-gold/20',
                text: 'text-primary-wattle-gold',
                dot: 'bg-primary-wattle-gold',
                border: 'border-primary-wattle-gold/30',
            },
            laboratory: {
                bg: 'bg-primary-wattle-gold/15',
                text: 'text-primary-wattle-gold',
                dot: 'bg-primary-wattle-gold',
                border: 'border-primary-wattle-gold/20',
            },
        },
        neutral: {
            gallery: {
                bg: 'bg-secondary-flannel-flower/10',
                text: 'text-secondary-flannel-flower',
                dot: 'bg-secondary-flannel-flower',
                border: 'border-secondary-flannel-flower/20',
            },
            laboratory: {
                bg: 'bg-outline-variant/10',
                text: 'text-on-surface-parchment-dim',
                dot: 'bg-outline-variant',
                border: 'border-outline-variant/20',
            },
        },
    };

    const currentStyle = variantStyles[variant][mode];

    // Mode-specific shape
    const shapeClass = mode === 'gallery'
        ? 'rounded-[8px_4px_10px_6px]' // More organic for Gallery
        : 'radius-seed'; // Precise asymmetry for Laboratory

    return (
        <div
            className={`
                inline-flex items-center gap-2
                px-3 py-1
                ${shapeClass}
                ${currentStyle.bg}
                ${currentStyle.text}
                border ${currentStyle.border}
                transition-all duration-fast ease-viscous
                hover:scale-105 hover:brightness-110
                ${className}
            `}
        >
            {showDot && (
                <div
                    className={`
                        w-2 h-2
                        rounded-full
                        ${currentStyle.dot}
                    `}
                />
            )}
            <span className="text-xs font-annotation font-medium tracking-wide uppercase">
                {label}
            </span>
        </div>
    );
};
