/**
 * M3 Expressive Input Component
 * Implements Material Design 3 text field with outlined variant
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 */
import React, { useState } from 'react';
import './M3Input.css';

export interface M3InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input label
   */
  label?: string;

  /**
   * Helper text displayed below input
   */
  helperText?: string;

  /**
   * Error message (replaces helperText when present)
   */
  error?: string | boolean;

  /**
   * If true, displays error state
   * @default false
   */
  isError?: boolean;

  /**
   * Icon to display at the start of the input
   */
  startIcon?: React.ReactNode;

  /**
   * Icon to display at the end of the input
   */
  endIcon?: React.ReactNode;

  /**
   * If true, input takes full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Input size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Custom className
   */
  className?: string;

  /**
   * Input type
   * @default 'text'
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
}

/**
 * M3 Expressive Input component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   helperText="We'll never share your email"
 * />
 *
 * <M3Input
 *   label="Password"
 *   type="password"
 *   error="Password is required"
 *   isError
 * />
 *
 * <M3Input
 *   label="Search"
 *   startIcon={<SearchIcon />}
 *   placeholder="Search..."
 * />
 * ```
 */
export const M3Input = React.forwardRef<HTMLInputElement, M3InputProps>(
  (
    {
      label,
      helperText,
      error,
      isError = false,
      startIcon,
      endIcon,
      fullWidth = false,
      size = 'medium',
      className = '',
      disabled = false,
      type = 'text',
      placeholder,
      value,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    const hasError = isError || !!error;
    const displayHelperText = hasError && typeof error === 'string' ? error : helperText;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      onChange?.(e);
    };

    const classNames = [
      'm3-input-wrapper',
      `m3-input-wrapper--${size}`,
      fullWidth && 'm3-input-wrapper--full-width',
      disabled && 'm3-input-wrapper--disabled',
      hasError && 'm3-input-wrapper--error',
      isFocused && 'm3-input-wrapper--focused',
      (hasValue || isFocused) && 'm3-input-wrapper--has-value',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={classNames}>
        <div className="m3-input-container">
          {startIcon && <span className="m3-input__icon m3-input__icon--start">{startIcon}</span>}

          <div className="m3-input__field-wrapper">
            <input
              ref={ref}
              type={type}
              className="m3-input__field"
              placeholder={isFocused ? placeholder : ''}
              disabled={disabled}
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-invalid={hasError}
              aria-describedby={displayHelperText ? 'm3-input-helper-text' : undefined}
              data-testid="m3-input"
              {...props}
            />

            {label && (
              <label
                className="m3-input__label"
                onClick={() => ref && 'current' in ref && ref.current?.focus()}
              >
                {label}
              </label>
            )}
          </div>

          {endIcon && <span className="m3-input__icon m3-input__icon--end">{endIcon}</span>}

          <fieldset className="m3-input__outline" aria-hidden="true">
            <legend className="m3-input__legend">
              {label && (isFocused || hasValue) ? <span>{label}</span> : null}
            </legend>
          </fieldset>
        </div>

        {displayHelperText && (
          <span
            id="m3-input-helper-text"
            className={`m3-input__helper-text ${hasError ? 'm3-input__helper-text--error' : ''}`}
          >
            {displayHelperText}
          </span>
        )}
      </div>
    );
  }
);

M3Input.displayName = 'M3Input';

export default M3Input;
