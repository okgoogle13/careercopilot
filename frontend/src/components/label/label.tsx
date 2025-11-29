import type { LabelHTMLAttributes } from 'react';
import React from 'react';
import styles from './label.module.css';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ required, disabled, error, className, children, ...props }, ref) => {
    const requiredClass = required ? styles['label--required'] : '';
    const disabledClass = disabled ? styles['label--disabled'] : '';
    const errorClass = error ? styles['label--error'] : '';

    const labelClassNames = [
      styles.label,
      requiredClass,
      disabledClass,
      errorClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label ref={ref} className={labelClassNames} {...props}>
        {children}
      </label>
    );
  }
);

Label.displayName = 'Label';
