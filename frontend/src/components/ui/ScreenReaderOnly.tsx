// Screen reader only content component for accessibility
import React from 'react';

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}

/**
 * Component that renders content visible only to screen readers
 * Uses absolute positioning to hide content visually while keeping it accessible
 */
const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ 
  children, 
  as: Component = 'span',
  className = '' 
}) => {
  return (
    <Component 
      className={`
        sr-only absolute -m-px h-px w-px overflow-hidden 
        whitespace-nowrap border-0 p-0 
        ${className}
      `.trim()}
    >
      {children}
    </Component>
  );
};

export { ScreenReaderOnly };
