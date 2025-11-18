/**
 * M3 Expressive Switch Component
 * Implements Material Design 3 toggle switch with smooth animations
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React from 'react';
import './M3Switch.css';

export interface M3SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
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
   * Label text
   */
  label?: string;

  /**
   * Position of label
   * @default 'end'
   */
  labelPosition?: 'start' | 'end';

  /**
   * Show icons on track
   * @default false
   */
  showIcons?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Switch component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Switch
 *   checked={enabled}
 *   onChange={(e) => setEnabled(e.target.checked)}
 *   label="Enable notifications"
 * />
 * ```
 */
export const M3Switch = React.forwardRef<HTMLInputElement, M3SwitchProps>(
  (
    {
      color = 'primary',
      size = 'medium',
      label,
      labelPosition = 'end',
      showIcons = false,
      disabled = false,
      className = '',
      checked,
      ...props
    },
    ref
  ) => {
    const wrapperClassNames = [
      'm3-switch-wrapper',
      `m3-switch-wrapper--${color}`,
      `m3-switch-wrapper--${size}`,
      `m3-switch-wrapper--label-${labelPosition}`,
      disabled && 'm3-switch-wrapper--disabled',
      checked && 'm3-switch-wrapper--checked',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label className={wrapperClassNames} data-testid="m3-switch-wrapper">
        {label && labelPosition === 'start' && (
          <span className="m3-switch__label m3-switch__label--start">{label}</span>
        )}

        <input
          ref={ref}
          type="checkbox"
          role="switch"
          className="m3-switch__input"
          disabled={disabled}
          checked={checked}
          aria-checked={checked}
          data-testid="m3-switch"
          {...props}
        />

        {/* Switch track and thumb */}
        <span className="m3-switch__track">
          {showIcons && (
            <>
              {/* Check icon (when on) */}
              <svg
                className="m3-switch__icon m3-switch__icon--check"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 4L6 11L3 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* X icon (when off) */}
              <svg
                className="m3-switch__icon m3-switch__icon--close"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4L4 12M4 4l8 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}

          {/* Sliding thumb */}
          <span className="m3-switch__thumb" />
        </span>

        {label && labelPosition === 'end' && (
          <span className="m3-switch__label m3-switch__label--end">{label}</span>
        )}
      </label>
    );
  }
);

M3Switch.displayName = 'M3Switch';

export default M3Switch;
