/**
 * M3 Expressive SearchInput Component
 * Implements Material Design 3 search input with icons and clear functionality
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React, { useState, useCallback } from 'react';
import './M3SearchInput.css';

export interface M3SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'> {
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
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Value for controlled component
   */
  value?: string;

  /**
   * Default value for uncontrolled component
   */
  defaultValue?: string;

  /**
   * Callback when value changes
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Callback when clear button is clicked
   */
  onClear?: () => void;

  /**
   * Show clear button when input has value
   * @default true
   */
  showClearButton?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive SearchInput component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3SearchInput
 *   variant="outlined"
 *   placeholder="Search..."
 *   onClear={() => console.log('Cleared')}
 * />
 * ```
 */
export const M3SearchInput = React.forwardRef<HTMLInputElement, M3SearchInputProps>(
  (
    {
      variant = 'outlined',
      color = 'primary',
      size = 'medium',
      disabled = false,
      placeholder = 'Search...',
      value,
      defaultValue = '',
      onChange,
      onClear,
      showClearButton = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setInternalValue(event.target.value);
        }
        onChange?.(event);
      },
      [isControlled, onChange]
    );

    const handleClear = useCallback(() => {
      const syntheticEvent = {
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;

      if (!isControlled) {
        setInternalValue('');
      }
      onChange?.(syntheticEvent);
      onClear?.();
    }, [isControlled, onChange, onClear]);

    const wrapperClassNames = [
      'm3-search-input-wrapper',
      `m3-search-input-wrapper--${variant}`,
      `m3-search-input-wrapper--${color}`,
      `m3-search-input-wrapper--${size}`,
      disabled && 'm3-search-input-wrapper--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClassNames} data-testid="m3-search-input-wrapper">
        {/* Search Icon */}
        <svg
          className="m3-search-input__icon m3-search-input__icon--search"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Input */}
        <input
          ref={ref}
          type="text"
          className="m3-search-input__input"
          placeholder={placeholder}
          disabled={disabled}
          value={currentValue}
          onChange={handleChange}
          data-testid="m3-search-input"
          {...props}
        />

        {/* Clear Button */}
        {showClearButton && currentValue && !disabled && (
          <button
            type="button"
            className="m3-search-input__clear-button"
            onClick={handleClear}
            aria-label="Clear search"
            data-testid="m3-search-input-clear"
          >
            <svg
              className="m3-search-input__icon m3-search-input__icon--clear"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.5 4.5l-9 9M4.5 4.5l9 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

M3SearchInput.displayName = 'M3SearchInput';

export default M3SearchInput;
