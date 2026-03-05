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
 * Lens - Kerala Rage kr-solidarity Text Input
 *
 * A comprehensive text input component using the Kerala Rage kr-solidarity design system.
 * Supports filled and outlined variants with proper semantic token states and validation.
 * Archetype: Lens (focal container)
 *
 * **Kerala Rage Design Token Usage:**
 * - Shape: Asymmetric 24px 8px 20px 4px (Lens archetype)
 * - Colors: Kerala Rage kr-solidarity semantic palette (inkGold, solidarityRed, concreteGrey, worker-ash)
 * - Typography: Work Sans (field-note font family)
 * - Motion: Spring physics cubic-bezier(0.34, 1.56, 0.64, 1) for smooth transitions
 * - Visual: Kerala Rage screenprint aesthetic with subtle focus glow
 *
 * **States:**
 * - Default: Outlined with subtle concreteGrey border
 * - Hover: Border color intensifies
 * - Focus: inkGold accent with semantic glow
 * - Error: solidarityRed with error message
 * - Disabled: Reduced opacity
 *
 * @example
 * ```tsx
 * <Lens
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   helperText="We'll never share your email"
 * />
 *
 * <Lens
 *   label="Password"
 *   type="password"
 *   error
 *   errorMessage="Password must be at least 8 characters"
 * />
 *
 * <Lens
 *   label="Search"
 *   startAdornment={<SearchIcon />}
 *   variant="filled"
 * />
 * ```
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
        input: 'px-4 py-3 text-base',
        adornment: 'text-base',
      },
      large: {
        input: 'px-5 py-4 text-lg',
        adornment: 'text-lg',
      },
    };

    // Variant-specific styles (KeralaRage KrSolidarity)
    const containerStyle = {
      borderRadius: '24px 8px 20px 4px', // Lens archetype asymmetric radius
      backgroundColor:
        variant === 'filled' ? 'var(--sys-color-charcoalBackground-steps-3)' : 'transparent',
      border: '2px solid',
      borderColor: error
        ? 'var(--sys-color-solidarityRed-base)'
        : isFocused
          ? 'var(--sys-color-inkGold-base)'
          : 'var(--sys-color-concreteGrey-base)',
      color: 'var(--sys-color-worker-ash-base)',
      transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    };

    const containerClasses = `
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${isFocused && !error ? 'shadow-[0_0_15px_var(--sys-color-inkGold-steps-0)]' : ''}
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
    font-field-note
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
          ${error ? 'text-[var(--sys-color-solidarityRed-base)]' : 'text-[var(--sys-color-concreteGrey-base)]'}
          ${isFocused && !error ? 'text-[var(--sys-color-inkGold-base)]' : ''}
        `}
          >
            {label}
            {required && <span className="text-[var(--sys-color-solidarityRed-base)] ml-1">*</span>}
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
              ${error ? 'text-[var(--sys-color-solidarityRed-base)]' : 'text-[var(--sys-color-concreteGrey-base-dark)]'}
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
              ${error ? 'text-[var(--sys-color-solidarityRed-base)]' : 'text-[var(--sys-color-concreteGrey-base-dark)]'}
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
                ${error ? 'text-[var(--sys-color-solidarityRed-base)]' : 'text-[var(--sys-color-concreteGrey-base-dark)]'}
              `}
              >
                {displayHelperText}
              </p>
            )}

            {showCounter && maxLength && (
              <p
                className={`
              text-xs
              ${charCount > maxLength ? 'text-[var(--sys-color-solidarityRed-base)]' : 'text-[var(--sys-color-concreteGrey-base-dark)]'}
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
 * LensArea - Multi-line text input variant
 *
 * Same API as Lens but renders a textarea for multi-line input.
 * Uses Kerala Rage kr-solidarity semantic tokens for consistent styling.
 * Archetype: Lens (focal container, textarea variant)
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
      borderRadius: '24px 8px 20px 4px', // Lens archetype asymmetric radius
      backgroundColor:
        variant === 'filled' ? 'var(--sys-color-charcoalBackground-steps-3)' : 'transparent',
      border: '2px solid',
      borderColor: error
        ? 'var(--sys-color-solidarityRed-base)'
        : isFocused
          ? 'var(--sys-color-inkGold-base)'
          : 'var(--sys-color-concreteGrey-base)',
      color: 'var(--sys-color-worker-ash-base)',
      transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    };

    const showError = error && errorMessage;
    const displayHelperText = showError ? errorMessage : helperText;

    return (
      <div className={`flex flex-col ${fullWidth ? 'w-full' : 'w-auto'}`}>
        {label && (
          <label
            className={`
          mb-2 text-sm font-medium transition-colors duration-200
          ${error ? 'text-[var(--sys-color-solidarityRed-base)]' : 'text-[var(--sys-color-concreteGrey-base)]'}
          ${isFocused && !error ? 'text-[var(--sys-color-inkGold-base)]' : ''}
        `}
          >
            {label}
            {required && <span className="text-[var(--sys-color-solidarityRed-base)] ml-1">*</span>}
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
          text-base
          bg-transparent
          text-inherit
          placeholder:opacity-50
          focus:outline-none
          resize-vertical
          font-field-note
          ${isFocused && !error ? 'shadow-[0_0_15px_var(--sys-color-inkGold-steps-0)]' : ''}
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
                ${error ? 'text-[var(--sys-color-solidarityRed-base)]' : 'text-[var(--sys-color-concreteGrey-base-dark)]'}
              `}
              >
                {displayHelperText}
              </p>
            )}

            {showCounter && maxLength && (
              <p
                className={`
              text-xs
              ${charCount > maxLength ? 'text-[var(--sys-color-solidarityRed-base)]' : 'text-[var(--sys-color-concreteGrey-base-dark)]'}
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

// Legacy M3 exports for backward compatibility
export { LensArea as M3TextArea, Lens as M3TextField };
export type { LensAreaProps as M3TextAreaProps, LensProps as M3TextFieldProps };
