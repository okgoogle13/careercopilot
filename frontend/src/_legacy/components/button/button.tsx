import type { ButtonHTMLAttributes } from 'react';
import React from 'react';
import styles from './button.module.css';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'md', className, disabled, children, ...props }, ref) => {
    const variantClass = `button--${variant}`;
    const sizeClass = `button--${size}`;
    const disabledClass = disabled ? 'button--disabled' : '';

    const classNames = [
      styles.button,
      styles[variantClass],
      styles[sizeClass],
      disabledClass && styles[disabledClass],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
