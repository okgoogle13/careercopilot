import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle as Warning, RefreshCw as Refresh, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Log error to monitoring service (e.g., Sentry, LogRocket)
    this.setState({
      error,
      errorInfo,
    });

    // Optional: Send error to analytics/monitoring service
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
    this.setState({ hasError: false, error: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-[var(--sys-color-charcoalBackground-base)] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[var(--sys-color-charcoalBackground-steps-2)] rounded-placard border border-[var(--sys-color-concreteGrey-base)]/20 shadow-elevation2Placard p-8 text-center ring-1 ring-[var(--sys-color-solidarityRed-base)]/10">
            <div className="mb-6">
              <Warning className="w-16 h-16 mx-auto text-[var(--sys-color-solidarityRed-base)] mb-4" />
              <h1 className="text-2xl font-bold text-[var(--sys-color-worker-ash-base)] mb-2 font-display">
                Oops! Something went wrong
              </h1>
              <p className="text-[var(--sys-color-worker-ash-steps-1)]">
                We&apos;re sorry, but something unexpected happened. Our team has been notified.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-[var(--sys-color-worker-ash-base)] mb-2 hover:text-[var(--sys-color-inkGold-base)] transition-colors">
                  Error Details (Development Only)
                </summary>
                <div className="bg-[var(--sys-color-kr-charcoalRed-steps-0)]/20 border border-[var(--sys-color-kr-charcoalRed-steps-0)]/30 rounded-march p-3 text-xs font-mono">
                  <p className="font-medium text-[var(--sys-color-kr-charcoalRed-base)] mb-1">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                  <pre className="text-[var(--sys-color-kr-charcoalRed-steps-3)] whitespace-pre-wrap overflow-auto max-h-32">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="text-[var(--sys-color-kr-charcoalRed-steps-3)] whitespace-pre-wrap overflow-auto max-h-32 mt-2">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={this.handleRefresh}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-bold rounded-strike text-[var(--sys-color-paperWhite-base)] bg-[var(--sys-color-solidarityRed-base)] hover:bg-[var(--sys-color-solidarityRed-steps-0)] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-elevation1Strike uppercase tracking-widest"
              >
                <Refresh className="w-4 h-4 mr-2" />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-bold rounded-march text-[var(--sys-color-charcoalBackground-base)] bg-[var(--sys-color-inkGold-base)] hover:bg-[var(--sys-color-inkGold-steps-2)] transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </button>
            </div>

            <p className="mt-6 text-[10px] text-[var(--sys-color-concreteGrey-base)] uppercase tracking-tighter">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
