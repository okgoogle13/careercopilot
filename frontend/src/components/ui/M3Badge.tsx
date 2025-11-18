/**
 * M3 Expressive Badge Component
 * Implements Material Design 3 badge/chip with color variants
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 */
import React from 'react';
import './M3Badge.css';

export type M3BadgeVariant = 'filled' | 'outlined' | 'tonal';
export type M3BadgeColor = 'primary' | 'secondary' | 'tertiary' | 'error' | 'neutral';
export type M3BadgeSize = 'small' | 'medium' | 'large';

export interface M3BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The variant to use
   * @default 'filled'
   */
  variant?: M3BadgeVariant;

  /**
   * The color role from M3 palette
   * @default 'primary'
   */
  color?: M3BadgeColor;

  /**
   * The size of the badge
   * @default 'medium'
   */
  size?: M3BadgeSize;

  /**
   * Icon to display before text
   */
  startIcon?: React.ReactNode;

  /**
   * Icon to display after text
   */
  endIcon?: React.ReactNode;

  /**
   * If true, badge is clickable
   * @default false
   */
  clickable?: boolean;

  /**
   * If true, badge is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Content of the badge
   */
  children: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Click handler for clickable badges
   */
  onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;

  /**
   * Delete/close handler
   */
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * M3 Expressive Badge component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Badge variant="filled" color="primary">
 *   Active
 * </M3Badge>
 *
 * <M3Badge variant="tonal" color="secondary" startIcon={<Icon />}>
 *   With Icon
 * </M3Badge>
 *
 * <M3Badge variant="outlined" color="error" onDelete={() => {}}>
 *   Deletable
 * </M3Badge>
 * ```
 */
export const M3Badge = React.forwardRef<HTMLSpanElement, M3BadgeProps>(
  (
    {
      variant = 'filled',
      color = 'primary',
      size = 'medium',
      startIcon,
      endIcon,
      clickable = false,
      disabled = false,
      children,
      className = '',
      onClick,
      onDelete,
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-badge',
      `m3-badge--${variant}`,
      `m3-badge--${color}`,
      `m3-badge--${size}`,
      clickable && 'm3-badge--clickable',
      disabled && 'm3-badge--disabled',
      onDelete && 'm3-badge--deletable',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
      if (!disabled && clickable && onClick) {
        onClick(e);
      }
    };

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (!disabled && onDelete) {
        onDelete(e);
      }
    };

    return (
      <span
        ref={ref}
        className={classNames}
        onClick={handleClick}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable && !disabled ? 0 : undefined}
        data-testid="m3-badge"
        {...props}
      >
        {startIcon && <span className="m3-badge__icon m3-badge__icon--start">{startIcon}</span>}

        <span className="m3-badge__label">{children}</span>

        {onDelete && (
          <button
            type="button"
            className="m3-badge__delete"
            onClick={handleDelete}
            disabled={disabled}
            aria-label="Delete"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <path d="M14.25 4.8075L13.1925 3.75L9 7.9425L4.8075 3.75L3.75 4.8075L7.9425 9L3.75 13.1925L4.8075 14.25L9 10.0575L13.1925 14.25L14.25 13.1925L10.0575 9L14.25 4.8075Z" />
            </svg>
          </button>
        )}

        {endIcon && !onDelete && (
          <span className="m3-badge__icon m3-badge__icon--end">{endIcon}</span>
        )}
      </span>
    );
  }
);

M3Badge.displayName = 'M3Badge';

export default M3Badge;
