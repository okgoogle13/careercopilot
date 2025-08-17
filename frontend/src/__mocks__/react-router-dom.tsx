// src/__mocks__/react-router-dom.tsx
import React from 'react';

// Mock NavLink component
const NavLink = ({
  children,
  to,
  className,
  style,
  ...rest
}: {
  children: React.ReactNode;
  to: string;
  className?: string;
  style?: any;
  [key: string]: any;
}) => {
  // Simplified version that doesn't depend on router context
  return (
    <a href={to} className={className} {...rest}>
      {children}
    </a>
  );
};

// Export the mocked components
export { NavLink };

// Re-export BrowserRouter for compatibility
export const BrowserRouter = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);
