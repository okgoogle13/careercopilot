// Skip link component for keyboard navigation accessibility
import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({ 
  href, 
  children, 
  className = '' 
}) => {
  return (
    <a
      href={href}
      className={`
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
        bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        z-50 transition-all duration-200
        ${className}
      `}
    >
      {children}
    </a>
  );
};

export default SkipLink;