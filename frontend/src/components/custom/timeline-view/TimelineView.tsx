/**
 * ELECTRIC ALCHEMIST: TIMELINE VIEW COMPONENT
 *
 * Timeline component with design system tokens.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/electric';
import { cn } from '@/lib/utils';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  status?: 'completed' | 'pending' | 'in-progress';
  icon?: React.ReactNode;
}

export interface TimelineViewProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[];
  orientation?: 'vertical' | 'horizontal';
}

export const TimelineView = React.forwardRef<HTMLDivElement, TimelineViewProps>(
  ({ items, orientation = 'vertical', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative',
          orientation === 'vertical' ? 'flex flex-col' : 'flex flex-row',
          className
        )}
        {...props}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const statusConfig = {
            completed: {
              dot: 'bg-primary-container border-primary-container',
              line: 'bg-primary-container',
            },
            'in-progress': {
              dot: 'bg-secondary-container border-secondary-container',
              line: 'bg-secondary-container',
            },
            pending: {
              dot: 'bg-surface-container-low border-outline-variant',
              line: 'bg-outline-variant',
            },
          };
          const config = statusConfig[item.status || 'pending'];

          return (
            <React.Fragment key={item.id}>
              <div className={cn('flex', orientation === 'vertical' ? 'flex-row' : 'flex-col')}>
                {/* Timeline Dot */}
                <div className="relative flex flex-col items-center">
                  <motion.div
                    className={cn(
                      'flex items-center justify-center h-10 w-10 rounded-full border-2',
                      config.dot,
                      'z-10'
                    )}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.icon || (
                      <div className={cn('h-3 w-3 rounded-full', config.dot.split(' ')[0])} />
                    )}
                  </motion.div>
                  {!isLast && (
                    <div
                      className={cn(
                        'absolute',
                        orientation === 'vertical'
                          ? 'top-10 bottom-0 w-0.5'
                          : 'left-10 right-0 h-0.5',
                        config.line
                      )}
                    />
                  )}
                </div>

                {/* Content */}
                <div
                  className={cn(
                    'flex-1',
                    orientation === 'vertical' ? 'ml-4 mb-6' : 'mt-4 mr-6'
                  )}
                >
                  <Card className="p-4" variant="interactive">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-hero text-lg font-semibold text-on-surface">
                        {item.title}
                      </h3>
                      <span className="text-data text-xs text-on-surface-variant">{item.date}</span>
                    </div>
                    {item.description && (
                      <p className="text-human text-sm text-on-surface-variant">
                        {item.description}
                      </p>
                    )}
                  </Card>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);

TimelineView.displayName = 'TimelineView';

export default TimelineView;

