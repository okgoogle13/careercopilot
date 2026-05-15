import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UnifiedColumnProps {
  title: string;
  count?: number;
  children?: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

/**
 * UnifiedColumn
 *
 * A "Stone" category container for vertical content organization.
 * Used in Kanban boards, dashboards, and feeds.
 *
 * Features:
 * - Viscous shadow depth.
 * - Subtle border definition.
 * - Semantic header.
 */
export const UnifiedColumn: React.FC<UnifiedColumnProps> = ({
  title,
  count,
  children,
  className,
  headerAction,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col h-full min-w-[320px] max-w-[400px] bg-charcoal-void/50 rounded-stone border border-white/5 shadow-viscous",
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {children}
      </div>

      {/* Footer / Fade effect (Optional) */}
      <div className="h-4 bg-gradient-to-t from-charcoal-void/80 to-transparent pointer-events-none sticky bottom-0" />
    </div>
  );
};
