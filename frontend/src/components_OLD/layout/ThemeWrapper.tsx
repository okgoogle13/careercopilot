/**
 * ELECTRIC ALCHEMIST: THEME WRAPPER COMPONENT
 *
 * Theme wrapper that ensures bg-surface class is applied globally.
 * Migrated to Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface ThemeWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('bg-surface min-h-screen', className)}>{children}</div>
  );
};

export default ThemeWrapper;

