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
export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({
  children,
  as = 'span',
  className = '',
}) => {
  const Component = as as keyof React.JSX.IntrinsicElements; // Type assertion for dynamic component

  return (
    <Component
      className={`sr-only absolute -left-10000px top-auto w-1 h-1 overflow-hidden ${className}`}
      style={{
        position: 'absolute',
        left: '-10000px',
        top: 'auto',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      {children}
    </Component>
  );
};

/**
 * Component for announcing dynamic content changes to screen readers
 * Uses aria-live to announce changes without interrupting user flow
 */
interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  className?: string;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  politeness = 'polite',
  atomic = false,
  className = '',
}) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      className={`sr-only ${className}`}
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

export default ScreenReaderOnly;
