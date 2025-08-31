import React from 'react';

// Theme toggle is now disabled - dark theme is universal across all pages
const ThemeToggle: React.FC = () => {
  return (
    <div className="flex items-center text-xs text-muted-foreground px-3 py-2">
      <span className="text-lg mr-1" role="img" aria-hidden="true">🌙</span>
      Dark Mode
    </div>
  );
};

export default ThemeToggle;