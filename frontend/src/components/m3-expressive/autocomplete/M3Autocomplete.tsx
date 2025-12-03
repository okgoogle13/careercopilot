/**
 * M3 Expressive Autocomplete Component
 * Implements Material Design 3 Autocomplete for CareerCopilot
 *
 * Select with typing filter. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Autocomplete.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useState, useMemo, useCallback } from 'react';
import './M3Autocomplete.css';
import { M3Input } from '../input/M3Input';
import { M3Menu, M3MenuItem } from '../menu/M3Menu';

export interface M3AutocompleteOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface M3AutocompleteProps {
  /**
   * Array of options
   */
  options: M3AutocompleteOption[];

  /**
   * Selected value
   */
  value?: string | number;

  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string | number;

  /**
   * Change handler
   */
  onChange?: (value: string | number) => void;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Label text
   */
  label?: string;

  /**
   * If true, autocomplete is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * If true, shows error state
   * @default false
   */
  error?: boolean;

  /**
   * Helper text
   */
  helperText?: string;

  /**
   * Custom filter function
   */
  filterOptions?: (options: M3AutocompleteOption[], inputValue: string) => M3AutocompleteOption[];

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Autocomplete component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Autocomplete
 *   options={[
 *     { label: 'Option 1', value: '1' },
 *     { label: 'Option 2', value: '2' },
 *   ]}
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 */
export const M3Autocomplete: React.FC<M3AutocompleteProps> = ({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = 'Type to search...',
  label = 'Autocomplete',
  disabled = false,
  error = false,
  helperText,
  filterOptions,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : internalValue;

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const filteredOptions = useMemo(() => {
    if (!inputValue.trim()) return options;
    if (filterOptions) {
      return filterOptions(options, inputValue);
    }
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [options, inputValue, filterOptions]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setOpen(true);
  }, []);

  const handleSelect = useCallback(
    (value: string | number) => {
      const option = options.find((opt) => opt.value === value);
      if (option) {
        setInputValue(option.label);
        if (!isControlled) {
          setInternalValue(value);
        }
        onChange?.(value);
        setOpen(false);
      }
    },
    [options, isControlled, onChange]
  );

  const handleFocus = useCallback(() => {
    setOpen(true);
  }, []);

  const handleBlur = useCallback(() => {
    // Delay to allow click events to fire
    setTimeout(() => setOpen(false), 200);
  }, []);

  const classNames = [
    'm3-autocomplete',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const menuItems: M3MenuItem[] = filteredOptions.map((opt) => ({
    label: opt.label,
    value: String(opt.value),
    disabled: opt.disabled,
    onClick: () => handleSelect(opt.value),
  }));

  return (
    <div className={classNames}>
      <M3Menu
        items={menuItems}
        trigger={
          <M3Input
            value={inputValue || selectedOption?.label || ''}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            label={label}
            disabled={disabled}
            error={error}
            helperText={helperText}
            readOnly={false}
          />
        }
        open={open && filteredOptions.length > 0}
        onOpenChange={setOpen}
        placement="bottom-start"
        closeOnSelect
      />
    </div>
  );
};

M3Autocomplete.displayName = 'M3Autocomplete';

export default M3Autocomplete;
