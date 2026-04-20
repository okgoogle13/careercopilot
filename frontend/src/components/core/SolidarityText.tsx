import React from 'react';
import { cn } from '../../lib/utils';

export interface SolidarityTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The structural role of this text block (Laboratory Theme).
   * - hero: Large proclamation display (Libre Bodoni)
   * - headline: Major section headers
   * - subhead: Card titles or secondary headers
   * - body: Standard readable content
   * - metric: Thin-weight data/stat display (Work Sans 200)
   */
  role?: 'hero' | 'headline' | 'subhead' | 'body' | 'metric';

  /**
   * The primary text content.
   */
  children: React.ReactNode;

  /**
   * Optional decorative label overlay (The Signal).
   */
  label?: string;

  /**
   * The semantic HTML tag to use.
   */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div' | 'code';
}

/**
 * **SOLIDARITY TEXT**
 *
 * The foundational structural unit for typography.
 * Refactored from 'Leaf' to comply with the selective flora/fauna canon.
 */
export const SolidarityText = React.forwardRef<HTMLDivElement, SolidarityTextProps>(
  ({ className, role = 'body', label, children, as, ...props }, ref) => {
    // Proclamation Logic (Hero)
    if (role === 'hero') {
      return (
        <div
          ref={ref}
          className={cn('Solidarity-proclamation relative py-4', className)}
          {...props}
        >
          {/* The Proclamation (Base) */}
          <h1 className="text-display-hero font-['Libre_Bodoni'] tracking-tight text-white mb-2 z-10 relative">
            {children}
          </h1>

          {/* The Signal (Overlay) */}
          {label && (
            <span className="Solidarity-signal absolute -top-2 -left-4 text-4xl md:text-6xl text-primary mix-blend-exclusion z-20">
              {label}
            </span>
          )}
        </div>
      );
    }

    // Determine default tag
    const Component = as || (role === 'headline' ? 'h2' : role === 'subhead' ? 'h3' : role === 'metric' ? 'code' : 'p');

    // Mapped Styles based on Laboratory scale
    const styles = {
      headline: 'text-headline text-3xl md:text-5xl text-text-primary mb-6 font-bold',
      subhead: 'text-subhead text-xl md:text-2xl text-text-primary mb-4 font-semibold',
      body: 'text-base md:text-lg text-text-secondary leading-relaxed max-w-prose',
      metric: "text-metric-display font-['Work_Sans'] font-thin tracking-widest text-primary/90 uppercase bg-surface-elevated/50 px-2 py-1 rounded-sm",
      hero: '', // Handled above
    };

    return (
      <Component
        ref={ref as any}
        className={cn(styles[role], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

SolidarityText.displayName = 'SolidarityText';
