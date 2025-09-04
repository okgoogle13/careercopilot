// Skip link component for keyboard navigation accessibility
import React from 'react';
import { cn } from '../../lib/utils';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({ href, children, className }) => {
  return (
    <a
      href={href}
      className={cn(
        // Hidden by default, visible on focus
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
        // Styling using design system tokens
        'bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium',
        // Focus and interaction styles
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
        // Layout and animation
        'z-50 transition-all duration-200',
        'hover:bg-primary/90',
        className
      )}
    >
      {children}
    </a>
  );
};

export default SkipLink;
