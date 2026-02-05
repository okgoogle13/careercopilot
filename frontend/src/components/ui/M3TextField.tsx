import React, { forwardRef } from 'react';

export type M3TextFieldVariant = 'filled' | 'outlined';
export type M3TextFieldSize = 'small' | 'medium' | 'large';

export interface M3TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** Input label */
    label?: string;

    /** Helper text below input */
    helperText?: string;

    /** Error state */
    error?: boolean;

    /** Error message (shows helperText in error color) */
    errorMessage?: string;

    /** Visual variant */
    variant?: M3TextFieldVariant;

    /** Input size */
    size?: M3TextFieldSize;

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
 * <M3TextField
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   helperText="We'll never share your email"
 * />
 * 
 * <M3TextField
 *   label="Password"
 *   type="password"
 *   error
 *   errorMessage="Password must be at least 8 characters"
 * />
 * 
 * <M3TextField
 *   label="Search"
 *   startAdornment={<SearchIcon />}
 *   variant="filled"
 * />
 * ```
 */
export const M3TextField = forwardRef<HTMLInputElement, M3TextFieldProps>(({
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
    const sizeClasses: Record<M3TextFieldSize, { input: string; adornment: string }> = {
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

    // Variant-specific classes
    const variantClasses = {
        outlined: {
            container: `
        border-2 
        ${error ? 'border-error' : 'border-outline-variant'}
        ${isFocused && !error ? 'border-primary ring-2 ring-primary/20' : ''}
        ${!disabled && !error && !isFocused ? 'hover:border-outline' : ''}
        bg-surface-container
      `,
        },
        filled: {
            container: `
        border-b-2
        ${error ? 'border-b-error' : 'border-b-outline-variant'}
        ${isFocused && !error ? 'border-b-primary' : ''}
        ${!disabled && !error && !isFocused ? 'hover:border-b-outline' : ''}
        bg-surface-container-high shadow-elevation-1
      `,
        },
    };

    const containerClasses = `
    ${variantClasses[variant].container}
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    rounded-tech
    transition-all duration-medium-1 ease-spring
    ${containerClassName}
  `;

    const inputClasses = `
    ${sizeClasses[size].input}
    w-full
    bg-transparent
    text-on-surface
    placeholder:text-on-surface-variant
    focus:outline-none
    disabled:cursor-not-allowed
    font-body
    ${className}
  `;

    const showError = error && errorMessage;
    const displayHelperText = showError ? errorMessage : helperText;

    return (
        <div className={`flex flex-col ${fullWidth ? 'w-full' : 'w-auto'}`}>
            {/* Label */}
            {label && (
                <label className={`
          mb-2 text-label-large font-medium
          ${error ? 'text-error' : 'text-on-surface'}
        `}>
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </label>
            )}

            {/* Input Container */}
            <div className={containerClasses}>
                <div className="flex items-center gap-2">
                    {/* Start Adornment */}
                    {startAdornment && (
                        <div className={`
              flex-shrink-0 ${sizeClasses[size].adornment}
              ${error ? 'text-error' : 'text-on-surface-variant'}
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
              flex-shrink-0 ${sizeClasses[size].adornment}
              ${error ? 'text-error' : 'text-on-surface-variant'}
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
                text-label-small
                ${error ? 'text-error' : 'text-on-surface-variant'}
              `}
                        >
                            {displayHelperText}
                        </p>
                    )}

                    {showCounter && maxLength && (
                        <p className={`
              text-label-small
              ${charCount > maxLength ? 'text-error' : 'text-on-surface-variant'}
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

M3TextField.displayName = 'M3TextField';

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
    variant?: M3TextFieldVariant;
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

    const variantClasses = {
        outlined: `
      border-2 
      ${error ? 'border-error' : 'border-outline-variant'}
      ${isFocused && !error ? 'border-primary ring-2 ring-primary/20' : ''}
      ${!disabled && !error && !isFocused ? 'hover:border-outline' : ''}
      bg-surface-container
    `,
        filled: `
      border-b-2
      ${error ? 'border-b-error' : 'border-b-outline-variant'}
      ${isFocused && !error ? 'border-b-primary' : ''}
      ${!disabled && !error && !isFocused ? 'hover:border-b-outline' : ''}
      bg-surface-container-high shadow-elevation-1
    `,
    };

    const showError = error && errorMessage;
    const displayHelperText = showError ? errorMessage : helperText;

    return (
        <div className={`flex flex-col ${fullWidth ? 'w-full' : 'w-auto'}`}>
            {label && (
                <label className={`
          mb-2 text-label-large font-medium
          ${error ? 'text-error' : 'text-on-surface'}
        `}>
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </label>
            )}

            <textarea
                ref={ref}
                rows={rows}
                className={`
          ${variantClasses[variant]}
          ${fullWidth ? 'w-full' : 'w-auto'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          rounded-tech
          px-4 py-3
          text-base
          bg-transparent
          text-on-surface
          placeholder:text-on-surface-variant
          focus:outline-none
          resize-vertical
          transition-all duration-medium-1 ease-spring
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
                text-label-small
                ${error ? 'text-error' : 'text-on-surface-variant'}
              `}
                        >
                            {displayHelperText}
                        </p>
                    )}

                    {showCounter && maxLength && (
                        <p className={`
              text-label-small
              ${charCount > maxLength ? 'text-error' : 'text-on-surface-variant'}
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
