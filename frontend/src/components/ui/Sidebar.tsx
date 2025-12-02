/**
 * ELECTRIC ALCHEMIST: SIDEBAR COMPONENT
 *
 * Sidebar navigation component using Electric Alchemist design system.
 * Replaces CSS modules with Tailwind classes.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
}

/**
 * Sidebar Component
 *
 * Sidebar navigation container.
 */
export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ open = true, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(
        'flex flex-col bg-surface-container border-r border-outline-variant',
        open ? 'w-64' : 'w-0 overflow-hidden',
        'transition-all duration-300',
        className
      )}
      initial={false}
      animate={{ width: open ? 256 : 0 }}
      {...props}
    />
  )
);

Sidebar.displayName = 'Sidebar';

/**
 * SidebarItem Component
 *
 * Individual sidebar navigation item.
 */
export const SidebarItem = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <motion.a
    ref={ref}
    className={cn(
      'flex items-center gap-3 px-4 py-3 text-human text-sm text-on-surface',
      'hover:bg-surface-container-high transition-colors rounded-[8px]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      className
    )}
    whileHover={{ scale: 0.98 }}
    whileTap={{ scale: 0.95 }}
    {...props}
  />
));

SidebarItem.displayName = 'SidebarItem';

