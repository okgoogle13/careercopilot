import type { InputHTMLAttributes } from 'react';
import React from 'react';
import styles from './radio-group.module.css';

export interface RadioGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ name, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={styles['radio-group-wrapper']} role="radiogroup">
        <div className={styles['radio-group']}>
          {children}
        </div>
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export interface RadioGroupItemProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  label?: React.ReactNode;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ value, label, className, disabled, ...props }, ref) => {
    const radioId = props.id || ("radio-" + Math.random().toString(36).substring(2, 9));
    const disabledClass = disabled ? styles['radio--disabled'] : '';

    const radioClassNames = [
      styles.radio,
      disabledClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles['radio-group-item-wrapper']}>
        <input
          ref={ref}
          id={radioId}
          type="radio"
          value={value}
          className={radioClassNames}
          disabled={disabled}
          {...props}
        />
        <span className={styles['radio-indicator']}>
          <span className={styles['radio-dot']} />
        </span>
        {label && (
          <label htmlFor={radioId} className={styles.label}>
            {label}
          </label>
        )}
      </div>
    );
  }
);

RadioGroupItem.displayName = 'RadioGroupItem';
