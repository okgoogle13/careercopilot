import type { InputHTMLAttributes } from 'react';
import React from 'react';
import styles from './switch.module.css';

export interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, className, disabled, ...props }, ref) => {
    const switchId = props.id || ("switch-" + Math.random().toString(36).substr(2, 9));
    const disabledClass = disabled ? 'switch--disabled' : '';

    const switchClassNames = [
      styles.switch,
      styles[disabledClass],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles['switch-wrapper']}>
        <input
          ref={ref}
          id={switchId}
          type="checkbox"
          className={switchClassNames}
          disabled={disabled}
          {...props}
        />
        <span className={styles['switch-track']}>
          <span className={styles['switch-thumb']} />
        </span>
        {label && (
          <label htmlFor={switchId} className={styles.label}>
            {label}
          </label>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
