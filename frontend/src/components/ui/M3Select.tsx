/**
 * M3 Expressive Select Component
 * Implements Material Design 3 dropdown select with search and multi-select
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Elevation: --md-sys-elevation-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './M3Select.css';

export interface M3SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface M3SelectProps {
  /**
   * Select options
   */
  options: M3SelectOption[];

  /**
   * Selected value(s)
   */
  value?: string | number | (string | number)[];

  /**
   * Default value
   */
  defaultValue?: string | number | (string | number)[];

  /**
   * Change handler
   */
  onChange?: (value: string | number | (string | number)[]) => void;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * If true, allows multiple selection
   * @default false
   */
  multiple?: boolean;

  /**
   * If true, shows search input
   * @default false
   */
  searchable?: boolean;

  /**
   * If true, select is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * If true, shows error state
   * @default false
   */
  error?: boolean;

  /**
   * Label text
   */
  label?: string;

  /**
   * Helper text
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
 *   options={[
 *     { label: 'Option 1', value: 1 },
 *     { label: 'Option 2', value: 2 }
 *   ]}
 *   value={selectedValue}
 *   onChange={setSelectedValue}
 * />
 * ```
 */
export const M3Select: React.FC<M3SelectProps> = ({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = 'Select...',
  multiple = false,
  searchable = false,
  disabled = false,
  error = false,
  label,
  helperText,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState<string | number | (string | number)[]>(
    defaultValue ?? (multiple ? [] : '')
  );
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const filteredOptions = searchable && searchQuery
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const getDisplayValue = useCallback(() => {
    if (multiple && Array.isArray(currentValue)) {
      if (currentValue.length === 0) return placeholder;
      const selectedLabels = currentValue
        .map((val) => options.find((opt) => opt.value === val)?.label)
        .filter(Boolean);
      return selectedLabels.join(', ');
    }
    const selected = options.find((opt) => opt.value === currentValue);
    return selected?.label || placeholder;
  }, [currentValue, multiple, options, placeholder]);

  const handleSelect = useCallback(
    (optionValue: string | number) => {
      let newValue: string | number | (string | number)[];

      if (multiple) {
        const currentArray = Array.isArray(currentValue) ? currentValue : [];
        if (currentArray.includes(optionValue)) {
          newValue = currentArray.filter((v) => v !== optionValue);
        } else {
          newValue = [...currentArray, optionValue];
        }
      } else {
        newValue = optionValue;
        setOpen(false);
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
      setSearchQuery('');
    },
    [currentValue, multiple, isControlled, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          if (!open) {
            e.preventDefault();
            setOpen(true);
          } else if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            e.preventDefault();
            handleSelect(filteredOptions[focusedIndex].value);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setOpen(false);
          setSearchQuery('');
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!open) {
            setOpen(true);
          } else {
            setFocusedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : prev
            );
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
      }
    },
    [disabled, open, focusedIndex, filteredOptions, handleSelect]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearchQuery('');
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open, searchable]);

  const isSelected = useCallback(
    (optionValue: string | number) => {
      if (multiple && Array.isArray(currentValue)) {
        return currentValue.includes(optionValue);
      }
      return currentValue === optionValue;
    },
    [currentValue, multiple]
  );

  const classNames = [
    'm3-select',
    open && 'm3-select--open',
    disabled && 'm3-select--disabled',
    error && 'm3-select--error',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} data-testid="m3-select">
      {label && <label className="m3-select__label">{label}</label>}

      <div
        ref={selectRef}
        className="m3-select__control"
        onClick={() => !disabled && setOpen(!open)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-disabled={disabled}
      >
        <span className="m3-select__value">{getDisplayValue()}</span>
        <svg className="m3-select__arrow" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>

      {open && (
        <div ref={dropdownRef} className="m3-select__dropdown" data-testid="m3-select-dropdown">
          {searchable && (
            <div className="m3-select__search">
              <input
                ref={searchInputRef}
                type="text"
                className="m3-select__search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="m3-select__options" role="listbox">
            {filteredOptions.length === 0 ? (
              <div className="m3-select__no-options">No options found</div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={[
                    'm3-select__option',
                    isSelected(option.value) && 'm3-select__option--selected',
                    option.disabled && 'm3-select__option--disabled',
                    focusedIndex === index && 'm3-select__option--focused',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  role="option"
                  aria-selected={isSelected(option.value)}
                  aria-disabled={option.disabled}
                >
                  {multiple && (
                    <input
                      type="checkbox"
                      checked={isSelected(option.value)}
                      readOnly
                      className="m3-select__checkbox"
                    />
                  )}
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {helperText && (
        <span className="m3-select__helper-text">{helperText}</span>
      )}
    </div>
  );
};

M3Select.displayName = 'M3Select';

export default M3Select;
