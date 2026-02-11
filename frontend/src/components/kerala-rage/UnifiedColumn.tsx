import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface UnifiedColumnProps {
  title: string;
  count?: number;
  children?: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  tone?: 'neutral' | 'success'; 
  density?: 'cozy' | 'comfortable';
}

/**
 * UnifiedColumn (Stone)
 * 
 * A specialized "Stone" container for vertical content organization.
 * Used in Kanban boards, dashboards, and feeds.
 * 
 * Pattern Principles:
 * 1. Synchronous motion with SolidarityCard.
 * 2. Clear visual hierarchy for mission-level data.
 */
export const UnifiedColumn: React.FC<UnifiedColumnProps> = ({
  title,
  count,
  children,
  className,
  headerAction,
  tone = 'neutral',
  density = 'comfortable',
}) => {
  const shouldReduceMotion = useReducedMotion();

  const densityStyles = {
    cozy: 'p-3 space-y-3',
    comfortable: 'p-4 space-y-4',
  };

  const motionProps = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: {
          type: 'spring',
          stiffness: 320,
          damping: 26,
        },
      };

  return (
    <div
      className={cn(
        "flex flex-col h-full min-w-[320px] max-w-[400px] bg-asphalt-black/50 rounded-stone border border-white/5 shadow-viscous",
        tone === 'success' && "border-solidarity-green/20",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <h3 className="font-solidarity text-xl uppercase tracking-tighter text-paper-white/90">
            {title}
          </h3>
          {count !== undefined && (
            <span className="px-2 py-0.5 text-xs font-direct-action bg-white/10 rounded-pebble text-paper-white/60">
              {count}
            </span>
          )}
        </div>
        {headerAction && <div className="flex items-center">{headerAction}</div>}
      </div>

      {/* Content Area */}
      <motion.div 
        layout
        {...motionProps}
        className={cn("flex-1 overflow-y-auto custom-scrollbar", densityStyles[density])}
      >
        {children}
      </motion.div>
    </div>
  );
};
