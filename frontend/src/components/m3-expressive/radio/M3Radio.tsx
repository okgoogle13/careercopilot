/**
 * M3 Expressive Radio Component
 * Implements Material Design 3 Radio for CareerCopilot
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 * - Elevation: --md-sys-elevation-*
 *
 * NOTE: CSS styles (M3Radio.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useRef } from 'react';
import './M3Radio.css';

export interface M3RadioProps
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
   * Value of the radio button
   */
  value: string | number;

  /**
   * If true, radio is checked
   */
  checked?: boolean;

  /**
   * Default checked state (uncontrolled)
   */
  defaultChecked?: boolean;

  /**
   * Name attribute for grouping radio buttons
   */
  name?: string;

  /**
   * Change handler - emits the selected value
   */
  onChange?: (value: string | number, event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Label text for the radio button
   */
  label?: string;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Radio component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Radio color="primary" value="option1" checked={selected === "option1"} onChange={(value) => setSelected(value)} />
 * <M3Radio label="Option 2" value="option2" name="group1" />
 * <M3Radio size="large" disabled value="option3" />
 * ```
 */
export const M3Radio = React.forwardRef<
  HTMLInputElement,
  M3RadioProps
>(
  (
    {
      color = 'primary',
      size = 'medium',
      value,
      checked,
      defaultChecked,
      name,
      onChange,
      disabled = false,
      label,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);

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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      onChange?.(value, event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        const input = internalRef.current;
        if (input) {
          input.click();
        }
      }
    };

    const radioId = id || `m3-radio-${Math.random().toString(36).substr(2, 9)}`;

    const classNames = [
      'm3-radio',
      `m3-radio--${color}`,
      `m3-radio--${size}`,
      checked && 'm3-radio--checked',
      disabled && 'm3-radio--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const radio = (
      <input
        ref={inputRef}
        type="radio"
        id={radioId}
        name={name}
        value={value}
        className={classNames}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        role="radio"
        aria-checked={checked ? 'true' : 'false'}
        aria-disabled={disabled}
        data-testid="m3-radio"
        {...props}
      />
    );

    if (label) {
      return (
        <div className="m3-radio-wrapper">
          {radio}
          <label
            htmlFor={radioId}
            className="m3-radio__label"
            onClick={(e) => {
              if (disabled) {
                e.preventDefault();
              }
            }}
          >
            {label}
          </label>
        </div>
      );
    }

    return radio;
  }
);

M3Radio.displayName = 'M3Radio';

export default M3Radio;
