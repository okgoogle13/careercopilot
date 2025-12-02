import type { SelectHTMLAttributes } from 'react';
import React from 'react';
import styles from './select.module.css';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    options,
    label,
    error = false,
    helperText,
    fullWidth = true,
    className,
    disabled,
    ...props
  }, ref) => {
    const errorClass = error ? 'select--error' : '';
    const disabledClass = disabled ? 'select--disabled' : '';
    const fullWidthClass = fullWidth ? 'select--full-width' : '';

    const classNames = [
      styles['select-wrapper'],
      styles[fullWidthClass],
    ]
      .filter(Boolean)
      .join(' ');

    const selectClassNames = [
      styles.select,
      styles[errorClass],
      styles[disabledClass],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={classNames}>
        {label && (
          <label className={styles.label}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={selectClassNames}
          disabled={disabled}
          aria-invalid={error}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helperText && (
          <span className={error ? styles['helper-text--error'] : styles['helper-text']}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
