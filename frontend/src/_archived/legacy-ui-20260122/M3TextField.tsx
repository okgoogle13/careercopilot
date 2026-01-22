import React, { forwardRef, useEffect } from 'react';

export type M3TextFieldVariant = 'filled' | 'outlined';
export type M3TextFieldSize = 'small' | 'medium' | 'large';
export type M3TextFieldMode = 'gallery' | 'laboratory';

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
    /** Theme mode: Gallery (warm, botanical) or Laboratory (clinical, precise) */
    mode?: M3TextFieldMode;
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
 * M3TextField - Northcote Curio Text Input
 *
 * Supports both Gallery (warm, botanical) and Laboratory (clinical, precise) modes.
 *
 * **Northcote Token Usage:**
 * - Typography: `font-field-note` (Input), `font-annotation` (Label)
 * - Color: `primary-wattle-gold` (Focus), `tertiary-waratah-crimson` (Error)
 * - Shape: `radius-stone` (Laboratory), organic asymmetry (Gallery)
 * - Motion: `ease-viscous` (Fluid interactions)
 *
 * **Accessibility:**
 * - WCAG 2.1 Level AA compliant
 * - Visible focus indicators
 * - ARIA attributes for screen readers
 * - Floating label animation
 */
export const M3TextField = forwardRef<HTMLInputElement, M3TextFieldProps>(({
    label,
    helperText,
    error = false,
    errorMessage,
    variant = 'outlined',
    size = 'medium',
    mode = 'laboratory',
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
    const [isFloating, setIsFloating] = React.useState(!!value);
    const [charCount, setCharCount] = React.useState(
        value ? String(value).length : 0
    );

    // Update floating state when value changes
    useEffect(() => {
        setIsFloating(!!value);
    }, [value]);

    const handleFocus = () => {
        setIsFocused(true);
        setIsFloating(true); // Float on focus regardless of value
    };

    const handleBlur = () => {
        setIsFocused(false);
        setIsFloating(!!value); // Only float if has value
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCharCount(e.target.value.length);
        setIsFloating(!!e.target.value);
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

    // Theme variants (Gallery vs. Laboratory)
    const themeVariants = {
        gallery: {
            container: {
                outlined: `
                    border-2 
                    ${error ? 'border-tertiary-waratah-crimson' : 'border-primary-wattle-gold/80'}
                    ${isFocused && !error ? 'border-primary-wattle-gold ring-2 ring-primary-wattle-gold/30' : ''}
                    bg-surface-gallery-eucalypt-smoke
                    shadow-sm
                `,
                filled: `
                    border-b-2
                    ${error ? 'border-b-tertiary-waratah-crimson' : 'border-b-primary-wattle-gold/80'}
                    ${isFocused && !error ? 'border-b-primary-wattle-gold' : ''}
                    bg-surface-gallery-eucalypt-smoke
                `,
            },
            label: {
                base: 'text-on-surface-parchment',
                error: 'text-tertiary-waratah-crimson',
                floating: 'text-secondary-flannel-dim',
            },
            input: {
                text: 'text-on-surface-parchment',
                placeholder: 'placeholder:text-secondary-flannel-flower/60',
            },
            radius: 'rounded-[8px_12px_6px_10px]', // More organic for Gallery
        },
        laboratory: {
            container: {
                outlined: `
                    border-2 
                    ${error ? 'border-tertiary-waratah-crimson' : 'border-outline-variant'}
                    ${isFocused && !error ? 'border-primary-wattle-gold ring-2 ring-primary-wattle-gold/20' : ''}
                    ${!disabled && !error && !isFocused ? 'hover:border-outline' : ''}
                    bg-surface-shared-specimen-night/50 backdrop-blur-sm
                `,
                filled: `
                    border-b-2
                    ${error ? 'border-b-tertiary-waratah-crimson' : 'border-b-outline-variant'}
                    ${isFocused && !error ? 'border-b-primary-wattle-gold' : ''}
                    bg-surface-gallery-eucalypt-smoke shadow-rest
                `,
            },
            label: {
                base: 'text-on-surface-parchment-dim',
                error: 'text-tertiary-waratah-crimson',
                floating: 'text-secondary-flannel-dim',
            },
            input: {
                text: 'text-on-surface-parchment',
                placeholder: 'placeholder:text-secondary-flannel-dim',
            },
            radius: 'radius-stone', // Precise asymmetry for Laboratory
        },
    };

    const currentTheme = themeVariants[mode];

    // Variant classes using current theme
    const variantClasses = {
        outlined: {
            container: currentTheme.container.outlined,
        },
        filled: {
            container: currentTheme.container.filled,
        },
    };

    // Input classes with focus outline (WCAG 2.4.7)
    const inputClasses = `
        ${sizeClasses[size].input}
        w-full
        bg-transparent
        ${currentTheme.input.text}
        ${currentTheme.input.placeholder}
        focus:outline-2 focus:outline-offset-2 focus:outline-primary-wattle-gold
        disabled:cursor-not-allowed
        font-field-note
        ${className}
    `;

    const containerClasses = `
        ${variantClasses[variant].container}
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${currentTheme.radius}
        transition-all duration-fast ease-viscous
        ${containerClassName}
    `;

    // Character counter warning states
    const isOverLimit = maxLength && charCount > maxLength;
    const isNearLimit = maxLength && charCount > maxLength * 0.8;

    const displayHelperText = errorMessage || helperText;

    return (
        <div className={`flex flex-col ${fullWidth ? 'w-full' : 'w-auto'} relative`}>
            {/* Input Container */}
            <div className={containerClasses}>
                {/* Start Adornment */}
                {startAdornment && (
                    <div className={`flex items-center ${sizeClasses[size].adornment} text-secondary-flannel-dim mr-2`}>
                        {startAdornment}
                    </div>
                )}

                {/* Input Field */}
                <div className="flex-1 relative">
                    {/* Floating Label */}
                    {label && (
                        <label
                            htmlFor={props.id}
                            className={`
                                absolute left-0
                                font-annotation font-medium tracking-wide
                                transition-all duration-fast ease-viscous
                                pointer-events-none
                                ${isFloating
                                    ? `text-xs -top-6 ${error ? currentTheme.label.error : currentTheme.label.floating}`
                                    : `text-sm top-3 ${error ? currentTheme.label.error : currentTheme.label.base}`
                                }
                            `}
                        >
                            {label}
                            {required && <span className="text-tertiary-waratah-crimson ml-1">*</span>}
                        </label>
                    )}

                    {/* Input Element */}
                    <input
                        ref={ref}
                        className={inputClasses}
                        disabled={disabled}
                        maxLength={maxLength}
                        value={value}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        aria-invalid={error}
                        aria-required={required}
                        aria-describedby={displayHelperText ? `${props.id}-helper-text` : undefined}
                        aria-label={label}
                        {...props}
                    />
                </div>

                {/* End Adornment */}
                {endAdornment && (
                    <div className={`flex items-center ${sizeClasses[size].adornment} text-secondary-flannel-dim ml-2`}>
                        {endAdornment}
                    </div>
                )}
            </div>

            {/* Helper Text / Error Message / Character Counter */}
            {(displayHelperText || showCounter) && (
                <div className="flex items-center justify-between mt-2 px-1">
                    {displayHelperText && (
                        <p
                            id={`${props.id}-helper-text`}
                            className={`text-xs font-annotation ${error ? 'text-tertiary-waratah-crimson' : 'text-secondary-flannel-dim'
                                }`}
                        >
                            {displayHelperText}
                        </p>
                    )}

                    {showCounter && maxLength && (
                        <p
                            className={`
                                text-xs font-annotation ml-auto
                                ${isOverLimit ? 'text-tertiary-waratah-crimson' : ''}
                                ${isNearLimit && !isOverLimit ? 'text-secondary-flannel-dim' : ''}
                            `}
                        >
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
 */
export interface M3TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
    label?: string;
    helperText?: string;
    error?: boolean;
    errorMessage?: string;
    size?: M3TextFieldSize;
    mode?: M3TextFieldMode;
    fullWidth?: boolean;
    showCounter?: boolean;
    containerClassName?: string;
}

export const M3TextArea = forwardRef<HTMLTextAreaElement, M3TextAreaProps>(({
    label,
    helperText,
    error = false,
    errorMessage,
    size = 'medium',
    mode = 'laboratory',
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
    const [isFloating, setIsFloating] = React.useState(!!value);
    const [charCount, setCharCount] = React.useState(
        value ? String(value).length : 0
    );

    useEffect(() => {
        setIsFloating(!!value);
    }, [value]);

    const handleFocus = () => {
        setIsFocused(true);
        setIsFloating(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setIsFloating(!!value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCharCount(e.target.value.length);
        setIsFloating(!!e.target.value);
        props.onChange?.(e);
    };

    const sizeClasses: Record<M3TextFieldSize, string> = {
        small: 'px-3 py-2 text-sm',
        medium: 'px-4 py-3 text-base',
        large: 'px-5 py-4 text-lg',
    };

    const themeVariants = {
        gallery: {
            container: `
                border-2 
                ${error ? 'border-tertiary-waratah-crimson' : 'border-primary-wattle-gold/80'}
                ${isFocused && !error ? 'border-primary-wattle-gold ring-2 ring-primary-wattle-gold/30' : ''}
                bg-surface-gallery-eucalypt-smoke
                shadow-sm
                rounded-[8px_12px_6px_10px]
            `,
            label: {
                base: 'text-on-surface-parchment',
                error: 'text-tertiary-waratah-crimson',
                floating: 'text-secondary-flannel-dim',
            },
        },
        laboratory: {
            container: `
                border-2 
                ${error ? 'border-tertiary-waratah-crimson' : 'border-outline-variant'}
                ${isFocused && !error ? 'border-primary-wattle-gold ring-2 ring-primary-wattle-gold/20' : ''}
                bg-surface-shared-specimen-night/50 backdrop-blur-sm
                radius-stone
            `,
            label: {
                base: 'text-on-surface-parchment-dim',
                error: 'text-tertiary-waratah-crimson',
                floating: 'text-secondary-flannel-dim',
            },
        },
    };

    const currentTheme = themeVariants[mode];

    const isOverLimit = maxLength && charCount > maxLength;
    const isNearLimit = maxLength && charCount > maxLength * 0.8;
    const displayHelperText = errorMessage || helperText;

    return (
        <div className={`flex flex-col ${fullWidth ? 'w-full' : 'w-auto'} relative`}>
            <div className={`${currentTheme.container} ${fullWidth ? 'w-full' : 'w-auto'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} transition-all duration-fast ease-viscous ${containerClassName}`}>
                <div className="relative">
                    {label && (
                        <label
                            htmlFor={props.id}
                            className={`
                                absolute left-0
                                font-annotation font-medium tracking-wide
                                transition-all duration-fast ease-viscous
                                pointer-events-none
                                ${isFloating
                                    ? `text-xs -top-6 ${error ? currentTheme.label.error : currentTheme.label.floating}`
                                    : `text-sm top-3 ${error ? currentTheme.label.error : currentTheme.label.base}`
                                }
                            `}
                        >
                            {label}
                            {required && <span className="text-tertiary-waratah-crimson ml-1">*</span>}
                        </label>
                    )}

                    <textarea
                        ref={ref}
                        className={`
                            ${sizeClasses[size]}
                            w-full
                            bg-transparent
                            text-on-surface-parchment
                            placeholder:text-secondary-flannel-dim
                            focus:outline-2 focus:outline-offset-2 focus:outline-primary-wattle-gold
                            disabled:cursor-not-allowed
                            font-field-note
                            resize-vertical
                            ${className}
                        `}
                        disabled={disabled}
                        maxLength={maxLength}
                        value={value}
                        rows={rows}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        aria-invalid={error}
                        aria-required={required}
                        aria-describedby={displayHelperText ? `${props.id}-helper-text` : undefined}
                        aria-label={label}
                        {...props}
                    />
                </div>
            </div>

            {(displayHelperText || showCounter) && (
                <div className="flex items-center justify-between mt-2 px-1">
                    {displayHelperText && (
                        <p
                            id={`${props.id}-helper-text`}
                            className={`text-xs font-annotation ${error ? 'text-tertiary-waratah-crimson' : 'text-secondary-flannel-dim'}`}
                        >
                            {displayHelperText}
                        </p>
                    )}

                    {showCounter && maxLength && (
                        <p
                            className={`
                                text-xs font-annotation ml-auto
                                ${isOverLimit ? 'text-tertiary-waratah-crimson' : ''}
                                ${isNearLimit && !isOverLimit ? 'text-secondary-flannel-dim' : ''}
                            `}
                        >
                            {charCount}/{maxLength}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
});

M3TextArea.displayName = 'M3TextArea';
