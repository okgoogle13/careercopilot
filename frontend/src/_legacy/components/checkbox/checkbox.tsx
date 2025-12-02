import type { InputHTMLAttributes } from 'react';
import React from 'react';
import styles from './checkbox.module.css';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: boolean;
  helperText?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error = false, helperText, className, disabled, ...props }, ref) => {
    const checkboxId = props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const errorClass = error ? 'checkbox--error' : '';
    const disabledClass = disabled ? 'checkbox--disabled' : '';

    const checkboxClassNames = [
      styles.checkbox,
      styles[errorClass],
      styles[disabledClass],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles['checkbox-wrapper']}>
        <div className={styles['checkbox-input-wrapper']}>
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={checkboxClassNames}
            disabled={disabled}
            aria-invalid={error}
            {...props}
          />
          <span className={styles['checkbox-indicator']}>
            <svg
              className={styles['checkbox-checkmark']}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        </div>

        {label && (
          <label htmlFor={checkboxId} className={styles.label}>
            {label}
          </label>
        )}

        {helperText && (
          <span className={error ? styles['helper-text--error'] : styles['helper-text']}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
