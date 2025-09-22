import type { ErrorInfo } from 'react';

export interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

export const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  error?: Error;
  errorInfo?: ErrorInfo;
  context?: Record<string, any>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLogEntry(entry: LogEntry): string {
    return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`;
  }

  private createLogEntry(
    level: string,
    message: string,
    error?: Error,
    errorInfo?: ErrorInfo,
    context?: Record<string, any>
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      error,
      errorInfo,
      context,
    };
  }

  /**
   * Log an error with optional React ErrorInfo and context
   */
  logError(
    message: string,
    error?: Error,
    errorInfo?: ErrorInfo,
    context?: Record<string, any>
  ): void {
    const logEntry = this.createLogEntry(LOG_LEVELS.ERROR, message, error, errorInfo, context);

    console.error(this.formatLogEntry(logEntry));

    if (error) {
      console.error('Error object:', error);
    }

    if (errorInfo?.componentStack) {
      console.error('Component stack:', errorInfo.componentStack);
    }

    if (context) {
      console.error('Additional context:', context);
    }

    // In production, you would send this to an error reporting service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    if (!this.isDevelopment) {
      this.sendToErrorReportingService(logEntry);
    }
  }

  /**
   * Log a warning message
   */
  logWarning(message: string, context?: Record<string, any>): void {
    const logEntry = this.createLogEntry(LOG_LEVELS.WARN, message, undefined, undefined, context);

    console.warn(this.formatLogEntry(logEntry));

    if (context) {
      console.warn('Context:', context);
    }
  }

  /**
   * Log an info message
   */
  logInfo(message: string, context?: Record<string, any>): void {
    const logEntry = this.createLogEntry(LOG_LEVELS.INFO, message, undefined, undefined, context);

    if (this.isDevelopment) {
      console.info(this.formatLogEntry(logEntry));

      if (context) {
        console.info('Context:', context);
      }
    }
  }

  /**
   * Log a debug message (only in development)
   */
  logDebug(message: string, context?: Record<string, any>): void {
    if (this.isDevelopment) {
      const logEntry = this.createLogEntry(LOG_LEVELS.DEBUG, message, undefined, undefined, context);

      console.debug(this.formatLogEntry(logEntry));

      if (context) {
        console.debug('Context:', context);
      }
    }
  }

  /**
   * Log user actions for analytics/debugging
   */
  logUserAction(action: string, context?: Record<string, any>): void {
    this.logInfo(`User action: ${action}`, context);
  }

  /**
   * Log performance metrics
   */
  logPerformance(metric: string, value: number, unit: string = 'ms'): void {
    this.logInfo(`Performance: ${metric} = ${value}${unit}`);
  }

  /**
   * Send error to external error reporting service
   * This is a placeholder for production error reporting
   */
  private sendToErrorReportingService(logEntry: LogEntry): void {
    // Placeholder for error reporting service integration
    // Examples:
    // - Sentry.captureException(logEntry.error, { extra: logEntry.context });
    // - Bugsnag.notify(logEntry.error, logEntry.context);
    // - Custom API endpoint for error collection

    try {
      // For now, we'll just log to console in production too
      console.error('Error reported:', logEntry);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }
}

// Create a singleton logger instance
const logger = new Logger();

// Export the logger instance and convenience functions
export { logger };

// Convenience functions for common logging scenarios
export const logError = (
  message: string,
  error?: Error,
  errorInfo?: ErrorInfo,
  context?: Record<string, any>
) => logger.logError(message, error, errorInfo, context);

export const logWarning = (message: string, context?: Record<string, any>) =>
  logger.logWarning(message, context);

export const logInfo = (message: string, context?: Record<string, any>) =>
  logger.logInfo(message, context);

export const logDebug = (message: string, context?: Record<string, any>) =>
  logger.logDebug(message, context);

export const logUserAction = (action: string, context?: Record<string, any>) =>
  logger.logUserAction(action, context);

export const logPerformance = (metric: string, value: number, unit?: string) =>
  logger.logPerformance(metric, value, unit);

export default logger;