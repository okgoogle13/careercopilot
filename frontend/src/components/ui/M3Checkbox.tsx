import React, { forwardRef } from 'react';
import { Check, Minus } from 'lucide-react';

export interface M3CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    /** Checkbox label */
    label?: string;

    /** Error state */
    error?: boolean;

    /** Indeterminate state (for "select all" scenarios) */
    indeterminate?: boolean;

    /** Additional CSS classes for container */
    containerClassName?: string;
}

/**
 * M3Checkbox - Material Design 3 Compliant Checkbox
 * 
 * A custom checkbox component using M3 design tokens with enhanced UX.
 * Features organic shapes, spring animations, and proper state indicators.
 * 
 * **M3 Design Token Usage:**
 * - Shape: `rounded-tech` (subtle organic corners)
 * - Colors: M3 primary/error semantic tokens with state layers
 * - Motion: Spring easing for smooth check transition
 * - Typography: M3 body-large for labels
 * 
 * **States:**
 * - Unchecked: Outlined box
 * - Checked: Filled with checkmark
 * - Indeterminate: Filled with dash (for partial selection)
 * - Error: Error color theme
 * - Disabled: Reduced opacity
 * 
 * @example
 * ```tsx
 * <M3Checkbox label="I agree to terms and conditions" />
 * 
 * <M3Checkbox
 *   label="Subscribe to newsletter"
 *   checked={subscribed}
 *   onChange={(e) => setSubscribed(e.target.checked)}
 * />
 * 
 * <M3Checkbox
 *   label="Select all"
 *   indeterminate={someSelected && !allSelected}
 *   checked={allSelected}
 * />
 * ```
 */
export const M3Checkbox = forwardRef<HTMLInputElement, M3CheckboxProps>(({
    label,
    error = false,
    indeterminate = false,
    containerClassName = '',
    className = '',
    disabled = false,
    checked,
    ...props
}, ref) => {
    // Sync indeterminate state with native checkbox
    const checkboxRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    React.useImperativeHandle(ref, () => checkboxRef.current!);

    const isChecked = checked || indeterminate;

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
                className="sr-only"
                {...props}
            />

            {/* Custom Checkbox */}
            <div className={`
        relative flex-shrink-0
        w-5 h-5
        rounded-tech
        border-2
        ${error
                    ? 'border-error'
                    : isChecked
                        ? 'border-primary bg-primary'
                        : 'border-outline-variant'
                }
        ${!disabled && !isChecked ? 'hover:border-outline' : ''}
        ${!disabled && isChecked && !error ? 'hover:brightness-110' : ''}
        transition-all duration-medium-1 ease-spring
        ${className}
      `}>
                {/* Checkmark or Dash Icon */}
                {isChecked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        {indeterminate ? (
                            <Minus className={`
                w-3.5 h-3.5
                ${error ? 'text-on-error' : 'text-on-primary'}
              `} />
                        ) : (
                            <Check className={`
                w-3.5 h-3.5
                ${error ? 'text-on-error' : 'text-on-primary'}
              `} />
                        )}
                    </div>
                )}

                {/* Focus Ring */}
                <div className={`
          absolute -inset-1
          rounded-tech
          ${!disabled ? 'focus-within:ring-2 focus-within:ring-primary/20' : ''}
        `} />
            </div>

            {/* Label */}
            {label && (
                <span className={`
          text-body-large
          ${error ? 'text-error' : 'text-on-surface'}
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
 * M3Radio - Material Design 3 Compliant Radio Button
 * 
 * Radio button variant using circular shape instead of box.
 */
export interface M3RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: boolean;
    containerClassName?: string;
}

export const M3Radio = forwardRef<HTMLInputElement, M3RadioProps>(({
    label,
    error = false,
    containerClassName = '',
    className = '',
    disabled = false,
    checked,
    ...props
}, ref) => {
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
                className="sr-only"
                {...props}
            />

            {/* Custom Radio */}
            <div className={`
        relative flex-shrink-0
        w-5 h-5
        rounded-full
        border-2
        ${error
                    ? 'border-error'
                    : checked
                        ? 'border-primary'
                        : 'border-outline-variant'
                }
        ${!disabled && !checked ? 'hover:border-outline' : ''}
        transition-all duration-medium-1 ease-spring
        ${className}
      `}>
                {/* Inner Dot */}
                {checked && (
                    <div className={`
            absolute inset-0 flex items-center justify-center
          `}>
                        <div className={`
              w-2.5 h-2.5
             rounded-full
              ${error ? 'bg-error' : 'bg-primary'}
              transition-transform duration-medium-1 ease-spring
              scale-100
            `} />
                    </div>
                )}

                {/* Focus Ring */}
                <div className={`
          absolute -inset-1
          rounded-full
          ${!disabled ? 'focus-within:ring-2 focus-within:ring-primary/20' : ''}
        `} />
            </div>

            {/* Label */}
            {label && (
                <span className={`
          text-body-large
          ${error ? 'text-error' : 'text-on-surface'}
          select-none
        `}>
                    {label}
                </span>
            )}
        </label>
    );
});

M3Radio.displayName = 'M3Radio';
