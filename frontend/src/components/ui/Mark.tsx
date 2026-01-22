import React, { forwardRef } from 'react';
import { Check, Minus } from 'lucide-react';

export interface MarkProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
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
 * <Mark label="I agree to terms and conditions" />
 * 
 * <Mark
 *   label="Subscribe to newsletter"
 *   checked={subscribed}
 *   onChange={(e) => setSubscribed(e.target.checked)}
 * />
 * 
 * <Mark
 *   label="Select all"
 *   indeterminate={someSelected && !allSelected}
 *   checked={allSelected}
 * />
 * ```
 */
export const Mark = forwardRef<HTMLInputElement, MarkProps>(({
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
        border-2
        ${error
                    ? 'border-[var(--color-waratah-crimson)]'
                    : isChecked
                        ? 'border-[var(--color-wattle-gold)] bg-[var(--color-wattle-gold)]'
                        : 'border-[var(--color-eucalypt-smoke-base)]'
                }
        ${!disabled && !isChecked ? 'hover:border-[var(--color-flannel-flower)]' : ''}
        transition-all duration-standard var(--ease-viscous-breeze)
        ${className}
      `}
                style={{ borderRadius: 'var(--radius-seed)' }}
            >
                {/* Checkmark or Dash Icon */}
                {isChecked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        {indeterminate ? (
                            <Minus className={`
                w-3.5 h-3.5
                ${error ? 'text-on-error' : 'text-[var(--color-specimen-night)]'}
              `} />
                        ) : (
                            <Check className={`
                w-3.5 h-3.5
                ${error ? 'text-on-error' : 'text-[var(--color-specimen-night)]'}
              `} />
                        )}
                    </div>
                )}
            </div>

            {/* Label */}
            {label && (
                <span className={`
          text-sm font-field-note font-medium
          ${error ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-parchment)]'}
          select-none
        `}>
                    {label}
                </span>
            )}
        </label>
    );
});

Mark.displayName = 'Mark';


/**
 * M3Radio - Material Design 3 Compliant Radio Button
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
                    ? 'border-[var(--color-waratah-crimson)]'
                    : checked
                        ? 'border-[var(--color-wattle-gold)]'
                        : 'border-[var(--color-eucalypt-smoke-base)]'
                }
        ${!disabled && !checked ? 'hover:border-[var(--color-flannel-flower)]' : ''}
        transition-all duration-standard var(--ease-viscous-breeze)
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
              ${error ? 'bg-[var(--color-waratah-crimson)]' : 'bg-[var(--color-wattle-gold)]'}
              scale-100
            `} />
                    </div>
                )}
            </div>

            {/* Label */}
            {label && (
                <span className={`
          text-sm font-field-note font-medium
          ${error ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-parchment)]'}
          select-none
        `}>
                    {label}
                </span>
            )}
        </label>
    );
});

M3Radio.displayName = 'M3Radio';
