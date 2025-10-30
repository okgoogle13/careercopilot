import React from 'react';
import { cn } from './utils';
import { ChevronDown, Check } from 'lucide-react';

interface M3SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface M3SelectProps {
  options: M3SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorText?: string;
  disabled?: boolean;
  className?: string;
}

const M3Select = React.forwardRef<HTMLDivElement, M3SelectProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = 'Select an option',
      label,
      helperText,
      error = false,
      errorText,
      disabled = false,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const selectRef = React.useRef<HTMLDivElement>(null);

    const selectedOption = options.find((option) => option.value === value);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setIsFocused(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        setIsFocused(!isOpen);
      }
    };

    const handleSelect = (optionValue: string) => {
      onValueChange?.(optionValue);
      setIsOpen(false);
      setIsFocused(false);
    };

    const selectId = `m3-select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div ref={ref} className={cn('relative w-full', className)}>
        {/* Select Trigger */}
        <div
          ref={selectRef}
          className={cn(
            'relative flex items-center justify-between',
            'rounded-xl border cursor-pointer transition-all',
            'duration-[var(--motion-duration-short4)] ease-[var(--motion-easing-standard)]',
            'bg-[var(--md-sys-color-surface-container-low)]',
            'min-h-[56px] px-4',

            // Border states
            error
              ? 'border-[var(--md-sys-color-error)]'
              : isFocused || isOpen
                ? 'border-[var(--md-sys-color-primary)]'
                : 'border-[var(--md-sys-color-outline-variant)] hover:border-[var(--md-sys-color-outline)]',

            // Focus glow effect
            (isFocused || isOpen) && !error && 'shadow-[0_0_0_3px_rgba(193,193,255,0.12)]',
            error && 'shadow-[0_0_0_3px_rgba(255,180,171,0.12)]',

            disabled && 'opacity-60 cursor-not-allowed'
          )}
          onClick={handleToggle}
        >
          <div className="flex-1 flex flex-col">
            {/* Floating Label */}
            {label && (
              <label
                htmlFor={selectId}
                className={cn(
                  'text-xs font-medium transition-all pointer-events-none',
                  'duration-[var(--motion-duration-short3)] ease-[var(--motion-easing-standard)]',
                  'mb-1',

                  // Label color states
                  (isFocused || isOpen) && !error && 'text-[var(--md-sys-color-primary)]',
                  error && 'text-[var(--md-sys-color-error)]',
                  !isFocused && !isOpen && !error && 'text-[var(--md-sys-color-on-surface-variant)]'
                )}
              >
                {label}
              </label>
            )}

            {/* Selected Value / Placeholder */}
            <div
              className={cn(
                'flex items-center gap-3',
                'text-base font-normal',
                selectedOption
                  ? 'text-[var(--md-sys-color-on-surface)]'
                  : 'text-[var(--md-sys-color-on-surface-variant)]'
              )}
            >
              {selectedOption?.icon && (
                <span className="flex items-center justify-center w-5 h-5">
                  {selectedOption.icon}
                </span>
              )}
              <span>{selectedOption?.label || placeholder}</span>
            </div>
          </div>

          {/* Chevron Icon */}
          <ChevronDown
            className={cn(
              'w-6 h-6 transition-transform ml-3',
              'duration-[var(--motion-duration-short3)] ease-[var(--motion-easing-standard)]',
              'text-[var(--md-sys-color-on-surface-variant)]',
              isOpen && 'rotate-180'
            )}
          />
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={cn(
              'absolute top-full left-0 right-0 z-50 mt-2',
              'bg-[var(--md-sys-color-surface-container-high)]',
              'border border-[var(--md-sys-color-outline-variant)]',
              'rounded-xl shadow-[var(--elevation-level3)]',
              'animate-fade-in',
              'max-h-60 overflow-y-auto'
            )}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 cursor-pointer',
                  'transition-colors',
                  'duration-[var(--motion-duration-short2)] ease-[var(--motion-easing-standard)]',
                  'text-[var(--md-sys-color-on-surface)]',
                  'hover:bg-[var(--md-sys-color-on-surface)]',
                  'hover:bg-opacity-8',
                  'first:rounded-t-xl last:rounded-b-xl',

                  option.disabled && 'opacity-60 cursor-not-allowed pointer-events-none',
                  option.value === value &&
                    'bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]'
                )}
                onClick={() => !option.disabled && handleSelect(option.value)}
              >
                {option.icon && (
                  <span className="flex items-center justify-center w-5 h-5">{option.icon}</span>
                )}

                <span className="flex-1 text-base font-normal">{option.label}</span>

                {option.value === value && (
                  <Check className="w-5 h-5 text-[var(--md-sys-color-primary)]" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Helper/Error Text */}
        {(helperText || errorText) && (
          <div className="mt-2 px-4">
            <p
              className={cn(
                'text-xs leading-4',
                error
                  ? 'text-[var(--md-sys-color-error)]'
                  : 'text-[var(--md-sys-color-on-surface-variant)]'
              )}
            >
              {error ? errorText : helperText}
            </p>
          </div>
        )}
      </div>
    );
  }
);

M3Select.displayName = 'M3Select';

export { M3Select, type M3SelectOption };
