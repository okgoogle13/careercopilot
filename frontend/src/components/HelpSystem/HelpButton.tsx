import React from 'react';
import { HelpCircle, Info, AlertCircle } from 'lucide-react';
import { useHelpContent } from './HelpProvider';
import { helpContent } from './HelpProvider';

interface HelpButtonProps {
  helpId: keyof typeof helpContent;
  variant?: 'icon' | 'text' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  children?: React.ReactNode;
}

export const HelpButton: React.FC<HelpButtonProps> = ({
  helpId,
  variant = 'icon',
  size = 'md',
  position,
  className = '',
  children,
}) => {
  const { showHelpFor } = useHelpContent();

  const content = helpContent[helpId];
  if (!content) {
    console.warn(`Help content not found for ID: ${helpId}`);
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showHelpFor(helpId, {
      position,
      anchor: e.currentTarget as HTMLElement,
    });
  };

  const getIcon = () => {
    switch (content.category) {
      case 'troubleshooting':
        return <AlertCircle className={`${getSizeClass()} text-amber-500`} />;
      case 'guide':
        return <Info className={`${getSizeClass()} text-green-500`} />;
      default:
        return <HelpCircle className={`${getSizeClass()} text-blue-500`} />;
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'lg':
        return 'w-5 h-5';
      default:
        return 'w-4 h-4';
    }
  };

  const getButtonClass = () => {
    const baseClass = 'inline-flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded';

    switch (variant) {
      case 'text':
        return `${baseClass} text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 hover:bg-blue-50 ${className}`;
      case 'minimal':
        return `${baseClass} text-gray-400 hover:text-gray-600 p-1 ${className}`;
      default:
        return `${baseClass} text-gray-500 hover:text-blue-600 p-1 ${className}`;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={getButtonClass()}
      title={`Get help: ${content.title}`}
      aria-label={`Show help for ${content.title}`}
      type="button"
    >
      {getIcon()}
      {children && <span className="text-sm">{children}</span>}
      {variant === 'text' && !children && (
        <span className="text-sm">Help</span>
      )}
    </button>
  );
};