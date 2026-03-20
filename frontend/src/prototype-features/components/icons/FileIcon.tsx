import React from 'react';

export const FileIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m9.15 12.926a3.375 3.375 0 0 1-3.375 3.375H8.25a3.375 3.375 0 0 1-3.375-3.375V5.625a3.375 3.375 0 0 1 3.375-3.375h4.5"
    />
  </svg>
);
