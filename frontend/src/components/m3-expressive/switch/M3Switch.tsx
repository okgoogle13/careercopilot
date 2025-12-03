/**
 * M3 Expressive Switch Component
 * Implements Material Design 3 Switch for CareerCopilot
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 * - Elevation: --md-sys-elevation-*
 *
 * NOTE: CSS styles (M3Switch.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useRef } from 'react';
import './M3Switch.css';

export interface M3SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  /**
   * Color role from M3 palette
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';

  /**
   * Size variant
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * If true, switch is checked (on)
   */
  checked?: boolean;

  /**
   * Default checked state (uncontrolled)
   */
  defaultChecked?: boolean;

  /**
   * Change handler - emits the checked state
   */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Label text for the switch
   */
  label?: string;

  /**
   * Label position
   * @default 'right'
   */
  labelPosition?: 'left' | 'right';

  /**
   * Icon to display when switch is on (optional)
   */
  onIcon?: React.ReactNode;

  /**
   * Icon to display when switch is off (optional)
   */
  offIcon?: React.ReactNode;

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
 * <M3Switch color="primary" checked={isOn} onChange={(checked) => setIsOn(checked)} />
 * <M3Switch label="Enable notifications" labelPosition="left" />
 * <M3Switch size="large" disabled />
 * ```
 */
export const M3Switch = React.forwardRef<
  HTMLInputElement,
  M3SwitchProps
>(
  (
    {
      color = 'primary',
      size = 'medium',
      checked,
      defaultChecked,
      onChange,
      disabled = false,
      label,
      labelPosition = 'right',
      onIcon,
      offIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      onChange?.(event.target.checked, event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (event.key === ' ') {
        event.preventDefault();
        const input = internalRef.current;
        if (input) {
          input.click();
        }
      }
    };

    // Handle ref forwarding properly
    const inputRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
        internalRef.current = node;
      },
      [ref]
    );

    const switchId = id || `m3-switch-${Math.random().toString(36).substr(2, 9)}`;

    const classNames = [
      'm3-switch',
      `m3-switch--${color}`,
      `m3-switch--${size}`,
      checked && 'm3-switch--checked',
      disabled && 'm3-switch--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const switchInput = (
      <div className="m3-switch__track">
        <input
          ref={inputRef}
          type="checkbox"
          id={switchId}
          className={classNames}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          role="switch"
          aria-checked={checked ? 'true' : 'false'}
          aria-disabled={disabled}
          data-testid="m3-switch"
          {...props}
        />
        <span className="m3-switch__thumb">
          {checked && onIcon && (
            <span className="m3-switch__icon m3-switch__icon--on">{onIcon}</span>
          )}
          {!checked && offIcon && (
            <span className="m3-switch__icon m3-switch__icon--off">{offIcon}</span>
          )}
        </span>
      </div>
    );

    if (label) {
      return (
        <div className={`m3-switch-wrapper m3-switch-wrapper--label-${labelPosition}`}>
          {labelPosition === 'left' && (
            <label
              htmlFor={switchId}
              className="m3-switch__label"
              onClick={(e) => {
                if (disabled) {
                  e.preventDefault();
                }
              }}
            >
              {label}
            </label>
          )}
          {switchInput}
          {labelPosition === 'right' && (
            <label
              htmlFor={switchId}
              className="m3-switch__label"
              onClick={(e) => {
                if (disabled) {
                  e.preventDefault();
                }
              }}
            >
              {label}
            </label>
          )}
        </div>
      );
    }

    return switchInput;
  }
);

M3Switch.displayName = 'M3Switch';

export default M3Switch;
