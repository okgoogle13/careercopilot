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
<<<<<<< HEAD
 * Lens -  Text Input
 *
 * A comprehensive text input component using the  design system.
 * Supports filled and outlined variants with proper Kerala Rage states and validation.
 *
 * **Kerala Rage Design Token Usage:**
 * - Shape: `--radius-leaf` (organic shape) for inputs
 * - Colors: Kerala Rage botanical palette (Wattle Gold, Waratah Crimson, Eucalypt Smoke)
 * - Typography: Kerala Rage field-note font family
 * - Motion: Viscous-breeze easing for organic transitions
 * - Visual: Glassmorphism with subtle backdrop blur
=======
 * Lens - KeralaRage KrSolidarity Text Input
 *
 * A comprehensive text input component using the KeralaRage KrSolidarity design system.
 * Supports filled and outlined variants with proper KeralaRage states and validation.
 *
 * **KeralaRage Design Token Usage:**
 * - Shape: `--radius-leaf` ([DEPRECATED_STYLE] shape) for inputs
 * - Colors: KeralaRage [DEPRECATED_STYLE] palette (Ink Gold, Solidarity Red, Concrete Grey)
 * - Typography: KeralaRage field-note font family
 * - Motion: Viscous-breeze easing for [DEPRECATED_STYLE] transitions
 * - Visual: KrScreenprint with subtle backdrop blur
>>>>>>> restoration-KR-Rage-Figma-v2.0
 *
 * **States:**
 * - Default: Outlined with subtle border
 * - Hover: Border color intensifies
<<<<<<< HEAD
 * - Focus: Wattle Gold accent with glow
 * - Error: Waratah Crimson with error message
=======
 * - Focus: Ink Gold accent with glow
 * - Error: Solidarity Red with error message
>>>>>>> restoration-KR-Rage-Figma-v2.0
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

<<<<<<< HEAD
    // Variant-specific styles ()
    const containerStyle = {
      borderRadius: 'var(--radius-leaf)',
      backgroundColor: variant === 'filled' ? 'rgba(44, 39, 35, 0.4)' : 'transparent',
      border: '2px solid',
      borderColor: error
        ? 'var(--color-waratah-crimson)'
        : isFocused
          ? 'var(--color-wattle-gold)'
          : 'var(--color-eucalypt-smoke-base)',
      color: 'var(--color-parchment)',
      transition: 'all var(--duration-standard) var(--ease-viscous-breeze)',
=======
    // Variant-specific styles (KeralaRage KrSolidarity)
    const containerStyle = {
      borderRadius: '24px 8px 20px 4px', // Lens archetype asymmetric radius
      backgroundColor: variant === 'filled' ? 'var(--sys-color-charcoalBackground-steps-3)' : 'transparent',
      border: '2px solid',
      borderColor: error
        ? 'var(--sys-color-solidarityRed-base)'
        : isFocused
          ? 'var(--sys-color-inkGold-base)'
          : 'var(--sys-color-concreteGrey-base)',
      color: 'var(--sys-color-worker-ash-base)',
      transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
>>>>>>> restoration-KR-Rage-Figma-v2.0
    };

    const containerClasses = `
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
<<<<<<< HEAD
    ${isFocused && !error ? 'shadow-[0_0_15px_rgba(212,168,75,0.2)]' : ''}
=======
    ${isFocused && !error ? 'shadow-[0_0_15px_var(--sys-color-inkGold-steps-0)]' : ''}
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
          ${error ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower)]'}
          ${isFocused && !error ? 'text-[var(--color-wattle-gold)]' : ''}
        `}
          >
            {label}
            {required && <span className="text-[var(--color-waratah-crimson)] ml-1">*</span>}
=======
          ${error ? 'text-[var(--color-solidarity-red)]' : 'text-[var(--color-concrete-grey)]'}
          ${isFocused && !error ? 'text-[var(--color-ink-gold)]' : ''}
        `}
          >
            {label}
            {required && <span className="text-[var(--color-solidarity-red)] ml-1">*</span>}
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
              ${error ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower-dark)]'}
=======
              ${error ? 'text-[var(--color-solidarity-red)]' : 'text-[var(--color-concrete-grey-dark)]'}
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
              ${error ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower-dark)]'}
=======
              ${error ? 'text-[var(--color-solidarity-red)]' : 'text-[var(--color-concrete-grey-dark)]'}
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
                ${error ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower-dark)]'}
=======
                ${error ? 'text-[var(--color-solidarity-red)]' : 'text-[var(--color-concrete-grey-dark)]'}
>>>>>>> restoration-KR-Rage-Figma-v2.0
              `}
              >
                {displayHelperText}
              </p>
            )}

            {showCounter && maxLength && (
              <p
                className={`
              text-xs
<<<<<<< HEAD
              ${charCount > maxLength ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower-dark)]'}
=======
              ${charCount > maxLength ? 'text-[var(--color-solidarity-red)]' : 'text-[var(--color-concrete-grey-dark)]'}
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
 * Uses  design tokens for consistent organic styling.
=======
 * Uses KeralaRage KrSolidarity design tokens for consistent [DEPRECATED_STYLE] styling.
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
      borderRadius: 'var(--radius-leaf)',
      backgroundColor: variant === 'filled' ? 'rgba(44, 39, 35, 0.4)' : 'transparent',
      border: '2px solid',
      borderColor: error
        ? 'var(--color-waratah-crimson)'
        : isFocused
          ? 'var(--color-wattle-gold)'
          : 'var(--color-eucalypt-smoke-base)',
      color: 'var(--color-parchment)',
      transition: 'all var(--duration-standard) var(--ease-viscous-breeze)',
=======
      borderRadius: '24px 8px 20px 4px', // Lens archetype asymmetric radius
      backgroundColor: variant === 'filled' ? 'var(--sys-color-charcoalBackground-steps-3)' : 'transparent',
      border: '2px solid',
      borderColor: error
        ? 'var(--sys-color-solidarityRed-base)'
        : isFocused
          ? 'var(--sys-color-inkGold-base)'
          : 'var(--sys-color-concreteGrey-base)',
      color: 'var(--sys-color-worker-ash-base)',
      transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
>>>>>>> restoration-KR-Rage-Figma-v2.0
    };

    const showError = error && errorMessage;
    const displayHelperText = showError ? errorMessage : helperText;

    return (
      <div className={`flex flex-col ${fullWidth ? 'w-full' : 'w-auto'}`}>
        {label && (
          <label
            className={`
          mb-2 text-sm font-medium transition-colors duration-200
<<<<<<< HEAD
          ${error ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower)]'}
          ${isFocused && !error ? 'text-[var(--color-wattle-gold)]' : ''}
        `}
          >
            {label}
            {required && <span className="text-[var(--color-waratah-crimson)] ml-1">*</span>}
=======
          ${error ? 'text-[var(--color-solidarity-red)]' : 'text-[var(--color-concrete-grey)]'}
          ${isFocused && !error ? 'text-[var(--color-ink-gold)]' : ''}
        `}
          >
            {label}
            {required && <span className="text-[var(--color-solidarity-red)] ml-1">*</span>}
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
          ${isFocused && !error ? 'shadow-[0_0_15px_rgba(212,168,75,0.2)]' : ''}
=======
          ${isFocused && !error ? 'shadow-[0_0_15px_var(--sys-color-inkGold-steps-0)]' : ''}
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
                ${error ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower-dark)]'}
=======
                ${error ? 'text-[var(--color-solidarity-red)]' : 'text-[var(--color-concrete-grey-dark)]'}
>>>>>>> restoration-KR-Rage-Figma-v2.0
              `}
              >
                {displayHelperText}
              </p>
            )}

            {showCounter && maxLength && (
              <p
                className={`
              text-xs
<<<<<<< HEAD
              ${charCount > maxLength ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower-dark)]'}
=======
              ${charCount > maxLength ? 'text-[var(--color-solidarity-red)]' : 'text-[var(--color-concrete-grey-dark)]'}
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
export type { LensAreaProps as M3TextAreaProps, LensProps as M3TextFieldProps };
=======
export type { LensAreaProps as M3TextAreaProps, LensProps as M3TextFieldProps };
>>>>>>> restoration-KR-Rage-Figma-v2.0
