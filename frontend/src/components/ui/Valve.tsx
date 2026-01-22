import React, { forwardRef } from 'react';

export interface ValveProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
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
 * M3Switch - Northcote Curio Toggle
 * 
 * An organic, viscous-motion toggle switch.
 */
export const Valve = forwardRef<HTMLInputElement, ValveProps>(({
    label,
    size = 'medium',
    color = 'primary',
    checked,
    disabled = false,
    className = '',
    error = false,
    helperText,
    ...props
}, ref) => {
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
            <label className={`
                inline-flex items-center gap-3
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            `}>
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
                    <div className={`
                        ${currentSize.track}
                        rounded-full
                        transition-all duration-300 var(--ease-viscous-breeze)
                        ${isChecked
                            ? `bg-[var(--ref-palette-${color}-40)]`
                            : 'bg-[var(--color-eucalypt-smoke-base)]'
                        }
                        peer-focus:ring-2 peer-focus:ring-[var(--color-wattle-gold)]/30
                        border border-white/10
                    `} />

                    {/* Thumb */}
                    <div className={`
                        absolute top-0.5 left-0.5
                        ${currentSize.thumb}
                        bg-[var(--color-parchment)]
                        rounded-full
                        shadow-sm
                        transition-all duration-300 var(--ease-viscous-breeze)
                        ${isChecked ? currentSize.translate : 'translate-x-0'}
                    `} />
                </div>

                {label && (
                    <span className="text-sm font-field-note font-medium text-[var(--color-parchment)]">
                        {label}
                    </span>
                )}
            </label>

            {helperText && (
                <p className={`text-xs px-1 ${error ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower-dark)]'}`}>
                    {helperText}
                </p>
            )}
        </div>
    );
});

Valve.displayName = 'Valve';
