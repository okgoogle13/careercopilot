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
<<<<<<< HEAD
 * M3Badge - Northcote Curio Notification Badge
 *
 * An organic badge overlay for icons and components.
=======
 * M3Badge - KeralaRage KrSolidarity Notification Badge
 *
 * An [DEPRECATED_STYLE] badge overlay for icons and components.
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
    primary: 'bg-[var(--ref-palette-primary-40)] text-[var(--ref-palette-primary-100)]',
    secondary: 'bg-[var(--ref-palette-secondary-40)] text-[var(--ref-palette-secondary-100)]',
    error: 'bg-[var(--ref-palette-error-40)] text-[var(--ref-palette-error-100)]',
    warning: 'bg-[var(--ref-palette-warning-40)] text-[var(--ref-palette-warning-10)]',
<<<<<<< HEAD
    neutral: 'bg-[var(--color-flannel-flower-dark)] text-[var(--color-parchment)]',
=======
    neutral: 'bg-[var(--color-concrete-grey-dark)] text-[var(--color-paper-white)]',
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
                    rounded-full font-bold font-annotation
                    ${colorClasses[color]}
                    ${sizeClasses[size]}
                    ${overlapClasses}
<<<<<<< HEAD
                    border border-[var(--color-specimen-night)]
=======
                    border border-[var(--color-asphalt-black)]
>>>>>>> restoration-KR-Rage-Figma-v2.0
                    transition-all duration-300 var(--ease-viscous-breeze)
                    animate-in zoom-in duration-200
                `}
      >
        {variant === 'standard' && content}
      </div>
    </div>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> restoration-KR-Rage-Figma-v2.0
