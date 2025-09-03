import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink } from 'lucide-react';
import { Button } from '../ui';

interface HelpContent {
  id: string;
  title: string;
  description: string;
  type: 'tooltip' | 'modal' | 'inline';
  category?: 'feature' | 'troubleshooting' | 'guide';
  relatedLinks?: Array<{
    title: string;
    url: string;
  }>;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface HelpOptions {
  position?: 'top' | 'bottom' | 'left' | 'right';
  anchor?: HTMLElement;
  persistent?: boolean;
  showOnce?: boolean;
}

interface HelpTooltipProps {
  content: HelpContent;
  options: HelpOptions;
  onDismiss: () => void;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  options,
  onDismiss,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [tooltipPosition, setTooltipPosition] = useState(options.position || 'top');
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!options.anchor) return;

    const updatePosition = () => {
      const anchorRect = options.anchor!.getBoundingClientRect();
      const tooltipRect = tooltipRef.current?.getBoundingClientRect();
      
      if (!tooltipRect) return;

      let top = 0;
      let left = 0;
      let finalPosition = options.position || 'top';

      // Calculate initial position
      switch (options.position || 'top') {
        case 'top':
          top = anchorRect.top - tooltipRect.height - 8;
          left = anchorRect.left + (anchorRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = anchorRect.bottom + 8;
          left = anchorRect.left + (anchorRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = anchorRect.top + (anchorRect.height - tooltipRect.height) / 2;
          left = anchorRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = anchorRect.top + (anchorRect.height - tooltipRect.height) / 2;
          left = anchorRect.right + 8;
          break;
      }

      // Adjust if tooltip would go off-screen
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      if (left < 8) {
        left = 8;
        if (finalPosition === 'left') finalPosition = 'right';
      } else if (left + tooltipRect.width > viewport.width - 8) {
        left = viewport.width - tooltipRect.width - 8;
        if (finalPosition === 'right') finalPosition = 'left';
      }

      if (top < 8) {
        top = 8;
        if (finalPosition === 'top') finalPosition = 'bottom';
      } else if (top + tooltipRect.height > viewport.height - 8) {
        top = viewport.height - tooltipRect.height - 8;
        if (finalPosition === 'bottom') finalPosition = 'top';
      }

      setPosition({ top, left });
      setTooltipPosition(finalPosition);
    };

    // Initial positioning
    requestAnimationFrame(updatePosition);

    // Update on scroll and resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [options.anchor, options.position]);

  useEffect(() => {
    if (!options.persistent) {
      const timer = setTimeout(onDismiss, 8000); // Auto-dismiss after 8 seconds
      return () => clearTimeout(timer);
    }
  }, [options.persistent, onDismiss]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onDismiss]);

  const getArrowClasses = () => {
    const baseClasses = 'absolute w-3 h-3 transform rotate-45 bg-gray-900';
    
    switch (tooltipPosition) {
      case 'top':
        return `${baseClasses} -bottom-1.5 left-1/2 -translate-x-1/2`;
      case 'bottom':
        return `${baseClasses} -top-1.5 left-1/2 -translate-x-1/2`;
      case 'left':
        return `${baseClasses} -right-1.5 top-1/2 -translate-y-1/2`;
      case 'right':
        return `${baseClasses} -left-1.5 top-1/2 -translate-y-1/2`;
      default:
        return baseClasses;
    }
  };

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className="fixed z-50 max-w-sm bg-gray-900 text-white rounded-lg shadow-xl p-4 animate-fade-in"
      style={{ top: position.top, left: position.left }}
      role="tooltip"
      aria-labelledby="tooltip-title"
      aria-describedby="tooltip-description"
    >
      {/* Arrow */}
      <div className={getArrowClasses()} />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 id="tooltip-title" className="font-medium text-white pr-4">
          {content.title}
        </h3>
        {!options.persistent && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Dismiss help"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div id="tooltip-description" className="text-gray-200 text-sm leading-relaxed mb-3">
        {content.description.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < content.description.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>

      {/* Related Links */}
      {content.relatedLinks && content.relatedLinks.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-2">Related:</p>
          <div className="space-y-1">
            {content.relatedLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-3 h-3" />
                {link.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {content.actions && content.actions.length > 0 && (
        <div className="flex gap-2 pt-2 border-t border-gray-700">
          {content.actions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              variant="outline"
              onClick={() => {
                action.action();
                onDismiss();
              }}
              className="text-xs bg-transparent border-gray-600 text-gray-200 hover:bg-gray-800 hover:border-gray-500"
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* Category indicator */}
      {content.category && (
        <div className="absolute -top-2 -right-2">
          <div
            className={`w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold ${
              content.category === 'feature'
                ? 'bg-blue-500 text-white'
                : content.category === 'guide'
                ? 'bg-green-500 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {content.category === 'feature'
              ? '?'
              : content.category === 'guide'
              ? 'i'
              : '!'}
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(tooltipContent, document.body);
};