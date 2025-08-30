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

