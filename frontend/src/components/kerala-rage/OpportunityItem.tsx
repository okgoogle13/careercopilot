import React from 'react';
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
 * OpportunityItem (Placard Archetype)
 *
 * Specialized card for the tactical feed implementing the Placard archetype.
 * Features a "halo" indicator for priority items.
 *
 * @mission Visual hierarchy, list stability, and clear CTA.
 */
export const OpportunityItem = React.forwardRef<HTMLDivElement, OpportunityItemProps>(
  (
    {
      className,
      title,
      subtitle,
      meta,
      onAction,
      actionLabel = 'View',
      priority = false,
      ...props
    },
    ref
  ) => {
    return (
      <SolidarityCard
        ref={ref}
        variant={priority ? 'active' : 'standard'}
        className={cn(
          'flex flex-col md:flex-row gap-6 md:items-center justify-between',
          'group transition-colors duration-300',
          className
        )}
        {...props}
      >
        {/* Priority Halo - TODO[asset]: Human replacement with halo disk PNG. */}
        {priority && (
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
            <div
              style={{
                borderRadius: 'var(--sys-shape-marchOrganic01)',
              }}
              className="absolute top-[-20%] right-[-20%] w-24 h-24 bg-ink-gold/20 blur-xl animate-pulse"
            />
          </div>
        )}

        <div className="flex-1 space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            {priority && (
              <span
                style={{
                  borderRadius: 'var(--sys-shape-marchOrganic01)',
                }}
                className="flex h-2 w-2 bg-[var(--sys-color-solidarityRed-base)] shadow-[var(--sys-shadow-glow-red)]"
                aria-label="Priority Item"
              />
            )}
            <span
              style={{
                fontFamily: 'var(--sys-type-fontFamilies-mono)',
              }}
              className="text-xs text-ink-gold tracking-widest uppercase"
            >
              {meta}
            </span>
          </div>

          <h3
            style={{
              fontFamily: 'var(--sys-type-fontFamilies-display)',
            }}
            className="text-xl text-paper-white group-hover:text-ink-gold transition-colors"
          >
            {title}
          </h3>

          {subtitle && (
            <p
              style={{
                fontFamily: 'var(--sys-type-fontFamilies-primary)',
              }}
              className="text-sm text-[var(--sys-color-concreteGrey-base)]"
            >
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
