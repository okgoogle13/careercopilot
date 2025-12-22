/**
 * M3 Expressive TextArea Component
 * Implements Material Design 3 TextArea for CareerCopilot
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 * - Elevation: --md-sys-elevation-*
 *
 * NOTE: CSS styles (M3TextArea.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useState, useCallback } from 'react';
import './M3Textarea.css';

export interface M3TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /**
   * TextArea variant style
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined';

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
   * Number of visible rows
   * @default 4
   */
  rows?: number;

  /**
   * Resize behavior
   * @default 'vertical'
   */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';

  /**
   * If true, textarea is in error state
   * @default false
   */
  error?: boolean;

  /**
   * Error message to display
   */
  errorMessage?: string;

  /**
   * Helper text to display below the textarea
   */
  helperText?: string;

  /**
   * Label text for the textarea
   */
  label?: string;

  /**
   * If true, show character count
   * @default false
   */
  showCharCount?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive TextArea component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3TextArea variant="filled" color="primary" placeholder="Enter text" />
 * <M3TextArea variant="outlined" rows={6} label="Description" />
 * <M3TextArea error errorMessage="This field is required" showCharCount maxLength={200} />
 * ```
 */
export const M3TextArea = React.forwardRef<
  HTMLTextAreaElement,
  M3TextAreaProps
>(
  (
    {
      variant = 'filled',
      color = 'primary',
      size = 'medium',
      rows = 4,
      resize = 'vertical',
      error = false,
      errorMessage,
      helperText,
      label,
      showCharCount = false,
      className = '',
      disabled = false,
      maxLength,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string>(
      typeof defaultValue === 'string' ? defaultValue : ''
    );

    const isControlled = value !== undefined;
    const currentValue = isControlled ? (typeof value === 'string' ? value : '') : internalValue;
    const charCount = currentValue.length;

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (disabled) return;
        
        if (!isControlled) {
          setInternalValue(event.target.value);
        }
        onChange?.(event);
      },
      [disabled, isControlled, onChange]
    );

    const classNames = [
      'm3-textarea',
      `m3-textarea--${variant}`,
      `m3-textarea--${color}`,
      `m3-textarea--${size}`,
      error && 'm3-textarea--error',
      disabled && 'm3-textarea--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const textareaId = props.id || `m3-textarea-${Math.random().toString(36).substr(2, 9)}`;
    const helperId = helperText || errorMessage ? `${textareaId}-helper` : undefined;

    const resizeClass = `m3-textarea--resize-${resize}`;

    return (
      <div className="m3-textarea-wrapper">
        {label && (
          <label htmlFor={textareaId} className="m3-textarea__label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`${classNames} ${resizeClass}`}
          disabled={disabled}
          maxLength={maxLength}
          value={isControlled ? value : undefined}
          defaultValue={!isControlled ? defaultValue : undefined}
          onChange={handleChange}
          aria-invalid={error}
          aria-describedby={helperId}
          data-testid="m3-textarea"
          {...props}
        />
        <div className="m3-textarea__footer">
          {(helperText || (error && errorMessage)) && (
            <span
              id={helperId}
              className={`m3-textarea__helper ${error ? 'm3-textarea__helper--error' : ''}`}
            >
              {error && errorMessage ? errorMessage : helperText}
            </span>
          )}
          {showCharCount && maxLength && (
            <span className="m3-textarea__char-count">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

M3TextArea.displayName = 'M3TextArea';

export default M3TextArea;
