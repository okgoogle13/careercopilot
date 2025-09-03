import { AppError, ErrorType, ErrorSeverity, ActionableSuggestion, ErrorContext } from '../types/errors';
import { v4 as uuidv4 } from 'uuid';

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: ((error: AppError) => void)[] = [];
  private retryStrategies: Map<ErrorType, () => Promise<boolean>> = new Map();

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  createError(
    type: ErrorType,
    message: string,
    originalError?: Error,
    context?: Partial<ErrorContext>
  ): AppError {
    const id = uuidv4();
    const severity = this.determineSeverity(type, originalError);
    const userMessage = this.generateUserMessage(type, message);
    const suggestions = this.generateSuggestions(type, originalError);
    
    return {
      id,
      type,
      severity,
      message,
      userMessage,
      technicalDetails: originalError?.stack || originalError?.message,
      timestamp: new Date(),
      context: context ? {
        ...context,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        route: window.location.pathname
      } : undefined,
      suggestions,
      isRetryable: this.isRetryable(type),
      retryCount: 0,
      maxRetries: this.getMaxRetries(type),
      originalError,
      component: context?.component
    };
  }

  handleError(error: Error | AppError, context?: Partial<ErrorContext>): AppError {
    let appError: AppError;

    if (this.isAppError(error)) {
      appError = error;
    } else {
      const errorType = this.classifyError(error);
      appError = this.createError(errorType, error.message, error, context);
    }

    this.logError(appError);
    this.notifyListeners(appError);
    
    if (appError.severity === ErrorSeverity.CRITICAL) {
      this.handleCriticalError(appError);
    }

    return appError;
  }

  private classifyError(error: Error): ErrorType {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    // Network errors
    if (message.includes('network') || message.includes('fetch') || name.includes('networkerror')) {
      return ErrorType.NETWORK;
    }
    
    // Timeout errors
    if (message.includes('timeout') || name.includes('timeout')) {
      return ErrorType.TIMEOUT;
    }
    
    // Authentication errors
    if (message.includes('unauthorized') || message.includes('401')) {
      return ErrorType.AUTHENTICATION;
    }
    
    // Authorization errors
    if (message.includes('forbidden') || message.includes('403')) {
      return ErrorType.AUTHORIZATION;
    }
    
    // Validation errors
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorType.VALIDATION;
    }
    
    // Render errors
    if (name.includes('react') || message.includes('render')) {
      return ErrorType.RENDER;
    }
    
    // Storage errors
    if (message.includes('storage') || message.includes('quota')) {
      return ErrorType.STORAGE;
    }

    return ErrorType.UNKNOWN;
  }

  private determineSeverity(type: ErrorType, error?: Error): ErrorSeverity {
    switch (type) {
      case ErrorType.AUTHENTICATION:
      case ErrorType.AUTHORIZATION:
      case ErrorType.SYSTEM:
      case ErrorType.MEMORY:
        return ErrorSeverity.CRITICAL;
      
      case ErrorType.API_SERVER_ERROR:
      case ErrorType.EXTERNAL_SERVICE:
      case ErrorType.RENDER:
        return ErrorSeverity.HIGH;
      
      case ErrorType.NETWORK:
      case ErrorType.TIMEOUT:
      case ErrorType.RESOURCE_NOT_FOUND:
        return ErrorSeverity.MEDIUM;
      
      default:
        return ErrorSeverity.LOW;
    }
  }

  private generateUserMessage(type: ErrorType, message: string): string {
    switch (type) {
      case ErrorType.NETWORK:
        return "We're having trouble connecting to our servers. Please check your internet connection.";
      
      case ErrorType.AUTHENTICATION:
        return "Your session has expired. Please sign in again to continue.";
      
      case ErrorType.AUTHORIZATION:
        return "You don't have permission to access this resource. Please contact support if you believe this is an error.";
      
      case ErrorType.VALIDATION:
      case ErrorType.FORM_VALIDATION:
        return "Please check the information you've entered and try again.";
      
      case ErrorType.FILE_VALIDATION:
        return "The file you're trying to upload doesn't meet our requirements. Please try a different file.";
      
      case ErrorType.TIMEOUT:
        return "The request is taking longer than expected. Please try again.";
      
      case ErrorType.RESOURCE_NOT_FOUND:
        return "The requested resource could not be found. It may have been moved or deleted.";
      
      case ErrorType.QUOTA_EXCEEDED:
        return "You've reached your usage limit. Please upgrade your plan or try again later.";
      
      case ErrorType.AI_SERVICE:
        return "Our AI service is temporarily unavailable. Please try again in a moment.";
      
      case ErrorType.STORAGE:
        return "We're having trouble saving your data. Please ensure you have enough storage space.";
      
      case ErrorType.RENDER:
        return "There was a problem displaying this content. Please refresh the page.";
      
      default:
        return message || "An unexpected error occurred. Please try again or contact support if the problem persists.";
    }
  }

  private generateSuggestions(type: ErrorType, error?: Error): ActionableSuggestion[] {
    const suggestions: ActionableSuggestion[] = [];

    switch (type) {
      case ErrorType.NETWORK:
        suggestions.push(
          {
            id: 'check-connection',
            title: 'Check Internet Connection',
            description: 'Verify that your device is connected to the internet',
            actionType: 'custom',
            priority: 1
          },
          {
            id: 'retry-request',
            title: 'Try Again',
            description: 'Retry the failed request',
            actionType: 'retry',
            priority: 2
          },
          {
            id: 'refresh-page',
            title: 'Refresh Page',
            description: 'Reload the page to reset the connection',
            actionType: 'refresh',
            priority: 3
          }
        );
        break;

      case ErrorType.AUTHENTICATION:
        suggestions.push(
          {
            id: 'sign-in-again',
            title: 'Sign In',
            description: 'Sign in to your account again',
            actionType: 'navigate',
            actionData: { path: '/login' },
            priority: 1
          },
          {
            id: 'clear-cache',
            title: 'Clear Browser Cache',
            description: 'Clear your browser cache and cookies',
            actionType: 'custom',
            priority: 2
          }
        );
        break;

      case ErrorType.AUTHORIZATION:
        suggestions.push(
          {
            id: 'contact-support',
            title: 'Contact Support',
            description: 'Get help from our support team',
            actionType: 'contact',
            priority: 1
          },
          {
            id: 'check-permissions',
            title: 'Check Account Permissions',
            description: 'Verify your account has the necessary permissions',
            actionType: 'navigate',
            actionData: { path: '/profile' },
            priority: 2
          }
        );
        break;

      case ErrorType.VALIDATION:
      case ErrorType.FORM_VALIDATION:
        suggestions.push(
          {
            id: 'review-input',
            title: 'Review Your Input',
            description: 'Check all required fields are filled correctly',
            actionType: 'dismiss',
            priority: 1
          },
          {
            id: 'clear-form',
            title: 'Reset Form',
            description: 'Clear the form and start over',
            actionType: 'custom',
            priority: 2
          }
        );
        break;

      case ErrorType.FILE_VALIDATION:
        suggestions.push(
          {
            id: 'check-file-type',
            title: 'Check File Type',
            description: 'Ensure your file is in a supported format (PDF, DOC, DOCX)',
            actionType: 'dismiss',
            priority: 1
          },
          {
            id: 'check-file-size',
            title: 'Check File Size',
            description: 'Make sure your file is under the size limit (10MB)',
            actionType: 'dismiss',
            priority: 2
          },
          {
            id: 'try-different-file',
            title: 'Try Different File',
            description: 'Select a different file to upload',
            actionType: 'custom',
            priority: 3
          }
        );
        break;

      case ErrorType.TIMEOUT:
        suggestions.push(
          {
            id: 'retry-request',
            title: 'Try Again',
            description: 'Retry the request',
            actionType: 'retry',
            priority: 1
          },
          {
            id: 'check-connection',
            title: 'Check Connection Speed',
            description: 'Ensure you have a stable internet connection',
            actionType: 'custom',
            priority: 2
          }
        );
        break;

      case ErrorType.QUOTA_EXCEEDED:
        suggestions.push(
          {
            id: 'upgrade-plan',
            title: 'Upgrade Plan',
            description: 'Upgrade to a higher plan for more resources',
            actionType: 'navigate',
            actionData: { path: '/pricing' },
            priority: 1
          },
          {
            id: 'wait-and-retry',
            title: 'Wait and Try Again',
            description: 'Your quota may reset soon, try again later',
            actionType: 'custom',
            priority: 2
          }
        );
        break;

      case ErrorType.RENDER:
        suggestions.push(
          {
            id: 'refresh-page',
            title: 'Refresh Page',
            description: 'Reload the page to fix display issues',
            actionType: 'refresh',
            priority: 1
          },
          {
            id: 'clear-browser-cache',
            title: 'Clear Browser Cache',
            description: 'Clear your browser cache to fix rendering issues',
            actionType: 'custom',
            priority: 2
          }
        );
        break;

      default:
        suggestions.push(
          {
            id: 'try-again',
            title: 'Try Again',
            description: 'Retry the action',
            actionType: 'retry',
            priority: 1
          },
          {
            id: 'contact-support',
            title: 'Contact Support',
            description: 'Get help from our support team',
            actionType: 'contact',
            priority: 2
          }
        );
    }

    return suggestions.sort((a, b) => a.priority - b.priority);
  }

  private isRetryable(type: ErrorType): boolean {
    const retryableTypes = [
      ErrorType.NETWORK,
      ErrorType.TIMEOUT,
      ErrorType.API_SERVER_ERROR,
      ErrorType.EXTERNAL_SERVICE,
      ErrorType.AI_SERVICE
    ];
    return retryableTypes.includes(type);
  }

  private getMaxRetries(type: ErrorType): number {
    switch (type) {
      case ErrorType.NETWORK:
      case ErrorType.TIMEOUT:
        return 3;
      case ErrorType.API_SERVER_ERROR:
      case ErrorType.EXTERNAL_SERVICE:
        return 2;
      default:
        return 1;
    }
  }

  private isAppError(error: any): error is AppError {
    return error && typeof error === 'object' && 'type' in error && 'severity' in error;
  }

  private logError(error: AppError): void {
    const logData = {
      id: error.id,
      type: error.type,
      severity: error.severity,
      message: error.message,
      timestamp: error.timestamp,
      context: error.context,
      component: error.component,
      technicalDetails: error.technicalDetails
    };

    if (error.severity === ErrorSeverity.CRITICAL || error.severity === ErrorSeverity.HIGH) {
      console.error('App Error:', logData);
    } else {
      console.warn('App Error:', logData);
    }

    // In production, you would send this to your logging service
    // Example: this.sendToLoggingService(logData);
  }

  private handleCriticalError(error: AppError): void {
    // For critical errors, you might want to:
    // 1. Send immediate alert to monitoring system
    // 2. Show a modal to the user
    // 3. Potentially redirect to a safe page
    console.error('CRITICAL ERROR:', error);
  }

  private notifyListeners(error: AppError): void {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (err) {
        console.error('Error in error listener:', err);
      }
    });
  }

  addErrorListener(listener: (error: AppError) => void): () => void {
    this.errorListeners.push(listener);
    return () => {
      const index = this.errorListeners.indexOf(listener);
      if (index > -1) {
        this.errorListeners.splice(index, 1);
      }
    };
  }

  async retry(error: AppError): Promise<boolean> {
    if (!error.isRetryable || (error.retryCount ?? 0) >= (error.maxRetries ?? 1)) {
      return false;
    }

    error.retryCount = (error.retryCount ?? 0) + 1;
    
    const retryStrategy = this.retryStrategies.get(error.type);
    if (retryStrategy) {
      try {
        return await retryStrategy();
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        return false;
      }
    }

    return false;
  }

  setRetryStrategy(errorType: ErrorType, strategy: () => Promise<boolean>): void {
    this.retryStrategies.set(errorType, strategy);
  }
}

export const errorHandler = ErrorHandler.getInstance();