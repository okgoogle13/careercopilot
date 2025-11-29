import type { InputHTMLAttributes } from 'react';
import React from 'react';
import styles from './input.module.css';

export type InputVariant = 'outlined' | 'filled';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  label?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    variant = 'outlined',
    label,
    error = false,
    helperText,
    fullWidth = true,
    className,
    disabled,
    ...props
  }, ref) => {
    const variantClass = `input--${variant}`;
    const errorClass = error ? 'input--error' : '';
    const disabledClass = disabled ? 'input--disabled' : '';
    const fullWidthClass = fullWidth ? 'input--full-width' : '';

    const classNames = [
      styles['input-wrapper'],
      styles[fullWidthClass],
    ]
      .filter(Boolean)
      .join(' ');

    const inputClassNames = [
      styles.input,
      styles[variantClass],
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
        <input
          ref={ref}
          className={inputClassNames}
          disabled={disabled}
          aria-invalid={error}
          {...props}
        />
        {helperText && (
          <span className={error ? styles['helper-text--error'] : styles['helper-text']}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
