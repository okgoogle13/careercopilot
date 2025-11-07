import React, { forwardRef } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | string;
  onRetry?: () => void;
  onGoHome?: () => void;
  showDetails?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      title = 'Something Went Wrong',
      message = 'We encountered an error while processing your request. Please try again.',
      error,
      onRetry,
      onGoHome,
      showDetails = false,
      className = '',
      children,
    },
    ref
  ) => {
    const errorMessage = typeof error === 'string' ? error : error?.message;
    const errorStack = typeof error === 'object' ? error?.stack : undefined;

    return (
      <div
        ref={ref}
        className={`
          flex flex-col items-center justify-center
          text-center p-12
          ${className}
        `}
      >
        {/* Error Icon */}
        <div
          className={`
          p-6 rounded-full mb-6
          bg-red-500/20
          border-2 border-red-500/30
        `}
        >
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>

        {/* Title */}
        <h3 className="text-xl text-[var(--on-surface)] mb-2">{title}</h3>

        {/* Message */}
        <p className="text-[var(--on-surface-variant)] max-w-md mb-4">{message}</p>

        {/* Error Details */}
        {showDetails && errorMessage && (
          <div
            className={`
            max-w-2xl w-full mb-6 p-4 rounded-[var(--radius-lg)]
            bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
            border-2 border-red-500/30
            text-left
          `}
          >
            <p className="text-sm text-[var(--color-error)] mb-2">Error Details:</p>
            <p className="text-sm text-[var(--on-surface-variant)] font-mono">{errorMessage}</p>
            {errorStack && (
              <details className="mt-2">
                <summary className="text-sm text-[var(--on-surface-variant)] cursor-pointer hover:text-[var(--on-surface)]">
                  Stack Trace
                </summary>
                <pre className="text-xs text-[var(--on-surface-variant)] mt-2 overflow-auto max-h-48 p-2 bg-black/20 rounded">
                  {errorStack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Custom Content */}
        {children}

        {/* Actions */}
        {(onRetry || onGoHome) && (
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
            {onRetry && (
              <button
                onClick={onRetry}
                className="
                  px-6 py-3 rounded-[var(--radius-lg)]
                  bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)]
                  text-white border-2 border-transparent
                  transition-all duration-300
                  hover:shadow-[var(--shadow-glow-aurora)] hover:-translate-y-0.5
                  flex items-center gap-2
                "
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            )}

            {onGoHome && (
              <button
                onClick={onGoHome}
                className="
                  px-6 py-3 rounded-[var(--radius-lg)]
                  bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
                  border-2 border-[var(--glass-border)]
                  text-[var(--on-surface)]
                  transition-all duration-300
                  hover:border-[var(--glass-border-hover)] hover:shadow-[var(--shadow-glow-aurora)] hover:-translate-y-0.5
                  flex items-center gap-2
                "
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

ErrorState.displayName = 'ErrorState';
