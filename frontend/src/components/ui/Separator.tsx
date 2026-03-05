import React from 'react';
import { cn } from '../../lib/utils';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The orientation of the separator.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Whether the separator is purely decorative.
   * If true, it is hidden from assistive technologies.
   * @default true
   */
  decorative?: boolean;

  /**
   * The mode context for the separator.
   * Aligning with 'Stone' and 'Pebble' naming.
   */
  mode?: 'KrDark' | 'KrLight';
}

/**
 * **THE SEPARATOR** (Stone Gap)
 *
 * A high-stasis structural division element.
 * Maps to the 'Stone' aesthetic with subtle transparency and [DEPRECATED_STYLE] ease.
 */
export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    { className, orientation = 'horizontal', decorative = true, mode = 'KrDark', ...props },
    ref
  ) => {
    // Base structural classes
    const baseStyles = 'shrink-0 transition-colors duration-medium ease-settle';

    // Orientation-specific sizing
    const orientationStyles = {
      horizontal: 'h-[1px] w-full',
      vertical: 'h-full w-[1px]',
    };

    // Mode-specific coloring (The Skin)
    // Using the same white/10 (dark) and black/10 (light) patterns from Stone/Pebble
    const modes = {
      KrDark: 'bg-white/10',
      KrLight: 'bg-black/10 shadow-sm',
    };

    return (
      <div
        ref={ref}
        role={decorative ? undefined : 'separator'}
        aria-orientation={decorative ? undefined : orientation}
        className={cn(baseStyles, orientationStyles[orientation], modes[mode], className)}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';
