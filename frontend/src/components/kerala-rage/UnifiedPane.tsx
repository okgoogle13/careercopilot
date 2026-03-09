import React from 'react';
import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface UnifiedPaneProps extends HTMLMotionProps<'section'> {
  title?: string;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * UnifiedPane (Stone)
 *
 * Major layout primitive for the Tactical Interface (Wave 2).
 * Splits content into a "Stone" container with localized scrolling.
 *
 * @mission Structural integrity, consistent radius, and layout stability.
 */
export const UnifiedPane = React.forwardRef<HTMLElement, UnifiedPaneProps>(
  ({ className, title, sidebar, children, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();

    const motionProps = shouldReduceMotion
      ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
        };

    return (
      <motion.section
        ref={ref}
        className={cn('flex flex-col md:flex-row gap-6 w-full h-full min-h-[500px]', className)}
        {...motionProps}
        {...props}
      >
        {/* Optional Sidebar */}
        {sidebar && (
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-asphalt-black/50 border border-white/5 rounded-megaphone p-4 h-full">
              {sidebar}
            </div>
          </aside>
        )}

        {/* Main Content Pane */}
        <div
          className={cn(
            'flex-1 relative overflow-hidden',
            'bg-asphalt-black border border-white/5 rounded-megaphone shadow-viscous',
            'flex flex-col'
          )}
        >
          {/* Header */}
          {title && (
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h2 className="font-display text-2xl text-ink-gold tracking-wide">{title}</h2>
              {/* TODO[asset]: Human to add optional texture embellishment here. */}
            </div>
          )}

          {/* Scrollable Content Area */}
          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">{children}</div>
        </div>
      </motion.section>
    );
  }
);

UnifiedPane.displayName = 'UnifiedPane';
