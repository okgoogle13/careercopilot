
import React from 'react';
import { cn } from '../../lib/utils';

export interface StoneProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * The mode context for the card.
     * - KrDark: Warm glass, [DEPRECATED_STYLE] borders (KeralaRage)
     * - KrLight: Cool slate, technical borders (KrSolidarity)
     */
    mode?: 'KrDark' | 'KrLight';

    /**
     * Elevation level.
     * - Flat: No shadow, border only
     * - Raised: Standard Ink Pool shadow
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
 * **THE STONE**
 * 
 * The fundamental container unit.
 * Maps to 'Stone' (borderRadius) and 'KrScreenprint' (background/blur) tokens.
 */
export const Stone = React.forwardRef<HTMLDivElement, StoneProps>(
    ({ className, mode = 'KrDark', elevation = 'raised', header, footer, children, ...props }, ref) => {

        // Base structural classes
        const baseStyles = "relative overflow-hidden transition-all duration-medium ease-settle backdrop-blur-xl border border-white/5";

        // Mode-specific styles (The Skin)
        const modes = {
            KrDark: "bg-surface-container/80 rounded-stone dark:border-white/10",
            KrLight: "bg-surface-elevated/90 rounded-stone border-white/5 bg-grid-major", // Lab gets the grid texture
        };

        const elevations = {
            flat: "shadow-none",
            raised: "shadow-ink-rest hover:shadow-ink-hover",
            floating: "shadow-2xl hover:translate-y-0",
        };

        return (
            <div
                ref={ref}
                className={cn(baseStyles, modes[mode], elevations[elevation], className)}
                {...props}
            >
                {header && (
                    <div className="px-6 py-4 border-b border-white/5 bg-white/5">
                        {header}
                    </div>
                )}

                <div className="p-6">
                    {children}
                </div>

                {footer && (
                    <div className="px-6 py-4 border-t border-white/5 bg-black/20">
                        {footer}
                    </div>
                )}
            </div>
        );
    }
);

Stone.displayName = "Stone";