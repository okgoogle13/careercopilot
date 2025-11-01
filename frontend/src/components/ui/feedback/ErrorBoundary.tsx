import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Typography, SvgIcon } from '@mui/material';

export interface ErrorBoundaryProps {
  /**
   * Content to render when there's no error
   */
  children: ReactNode;
  /**
   * Custom fallback UI to render when an error occurs
   */
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
  /**
   * Callback when an error is caught
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /**
   * Whether to show the error message in development
   * @default true
   */
  showErrorInDev?: boolean;
  /**
   * Custom error message to display
   */
  errorMessage?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public static defaultProps: Partial<ErrorBoundaryProps> = {
    showErrorInDev: true,
    errorMessage: 'Something went wrong. Please try again later.',
  };

  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error info
    this.setState({ error, errorInfo });
    
    // Call the error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, showErrorInDev, errorMessage } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback && error && errorInfo) {
        return fallback(error, errorInfo);
      }

      // Default fallback UI
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 300,
            p: 4,
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'error.light',
          }}
        >
          <SvgIcon
            color="error"
            sx={{
              fontSize: 60,
              mb: 2,
            }}
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </SvgIcon>
          
          <Typography variant="h6" color="error" gutterBottom>
            {errorMessage}
          </Typography>
          
          {showErrorInDev && process.env.NODE_ENV === 'development' && error && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'background.default',
                borderRadius: 1,
                textAlign: 'left',
                maxWidth: '100%',
                overflow: 'auto',
                maxHeight: 200,
              }}
            >
              <Typography variant="caption" component="pre" color="error">
                {error.toString()}
                {errorInfo?.componentStack}
              </Typography>
            </Box>
          )}
          
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleReset}
            sx={{ mt: 3 }}
          >
            Try Again
          </Button>
        </Box>
      );
    }

    return children;
  }
}

// Higher-order component for function components
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  // Format for display in DevTools
  const name = Component.displayName || Component.name || 'Component';
  WrappedComponent.displayName = `withErrorBoundary(${name})`;
  
  return WrappedComponent;
};
