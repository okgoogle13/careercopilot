import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SolidarityCard, SolidarityCardProps } from './SolidarityCard';
import { ActionButton } from './ActionButton';

export interface OpportunityItemProps extends Omit<SolidarityCardProps, 'children'> {
  title: string;
  subtitle?: string;
  meta: string;
  onAction?: () => void;
  actionLabel?: string;
  priority?: boolean;
}

/**
 * OpportunityItem (Stone)
 * 
 * Specialized card for the tactical feed.
 * Features a "halo" indicator for priority items.
 * 
 * @mission Visual hierarchy, list stability, and clear CTA.
 */
export const OpportunityItem = React.forwardRef<HTMLDivElement, OpportunityItemProps>(
  ({ className, title, subtitle, meta, onAction, actionLabel = "View", priority = false, ...props }, ref) => {
    
    return (
      <SolidarityCard
        ref={ref}
        variant={priority ? 'active' : 'standard'}
        className={cn(
          "flex flex-col md:flex-row gap-6 md:items-center justify-between",
          "group transition-colors duration-300",
          className
        )}
        {...props}
      >
        {/* Priority Halo - TODO[asset]: Human replacement with halo disk PNG. */}
        {priority && (
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
            <div className="absolute top-[-20%] right-[-20%] w-24 h-24 bg-ink-gold/20 blur-xl rounded-full animate-pulse" />
          </div>
        )}

        <div className="flex-1 space-y-2 relative z-10">
          <div className="flex items-center gap-3">
             {priority && (
               <span className="flex h-2 w-2 rounded-full bg-solidarity-red shadow-[0_0_8px_rgba(241,71,20,0.8)]" aria-label="Priority Item" />
             )}
             <span className="font-annotation text-xs text-ink-gold tracking-widest uppercase">
               {meta}
             </span>
          </div>

          <h3 className="font-bloom text-xl text-paper-white group-hover:text-ink-gold transition-colors">
            {title}
          </h3>
          
          {subtitle && (
            <p className="font-field-note text-sm text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        {onAction && (
          <div className="relative z-10 flex-shrink-0">
             <ActionButton 
               label={actionLabel} 
               size="sm" 
               variant={priority ? 'primary' : 'secondary'} 
               onClick={(e) => {
                 e.stopPropagation();
                 onAction();
               }}
             />
          </div>
        )}
      </SolidarityCard>
    );
  }
);

OpportunityItem.displayName = 'OpportunityItem';
