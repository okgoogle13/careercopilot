/**
 * M3 Expressive Tag Component
 * Implements Material Design 3 Tag for CareerCopilot
 *
 * Label/tag display component. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Tag.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';
import './M3Tag.css';

export interface M3TagProps {
  /**
   * Tag label text
   */
  label: string;

  /**
   * Tag variant
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined';

  /**
   * Color role from M3 palette
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'warning';

  /**
   * Size variant
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * If true, tag is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Tag component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Tag label="React" color="primary" />
 * <M3Tag label="TypeScript" variant="outlined" />
 * ```
 */
export const M3Tag: React.FC<M3TagProps> = ({
  label,
  variant = 'filled',
  color = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
}) => {
  const classNames = [
    'm3-tag',
    `m3-tag--${variant}`,
    `m3-tag--${color}`,
    `m3-tag--${size}`,
    disabled && 'm3-tag--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames} role="status" aria-label={label}>
      {label}
    </span>
  );
};

M3Tag.displayName = 'M3Tag';

export default M3Tag;
