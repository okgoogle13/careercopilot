import type { TextareaHTMLAttributes } from 'react';
import React from 'react';
import styles from './textarea.module.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    label,
    error = false,
    helperText,
    fullWidth = true,
    className,
    disabled,
    rows = 4,
    ...props
  }, ref) => {
    const textareaId = props.id || ("textarea-" + Math.random().toString(36).substring(2, 9));
    const errorClass = error ? styles['textarea--error'] : '';
    const disabledClass = disabled ? styles['textarea--disabled'] : '';
    const fullWidthClass = fullWidth ? styles['textarea--full-width'] : '';

    const textareaClassNames = [
      styles.textarea,
      errorClass,
      disabledClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const wrapperClassNames = [
      styles['textarea-wrapper'],
      fullWidthClass,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClassNames}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={textareaClassNames}
          disabled={disabled}
          rows={rows}
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

Textarea.displayName = 'Textarea';
