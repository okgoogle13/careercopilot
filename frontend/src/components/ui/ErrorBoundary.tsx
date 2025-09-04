import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AppError } from '../../types/errors';
import { errorHandler } from '../../utils/errorHandler';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: AppError) => void;
  componentName?: string;
  showActionableSuggestions?: boolean;
}

interface State {
  hasError: boolean;
  appError?: AppError;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError = errorHandler.handleError(error, {
      component: this.props.componentName || 'ErrorBoundary',
      additionalData: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      }
    });

    this.setState({ appError });
    this.props.onError?.(appError);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, appError: undefined });
  };

  private handleAction = async (actionType: string, actionData?: unknown) => {
    switch (actionType) {
      case 'retry':
        this.handleRetry();
        break;
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
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { appError } = this.state;

      // Enhanced error UI with actionable suggestions
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 text-red-500">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Oops! Something went wrong
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {appError?.userMessage || "We encountered an unexpected error."}
              </p>
            </div>

            {/* Actionable Suggestions */}
            {appError && this.props.showActionableSuggestions !== false && (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">What you can do:</h3>
                <div className="space-y-3">
                  {appError.suggestions.slice(0, 3).map((suggestion) => (
                    <div key={suggestion.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-xs font-medium text-blue-600">
                          {suggestion.priority}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {suggestion.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {suggestion.description}
                        </p>
                        {suggestion.actionType !== 'dismiss' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => this.handleAction(suggestion.actionType, suggestion.actionData)}
                          >
                            {suggestion.title}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Development Error Details */}
            {import.meta.env.DEV && appError?.technicalDetails && (
              <details className="bg-red-50 p-4 rounded-lg border border-red-200">
                <summary className="cursor-pointer font-medium text-red-800 mb-2">
                  Technical Details (Development Only)
                </summary>
                <pre className="text-xs text-red-700 whitespace-pre-wrap overflow-auto max-h-40">
                  {appError.technicalDetails}
                </pre>
              </details>
            )}

            {/* Default Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleRetry} className="w-full sm:w-auto">
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto"
              >
                Reload Page
              </Button>
              <Button
                variant="ghost"
                onClick={() => (window.location.href = '/')}
                className="w-full sm:w-auto"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
