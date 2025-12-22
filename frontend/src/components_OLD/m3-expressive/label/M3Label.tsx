/**
 * M3 Expressive Label Component
 * Form label with M3 typography tokens
 */
import React from 'react';
import './M3Label.css';

export interface M3LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * If true, shows required indicator
   * @default false
   */
  required?: boolean;

  /**
   * If true, applies disabled styling
   * @default false
   */
  disabled?: boolean;

  /**
   * Label text
   */
  children: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;
}

export const M3Label = React.forwardRef<HTMLLabelElement, M3LabelProps>(
  (
    {
      required = false,
      disabled = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-label',
      disabled && 'm3-label--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label
        ref={ref}
        className={classNames}
        data-testid="m3-label"
        {...props}
      >
        {children}
        {required && <span className="m3-label__required" aria-label="required">*</span>}
      </label>
    );
  }
);

M3Label.displayName = 'M3Label';

export default M3Label;
