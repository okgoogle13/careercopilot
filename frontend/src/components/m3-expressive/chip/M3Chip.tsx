/**
 * M3 Expressive Chip Component
 * Implements Material Design 3 chip for tags, filters, and selections
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 */
import React from 'react';
import './M3Chip.css';

export interface M3ChipProps {
  /**
   * Chip label text
   */
  label: string;

  /**
   * Chip variant
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined';

  /**
   * Color role from M3 palette
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success';

  /**
   * Size variant
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * If true, chip is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * If true, shows delete icon
   * @default false
   */
  removable?: boolean;

  /**
   * Icon element to display at start
   */
  icon?: React.ReactNode;

  /**
   * Avatar element to display at start
   */
  avatar?: React.ReactNode;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Delete handler (called when X is clicked)
   */
  onDelete?: () => void;

  /**
   * Custom className
   */
  className?: string;

  /**
   * If true, chip is selected (for filter chips)
   * @default false
   */
  selected?: boolean;
}

/**
 * M3 Expressive Chip component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Chip label="React" color="primary" />
 * <M3Chip label="TypeScript" removable onDelete={() => {}} />
 * <M3Chip label="JavaScript" icon={<Icon />} />
 * ```
 */
export const M3Chip: React.FC<M3ChipProps> = ({
  label,
  variant = 'filled',
  color = 'primary',
  size = 'medium',
  disabled = false,
  removable = false,
  icon,
  avatar,
  onClick,
  onDelete,
  className = '',
  selected = false,
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onDelete) {
      onDelete();
    }
  };

  const classNames = [
    'm3-chip',
    `m3-chip--${variant}`,
    `m3-chip--${color}`,
    `m3-chip--${size}`,
    disabled && 'm3-chip--disabled',
    selected && 'm3-chip--selected',
    onClick && 'm3-chip--clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-disabled={disabled}
      data-testid="m3-chip"
    >
      {avatar && <span className="m3-chip__avatar">{avatar}</span>}
      {icon && !avatar && <span className="m3-chip__icon">{icon}</span>}
      <span className="m3-chip__label">{label}</span>
      {removable && (
        <button
          type="button"
          className="m3-chip__delete"
          onClick={handleDelete}
          disabled={disabled}
          aria-label={`Remove ${label}`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      )}
    </div>
  );
};

M3Chip.displayName = 'M3Chip';

export default M3Chip;
