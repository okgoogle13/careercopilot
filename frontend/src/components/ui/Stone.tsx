
import React from 'react';
import { cn } from '../../lib/utils';

export interface StoneProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
<<<<<<< HEAD
     * The mode context for the card.
     * - Gallery: Warm glass, organic borders (Northcote)
     * - Laboratory: Cool slate, technical borders (Curio)
     */
    mode?: 'gallery' | 'laboratory';

    /**
     * Elevation level.
     * - Flat: No shadow, border only
     * - Raised: Standard Ink Pool shadow
=======
     * Elevation level.
     * - Flat: No shadow, border only
     * - Raised: Standard shadow
>>>>>>> restoration-KR-Rage-Figma-v2.0
     * - Floating: Deep shadow for modals/popovers
     */
    elevation?: 'flat' | 'raised' | 'floating';

    /**
     * Optional header content.
     */
    header?: React.ReactNode;

    /**
     * Optional footer content.
     */
    footer?: React.ReactNode;
}

/**
<<<<<<< HEAD
 * **THE STONE**
 * 
 * The fundamental container unit.
 * Maps to 'Stone' (borderRadius) and 'Glassmorphism' (background/blur) tokens.
 */
export const Stone = React.forwardRef<HTMLDivElement, StoneProps>(
    ({ className, mode = 'gallery', elevation = 'raised', header, footer, children, ...props }, ref) => {

        // Base structural classes
        const baseStyles = "relative overflow-hidden transition-all duration-medium ease-settle backdrop-blur-xl border border-white/5";

        // Mode-specific styles (The Skin)
        const modes = {
            gallery: "bg-surface-container/80 rounded-stone dark:border-white/10",
            laboratory: "bg-surface-elevated/90 rounded-stone border-white/5 bg-grid-major", // Lab gets the grid texture
        };

        const elevations = {
            flat: "shadow-none",
            raised: "shadow-ink-rest hover:shadow-ink-hover",
            floating: "shadow-2xl hover:translate-y-0",
=======
 * Stone (Stone Archetype)
 *
 * Kerala Rage kr-solidarity structural container component.
 * Fundamental divider/spacer/border primitive with semantic token support.
 *
 * Design Principles:
 * 1. Uses --sys-color-* semantic tokens (never hardcoded colors)
 * 2. Minimal border radius (Stone archetype is structural)
 * 3. Solidarity mode only (no mode-switching)
 * 4. Backdrop blur for glassmorphism effect
 * 5. Elevation variants with semantic shadows
 */
export const Stone = React.forwardRef<HTMLDivElement, StoneProps>(
    ({ className, elevation = 'raised', header, footer, children, ...props }, ref) => {

        const elevations = {
            flat: 'shadow-none',
            raised: '0 4px 16px rgba(0, 0, 0, 0.25)',
            floating: '0 12px 32px rgba(0, 0, 0, 0.35)',
>>>>>>> restoration-KR-Rage-Figma-v2.0
        };

        return (
            <div
                ref={ref}
<<<<<<< HEAD
                className={cn(baseStyles, modes[mode], elevations[elevation], className)}
                {...props}
            >
                {header && (
                    <div className="px-6 py-4 border-b border-white/5 bg-white/5">
=======
                style={{
                    backgroundColor: 'var(--sys-color-charcoalBackground-steps-2)',
                    borderRadius: '16px 4px 12px 24px', // Stone archetype asymmetric
                    borderColor: 'var(--sys-color-concreteGrey-steps-2)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    boxShadow: elevations[elevation],
                }}
                className={cn(
                    'relative overflow-hidden transition-all duration-300 backdrop-blur-xl',
                    className
                )}
                {...props}
            >
                {header && (
                    <div
                        style={{
                            backgroundColor: 'var(--sys-color-charcoalBackground-steps-1)',
                            borderBottomColor: 'var(--sys-color-concreteGrey-steps-1)',
                        }}
                        className="px-6 py-4 border-b"
                    >
>>>>>>> restoration-KR-Rage-Figma-v2.0
                        {header}
                    </div>
                )}

                <div className="p-6">
                    {children}
                </div>

                {footer && (
<<<<<<< HEAD
                    <div className="px-6 py-4 border-t border-white/5 bg-black/20">
=======
                    <div
                        style={{
                            backgroundColor: 'var(--sys-color-charcoalBackground-steps-0)',
                            borderTopColor: 'var(--sys-color-concreteGrey-steps-1)',
                        }}
                        className="px-6 py-4 border-t"
                    >
>>>>>>> restoration-KR-Rage-Figma-v2.0
                        {footer}
                    </div>
                )}
            </div>
        );
    }
);

<<<<<<< HEAD
Stone.displayName = "Stone";
=======
Stone.displayName = "Stone";
>>>>>>> restoration-KR-Rage-Figma-v2.0
