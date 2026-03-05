import React from 'react';
import { cn } from '../../lib/utils';

export interface StoneProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Elevation level.
   * - Flat: No shadow, border only
   * - Raised: Standard shadow
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
    };

    return (
      <div
        ref={ref}
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
            {header}
          </div>
        )}

        <div className="p-6">{children}</div>

        {footer && (
          <div
            style={{
              backgroundColor: 'var(--sys-color-charcoalBackground-steps-0)',
              borderTopColor: 'var(--sys-color-concreteGrey-steps-1)',
            }}
            className="px-6 py-4 border-t"
          >
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Stone.displayName = 'Stone';
