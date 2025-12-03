/**
 * M3 Expressive TimePicker Component
 * Implements Material Design 3 TimePicker for CareerCopilot
 *
 * Time selection interface. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Timepicker.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useState, useCallback } from 'react';
import './M3Timepicker.css';
import { M3Input } from '../input/M3Input';

export interface M3TimepickerProps {
  /**
   * Selected time value (HH:mm format)
   */
  value?: string;

  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string;

  /**
   * Change handler
   */
  onChange?: (time: string) => void;

  /**
   * If true, timepicker is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Label text
   */
  label?: string;

  /**
   * Helper text
   */
  helperText?: string;

  /**
   * If true, shows error state
   * @default false
   */
  error?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive TimePicker component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Timepicker value="14:30" onChange={(time) => console.log(time)} />
 * ```
 */
export const M3Timepicker: React.FC<M3TimepickerProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  disabled = false,
  label = 'Time',
  helperText,
  error = false,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );

  const classNames = [
    'm3-timepicker',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames}>
      <M3Input
        type="time"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        label={label}
        helperText={helperText}
        error={error}
      />
    </div>
  );
};

M3Timepicker.displayName = 'M3Timepicker';

export default M3Timepicker;
