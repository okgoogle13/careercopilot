import React from 'react';

export type StatusBadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type StatusBadgeMode = 'KrDark' | 'KrLight';

export interface StatusBadgeProps {
  /** The text label to display */
  label: string;
  /** Semantic status variant */
  variant?: StatusBadgeVariant;
  /** Theme mode: KrDark (warm) or KrLight (clinical, precise) */
  mode?: StatusBadgeMode;
  /** Optional dot indicator */
  showDot?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
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
      success: 'primary', // Sage
      warning: 'warning', // Gold (Highlight)
      error: 'error', // Crimson (Alert)
      info: 'secondary', // Coral (Dynamic)
      neutral: 'neutral', // Charcoal (Recessed)
    };

    const base = colorMap[variant];

    // Mode-aware colors using palette tokens
    const styles = {
      bg: `var(--ref-palette-${base}-90)`,
      text: `var(--on-${base}-container)`,
      dot: `var(--ref-palette-${base}-40)`,
      border: `var(--ref-palette-${base}-80)`,
    };

    // Solidarity mode color overrides using semantic tokens
    if (base === 'primary') {
      // Activist Smoke (Success)
      styles.bg = 'rgba(72, 218, 139, 0.15)';
      styles.text = 'var(--sys-color-kr-activistSmokeGreen-base)';
      styles.dot = 'var(--sys-color-kr-activistSmokeGreen-base)';
      styles.border = 'var(--sys-color-kr-activistSmokeGreen-steps-2)';
    } else if (base === 'neutral') {
      styles.bg = 'var(--sys-color-concreteGrey-steps-0)';
      styles.text = 'var(--sys-color-concreteGrey-base)';
      styles.dot = 'var(--sys-color-concreteGrey-steps-4)';
      styles.border = 'var(--sys-color-concreteGrey-steps-1)';
    } else if (base === 'warning') {
      styles.text = 'var(--sys-color-inkGold-base)';
      styles.bg = 'var(--sys-color-inkGold-steps-0)';
      styles.border = 'var(--sys-color-inkGold-steps-2)';
      styles.dot = 'var(--sys-color-inkGold-base)';
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
                transition-all duration-300 ease-viscous var(--ease-viscous-breeze)
                hover:scale-105 hover:brightness-110
                ${className}
            `}
      style={{
        borderRadius: 'var(--shape-megaphoneCut01)',
        backgroundColor: currentStyle.bg,
        color: currentStyle.text,
        borderColor: currentStyle.border,
      }}
    >
      {showDot && (
        <div
          className="w-2 h-2 rounded-sentry"
          style={{ backgroundColor: currentStyle.dot }}
        />
      )}
      <span className="text-xs font-annotation font-bold tracking-widest uppercase">{label}</span>
    </div>
  );
};
