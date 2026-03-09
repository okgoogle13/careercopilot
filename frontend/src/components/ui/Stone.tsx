/**
 * @deprecated Stone is deprecated as of KR Solidarity v6.0.
 * Use {@link Placard} from './Placard' instead. See docs/design/01_CANON.md §2.C
 * Will be removed in v7.0.
 */
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
 * @deprecated Use Placard instead.
 *
 * Stone (Placard Archetype — Legacy Name)
 *
 * Kerala Rage kr-solidarity structural container.
 * Replaced by Placard in v6.0. See docs/design/01_CANON.md §2.C
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
          borderRadius: 'var(--shape-megaphoneCut01)', // Megaphone archetype asymmetric
          borderColor: 'var(--sys-color-concreteGrey-steps-2)',
          borderWidth: '1px',
          borderStyle: 'solid',
          boxShadow: elevations[elevation],
        }}
        className={cn(
          'relative overflow-hidden transition-all duration-300 ease-viscous backdrop-blur-xl',
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
