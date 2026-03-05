import React from 'react';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  children?: React.ReactNode;
  className?: string;
  horizontalScroll?: boolean;
}

/**
 * KanbanBoard
 *
 * A top-level container for managing multiple UnifiedColumns.
 *
 * @mission Wave 3 - Complex layout orchestration.
 */
export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  children,
  className,
  horizontalScroll = true,
}) => {
  return (
    <div
      className={cn(
        'flex h-full w-full gap-6 p-6 scroll-smooth',
        horizontalScroll ? 'overflow-x-auto overflow-y-hidden' : 'flex-wrap overflow-y-auto',
        'custom-scrollbar',
        className
      )}
    >
      {children}
    </div>
  );
};
