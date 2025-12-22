/**
 * M3 Expressive MultiSelect Component
 * Implements Material Design 3 MultiSelect for CareerCopilot
 *
 * Select variant for multiple values. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Multiselect.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useState, useCallback } from 'react';
import './M3Multiselect.css';
import { M3Select, M3SelectOption } from '../select/M3Select';
import { M3Chip } from '../chip/M3Chip';

export interface M3MultiselectProps {
  /**
   * Array of options
   */
  options: M3SelectOption[];

  /**
   * Selected values
   */
  value?: (string | number)[];

  /**
   * Default values (uncontrolled)
   */
  defaultValue?: (string | number)[];

  /**
   * Change handler
   */
  onChange?: (values: (string | number)[]) => void;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Label text
   */
  label?: string;

  /**
   * If true, multiselect is disabled
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
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive MultiSelect component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3MultiSelect
 *   options={[
 *     { label: 'Option 1', value: '1' },
 *     { label: 'Option 2', value: '2' },
 *   ]}
 *   value={['1', '2']}
 *   onChange={(values) => console.log(values)}
 * />
 * ```
 */
export const M3Multiselect: React.FC<M3MultiselectProps> = ({
  options,
  value: controlledValue,
  defaultValue = [],
  onChange,
  placeholder = 'Select multiple options...',
  label = 'Multi Select',
  disabled = false,
  error = false,
  helperText,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState<(string | number)[]>(defaultValue);
  const [open, setOpen] = useState(false);

  const isControlled = controlledValue !== undefined;
  const selectedValues = isControlled ? controlledValue : internalValue;

  const handleToggle = useCallback(
    (optionValue: string | number) => {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];

      if (!isControlled) {
        setInternalValue(newValues);
      }
      onChange?.(newValues);
    },
    [selectedValues, isControlled, onChange]
  );

  const handleRemove = useCallback(
    (valueToRemove: string | number) => {
      const newValues = selectedValues.filter((v) => v !== valueToRemove);
      if (!isControlled) {
        setInternalValue(newValues);
      }
      onChange?.(newValues);
    },
    [selectedValues, isControlled, onChange]
  );

  const selectedOptions = options.filter((opt) => selectedValues.includes(opt.value));
  const displayText = selectedOptions.length > 0
    ? `${selectedOptions.length} selected`
    : placeholder;

  const classNames = [
    'm3-multiselect',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames}>
      <div className="m3-multiselect__chips">
        {selectedOptions.map((option) => (
          <M3Chip
            key={option.value}
            label={option.label}
            removable
            onDelete={() => handleRemove(option.value)}
            size="small"
          />
        ))}
      </div>
      <M3Select
        options={options}
        value={selectedValues[0]}
        onChange={(val) => handleToggle(val)}
        placeholder={displayText}
        label={label}
        disabled={disabled}
        error={error}
        helperText={helperText}
      />
    </div>
  );
};

M3Multiselect.displayName = 'M3Multiselect';

export default M3Multiselect;
