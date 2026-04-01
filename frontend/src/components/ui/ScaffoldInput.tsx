import React, { forwardRef } from 'react';

export type ScaffoldInputVariant = 'filled' | 'outlined';
export type ScaffoldInputSize = 'small' | 'medium' | 'large';

export interface ScaffoldInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  /** Input label */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Error state */
  error?: boolean;
  /** Error message (shows helperText in error color) */
  errorMessage?: string;
  /** Visual variant */
  variant?: ScaffoldInputVariant;
  /** Input size */
  size?: ScaffoldInputSize;
  /** Start adornment (icon or text) */
  startAdornment?: React.ReactNode;
  /** End adornment (icon or text) */
  endAdornment?: React.ReactNode;
  /** Full width input */
  fullWidth?: boolean;
  /** Character counter (shows count/maxLength) */
  showCounter?: boolean;
  /** Additional CSS classes for container */
  containerClassName?: string;
}

/**
 * **SCAFFOLD INPUT**
 *
 * Archetype: Scaffold — Structural form element. Load-bearing, immutable shape.
 * Shape: `shape.block02` → `20px 4px 12px 2px` (asymmetric, does NOT morph)
 * Motion: none (Scaffold never morphs — see 01_CANON.md §2.C Law 4)
 *
 * KR Shape Token: `--sys-shape-block02`
 * The scaffold holds the structure up. It does not dance. It does not yield.
 *
 * @example
 * <ScaffoldInput
 *   label="Upload your journey"
 *   placeholder="Evidence title"
 *   helperText="We'll extract the signal."
 * />
 */
export const ScaffoldInput = forwardRef<HTMLInputElement, ScaffoldInputProps>(
  (
    {
      id,
      label,
      helperText,
      error = false,
      errorMessage,
      variant = 'outlined',
      size = 'medium',
      startAdornment,
      endAdornment,
      fullWidth = false,
      showCounter = false,
      maxLength,
      value,
      containerClassName = '',
      className = '',
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const reactId = React.useId();
    const [isFocused, setIsFocused] = React.useState(false);
    const [charCount, setCharCount] = React.useState(value ? String(value).length : 0);

    React.useEffect(() => {
      setCharCount(value ? String(value).length : 0);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    const sizeClasses: Record<ScaffoldInputSize, { input: string; adornment: string }> = {
      small: { input: 'px-3 py-2 text-sm', adornment: 'text-sm' },
      medium: { input: 'px-4 py-3 text-base', adornment: 'text-base' },
      large: { input: 'px-5 py-4 text-lg', adornment: 'text-lg' },
    };

    const containerStyle = {
      borderRadius: 'var(--kr-archetypes-scaffold-shape-base)', // shape.blockRiot02 — Scaffold archetype
      backgroundColor:
        variant === 'filled' ? 'var(--kr-color-charcoal-background-steps-3)' : 'transparent',
      border: '2px solid',
      borderColor: error
        ? 'var(--kr-color-solidarity-red-base)'
        : isFocused
          ? 'var(--kr-color-ink-gold-base)'
          : 'var(--kr-color-worker-ash-steps-2)',
      color: 'var(--kr-color-worker-ash-base)',
      transition: 'border-color 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    };

    const containerClasses = `
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${isFocused && !error ? 'shadow-[0_0_15px_var(--kr-color-ink-gold-steps-0)]' : ''}
    ${containerClassName}
  `;

    const inputClasses = `
    ${sizeClasses[size].input}
    w-full bg-transparent text-inherit placeholder:opacity-50
    focus:outline-none disabled:cursor-not-allowed
    ${className}
  `;

    const showError = error && errorMessage;
    const displayHelperText = showError ? errorMessage : helperText;
    const inputId = id ?? `scaffold-input-${reactId}`;
    const helperId = displayHelperText ? `${inputId}-helper-text` : undefined;

    return (
      <div className={`flex flex-col ${fullWidth ? 'w-full' : 'w-auto'}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`
          mb-2 text-sm font-medium transition-colors duration-200
          ${error ? 'text-[var(--kr-color-solidarity-red-base)]' : 'text-[var(--kr-color-worker-ash-steps-2)]'}
          ${isFocused && !error ? 'text-[var(--kr-color-ink-gold-base)]' : ''}
        `}
            style={{ fontFamily: 'var(--kr-typography-family-primary)' }}
          >
            {label}
            {required && <span className="text-[var(--kr-color-solidarity-red-base)] ml-1">*</span>}
          </label>
        )}

        <div
          className={`${containerClasses} group relative`}
          style={containerStyle}
          data-archetype="scaffold"
        >
          <div className="flex items-center gap-2">
            {startAdornment && (
              <div
                className={`
              flex-shrink-0 ml-3 ${sizeClasses[size].adornment}
              ${error ? 'text-[var(--kr-color-solidarity-red-base)]' : 'text-[var(--kr-color-worker-ash-steps-2)]'}
            `}
              >
                {startAdornment}
              </div>
            )}
            <input
              ref={ref}
              id={inputId}
              className={inputClasses}
              style={{ fontFamily: 'var(--kr-typography-family-primary)' }}
              disabled={disabled}
              maxLength={maxLength}
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              aria-invalid={error}
              aria-describedby={helperId}
              {...props}
            />
            {endAdornment && (
              <div
                className={`
              flex-shrink-0 mr-3 ${sizeClasses[size].adornment}
              ${error ? 'text-[var(--kr-color-solidarity-red-base)]' : 'text-[var(--kr-color-worker-ash-steps-2)]'}
            `}
              >
                {endAdornment}
              </div>
            )}

            {/* Subtle Screenprint Grit Overlay */}
            {!disabled && (
              <div
                className="absolute inset-0 opacity-0 group-focus-within:opacity-[0.05] pointer-events-none transition-opacity bg-[url('/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-ui-019--v1.svg')]"
                style={{ borderRadius: 'var(--kr-archetypes-scaffold-shape-base)' }}
              />
            )}
          </div>
        </div>

        {(displayHelperText || showCounter) && (
          <div className="flex justify-between mt-1 px-1">
            {displayHelperText && (
              <p
                id={helperId}
                className={`
                text-xs
                ${error ? 'text-[var(--kr-color-solidarity-red-base)]' : 'text-[var(--kr-color-worker-ash-steps-2)]'}
              `}
              >
                {displayHelperText}
              </p>
            )}
            {showCounter && maxLength && (
              <p
                className={`
              text-xs
              ${charCount > maxLength ? 'text-[var(--kr-color-solidarity-red-base)]' : 'text-[var(--kr-color-worker-ash-steps-2)]'}
              ml-auto
            `}
              >
                {charCount}/{maxLength}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

ScaffoldInput.displayName = 'ScaffoldInput';

/**
 * ScaffoldArea — Multi-line textarea variant of ScaffoldInput.
 * Same Scaffold archetype: structural, immutable shape, no morph.
 */
export interface ScaffoldAreaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size'
> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  variant?: ScaffoldInputVariant;
  fullWidth?: boolean;
  showCounter?: boolean;
  containerClassName?: string;
  rows?: number;
}

export const ScaffoldArea = forwardRef<HTMLTextAreaElement, ScaffoldAreaProps>(
  (
    {
      id,
      label,
      helperText,
      error = false,
      errorMessage,
      variant = 'outlined',
      fullWidth = false,
      showCounter = false,
      maxLength,
      value,
      containerClassName = '',
      className = '',
      disabled = false,
      required = false,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const reactId = React.useId();
    const [isFocused, setIsFocused] = React.useState(false);
    const [charCount, setCharCount] = React.useState(value ? String(value).length : 0);

    React.useEffect(() => {
      setCharCount(value ? String(value).length : 0);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    const containerStyle = {
      borderRadius: 'var(--kr-archetypes-scaffold-shape-base)', // shape.blockRiot02 — Scaffold archetype
      backgroundColor:
        variant === 'filled' ? 'var(--kr-color-charcoal-background-steps-3)' : 'transparent',
      border: '2px solid',
      borderColor: error
        ? 'var(--kr-color-solidarity-red-base)'
        : isFocused
          ? 'var(--kr-color-ink-gold-base)'
          : 'var(--kr-color-worker-ash-steps-2)',
      color: 'var(--kr-color-worker-ash-base)',
      transition: 'border-color 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    };

    const showError = error && errorMessage;
    const displayHelperText = showError ? errorMessage : helperText;
    const areaId = id ?? `scaffold-area-${reactId}`;
    const helperId = displayHelperText ? `${areaId}-helper-text` : undefined;

    return (
      <div className={`flex flex-col ${fullWidth ? 'w-full' : 'w-auto'}`}>
        {label && (
          <label
            htmlFor={areaId}
            className={`
          mb-2 text-sm font-medium transition-colors duration-200
          ${error ? 'text-[var(--kr-color-solidarity-red-base)]' : 'text-[var(--kr-color-worker-ash-steps-2)]'}
          ${isFocused && !error ? 'text-[var(--kr-color-ink-gold-base)]' : ''}
        `}
            style={{ fontFamily: 'var(--kr-typography-family-primary)' }}
          >
            {label}
            {required && <span className="text-[var(--kr-color-solidarity-red-base)] ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={areaId}
          rows={rows}
          style={containerStyle}
          data-archetype="scaffold"
          className={`
          ${fullWidth ? 'w-full' : 'w-auto'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          px-4 py-3 text-base bg-transparent text-inherit
          placeholder:opacity-50 focus:outline-none resize-vertical
          ${isFocused && !error ? 'shadow-[0_0_15px_var(--kr-color-ink-gold-steps-0)]' : ''}
          ${containerClassName}
          ${className}
        `}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={error}
          aria-describedby={helperId}
          {...props}
        />

        {(displayHelperText || showCounter) && (
          <div className="flex justify-between mt-1 px-1">
            {displayHelperText && (
              <p
                id={helperId}
                className={`
                text-xs
                ${error ? 'text-[var(--kr-color-solidarity-red-base)]' : 'text-[var(--kr-color-worker-ash-steps-2)]'}
              `}
              >
                {displayHelperText}
              </p>
            )}
            {showCounter && maxLength && (
              <p
                className={`
              text-xs
              ${charCount > maxLength ? 'text-[var(--kr-color-solidarity-red-base)]' : 'text-[var(--kr-color-worker-ash-steps-2)]'}
              ml-auto
            `}
              >
                {charCount}/{maxLength}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

ScaffoldArea.displayName = 'ScaffoldArea';
