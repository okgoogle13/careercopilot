/**
 * M3 Expressive Select Component
 * Implements Material Design 3 Select for CareerCopilot
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 * - Elevation: --md-sys-elevation-*
 *
 * NOTE: CSS styles (M3Select.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import './M3Select.css';

export interface M3SelectOption {
  /**
   * Display label for the option
   */
  label: string;

  /**
   * Value of the option
   */
  value: string | number;

  /**
   * If true, option is disabled
   */
  disabled?: boolean;
}

export interface M3SelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Array of select options
   */
  options: M3SelectOption[];

  /**
   * Currently selected value
   */
  value?: string | number;

  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string | number;

  /**
   * Change handler - emits the selected value
   */
  onChange?: (value: string | number) => void;

  /**
   * Select variant style
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
   * If true, select is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string;

  /**
   * If true, select is in error state
   * @default false
   */
  error?: boolean;

  /**
   * Error message to display
   */
  errorMessage?: string;

  /**
   * Label text for the select
   */
  label?: string;

  /**
   * Helper text to display below the select
   */
  helperText?: string;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Select component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Select
 *   variant="filled"
 *   color="primary"
 *   options={[
 *     { label: 'Option 1', value: '1' },
 *     { label: 'Option 2', value: '2' }
 *   ]}
 *   value={selectedValue}
 *   onChange={(value) => setSelectedValue(value)}
 * />
 * ```
 */
export const M3Select = React.forwardRef<HTMLDivElement, M3SelectProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      variant = 'filled',
      color = 'primary',
      size = 'medium',
      disabled = false,
      placeholder = 'Select...',
      error = false,
      errorMessage,
      label,
      helperText,
      className = '',
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string | number | undefined>(
      defaultValue
    );
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    // Find selected option
    const selectedOption = options.find((opt) => opt.value === currentValue);
    const displayValue = selectedOption?.label || placeholder;

    // Handle option selection
    const handleSelect = useCallback(
      (optionValue: string | number) => {
        if (!isControlled) {
          setInternalValue(optionValue);
        }
        onChange?.(optionValue);
        setIsOpen(false);
        setFocusedIndex(-1);
      },
      [isControlled, onChange]
    );

    // Keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) return;

        switch (e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault();
            if (!isOpen) {
              setIsOpen(true);
            } else if (focusedIndex >= 0 && focusedIndex < options.length) {
              const option = options[focusedIndex];
              if (!option.disabled) {
                handleSelect(option.value);
              }
            }
            break;

          case 'Escape':
            e.preventDefault();
            setIsOpen(false);
            setFocusedIndex(-1);
            break;

          case 'ArrowDown':
            e.preventDefault();
            if (!isOpen) {
              setIsOpen(true);
              setFocusedIndex(0);
            } else {
              setFocusedIndex((prev) => {
                const next = prev < options.length - 1 ? prev + 1 : prev;
                // Skip disabled options
                let attempts = 0;
                while (
                  attempts < options.length &&
                  options[next]?.disabled &&
                  next < options.length - 1
                ) {
                  attempts++;
                  if (next < options.length - 1) {
                    return next + 1;
                  }
                }
                return next;
              });
            }
            break;

          case 'ArrowUp':
            e.preventDefault();
            if (isOpen) {
              setFocusedIndex((prev) => {
                const next = prev > 0 ? prev - 1 : 0;
                // Skip disabled options
                let attempts = 0;
                while (attempts < options.length && options[next]?.disabled && next > 0) {
                  attempts++;
                  if (next > 0) {
                    return next - 1;
                  }
                }
                return next;
              });
            }
            break;

          case 'Tab':
            if (isOpen) {
              setIsOpen(false);
              setFocusedIndex(-1);
            }
            break;
        }
      },
      [disabled, isOpen, focusedIndex, options, handleSelect]
    );

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setFocusedIndex(-1);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    // Scroll focused option into view
    useEffect(() => {
      if (isOpen && focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
        const element = optionRefs.current[focusedIndex];
        if (element && typeof element.scrollIntoView === 'function') {
          element.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
          });
        }
      }
    }, [isOpen, focusedIndex]);

    // Reset focused index when dropdown opens
    useEffect(() => {
      if (isOpen) {
        const selectedIndex = options.findIndex((opt) => opt.value === currentValue);
        setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      }
    }, [isOpen, options, currentValue]);

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    const inputId = props.id || `m3-select-${Math.random().toString(36).substr(2, 9)}`;
    const helperId = helperText || errorMessage ? `${inputId}-helper` : undefined;

    const classNames = [
      'm3-select',
      `m3-select--${variant}`,
      `m3-select--${color}`,
      `m3-select--${size}`,
      isOpen && 'm3-select--open',
      error && 'm3-select--error',
      disabled && 'm3-select--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref || selectRef}
        className={classNames}
        data-testid="m3-select"
        {...props}
      >
        {label && (
          <label htmlFor={inputId} className="m3-select__label">
            {label}
          </label>
        )}

        <div
          className="m3-select__control"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-disabled={disabled}
          aria-invalid={error}
          aria-describedby={helperId}
          id={inputId}
        >
          <span
            className={`m3-select__value ${!selectedOption ? 'm3-select__value--placeholder' : ''}`}
          >
            {displayValue}
          </span>
          <svg
            className="m3-select__arrow"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M7 10l5 5 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {isOpen && (
          <div
            ref={dropdownRef}
            className="m3-select__dropdown"
            role="listbox"
            data-testid="m3-select-dropdown"
          >
            {options.length === 0 ? (
              <div className="m3-select__no-options">No options available</div>
            ) : (
              options.map((option, index) => {
                const isSelected = option.value === currentValue;
                const isFocused = focusedIndex === index;

                return (
                  <div
                    key={option.value}
                    ref={(el) => {
                      optionRefs.current[index] = el;
                    }}
                    className={[
                      'm3-select__option',
                      isSelected && 'm3-select__option--selected',
                      isFocused && 'm3-select__option--focused',
                      option.disabled && 'm3-select__option--disabled',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                    data-testid={`m3-select-option-${option.value}`}
                  >
                    {option.label}
                  </div>
                );
              })
            )}
          </div>
        )}

        {(helperText || (error && errorMessage)) && (
          <span
            id={helperId}
            className={`m3-select__helper ${error ? 'm3-select__helper--error' : ''}`}
          >
            {error && errorMessage ? errorMessage : helperText}
          </span>
        )}
      </div>
    );
  }
);

M3Select.displayName = 'M3Select';

export default M3Select;
