import React, { forwardRef, useId, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { KrDarkSpring } from '@/design/tokens/motion-presets';

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
 * - Shape: Circular track and thumb (rounded-march)
 * - Motion: Spring physics cubic-bezier(0.34, 1.56, 0.64, 1)
 * - Typography: Work Sans (field-note font for labels)
 */
export const Valve = forwardRef<HTMLInputElement, ValveProps>(
  (
    {
      id,
      label,
      size = 'medium',
      color = 'primary',
      checked,
      defaultChecked,
      disabled = false,
      className = '',
      error = false,
      helperText,
      onChange,
      ...props
    },
    ref
  ) => {
    const reactId = useId();
    const inputId = id ?? `valve-${reactId}`;
    const helperId = helperText ? `${inputId}-helper-text` : undefined;
    const isControlled = checked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] = useState(Boolean(defaultChecked));
    const isChecked = isControlled ? Boolean(checked) : uncontrolledChecked;

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
    const checkedTrackColor = useMemo(() => {
      if (color === 'primary') {
        return 'bg-[var(--sys-color-signalGreen-base)]';
      }
      if (color === 'secondary') {
        return 'bg-[var(--sys-color-kr-activistSmokeGreen-base)]';
      }
      return 'bg-[var(--sys-color-inkGold-base)]';
    }, [color]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setUncontrolledChecked(event.target.checked);
      }
      onChange?.(event);
    };

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <label
          htmlFor={inputId}
          className={`
                inline-flex items-center gap-3
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            `}
        >
          <div className="relative">
            {/* Hidden Native Checkbox */}
            <input
              ref={ref}
              id={inputId}
              type="checkbox"
              role="switch"
              checked={isControlled ? checked : undefined}
              defaultChecked={!isControlled ? defaultChecked : undefined}
              disabled={disabled}
              className="sr-only peer"
              onChange={handleChange}
              aria-checked={isChecked}
              aria-invalid={error}
              aria-describedby={helperId}
              {...props}
            />

            {/* Track */}
            <div
              className={`
                        ${currentSize.track}
                        rounded-march
                        transition-all duration-[var(--duration-standard)] ease-[var(--ease-viscous-breeze)]
                        ${isChecked ? checkedTrackColor : 'bg-[var(--sys-color-concreteGrey-base)]'}
                        peer-focus:ring-2 peer-focus:ring-[var(--sys-color-inkGold-base)]/30
                        border border-white/10
                    `}
            />

            {/* Thumb */}
            <motion.div
              layout
              animate={{
                x: isChecked ? (size === 'small' ? 16 : 24) : 0,
                borderRadius: isChecked
                  ? 'var(--sys-shape-round-march)'
                  : 'var(--sys-shape-round-march)',
              }}
              whileTap={{
                borderRadius: 'var(--sys-shape-toggleSlide01)', // Kinetic "Stretch" morph on drag/tap
                scaleX: 1.2,
              }}
              transition={KrDarkSpring}
              className={`
                        absolute top-0.5 left-0.5
                        ${currentSize.thumb}
                        bg-[var(--sys-color-worker-ash-base)]
                        shadow-sm
                    `}
            />
          </div>

          {label && (
            <span className="text-sm font-primary font-medium text-[var(--sys-color-worker-ash-base)]">
              {label}
            </span>
          )}
        </label>

        {helperText && (
          <p
            id={helperId}
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
