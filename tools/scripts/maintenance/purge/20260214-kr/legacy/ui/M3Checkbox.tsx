import React, { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import { Check, Minus } from 'lucide-react';

export type M3CheckboxMode = 'KrDark' | 'KrLight';

export interface M3CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    /** Checkbox label */
    label?: string;
    /** Error state */
    error?: boolean;
    /** Indeterminate state (for "select all" scenarios) */
    indeterminate?: boolean;
    /** Theme mode: KrDark (warm, [DEPRECATED_STYLE]) or KrDark (clinical, precise) */
    mode?: M3CheckboxMode;
    /** Additional CSS classes for container */
    containerClassName?: string;
}

/**
 * M3Checkbox - KeralaRage KrSolidarity Checkbox
 *
 * Supports both KrDark (warm, [DEPRECATED_STYLE]) and KrDark (clinical, precise) modes.
 *
 * **KeralaRage Token Usage:**
 * - Typography: `font-field-note` (Label)
 * - Color: `primary-ink-gold` (Checked), `tertiary-solidarity-red` (Error)
 * - Shape: `rounded-[4px]` (KrDark), `rounded-[6px]` (KrDark)
 * - Motion: `ease-viscous` (Check animation)
 *
 * **Accessibility:**
 * - WCAG 2.1 Level AA compliant
 * - Visible focus indicators
 * - ARIA attributes for screen readers
 * - Indeterminate state support
 */
export const M3Checkbox = forwardRef<HTMLInputElement, M3CheckboxProps>(({
    label,
    error = false,
    indeterminate = false,
    mode = 'KrDark',
    containerClassName = '',
    className = '',
    disabled = false,
    checked,
    ...props
}, ref) => {
    const checkboxRef = useRef<HTMLInputElement>(null);

    // Sync indeterminate state with native checkbox
    useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    useImperativeHandle(ref, () => checkboxRef.current!);

    const isChecked = checked || indeterminate;

    // Theme variants (KrDark vs. KrDark)
    const themeVariants = {
        'KrDark': {
            checkbox: `
                rounded-[6px]
                ${error
                    ? 'border-tertiary-solidarity-red'
                    : isChecked
                        ? 'border-primary-ink-gold bg-ink-gold'
                        : 'border-primary-ink-gold/60'
                }
                ${!disabled && !isChecked ? 'hover:border-primary-ink-gold' : ''}
                ${!disabled && isChecked && !error ? 'hover:bg-ink-gold/90' : ''}
            `,
            label: error ? 'text-tertiary-solidarity-red' : 'text-on-surface-paper-white',
            iconColor: error ? 'text-on-error' : 'text-asphalt-black',
        },
        'KrLight': {
            checkbox: `
                rounded-[4px]
                ${error
                    ? 'border-tertiary-solidarity-red'
                    : isChecked
                        ? 'border-primary-ink-gold bg-ink-gold'
                        : 'border-outline-variant'
                }
                ${!disabled && !isChecked ? 'hover:border-outline' : ''}
                ${!disabled && isChecked && !error ? 'hover:bg-ink-gold/90' : ''}
            `,
            label: error ? 'text-tertiary-solidarity-red' : 'text-on-surface-paper-white',
            iconColor: error ? 'text-on-error' : 'text-asphalt-black',
        },
    };

    const currentTheme = themeVariants[mode];

    return (
        <label className={`
            inline-flex items-center gap-3
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${containerClassName}
        `}>
            {/* Hidden Native Checkbox */}
            <input
                ref={checkboxRef}
                type="checkbox"
                checked={checked}
                disabled={disabled}
                aria-checked={indeterminate ? 'mixed' : checked}
                aria-required={props.required}
                aria-invalid={error}
                aria-label={label}
                className="sr-only peer"
                {...props}
            />

            {/* Custom Checkbox */}
            <div className={`
                relative flex-shrink-0
                w-5 h-5
                border-2
                ${currentTheme.checkbox}
                transition-all duration-standard ease-viscous
                peer-focus:outline-2 peer-focus:outline-offset-2 peer-focus:outline-primary-ink-gold
                ${className}
            `}>
                {/* Checkmark or Dash Icon */}
                {isChecked && (
                    <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in duration-fast">
                        {indeterminate ? (
                            <Minus className={`w-3.5 h-3.5 ${currentTheme.iconColor}`} />
                        ) : (
                            <Check className={`w-3.5 h-3.5 ${currentTheme.iconColor}`} />
                        )}
                    </div>
                )}
            </div>

            {/* Label */}
            {label && (
                <span className={`
                    text-base font-field-note
                    ${currentTheme.label}
                    select-none
                `}>
                    {label}
                </span>
            )}
        </label>
    );
});

M3Checkbox.displayName = 'M3Checkbox';

/**
 * M3Radio - KeralaRage KrSolidarity Radio Button
 *
 * **M3 Expressive Exception:**
 * Uses `rounded-full` for functional reasons. Perfect circles provide better
 * usability and accessibility for radio button indicators.
 */
export interface M3RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: boolean;
    mode?: M3CheckboxMode;
    containerClassName?: string;
}

export const M3Radio = forwardRef<HTMLInputElement, M3RadioProps>(({
    label,
    error = false,
    mode = 'KrDark',
    containerClassName = '',
    className = '',
    disabled = false,
    checked,
    ...props
}, ref) => {
    const themeVariants = {
        'KrDark': {
            radio: `
                ${error
                    ? 'border-tertiary-solidarity-red'
                    : checked
                        ? 'border-primary-ink-gold'
                        : 'border-primary-ink-gold/60'
                }
                ${!disabled && !checked ? 'hover:border-primary-ink-gold' : ''}
            `,
            dot: error ? 'bg-tertiary-solidarity-red' : 'bg-ink-gold',
            label: error ? 'text-tertiary-solidarity-red' : 'text-on-surface-paper-white',
        },
        'KrLight': {
            radio: `
                ${error
                    ? 'border-tertiary-solidarity-red'
                    : checked
                        ? 'border-primary-ink-gold'
                        : 'border-outline-variant'
                }
                ${!disabled && !checked ? 'hover:border-outline' : ''}
            `,
            dot: error ? 'bg-tertiary-solidarity-red' : 'bg-ink-gold',
            label: error ? 'text-tertiary-solidarity-red' : 'text-on-surface-paper-white',
        },
    };

    const currentTheme = themeVariants[mode];

    return (
        <label className={`
            inline-flex items-center gap-3
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${containerClassName}
        `}>
            {/* Hidden Native Radio */}
            <input
                ref={ref}
                type="radio"
                checked={checked}
                disabled={disabled}
                aria-required={props.required}
                aria-invalid={error}
                aria-label={label}
                className="sr-only peer"
                {...props}
            />

            {/* Custom Radio */}
            <div className={`
                relative flex-shrink-0
                w-5 h-5
                rounded-full
                border-2
                ${currentTheme.radio}
                transition-all duration-standard ease-viscous
                peer-focus:outline-2 peer-focus:outline-offset-2 peer-focus:outline-primary-ink-gold
                ${className}
            `}>
                {/* Inner Dot */}
                {checked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`
                            w-2.5 h-2.5
                            rounded-full
                            ${currentTheme.dot}
                            transition-transform duration-standard ease-viscous
                            scale-100 animate-in zoom-in duration-fast
                        `} />
                    </div>
                )}
            </div>

            {/* Label */}
            {label && (
                <span className={`
                    text-base font-field-note
                    ${currentTheme.label}
                    select-none
                `}>
                    {label}
                </span>
            )}
        </label>
    );
});

M3Radio.displayName = 'M3Radio';