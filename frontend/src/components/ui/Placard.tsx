import React from 'react';
import { cn } from '../../lib/utils';

export interface PlacardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Elevation level.
   * - flat: No shadow, border only
   * - raised: Standard shadow (default)
   * - floating: Deep shadow for modals/detached surfaces
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
 * **THE PLACARD**
 *
 * Archetype: Placard — Content container and framing. Solidarity structure.
 * Shape palette: `shape.slab01` (base) → `shape.block02` (active/selected)
 * Motion coupling: `dragSettle` (800ms, viscous-breeze)
 *
 * KR Shape Token: `--sys-shape-slab01` (organic % radii: `48% 52% 58% 42% / 55% 45% 60% 40%`)
 * A placard is held up in defiance. It contains a truth. It frames a demand.
 *
 * @example
 * <Placard elevation="raised" header={<h2>THE AUDIT</h2>}>
 *   {content}
 * </Placard>
 */
export const Placard = React.forwardRef<HTMLDivElement, PlacardProps>(
  ({ className, elevation = 'raised', header, footer, children, ...props }, ref) => {
    const elevationShadows = {
      flat: 'none',
      raised: 'var(--sys-elevation2Stone)',
      floating: 'var(--sys-elevation4Float)',
    };

    return (
      <div
        ref={ref}
        data-archetype="placard"
        style={{
          backgroundColor: 'var(--sys-color-charcoalBackground-steps-2)',
          borderRadius: 'var(--shape-placardTorn01)', // shape.placardTorn01
          borderColor: 'var(--sys-color-concreteGrey-steps-2)',
          borderWidth: '1px',
          borderStyle: 'solid',
          boxShadow: elevationShadows[elevation],
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

Placard.displayName = 'Placard';
