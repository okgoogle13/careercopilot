import { Check, Minus } from 'lucide-react';
import React, { forwardRef } from 'react';

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
 * Mark - KeralaRage KrSolidarity Checkbox
 *
 * A custom checkbox component using KeralaRage KrSolidarity design tokens with enhanced UX.
 * Features [DEPRECATED_STYLE] shapes with Seed radius, spring animations, and proper state indicators.
 *
 * **KeralaRage Design Token Usage:**
 * - Shape: `--radius-seed` (subtle [DEPRECATED_STYLE] corners)
 * - Colors: [DEPRECATED_STYLE] palette (Ink Gold, Solidarity Red, Concrete Grey)
 * - Motion: Viscous-breeze easing for smooth check transition
 * - Typography: Field-note font for labels
 *
 * **States:**
 * - Unchecked: Outlined box
 * - Checked: Filled with checkmark (Ink Gold)
 * - Indeterminate: Filled with dash (for partial selection)
 * - Error: Solidarity Red theme
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
export const Mark = forwardRef<HTMLInputElement, MarkProps>(
  (
    {
      label,
      error = false,
      indeterminate = false,
      containerClassName = '',
      className = '',
      disabled = false,
      checked,
      ...props
    },
    ref
  ) => {
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
      <label
        className={`
      inline-flex items-center gap-3
      ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      ${containerClassName}
    `}
      >
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
        <div
          className={`
        relative flex-shrink-0
        w-5 h-5
        border-2
        ${
          error
            ? 'border-[var(--sys-color-solidarityRed-base)]'
            : isChecked
              ? 'border-[var(--sys-color-inkGold-base)] bg-[var(--sys-color-inkGold-base)]'
              : 'border-[var(--sys-color-worker-ash-base)]'
        }
        ${!disabled && !isChecked ? 'hover:border-[var(--sys-color-worker-ash-base)]' : ''}
        transition-all duration-standard var(--ease-viscous-breeze)
        ${className}
      `}
          style={{ borderRadius: 'var(--radius-seed)' }}
        >
          {/* Checkmark or Dash Icon */}
          {isChecked && (
            <div className="absolute inset-0 flex items-center justify-center">
              {indeterminate ? (
                <Minus
                  className={`
                w-3.5 h-3.5
                ${error ? 'text-on-error' : 'text-[var(--sys-color-charcoalBackground-base)]'}
              `}
                />
              ) : (
                <Check
                  className={`
                w-3.5 h-3.5
                ${error ? 'text-on-error' : 'text-[var(--sys-color-charcoalBackground-base)]'}
              `}
                />
              )}
            </div>
          )}
        </div>

        {/* Label */}
        {label && (
          <span
            className={`
          text-sm font-field-note font-medium
          ${error ? 'text-[var(--sys-color-solidarityRed-base)]' : 'text-[var(--sys-color-worker-ash-steps-6)]'}
          select-none
        `}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

Mark.displayName = 'Mark';

/**
 * MarkRadio - KeralaRage KrSolidarity Radio Button
 *
 * Radio button variant with consistent KeralaRage design language.
 */
export interface MarkRadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: boolean;
  containerClassName?: string;
}

export const MarkRadio = forwardRef<HTMLInputElement, MarkRadioProps>(
  (
    {
      label,
      error = false,
      containerClassName = '',
      className = '',
      disabled = false,
      checked,
      ...props
    },
    ref
  ) => {
    return (
      <label
        className={`
      inline-flex items-center gap-3
      ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      ${containerClassName}
    `}
      >
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
        <div
          className={`
        relative flex-shrink-0
        w-5 h-5
        rounded-full
        border-2
        ${
          error
            ? 'border-[var(--sys-color-solidarityRed-base)]'
            : checked
              ? 'border-[var(--sys-color-inkGold-base)]'
              : 'border-[var(--sys-color-worker-ash-base)]'
        }
        ${!disabled && !checked ? 'hover:border-[var(--sys-color-worker-ash-base)]' : ''}
        transition-all duration-standard var(--ease-viscous-breeze)
        ${className}
      `}
        >
          {/* Inner Dot */}
          {checked && (
            <div
              className={`
            absolute inset-0 flex items-center justify-center
          `}
            >
              <div
                className={`
              w-2.5 h-2.5
             rounded-full
              ${error ? 'bg-[var(--sys-color-solidarityRed-base)]' : 'bg-[var(--sys-color-inkGold-base)]'}
              scale-100
            `}
              />
            </div>
          )}
        </div>

        {/* Label */}
        {label && (
          <span
            className={`
          text-sm font-field-note font-medium
          ${error ? 'text-[var(--sys-color-solidarityRed-base)]' : 'text-[var(--sys-color-worker-ash-steps-6)]'}
          select-none
        `}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

MarkRadio.displayName = 'MarkRadio';

// Legacy M3 exports for backward compatibility
export { Mark as M3Checkbox, MarkRadio as M3Radio };
export type { MarkProps as M3CheckboxProps, MarkRadioProps as M3RadioProps };