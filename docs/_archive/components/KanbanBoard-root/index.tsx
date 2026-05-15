import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface KanbanBoardProps {
  children?: React.ReactNode;
  className?: string;
  horizontalScroll?: boolean;
}

/**
 * KanbanBoard
 *
 * A top-level container for managing multiple UnifiedColumns.
 * Primarily used for mission tracking, job applications, and task management.
 *
 * Design:
 * - Fluid horizontal layout.
 * - Substrate-aware transparency.
 * - Smooth transition between viewports.
 */
export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  children,
  className,
  horizontalScroll = true,
}) => {
  return (
    <div
      className={cn(
        "flex h-full w-full gap-6 p-6",
        horizontalScroll ? "overflow-x-auto overflow-y-hidden" : "flex-wrap overflow-y-auto",
        "custom-scrollbar",
        className
      )}
    >
      {children}
    </div>
  );
};
