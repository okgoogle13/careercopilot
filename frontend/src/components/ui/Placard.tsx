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
 * Shape palette: `var(--kr-archetypes-placard-shape-base)` (base)
 * Motion coupling: `dragSettle` (800ms, viscous-breeze)
 *
 * KR Token: `--kr-archetypes-placard-shape-base` (organic % radii: `48% 52% 58% 42% / 55% 45% 60% 40%`)
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
      raised: 'var(--kr-shadow-elevation2-placard)',
      floating: 'var(--kr-shadow-elevation4-float)',
    };

    return (
      <div
        ref={ref}
        data-archetype="placard"
        style={{
          backgroundColor: 'var(--kr-color-charcoal-background-steps-1)',
          borderRadius: 'var(--kr-archetypes-placard-shape-base)',
          borderColor: 'var(--kr-color-concrete-grey-usage)',
          borderWidth: '1px',
          borderStyle: 'solid',
          boxShadow: elevationShadows[elevation],
        }}
        className={cn(
          'relative overflow-hidden transition-all duration-medium1 ease-m3-expressive backdrop-blur-xl',
          className
        )}
        {...props}
      >
        {header && (
          <div
            style={{
              backgroundColor: 'var(--kr-color-charcoal-background-steps-2)',
              borderBottomColor: 'var(--kr-color-concrete-grey-steps-2)',
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
              backgroundColor: 'var(--kr-color-charcoal-background-steps-0)',
              borderTopColor: 'var(--kr-color-concrete-grey-steps-2)',
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
