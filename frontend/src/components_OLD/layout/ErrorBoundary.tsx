/**
 * ELECTRIC ALCHEMIST: ERROR BOUNDARY
 *
 * Error boundary component using Electric Alchemist design system.
 * Catches React errors and displays a user-friendly error UI.
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button, Card } from '@/components/electric';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Optional: Send error to monitoring service
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Example: Send to monitoring service
      // analytics.track('Error Boundary Triggered', {
      //   error: error.message,
      //   stack: error.stack,
      //   componentStack: errorInfo.componentStack,
      // });
    }
  }

  private handleRefresh = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
          <Card variant="default" className="max-w-md w-full p-8 text-center">
            <div className="mb-6">
              <AlertTriangle className="w-16 h-16 text-error mx-auto mb-4" />
              <h1 className="text-hero text-2xl font-bold mb-2 text-on-surface">
                Oops! Something went wrong
              </h1>
              <p className="text-human text-on-surface-variant">
                We're sorry, but something unexpected happened. Our team has been notified.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-data text-sm font-medium text-on-surface-variant mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="bg-error-container border border-error rounded-[8px] p-3 text-data text-xs">
                  <p className="font-medium mb-1 text-on-error">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                  <pre className="text-on-error whitespace-pre-wrap overflow-auto">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="text-on-error whitespace-pre-wrap overflow-auto mt-2">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="default" onClick={this.handleRefresh} className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button variant="outline" onClick={this.handleGoHome} className="flex-1">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>

            <p className="mt-4 text-data text-xs text-on-surface-variant">
              If this problem persists, please contact support.
            </p>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

