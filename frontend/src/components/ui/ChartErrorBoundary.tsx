import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from './utils';

interface ChartErrorBoundaryProps {
  children: ReactNode;
  className?: string;
  onRetry?: () => void;
}

interface ChartErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ChartErrorBoundary extends Component<ChartErrorBoundaryProps, ChartErrorBoundaryState> {
  constructor(props: ChartErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ChartErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to error reporting service
    console.error('Chart rendering error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={cn('p-4 border border-red-200 bg-red-50 rounded-lg', this.props.className)}>
          <div className="space-y-2">
            <h4 className="font-medium text-red-800">Chart Error</h4>
            <p className="text-sm text-red-700">
              We couldn't display this chart. {this.state.error?.message || 'An unknown error occurred.'}
            </p>
            <button
              onClick={this.handleRetry}
              className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:underline"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
