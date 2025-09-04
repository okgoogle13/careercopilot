import React, { useState } from 'react';
import { Button } from './Button';
import { AppError } from '../../types/errors';
import { XCircle, AlertCircle, Info, ExternalLink } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | AppError | null;
  variant?: 'inline' | 'banner' | 'card' | 'toast';
  showRetry?: boolean;
  showSuggestions?: boolean;
  maxSuggestions?: number;
  onRetry?: () => void;
  onDismiss?: () => void;
  onAction?: (actionType: string, actionData?: unknown) => void;
  isRetrying?: boolean;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  variant = 'inline',
  showRetry = false,
  showSuggestions = true,
  maxSuggestions = 3,
  onRetry,
  onDismiss,
  onAction,
  isRetrying = false,
  className = '',
}) => {
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);

  if (!error) return null;

  const isAppError = (err: string | AppError): err is AppError => {
    return typeof err === 'object' && 'type' in err;
  };

  const appError = isAppError(error) ? error : null;
  const errorMessage = isAppError(error) ? error.userMessage : error;

  const getSeverityIcon = () => {
    if (!appError) return <XCircle className="h-5 w-5 text-red-400" />;

    switch (appError.severity) {
      case 'CRITICAL':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'HIGH':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'MEDIUM':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityStyles = () => {
    if (!appError) return 'border-red-200 bg-red-50';

    switch (appError.severity) {
      case 'CRITICAL':
        return 'border-red-300 bg-red-50';
      case 'HIGH':
        return 'border-orange-200 bg-orange-50';
      case 'MEDIUM':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getVariantStyles = () => {
    const severityStyles = getSeverityStyles();

    switch (variant) {
      case 'banner':
        return `rounded-none border-l-4 border-r-0 border-t-0 border-b-0 px-4 py-3 ${severityStyles}`;
      case 'card':
        return `rounded-lg border p-4 shadow-sm ${severityStyles}`;
      case 'toast':
        return `rounded-lg border p-3 shadow-lg ${severityStyles} max-w-md`;
      default:
        return `rounded-md border p-3 ${severityStyles}`;
    }
  };

  const handleAction = (actionType: string, actionData?: unknown) => {
    if (onAction) {
      onAction(actionType, actionData);
    } else {
      // Default action handlers
      switch (actionType) {
        case 'refresh':
          window.location.reload();
          break;
        case 'navigate':
          if (actionData?.path) {
            window.location.href = actionData.path;
          }
          break;
        case 'contact':
          window.open('mailto:support@careercopilot.com', '_blank');
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className={`${getVariantStyles()} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            {getSeverityIcon()}
          </div>

          <div className="flex-1 space-y-3">
            <p className={`text-sm font-medium ${
              appError?.severity === 'CRITICAL' ? 'text-red-800' :
              appError?.severity === 'HIGH' ? 'text-orange-800' :
              appError?.severity === 'MEDIUM' ? 'text-yellow-800' :
              'text-blue-800'
            }`}>
              {errorMessage}
            </p>

            {/* Actionable Suggestions */}
            {appError && showSuggestions && appError.suggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Suggested Actions:
                </h4>
                <div className="space-y-2">
                  {appError.suggestions.slice(0, maxSuggestions).map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="flex items-start justify-between p-2 rounded-md bg-white bg-opacity-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="flex-shrink-0 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border">
                            {suggestion.priority}
                          </span>
                          <button
                            className="text-sm font-medium text-left hover:underline focus:outline-none"
                            onClick={() => setExpandedSuggestion(
                              expandedSuggestion === suggestion.id ? null : suggestion.id
                            )}
                          >
                            {suggestion.title}
                          </button>
                          {suggestion.actionType === 'navigate' && (
                            <ExternalLink className="h-3 w-3 text-gray-400" />
                          )}
                        </div>

                        {expandedSuggestion === suggestion.id && (
                          <div className="mt-2 pl-7">
                            <p className="text-xs text-gray-600 mb-2">
                              {suggestion.description}
                            </p>
                            {suggestion.actionType !== 'dismiss' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAction(suggestion.actionType, suggestion.actionData)}
                                className="text-xs"
                              >
                                {suggestion.title}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>

                      {suggestion.actionType !== 'dismiss' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction(suggestion.actionType, suggestion.actionData)}
                          className="ml-2 text-xs"
                        >
                          {suggestion.actionType === 'retry' && isRetrying ? 'Retrying...' : 'Do it'}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Traditional retry button for non-AppError cases */}
            {!appError && showRetry && onRetry && (
              <div className="mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRetry}
                  className="text-red-700 hover:text-red-800 hover:bg-red-100 border-red-300 hover:border-red-400"
                >
                  {isRetrying ? 'Retrying...' : 'Try Again'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {onDismiss && (
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={onDismiss}
              className="ml-3 inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="Dismiss error"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};



export default ErrorDisplay;
