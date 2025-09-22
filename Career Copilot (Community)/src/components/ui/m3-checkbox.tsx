import React from 'react';
import { cn } from './utils';
import { Check, Minus } from 'lucide-react';

interface M3CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorText?: string;
  indeterminate?: boolean;
}

const M3Checkbox = React.forwardRef<HTMLInputElement, M3CheckboxProps>(
  ({
    className,
    label,
    helperText,
    error = false,
    errorText,
    indeterminate = false,
    disabled = false,
    checked,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const checkboxRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const checkboxId = props.id || `m3-checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('flex flex-col gap-2', className)}>
        <div className="flex items-start gap-3">
          {/* Checkbox Container */}
          <div className="relative flex items-center justify-center">
            <input
              ref={checkboxRef}
              type="checkbox"
              id={checkboxId}
              className="sr-only"
              checked={checked}
              disabled={disabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />
            
            {/* Custom Checkbox */}
            <div
              className={cn(
                'relative flex items-center justify-center',
                'w-5 h-5 rounded border-2',
                'transition-all cursor-pointer',
                'duration-[var(--motion-duration-short4)] ease-[var(--motion-easing-standard)]',
                
                // Default state
                !checked && !indeterminate && [
                  'bg-transparent',
                  'border-[var(--md-sys-color-on-surface-variant)]',
                  'hover:border-[var(--md-sys-color-on-surface)]'
                ],
                
                // Checked state
                (checked || indeterminate) && [
                  'bg-[var(--md-sys-color-primary)]',
                  'border-[var(--md-sys-color-primary)]'
                ],
                
                // Error state
                error && !checked && !indeterminate && [
                  'border-[var(--md-sys-color-error)]'
                ],
                
                error && (checked || indeterminate) && [
                  'bg-[var(--md-sys-color-error)]',
                  'border-[var(--md-sys-color-error)]'
                ],
                
                // Focus state
                isFocused && 'ring-2 ring-offset-0',
                isFocused && !error && 'ring-[var(--md-sys-color-primary)] ring-opacity-20',
                isFocused && error && 'ring-[var(--md-sys-color-error)] ring-opacity-20',
                
                // Disabled state
                disabled && 'opacity-60 cursor-not-allowed pointer-events-none'
              )}
              onClick={() => {
                if (!disabled) {
                  checkboxRef.current?.click();
                }
              }}
            >
              {/* Check/Indeterminate Icon */}
              <div className={cn(
                'flex items-center justify-center w-full h-full',
                'transition-all',
                'duration-[var(--motion-duration-short3)] ease-[var(--motion-easing-emphasized-decelerate)]',
                'text-[var(--md-sys-color-on-primary)]',
                !(checked || indeterminate) && 'scale-0 opacity-0',
                (checked || indeterminate) && 'scale-100 opacity-100'
              )}>
                {indeterminate ? (
                  <Minus className="w-3 h-3" strokeWidth={3} />
                ) : (
                  <Check className="w-3 h-3" strokeWidth={3} />
                )}
              </div>
            </div>
          </div>

          {/* Label */}
          {label && (
            <div className="flex-1">
              <label
                htmlFor={checkboxId}
                className={cn(
                  'text-base font-normal leading-6 cursor-pointer',
                  'text-[var(--md-sys-color-on-surface)]',
                  disabled && 'opacity-60 cursor-not-allowed'
                )}
              >
                {label}
              </label>
            </div>
          )}
        </div>

        {/* Helper/Error Text */}
        {(helperText || errorText) && (
          <div className="ml-8">
            <p className={cn(
              'text-xs leading-4',
              error
                ? 'text-[var(--md-sys-color-error)]'
                : 'text-[var(--md-sys-color-on-surface-variant)]'
            )}>
              {error ? errorText : helperText}
            </p>
          </div>
        )}
      </div>
    );
  }
);

M3Checkbox.displayName = 'M3Checkbox';

export { M3Checkbox };