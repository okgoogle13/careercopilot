/**
 * M3 Expressive Textarea Component
 * Implements Material Design 3 multiline text input with auto-resize and character counter
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import './M3Textarea.css';

export interface M3TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size' | 'color'> {
  /**
   * The variant to use
   * @default 'outlined'
   */
  variant?: 'outlined' | 'filled';

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
   * Helper text displayed below textarea
   */
  helperText?: string;

  /**
   * Error message (shows error state if provided)
   */
  error?: string | boolean;

  /**
   * Enable auto-resize based on content
   * @default true
   */
  autoResize?: boolean;

  /**
   * Minimum number of rows
   * @default 3
   */
  minRows?: number;

  /**
   * Maximum number of rows before scrolling
   * @default 10
   */
  maxRows?: number;

  /**
   * Show character counter
   * @default false
   */
  showCharacterCount?: boolean;

  /**
   * Maximum character count
   */
  maxLength?: number;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Textarea component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Textarea
 *   label="Description"
 *   autoResize
 *   showCharacterCount
 *   maxLength={500}
 * />
 * ```
 */
export const M3Textarea = React.forwardRef<HTMLTextAreaElement, M3TextareaProps>(
  (
    {
      variant = 'outlined',
      color = 'primary',
      size = 'medium',
      disabled = false,
      label,
      helperText,
      error,
      autoResize = true,
      minRows = 3,
      maxRows = 10,
      showCharacterCount = false,
      maxLength,
      className = '',
      value,
      defaultValue = '',
      onChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasError = Boolean(error);

    // Auto-resize functionality
    const adjustHeight = useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea || !autoResize) return;

      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';

      // Calculate line height
      const computedStyle = window.getComputedStyle(textarea);
      const lineHeight = parseInt(computedStyle.lineHeight, 10);

      // Calculate min and max heights
      const minHeight = lineHeight * minRows;
      const maxHeight = lineHeight * maxRows;

      // Set new height within bounds
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
    }, [autoResize, minRows, maxRows]);

    // Adjust height when value changes
    useEffect(() => {
      adjustHeight();
    }, [currentValue, adjustHeight]);

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!isControlled) {
          setInternalValue(event.target.value);
        }
        onChange?.(event);
      },
      [isControlled, onChange]
    );

    const wrapperClassNames = [
      'm3-textarea-wrapper',
      `m3-textarea-wrapper--${variant}`,
      `m3-textarea-wrapper--${color}`,
      `m3-textarea-wrapper--${size}`,
      isFocused && 'm3-textarea-wrapper--focused',
      hasError && 'm3-textarea-wrapper--error',
      disabled && 'm3-textarea-wrapper--disabled',
      (isFocused || currentValue) && 'm3-textarea-wrapper--has-value',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const characterCount = String(currentValue).length;
    const isOverLimit = maxLength !== undefined && characterCount > maxLength;

    return (
      <div className={wrapperClassNames} data-testid="m3-textarea-wrapper">
        {label && (
          <label className="m3-textarea__label" htmlFor={props.id}>
            {label}
          </label>
        )}

        <textarea
          ref={(element) => {
            textareaRef.current = element;
            if (typeof ref === 'function') {
              ref(element);
            } else if (ref) {
              ref.current = element;
            }
          }}
          className="m3-textarea__input"
          disabled={disabled}
          value={currentValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
          rows={minRows}
          data-testid="m3-textarea"
          {...props}
        />

        {/* Helper text or error message */}
        {(helperText || error) && (
          <div className="m3-textarea__helper-text">
            {typeof error === 'string' ? error : helperText}
          </div>
        )}

        {/* Character counter */}
        {showCharacterCount && (
          <div
            className={`m3-textarea__character-count ${
              isOverLimit ? 'm3-textarea__character-count--over-limit' : ''
            }`}
          >
            {characterCount}
            {maxLength !== undefined && ` / ${maxLength}`}
          </div>
        )}
      </div>
    );
  }
);

M3Textarea.displayName = 'M3Textarea';

export default M3Textarea;
