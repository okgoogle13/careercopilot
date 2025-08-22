// Standardized error display component
import React from 'react';
import Button from './Button';

interface ErrorDisplayProps {
  error: string | null;
  variant?: 'inline' | 'banner' | 'card';
  showRetry?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  isRetrying?: boolean;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  variant = 'inline',
  showRetry = false,
  onRetry,
  onDismiss,
  isRetrying = false,
  className = '',
}) => {
  if (!error) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'banner':
        return 'rounded-none border-l-4 border-r-0 border-t-0 border-b-0 border-red-500 bg-red-50 px-4 py-3';
      case 'card':
        return 'rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm';
      default:
        return 'rounded-md border border-red-200 bg-red-50 p-3';
    }
  };

  return (
    <div className={`${getVariantStyles()} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2 flex-1">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{error}</p>

            {showRetry && onRetry && (
              <div className="mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRetry}
                  loading={isRetrying}
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
              className="ml-3 inline-flex rounded-md text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-50"
              aria-label="Dismiss error"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Specialized error displays for common scenarios

export const NetworkErrorDisplay: React.FC<
  Omit<ErrorDisplayProps, 'error'>
> = props => (
  <ErrorDisplay
    error="Network connection failed. Please check your internet connection and try again."
    showRetry={true}
    {...props}
  />
);

export const AuthErrorDisplay: React.FC<
  Omit<ErrorDisplayProps, 'error'>
> = props => (
  <ErrorDisplay
    error="Your session has expired. Please refresh the page to log in again."
    {...props}
  />
);

export const LoadingErrorDisplay: React.FC<{
  resourceName?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}> = ({ resourceName = 'data', onRetry, isRetrying }) => (
  <ErrorDisplay
    error={`Failed to load ${resourceName}. This might be a temporary issue.`}
    showRetry={!!onRetry}
    onRetry={onRetry}
    isRetrying={isRetrying}
    variant="card"
  />
);

export default ErrorDisplay;
