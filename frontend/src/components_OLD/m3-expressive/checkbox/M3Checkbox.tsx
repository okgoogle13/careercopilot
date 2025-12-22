/**
 * M3 Expressive Checkbox Component
 * Implements Material Design 3 Checkbox for CareerCopilot
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 * - Elevation: --md-sys-elevation-*
 *
 * NOTE: CSS styles (M3Checkbox.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useRef, useEffect } from 'react';
import './M3Checkbox.css';

export interface M3CheckboxProps
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
   * If true, checkbox is checked
   */
  checked?: boolean;

  /**
   * If true, checkbox is in indeterminate state
   */
  indeterminate?: boolean;

  /**
   * Default checked state (uncontrolled)
   */
  defaultChecked?: boolean;

  /**
   * Change handler - emits the checked state
   */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Label text for the checkbox
   */
  label?: string;

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
 * <M3Checkbox color="primary" checked={isChecked} onChange={(checked) => setIsChecked(checked)} />
 * <M3Checkbox label="Accept terms" indeterminate />
 * <M3Checkbox size="large" disabled />
 * ```
 */
export const M3Checkbox = React.forwardRef<
  HTMLInputElement,
  M3CheckboxProps
>(
  (
    {
      color = 'primary',
      size = 'medium',
      checked,
      indeterminate = false,
      defaultChecked,
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

    // Set indeterminate state on the native input
    useEffect(() => {
      const input = internalRef.current;
      if (input) {
        input.indeterminate = indeterminate;
      }
    }, [indeterminate]);

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

    const checkboxId = id || `m3-checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const classNames = [
      'm3-checkbox',
      `m3-checkbox--${color}`,
      `m3-checkbox--${size}`,
      checked && 'm3-checkbox--checked',
      indeterminate && 'm3-checkbox--indeterminate',
      disabled && 'm3-checkbox--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

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

    const checkbox = (
      <input
        ref={inputRef}
        type="checkbox"
        id={checkboxId}
        className={classNames}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked ? 'true' : 'false'}
        aria-disabled={disabled}
        data-testid="m3-checkbox"
        {...props}
      />
    );

    if (label) {
      return (
        <div className="m3-checkbox-wrapper">
          {checkbox}
          <label
            htmlFor={checkboxId}
            className="m3-checkbox__label"
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

    return checkbox;
  }
);

M3Checkbox.displayName = 'M3Checkbox';

export default M3Checkbox;
