/**
 * ELECTRIC ALCHEMIST: HEADER COMPONENT
 *
 * Header component using Electric Alchemist Design System v4.4.
 * Uses bg-surface-container and ElectricButton.
 */

import React from 'react';

import { cn } from '@/lib/utils';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(
          'bg-surface-container border-b border-outline-variant',
          'px-6 py-4 flex items-center justify-between',
          className
        )}
        {...props}
      >
        {children}
      </header>
    );
  }
);

Header.displayName = 'Header';

export default Header;

