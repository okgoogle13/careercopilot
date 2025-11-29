import React from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variantClass = `button--${variant}`;
    const sizeClass = `button--${size}`;

    const buttonClassNames = [
      styles.button,
      styles[variantClass],
      styles[sizeClass],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={buttonClassNames}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
export { Button };
