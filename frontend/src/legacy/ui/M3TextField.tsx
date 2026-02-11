import React, { forwardRef, useEffect } from 'react';

export type M3TextFieldVariant = 'filled' | 'outlined';
export type M3TextFieldSize = 'small' | 'medium' | 'large';
export type M3TextFieldMode = 'KrDark' | 'KrLight';

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
    /** Theme mode: KrDark (warm, botanical) or KrLight (clinical, precise) */
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
 * M3TextField - KeralaRage KrSolidarity Text Input
 *
 * Supports both KrDark (warm, botanical) and KrLight (clinical, precise) modes.
 */
export const M3TextField = forwardRef<HTMLInputElement, M3TextFieldProps>(({
    label,
    helperText,
    error = false,
    errorMessage,
    variant = 'outlined',
    size = 'medium',
    mode = 'KrDark',
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCharCount(e.target.value.length);
        setIsFloating(!!e.target.value);
        props.onChange?.(e);
    };

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

    const themeVariants = {
        'KrDark': {
            container: {
                outlined: `
                    border-2
                    ${error ? 'border-tertiary-solidarity-red' : 'border-primary-ink-gold/80'}
                    ${isFocused && !error ? 'border-primary-ink-gold ring-2 ring-primary-ink-gold/30' : ''}
                    bg-surface-KrDark-concrete-grey
                    shadow-sm
                `,
                filled: `
                    border-b-2
                    ${error ? 'border-b-tertiary-solidarity-red' : 'border-b-primary-ink-gold/80'}
                    ${isFocused && !error ? 'border-b-primary-ink-gold' : ''}
                    bg-surface-KrDark-concrete-grey
                `,
            },
            label: {
                base: 'text-on-surface-paper-white',
                error: 'text-tertiary-solidarity-red',
                floating: 'text-secondary-flannel-dim',
            },
            input: {
                text: 'text-on-surface-paper-white',
                placeholder: 'placeholder:text-secondary-concrete-grey/60',
            },
            radius: 'rounded-[8px_12px_6px_10px]',
        },
        'KrLight': {
            container: {
                outlined: `
                    border-2
                    ${error ? 'border-tertiary-solidarity-red' : 'border-outline-variant'}
                    ${isFocused && !error ? 'border-primary-ink-gold ring-2 ring-primary-ink-gold/20' : ''}
                    ${!disabled && !error && !isFocused ? 'hover:border-outline' : ''}
                    bg-surface-shared-asphalt-black/50 backdrop-blur-sm
                `,
                filled: `
                    border-b-2
                    ${error ? 'border-b-tertiary-solidarity-red' : 'border-b-outline-variant'}
                    ${isFocused && !error ? 'border-b-primary-ink-gold' : ''}
                    bg-surface-KrDark-concrete-grey shadow-rest
                `,
            },
            label: {
                base: 'text-on-surface-paper-white-dim',
                error: 'text-tertiary-solidarity-red',
                floating: 'text-secondary-flannel-dim',
            },
            input: {
                text: 'text-on-surface-paper-white',
                placeholder: 'placeholder:text-secondary-flannel-dim',
            },
            radius: 'radius-stone',
        },
    };

    const currentTheme = themeVariants[mode];

    const variantClasses = {
        outlined: {
            container: currentTheme.container.outlined,
        },
        filled: {
            container: currentTheme.container.filled,
        },
    };

    const inputClasses = `
        ${sizeClasses[size].input}
        w-full
        bg-transparent
        ${currentTheme.input.text}
        ${currentTheme.input.placeholder}
        focus:outline-2 focus:outline-offset-2 focus:outline-primary-ink-gold
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

    const isOverLimit = maxLength && charCount > maxLength;
    const isNearLimit = maxLength && charCount > maxLength * 0.8;
    const displayHelperText = errorMessage || helperText;

    return (
        <div className={`flex flex-col ${fullWidth ? 'w-full' : 'w-auto'} relative`}>
            <div className={containerClasses}>
                {startAdornment && (
                    <div className={`flex items-center ${sizeClasses[size].adornment} text-secondary-flannel-dim mr-2`}>
                        {startAdornment}
                    </div>
                )}
                <div className="flex-1 relative">
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
                            {required && <span className="text-tertiary-solidarity-red ml-1">*</span>}
                        </label>
                    )}
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
                {endAdornment && (
                    <div className={`flex items-center ${sizeClasses[size].adornment} text-secondary-flannel-dim ml-2`}>
                        {endAdornment}
                    </div>
                )}
            </div>
            {(displayHelperText || showCounter) && (
                <div className="flex items-center justify-between mt-2 px-1">
                    {displayHelperText && (
                        <p
                            id={`${props.id}-helper-text`}
                            className={`text-xs font-annotation ${error ? 'text-tertiary-solidarity-red' : 'text-secondary-flannel-dim'}`}
                        >
                            {displayHelperText}
                        </p>
                    )}
                    {showCounter && maxLength && (
                        <p
                            className={`
                                text-xs font-annotation ml-auto
                                ${isOverLimit ? 'text-tertiary-solidarity-red' : ''}
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
    mode = 'KrDark',
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
        'KrDark': {
            container: `
                border-2
                ${error ? 'border-tertiary-solidarity-red' : 'border-primary-ink-gold/80'}
                ${isFocused && !error ? 'border-primary-ink-gold ring-2 ring-primary-ink-gold/30' : ''}
                bg-surface-KrDark-concrete-grey
                shadow-sm
                rounded-[8px_12px_6px_10px]
            `,
            label: {
                base: 'text-on-surface-paper-white',
                error: 'text-tertiary-solidarity-red',
                floating: 'text-secondary-flannel-dim',
            },
        },
        'KrLight': {
            container: `
                border-2
                ${error ? 'border-tertiary-solidarity-red' : 'border-outline-variant'}
                ${isFocused && !error ? 'border-primary-ink-gold ring-2 ring-primary-ink-gold/20' : ''}
                bg-surface-shared-asphalt-black/50 backdrop-blur-sm
                radius-stone
            `,
            label: {
                base: 'text-on-surface-paper-white-dim',
                error: 'text-tertiary-solidarity-red',
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
                            {required && <span className="text-tertiary-solidarity-red ml-1">*</span>}
                        </label>
                    )}
                    <textarea
                        ref={ref}
                        className={`
                            ${sizeClasses[size]}
                            w-full
                            bg-transparent
                            text-on-surface-paper-white
                            placeholder:text-secondary-flannel-dim
                            focus:outline-2 focus:outline-offset-2 focus:outline-primary-ink-gold
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
                            className={`text-xs font-annotation ${error ? 'text-tertiary-solidarity-red' : 'text-secondary-flannel-dim'}`}
                        >
                            {displayHelperText}
                        </p>
                    )}
                    {showCounter && maxLength && (
                        <p
                            className={`
                                text-xs font-annotation ml-auto
                                ${isOverLimit ? 'text-tertiary-solidarity-red' : ''}
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