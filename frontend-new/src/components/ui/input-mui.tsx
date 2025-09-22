import React, { forwardRef, useState } from 'react';
import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'standard' | 'enhanced';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, variant = 'enhanced', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    if (variant === 'standard') {
      return (
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      );
    }

    const shouldFloatLabel = isFocused || hasValue || type === 'date' || type === 'time';

    return (
      <div className="form-input-enhanced">
        <input
          type={type}
          className={cn(
            "peer w-full rounded-md border border-outline-variant bg-surface-container-high px-3 py-4 text-base text-on-surface transition-all duration-300 ease-out placeholder:text-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error focus:border-error focus:ring-error/20",
            className
          )}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder=" " // Keep a space to enable the :placeholder-shown pseudo-selector
          {...props}
        />

        {label && (
          <label
            className={cn(
              "absolute left-3 top-4 origin-left cursor-text select-none bg-surface-container-high px-1 text-base text-on-surface-variant transition-all duration-250 ease-cubic-bezier",
              shouldFloatLabel && "top-0 -translate-y-1/2 scale-85 text-xs font-medium text-primary",
              error && shouldFloatLabel && "text-error",
              isFocused && "text-primary",
              error && isFocused && "text-error"
            )}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {label}
          </label>
        )}

        {(error || helperText) && (
          <div className={cn(
            "mt-1 text-xs transition-colors duration-200",
            error ? "text-error" : "text-muted-foreground"
          )}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
