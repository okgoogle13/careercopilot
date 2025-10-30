import React, { useState, forwardRef } from 'react';

export interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    return (
      <div className="w-full">
        <div className="relative">
          <input
            ref={ref}
            {...props}
            onChange={handleChange}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              form-input-enhanced
              w-full px-4 pt-6 pb-2
              bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
              border-2 rounded-[var(--radius-lg)]
              text-[var(--on-surface)] 
              transition-all duration-300
              ${isFocused 
                ? 'border-transparent bg-gradient-to-br from-[var(--primary)]/20 via-[var(--tertiary)]/20 to-transparent' 
                : error 
                  ? 'border-[var(--color-error)]' 
                  : 'border-[var(--glass-border)]'
              }
              ${isFocused && 'shadow-[var(--shadow-glow-aurora)]'}
              ${props.disabled && 'opacity-50 cursor-not-allowed'}
              ${className}
            `}
            style={{
              outline: 'none',
              ...(isFocused && {
                boxShadow: '0 0 24px rgba(167, 139, 250, 0.3), 0 0 48px rgba(244, 114, 182, 0.2)',
                borderImage: 'linear-gradient(135deg, var(--primary), var(--tertiary)) 1',
                borderImageSlice: 1,
              })
            }}
          />
          <label
            className={`
              absolute left-4 pointer-events-none
              transition-all duration-300
              ${isFocused || hasValue || props.value
                ? 'top-2 text-xs'
                : 'top-1/2 -translate-y-1/2 text-base'
              }
              ${isFocused 
                ? 'text-[var(--primary)]' 
                : error 
                  ? 'text-[var(--color-error)]' 
                  : 'text-[var(--on-surface-variant)]'
              }
            `}
          >
            {label}
          </label>
        </div>
        {(error || helperText) && (
          <div 
            className={`
              mt-2 text-sm px-4
              ${error ? 'text-[var(--color-error)]' : 'text-[var(--on-surface-variant)]'}
            `}
          >
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';
