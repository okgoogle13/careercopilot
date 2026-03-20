/* eslint-disable */
import React from 'react';

export const LightBulbIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
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
      d="M12 18v-5.25m0 0a6 6 0 1 0-6 6 6 6 0 0 0 6-6ZM15 18h.008v.008H15V18ZM18 18h.008v.008H18V18ZM6 18h.008v.008H6V18ZM9 18h.008v.008H9V18Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18c-3.313 0-6-2.687-6-6s2.687-6 6-6 6 2.687 6 6-2.687 6-6 6Zm0 0v2.25m0 0h2.25m-2.25 0H9.75M12 3v1.5m0 16.5V21m7.5-9h-1.5M4.5 12h-1.5m14.25-6.75-1.06 1.06M6.31 17.69l-1.06 1.06m12.72 0-1.06-1.06M6.31 6.31l-1.06-1.06"
    />
  </svg>
);
