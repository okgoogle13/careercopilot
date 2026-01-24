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
 * M3TextField - Material Design 3 Compliant Text Input
 *
 * A comprehensive text input component using the Electric Alchemist M3 design system.
 * Supports filled and outlined variants with proper M3 states and validation.
 *
 * **M3 Design Token Usage:**
 * - Shape: `rounded-tech` (M3 medium shape) for inputs
 * - Colors: M3 semantic color roles with state layers
 * - Typography: M3 body-large for input text
 * - Motion: Smooth transitions for focus/hover states
 * - Elevation: Subtle elevation for filled variant
 *
 * **States:**
 * - Default: Outlined with subtle border
 * - Hover: Border color intensifies
 * - Focus: Primary color accent with ring
 * - Error: Error color with error message
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
export const Lens = forwardRef<HTMLInputElement, LensProps>(({
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
}, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [charCount, setCharCount] = React.useState(
        value ? String(value).length : 0
    );

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

    // Variant-specific styles (Northcote Curio)
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
    };

    const containerClasses = `
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${isFocused && !error ? 'shadow-[0_0_15px_rgba(212,168,75,0.2)]' : ''}
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
                <label className={`
          mb-2 text-sm font-medium transition-colors duration-200
          ${error ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower)]'}
          ${isFocused && !error ? 'text-[var(--color-wattle-gold)]' : ''}
        `}>
                    {label}
                    {required && <span className="text-[var(--color-waratah-crimson)] ml-1">*</span>}
                </label>
            )}

            {/* Input Container */}
            <div className={containerClasses} style={containerStyle}>
                <div className="flex items-center gap-2">
                    {/* Start Adornment */}
                    {startAdornment && (
                        <div className={`
              flex-shrink-0 ml-3 ${sizeClasses[size].adornment}
              ${error ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower-dark)]'}
            `}>
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
                        <div className={`
              flex-shrink-0 mr-3 ${sizeClasses[size].adornment}
              ${error ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower-dark)]'}
            `}>
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
                ${error ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower-dark)]'}
              `}
                        >
                            {displayHelperText}
                        </p>
                    )}

                    {showCounter && maxLength && (
                        <p className={`
              text-xs
              ${charCount > maxLength ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower-dark)]'}
              ml-auto
            `}>
                            {charCount}/{maxLength}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
});

Lens.displayName = 'Lens';

/**
 * M3TextArea - Multi-line text input variant
 *
 * Same API as M3TextField but renders a textarea for multi-line input.
 */
export interface M3TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
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

export const M3TextArea = forwardRef<HTMLTextAreaElement, M3TextAreaProps>(({
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
}, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [charCount, setCharCount] = React.useState(
        value ? String(value).length : 0
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCharCount(e.target.value.length);
        props.onChange?.(e);
    };

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
    };

    const showError = error && errorMessage;
    const displayHelperText = showError ? errorMessage : helperText;

    return (
        <div className={`flex flex-col ${fullWidth ? 'w-full' : 'w-auto'}`}>
            {label && (
                <label className={`
          mb-2 text-sm font-medium transition-colors duration-200
          ${error ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower)]'}
          ${isFocused && !error ? 'text-[var(--color-wattle-gold)]' : ''}
        `}>
                    {label}
                    {required && <span className="text-[var(--color-waratah-crimson)] ml-1">*</span>}
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
          ${isFocused && !error ? 'shadow-[0_0_15px_rgba(212,168,75,0.2)]' : ''}
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
                ${error ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower-dark)]'}
              `}
                        >
                            {displayHelperText}
                        </p>
                    )}

                    {showCounter && maxLength && (
                        <p className={`
              text-xs
              ${charCount > maxLength ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower-dark)]'}
              ml-auto
            `}>
                            {charCount}/{maxLength}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
});

M3TextArea.displayName = 'M3TextArea';
