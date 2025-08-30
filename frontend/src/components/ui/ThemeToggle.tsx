import React from 'react';
import { Button } from './Button';
import { useTheme } from '../../contexts';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };

  const getIcon = () => {
    if (theme === 'system') {
      return resolvedTheme === 'dark' ? '🌙' : '☀️';
    }
    return theme === 'light' ? '🌙' : '☀️';
  };

  const getLabel = () => {
    if (theme === 'system') {
      return `Switch from system (${resolvedTheme}) theme`;
    }
    return `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`;
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-10 h-10 p-0 hover-lift animate-fade-in"
      aria-label={getLabel()}
    >
      <span className="text-lg transition-transform duration-200 hover:scale-110">
        {getIcon()}
      </span>
    </Button>
  );
};

export default ThemeToggle;
