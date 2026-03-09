import React, { forwardRef } from 'react';

export interface ValveProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  /** Label for the switch */
  label?: string;
  /** Size variant */
  size?: 'small' | 'medium';
  /** Color variant */
  color?: 'primary' | 'secondary' | 'tertiary';
  /** Error state */
  error?: boolean;
  /** Helper text */
  helperText?: string;
}

/**
 * Valve - Kerala Rage kr-solidarity Toggle Switch
 *
 * A toggle switch using Kerala Rage kr-solidarity semantic tokens with spring physics motion.
 * Features smooth transitions with viscous-breeze easing and semantic color theming.
 * Archetype: Stone (structural toggle control)
 *
 * **Kerala Rage Design Token Usage:**
 * - Colors: Kerala Rage kr-solidarity semantic palette (signalGreen, kr-activistSmokeGreen, inkGold, concreteGrey, worker-ash)
 * - Shape: Circular track and thumb (rounded-sentry)
 * - Motion: Spring physics cubic-bezier(0.34, 1.56, 0.64, 1)
 * - Typography: Work Sans (field-note font for labels)
 */
export const Valve = forwardRef<HTMLInputElement, ValveProps>(
  (
    {
      label,
      size = 'medium',
      color = 'primary',
      checked,
      disabled = false,
      className = '',
      error = false,
      helperText,
      ...props
    },
    ref
  ) => {
    const isChecked = checked;

    // Size mapping
    const sizes = {
      small: {
        track: 'w-8 h-4',
        thumb: 'w-3 h-3',
        translate: 'translate-x-4',
      },
      medium: {
        track: 'w-12 h-6',
        thumb: 'w-5 h-5',
        translate: 'translate-x-6',
      },
    };

    const currentSize = sizes[size];

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <label
          className={`
                inline-flex items-center gap-3
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            `}
        >
          <div className="relative">
            {/* Hidden Native Checkbox */}
            <input
              ref={ref}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              className="sr-only peer"
              {...props}
            />

            {/* Track */}
            <div
              className={`
                        ${currentSize.track}
                        rounded-sentry
                        transition-all duration-300 var(--ease-viscous-breeze)
                        ${
                          isChecked
                            ? color === 'primary'
                              ? 'bg-[var(--sys-color-signalGreen-base)]'
                              : color === 'secondary'
                                ? 'bg-[var(--sys-color-kr-activistSmokeGreen-base)]'
                                : 'bg-[var(--sys-color-inkGold-base)]'
                            : 'bg-[var(--sys-color-concreteGrey-base)]'
                        }
                        peer-focus:ring-2 peer-focus:ring-[var(--sys-color-inkGold-base)]/30
                        border border-white/10
                    `}
            />

            {/* Thumb */}
            <div
              className={`
                        absolute top-0.5 left-0.5
                        ${currentSize.thumb}
                        bg-[var(--sys-color-worker-ash-base)]
                        rounded-sentry
                        shadow-sm
                        transition-all duration-300 var(--ease-viscous-breeze)
                        ${isChecked ? currentSize.translate : 'translate-x-0'}
                    `}
            />
          </div>

          {label && (
            <span className="text-sm font-field-note font-medium text-[var(--sys-color-worker-ash-base)]">
              {label}
            </span>
          )}
        </label>

        {helperText && (
          <p
            className={`text-xs px-1 ${error ? 'text-[var(--sys-color-solidarityRed-base)]' : 'text-[var(--sys-color-concreteGrey-steps-4)]'}`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Valve.displayName = 'Valve';
