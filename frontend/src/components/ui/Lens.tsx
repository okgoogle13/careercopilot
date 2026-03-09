/**
 * @deprecated Lens is deprecated as of KR Solidarity v6.0.
 * Use {@link ScaffoldInput} from './ScaffoldInput' instead. See docs/design/01_CANON.md §2.C
 * Will be removed in v7.0.
 */
import React, { forwardRef } from 'react';

export type LensVariant = 'filled' | 'outlined';
export type LensSize = 'small' | 'medium' | 'large';

export interface LensProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input label */
  label?: string;

  /** Helper text below input */
  helperText?: string;

  /** Error state */
  error?: boolean;

  /** Error message (shows helperText in error color) */
  errorMessage?: string;

  /** Visual variant */
  variant?: LensVariant;

  /** Input size */
  size?: LensSize;

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
 * @deprecated Use ScaffoldInput instead.
 *
 * Lens - Kerala Rage kr-solidarity Text Input (legacy name)
 *
 * Archetype was: Lens (focal container). Now: Scaffold (structural form element).
 * Shape: shape.block02 — `20px 4px 12px 2px` (asymmetric, does NOT morph)
 * Replaced by ScaffoldInput in KR Solidarity v6.0.
 */

export const Lens = forwardRef<HTMLInputElement, LensProps>(
  (
    {
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
    const [isFocused, setIsFocused] = React.useState(false);
    const [charCount, setCharCount] = React.useState(value ? String(value).length : 0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    // Size-specific classes
    const sizeClasses: Record<LensSize, { input: string; adornment: string }> = {
      small: {
        input: 'px-3 py-2 text-sm',
        adornment: 'text-sm',
      },
      medium: {
        input: 'px-4 py-3 text',
        adornment: 'text',
      },
      large: {
        input: 'px-5 py-4 text-lg',
        adornment: 'text-lg',
      },
    };

    // Variant-specific styles (KeralaRage KrSolidarity)
    const containerStyle = {
      borderRadius: 'var(--shape-blockRiot02, 20px 4px 12px 2px)', // shape.block02 — Scaffold archetype (was: Lens)
      backgroundColor: variant === 'filled' ? 'var(--sys-color-charcoalBackground)' : 'transparent',
      border: '2px solid',
      borderColor: error
        ? 'var(--sys-color-solidarityRed)'
        : isFocused
          ? 'var(--sys-color-inkGold)'
          : 'var(--sys-color-concreteGrey)',
      color: 'var(--sys-color-worker-ash)',
      transition: 'all var(--sys-motion-duration-medium2) cubic-bezier(0.34, 1.56, 0.64, 1)',
    };

    const containerClasses = `
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${isFocused && !error ? 'shadow-[0_0_15px_var(--sys-color-inkGold)]' : ''}
    ${containerClassName}
  `;

    const inputClasses = `
    ${sizeClasses[size].input}
    w-full
    bg-transparent
    text-inherit
    placeholder:opacity-50
    focus:outline-none
    disabled:cursor-not-allowed
    font-primary
    ${className}
  `;

    const showError = error && errorMessage;
    const displayHelperText = showError ? errorMessage : helperText;

    return (
      <div className={`flex flex-col ${fullWidth ? 'w-full' : 'w-auto'}`}>
        {/* Label */}
        {label && (
          <label
            className={`
          mb-2 text-sm font-medium transition-colors duration-200
          ${error ? 'text-[var(--sys-color-solidarityRed)]' : 'text-[var(--sys-color-concreteGrey)]'}
          ${isFocused && !error ? 'text-[var(--sys-color-inkGold)]' : ''}
        `}
          >
            {label}
            {required && <span className="text-[var(--sys-color-solidarityRed)] ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div
          className={containerClasses}
          style={containerStyle}
        >
          <div className="flex items-center gap-2">
            {/* Start Adornment */}
            {startAdornment && (
              <div
                className={`
              flex-shrink-0 ml-3 ${sizeClasses[size].adornment}
              ${error ? 'text-[var(--sys-color-solidarityRed)]' : 'text-[var(--sys-color-concreteGrey)]'}
            `}
              >
                {startAdornment}
              </div>
            )}

            {/* Input */}
            <input
              ref={ref}
              className={inputClasses}
              disabled={disabled}
              maxLength={maxLength}
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              aria-invalid={error}
              aria-describedby={displayHelperText ? `${props.id}-helper-text` : undefined}
              {...props}
            />

            {/* End Adornment */}
            {endAdornment && (
              <div
                className={`
              flex-shrink-0 mr-3 ${sizeClasses[size].adornment}
              ${error ? 'text-[var(--sys-color-solidarityRed)]' : 'text-[var(--sys-color-concreteGrey)]'}
            `}
              >
                {endAdornment}
              </div>
            )}
          </div>
        </div>

        {/* Helper Text / Error Message / Counter */}
        {(displayHelperText || showCounter) && (
          <div className="flex justify-between mt-1 px-1">
            {displayHelperText && (
              <p
                id={`${props.id}-helper-text`}
                className={`
                text-xs
                ${error ? 'text-[var(--sys-color-solidarityRed)]' : 'text-[var(--sys-color-concreteGrey)]'}
              `}
              >
                {displayHelperText}
              </p>
            )}

            {showCounter && maxLength && (
              <p
                className={`
              text-xs
              ${charCount > maxLength ? 'text-[var(--sys-color-solidarityRed)]' : 'text-[var(--sys-color-concreteGrey)]'}
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

Lens.displayName = 'Lens';

/**
 * @deprecated Use ScaffoldArea instead.
 * LensArea - Multi-line text input variant (legacy name)
 *
 * Same Scaffold archetype as ScaffoldInput: structural, immutable shape.
 */
export interface LensAreaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size'
> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  variant?: LensVariant;
  fullWidth?: boolean;
  showCounter?: boolean;
  containerClassName?: string;
  rows?: number;
}

export const LensArea = forwardRef<HTMLTextAreaElement, LensAreaProps>(
  (
    {
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
    const [isFocused, setIsFocused] = React.useState(false);
    const [charCount, setCharCount] = React.useState(value ? String(value).length : 0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    const containerStyle = {
      borderRadius: 'var(--shape-blockRiot02, 20px 4px 12px 2px)', // shape.block02 — Scaffold archetype (was: Lens)
      backgroundColor: variant === 'filled' ? 'var(--sys-color-charcoalBackground)' : 'transparent',
      border: '2px solid',
      borderColor: error
        ? 'var(--sys-color-solidarityRed)'
        : isFocused
          ? 'var(--sys-color-inkGold)'
          : 'var(--sys-color-concreteGrey)',
      color: 'var(--sys-color-worker-ash)',
      transition: 'all var(--sys-motion-duration-medium2) cubic-bezier(0.34, 1.56, 0.64, 1)',
    };

    const showError = error && errorMessage;
    const displayHelperText = showError ? errorMessage : helperText;

    return (
      <div className={`flex flex-col ${fullWidth ? 'w-full' : 'w-auto'}`}>
        {label && (
          <label
            className={`
          mb-2 text-sm font-medium transition-colors duration-200
          ${error ? 'text-[var(--sys-color-solidarityRed)]' : 'text-[var(--sys-color-concreteGrey)]'}
          ${isFocused && !error ? 'text-[var(--sys-color-inkGold)]' : ''}
        `}
          >
            {label}
            {required && <span className="text-[var(--sys-color-solidarityRed)] ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          rows={rows}
          style={containerStyle}
          className={`
          ${fullWidth ? 'w-full' : 'w-auto'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          px-4 py-3
          text
          bg-transparent
          text-inherit
          placeholder:opacity-50
          focus:outline-none
          resize-vertical
          font-primary
          ${isFocused && !error ? 'shadow-[0_0_15px_var(--sys-color-inkGold)]' : ''}
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
          aria-describedby={displayHelperText ? `${props.id}-helper-text` : undefined}
          {...props}
        />

        {(displayHelperText || showCounter) && (
          <div className="flex justify-between mt-1 px-1">
            {displayHelperText && (
              <p
                id={`${props.id}-helper-text`}
                className={`
                text-xs
                ${error ? 'text-[var(--sys-color-solidarityRed)]' : 'text-[var(--sys-color-concreteGrey)]'}
              `}
              >
                {displayHelperText}
              </p>
            )}

            {showCounter && maxLength && (
              <p
                className={`
              text-xs
              ${charCount > maxLength ? 'text-[var(--sys-color-solidarityRed)]' : 'text-[var(--sys-color-concreteGrey)]'}
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

LensArea.displayName = 'LensArea';
