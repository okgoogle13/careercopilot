import type { InputHTMLAttributes } from 'react';
import React from 'react';
import styles from './date-picker.module.css';
import { Calendar } from 'lucide-react';

export interface DatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  minDate?: string;
  maxDate?: string;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({
    value = '',
    onChange,
    label,
    error = false,
    helperText,
    minDate,
    maxDate,
    className,
    disabled,
    ...props
  }, ref) => {
    const datePickerId = props.id || ("date-picker-" + Math.random().toString(36).substring(2, 9));
    const errorClass = error ? styles['date-input--error'] : '';

    const dateInputClassNames = [
      styles['date-input'],
      errorClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event.target.value);
      }
    };

    return (
      <div className={styles['date-picker-wrapper']}>
        {label && (
          <label htmlFor={datePickerId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles['date-input-wrapper']}>
          <input
            ref={ref}
            id={datePickerId}
            type="date"
            value={value}
            onChange={handleChange}
            min={minDate}
            max={maxDate}
            className={dateInputClassNames}
            disabled={disabled}
            aria-invalid={error}
            {...props}
          />
          <Calendar className={styles['calendar-icon']} size={20} />
        </div>
        {helperText && (
          <span className={error ? styles['helper-text--error'] : styles['helper-text']}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
