import React, { useEffect } from 'react';
import { X, ExternalLink, HelpCircle, AlertCircle, Info } from 'lucide-react';
import { Modal, Button } from '../ui';

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

interface HelpModalProps {
  content: HelpContent;
  options: HelpOptions;
  onDismiss: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  content,
  options: _options,
  onDismiss,
}) => {
  useEffect(() => {
    // Track help modal views for analytics
    const viewKey = `help_viewed_${content.id}`;
    const viewCount = parseInt(localStorage.getItem(viewKey) || '0');
    localStorage.setItem(viewKey, (viewCount + 1).toString());
  }, [content.id]);

  const getCategoryIcon = () => {
    switch (content.category) {
      case 'feature':
        return <HelpCircle className="w-5 h-5 text-blue-500" />;
      case 'troubleshooting':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'guide':
        return <Info className="w-5 h-5 text-green-500" />;
      default:
        return <HelpCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryColor = () => {
    switch (content.category) {
      case 'feature':
        return 'blue';
      case 'troubleshooting':
        return 'amber';
      case 'guide':
        return 'green';
      default:
        return 'gray';
    }
  };

  const formatDescription = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Handle bullet points
      if (line.startsWith('• ')) {
        return (
          <li key={index} className="ml-4">
            {line.substring(2)}
          </li>
        );
      }

      // Handle headers (lines ending with ':')
      if (line.endsWith(':') && line.length < 50) {
        return (
          <h4 key={index} className="font-semibold text-gray-900 mt-3 mb-1">
            {line}
          </h4>
        );
      }

      // Regular paragraphs
      if (line.trim()) {
        return (
          <p key={index} className="mb-2">
            {line}
          </p>
        );
      }

      // Empty lines
      return <div key={index} className="h-2" />;
    });
  };

  return (
    <Modal isOpen={true} onClose={onDismiss} size="md">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {getCategoryIcon()}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {content.title}
              </h2>
              {content.category && (
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 bg-${getCategoryColor()}-100 text-${getCategoryColor()}-800`}
                >
                  {content.category.charAt(0).toUpperCase() + content.category.slice(1)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close help"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="text-gray-700 leading-relaxed mb-6">
          <div className="prose prose-sm max-w-none">
            {formatDescription(content.description)}
          </div>
        </div>

        {/* Related Links */}
        {content.relatedLinks && content.relatedLinks.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Related Resources
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {content.relatedLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors p-2 rounded hover:bg-blue-50"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{link.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex gap-2">
            {content.actions?.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  action.action();
                  onDismiss();
                }}
              >
                {action.label}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onDismiss}>
              Got it
            </Button>
            <Button
              onClick={() => {
                // Mark as helpful for feedback
                const helpfulKey = `help_helpful_${content.id}`;
                localStorage.setItem(helpfulKey, 'true');
                onDismiss();
              }}
            >
              This was helpful
            </Button>
          </div>
        </div>

        {/* Footer hint */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">Esc</kbd> to close •
            You can disable help tooltips in Settings
          </p>
        </div>
      </div>
    </Modal>
  );
};
