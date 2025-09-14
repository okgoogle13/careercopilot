import * as React from 'react';
import { cn } from './utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Whether the input has an error */
  error?: boolean;
  /** Optional icon to display inside the input */
  icon?: React.ReactNode;
  /** Additional class name for the input container */
  containerClassName?: string;
}

/**
 * A customizable input component with support for icons and error states.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, containerClassName, ...props }, ref) => {
    return (
      <div className={cn('relative w-full', containerClassName)}>
        {icon && (
          <div
            className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
            aria-hidden='true'
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          data-slot='input'
          data-error={error ? 'true' : undefined}
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground/70',
            'selection:bg-primary/80 selection:text-primary-foreground',
            'flex h-10 w-full min-w-0 rounded-lg border bg-background px-3 py-2 text-sm',
            'transition-all duration-200 ease-in-out',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            'dark:bg-input/20 dark:border-input/50 dark:focus:border-input/80',
            'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
            error
              ? 'border-destructive/70 focus-visible:ring-destructive/20 dark:border-destructive/50'
              : 'border-input hover:border-input/70',
            icon ? 'pl-10' : '',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
