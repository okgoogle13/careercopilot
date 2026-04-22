import React from 'react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Scaffold — KR Solidarity v6.0 Layout Primitive
//
// The canonical top-level layout shell. Every routed page must be wrapped in
// <Scaffold /> as its root container. No page may render without this wrapper.
//
// Token spec (Figma Dev Mode nodes: Home 1:10, Dashboard 1:166):
//   background   → --sys-color-charcoalBackground-steps-2
//   border-radius → 8px 2px 8px 2px  (literal; matches --sys-shape-scaffoldFrame01)
//   box-shadow   → --sys-shadow-elevation2Placard
//   min-height   → 100%
//   position     → relative
// ─────────────────────────────────────────────────────────────────────────────

export type ScaffoldProps = React.ComponentProps<'div'> & {
  /**
   * Optional data-testid for automated testing.
   * Defaults to "scaffold-root".
   */
  testId?: string;
};

export const Scaffold = ({
  children,
  className,
  testId = 'scaffold-root',
  style,
  ...props
}: ScaffoldProps) => {
  return (
    <div
      data-testid={testId}
      data-archetype="scaffold"
      className={cn('relative', className)}
      style={{
        backgroundColor: 'var(--sys-color-charcoalBackground-steps-2)',
        // Literal value — matches --sys-shape-scaffoldFrame01 exactly.
        // No new token created; using literal per spec.
        borderRadius: '8px 2px 8px 2px',
        boxShadow: 'var(--sys-shadow-elevation2Placard)',
        minHeight: '100%',
        position: 'relative',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Scaffold;
