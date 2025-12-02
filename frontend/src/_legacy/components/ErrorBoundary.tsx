import { Warning, Refresh, Home } from '@mui/icons-material';
import { Box } from '@mui/material';
import type { ErrorInfo, ReactNode } from 'react';
import React, { Component } from 'react';

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
        <div sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 4
    }}>
          <div sx={{
      maxWidth: "md",
      width: "100%",
      bgcolor: "common.white",
      borderRadius: 'var(--sys-shape-radius-md)',
      boxShadow: 4,
      p: 8,
      textAlign: "center"
    }}>
            <div sx={{
      mb: 6
    }}>
              <Warning sx={{
      color: "red.500",
      mb: 4
    }} />
              <h1 sx={{
      typography: "h4",
      fontWeight: 700,
      mb: 2
    }}>Oops! Something went wrong</h1>
              <p sx={{
      color: "gray.600"
    }}>
                We're sorry, but something unexpected happened. Our team has been notified.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details sx={{
      mb: 6,
      textAlign: "left"
    }}>
                <summary sx={{
      cursor: "pointer",
      typography: "body1",
      fontWeight: 500,
      color: "gray.700",
      mb: 2
    }}>
                  Error Details (Development Only)
                </summary>
                <div sx={{
      bgcolor: "red.50",
      border: 1,
      borderColor: "red.200",
      borderRadius: 'var(--sys-shape-radius-sm)',
      p: 3,
      typography: "body2"
    }}>
                  <p sx={{
      fontWeight: 500,
      mb: 1
    }}>
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                  <pre sx={{
      color: "red.700",
      whiteSpace: "pre-wrap",
      overflow: "auto",}}>
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <pre sx={{
      color: "red.700",
      whiteSpace: "pre-wrap",
      overflow: "auto",
      mt: 2
    }}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div sx={{
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.up('xs')]: { flexDirection: "row" },
      gap: 3
    }}>
              <button
                onClick={this.handleRefresh}
                sx={{
      flex: 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      px: 4,
      py: 2,
      border: 1,
      borderColor: "transparent",
      typography: "body1",
      fontWeight: 500,
      borderRadius: '0.375rem',
      color: "common.white",
      '&:hover': {},
      '&:focus': { outline: 'none' },
      '&:focus': { outline: 'none', boxShadow: '0 0 0 2px currentColor' },}}
              >
                <Refresh sx={{
      mr: 2
    }} />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                sx={{
      flex: 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      px: 4,
      py: 2,
      border: 1,
      borderColor: "gray.300",
      typography: "body1",
      fontWeight: 500,
      borderRadius: '0.375rem',
      color: "gray.700",
      bgcolor: "common.white",
      '&:hover': { bgcolor: "gray.50" },
      '&:focus': { outline: 'none' },
      '&:focus': { outline: 'none', boxShadow: '0 0 0 2px currentColor' },}}
              >
                <Home sx={{
      mr: 2
    }} />
                Go Home
              </button>
            </div>

            <p sx={{
      mt: 4,
      typography: "body2",
      color: "gray.500"
    }}>
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
