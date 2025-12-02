/**
 * ELECTRIC ALCHEMIST: LABEL COMPONENT
 *
 * Form label with design system typography tokens.
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ required, disabled, error, className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-human text-sm text-on-surface-variant',
          'block',
          required && "after:content-['*'] after:ml-1 after:text-error",
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'text-error',
          className
        )}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = 'Label';

export default Label;

