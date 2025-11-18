/**
 * M3 Expressive Checkbox Component
 * Implements Material Design 3 checkbox with indeterminate state support
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React, { useEffect, useRef } from 'react';
import './M3Checkbox.css';

export interface M3CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /**
   * The color role from M3 palette
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';

  /**
   * The size of the component
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Indeterminate state (shows dash instead of checkmark)
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Label text
   */
  label?: string;

  /**
   * Error state
   */
  error?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Checkbox component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Checkbox
 *   checked={checked}
 *   onChange={(e) => setChecked(e.target.checked)}
 *   label="Accept terms"
 * />
 * <M3Checkbox indeterminate label="Select all" />
 * ```
 */
export const M3Checkbox = React.forwardRef<HTMLInputElement, M3CheckboxProps>(
  (
    {
      color = 'primary',
      size = 'medium',
      indeterminate = false,
      label,
      error = false,
      disabled = false,
      className = '',
      checked,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Set indeterminate property (can't be set via HTML attribute)
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const wrapperClassNames = [
      'm3-checkbox-wrapper',
      `m3-checkbox-wrapper--${color}`,
      `m3-checkbox-wrapper--${size}`,
      error && 'm3-checkbox-wrapper--error',
      disabled && 'm3-checkbox-wrapper--disabled',
      (checked || indeterminate) && 'm3-checkbox-wrapper--checked',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label className={wrapperClassNames} data-testid="m3-checkbox-wrapper">
        <input
          ref={(element) => {
            inputRef.current = element;
            if (typeof ref === 'function') {
              ref(element);
            } else if (ref) {
              ref.current = element;
            }
          }}
          type="checkbox"
          className="m3-checkbox__input"
          disabled={disabled}
          checked={checked}
          data-testid="m3-checkbox"
          {...props}
        />

        {/* Custom checkbox visual */}
        <span className="m3-checkbox__box">
          {/* Checkmark icon */}
          <svg
            className="m3-checkbox__icon m3-checkbox__icon--check"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 4.5L6.75 12.75L3 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Indeterminate dash icon */}
          <svg
            className="m3-checkbox__icon m3-checkbox__icon--indeterminate"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 9h10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>

        {/* Label */}
        {label && <span className="m3-checkbox__label">{label}</span>}
      </label>
    );
  }
);

M3Checkbox.displayName = 'M3Checkbox';

export default M3Checkbox;
