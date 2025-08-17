// src/__mocks__/react-router-dom.tsx
import React from 'react';

// Mock NavLink component
interface NavLinkProps {
  children: React.ReactNode;
  to: string;
  className?: string;
  // Remove unused 'style'
  [key: string]: unknown;
}

const NavLink = ({ children, to, className, ...rest }: NavLinkProps): JSX.Element => {
  return (
    <a href={to} className={className} {...rest}>
      {children}
    </a>
  );
};

// Export the mocked components
export { NavLink };

// Re-export BrowserRouter for compatibility
export const BrowserRouter = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <div>{children}</div>
);
