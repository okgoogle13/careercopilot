import React from 'react';

export interface SeedProps {
  /** Badge content (number or small string) */
  content?: React.ReactNode;
  /** Semantic color theme */
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'neutral';
  /** Badge size */
  size?: 'small' | 'medium';
  /** Position relative to anchor */
  overlap?: 'circular' | 'rectangular';
  /** Show content? If false, shows as a dot */
  variant?: 'standard' | 'dot';
  /** The element the badge is attached to */
  children: React.ReactNode;
  /** Additional CSS classes for container */
  className?: string;
  /** Hidden state */
  invisible?: boolean;
}

/**
 * Seed - Kerala Rage kr-solidarity Notification Badge
 *
 * A notification badge overlay for icons and components using Kerala Rage kr-solidarity semantic tokens.
 * Archetype: Seed (atomic notification primitive)
 *
 * **Kerala Rage Design Token Usage:**
 * - Colors: Kerala Rage kr-solidarity semantic palette (solidarityRed, inkGold, signalGreen, stencilYellow)
 * - Shape: Circular (rounded-march)
 * - Motion: Spring physics cubic-bezier(0.34, 1.56, 0.64, 1) with zoom-in animation
 * - Typography: Work Sans (annotation font)
 */
export const Seed: React.FC<SeedProps> = ({
  content,
  color = 'error',
  size = 'medium',
  overlap = 'rectangular',
  variant = 'standard',
  children,
  className = '',
  invisible = false,
}) => {
  if (invisible) return <>{children}</>;

  const colorClasses = {
    primary:
      'bg-[var(--sys-color-signalGreen-base)] text-[var(--sys-color-charcoalBackground-base)]',
    secondary:
      'bg-[var(--sys-color-kr-activistSmokeGreen-base)] text-[var(--sys-color-charcoalBackground-base)]',
    error: 'bg-[var(--sys-color-solidarityRed-base)] text-[var(--sys-color-worker-ash-base)]',
    warning:
      'bg-[var(--sys-color-stencilYellow-base)] text-[var(--sys-color-charcoalBackground-base)]',
    neutral: 'bg-[var(--sys-color-concreteGrey-steps-4)] text-[var(--sys-color-worker-ash-base)]',
  };

  const sizeClasses = {
    small: variant === 'dot' ? 'w-2 h-2' : 'min-w-[14px] h-[14px] text-[8px] px-1',
    medium: variant === 'dot' ? 'w-3 h-3' : 'min-w-[20px] h-[20px] text-[10px] px-1.5',
  };

  const overlapClasses =
    overlap === 'circular' ? 'top-1 right-1' : 'top-0 right-0 translate-x-1/2 -translate-y-1/2';

  return (
    <div className={`relative inline-flex align-middle ${className}`}>
      {children}
      <div
        className={`
                    absolute z-10
                    flex items-center justify-center
                    rounded-march font-bold font-mono
                    ${colorClasses[color]}
                    ${sizeClasses[size]}
                    ${overlapClasses}
                    border border-[var(--sys-color-charcoalBackground-base)]
                    transition-all duration-300 var(--ease-viscous-breeze)
                    animate-in zoom-in duration-200
                `}
      >
        {variant === 'standard' && content}
      </div>
    </div>
  );
};
