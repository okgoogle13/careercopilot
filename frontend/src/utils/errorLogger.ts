import { AppError, ErrorSeverity } from '../types/errors';

interface LoggingConfig {
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  apiKey?: string;
  batchSize: number;
  flushInterval: number;
  enableUserTracking: boolean;
  enablePerformanceMetrics: boolean;
}

interface LogEntry {
  id: string;
  timestamp: string;
  error: AppError;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId: string;
  performanceMetrics?: PerformanceMetrics;
}

interface PerformanceMetrics {
  memory?: {
    used: number;
    total: number;
  };
  timing?: {
    domContentLoaded: number;
    loadComplete: number;
  };
  networkInfo?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private config: LoggingConfig;
  private logQueue: LogEntry[] = [];
  private flushTimer?: number;
  private sessionId: string;

  constructor(config?: Partial<LoggingConfig>) {
    this.config = {
      enableConsole: true,
      enableRemote: false,
      batchSize: 10,
      flushInterval: 30000, // 30 seconds
      enableUserTracking: true,
      enablePerformanceMetrics: true,
      ...config
    };

    this.sessionId = this.generateSessionId();
    this.startFlushTimer();
  }

  static getInstance(config?: Partial<LoggingConfig>): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger(config);
    }
    return ErrorLogger.instance;
  }

  async logError(error: AppError): Promise<void> {
    const logEntry: LogEntry = {
      id: error.id,
      timestamp: error.timestamp.toISOString(),
      error: this.sanitizeError(error),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: error.userId,
      sessionId: this.sessionId,
    };

    // Add performance metrics if enabled
    if (this.config.enablePerformanceMetrics) {
      logEntry.performanceMetrics = await this.getPerformanceMetrics();
    }

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(logEntry);
    }

    // Remote logging
    if (this.config.enableRemote) {
      this.logQueue.push(logEntry);

      if (this.logQueue.length >= this.config.batchSize) {
        await this.flush();
      }
    }
  }

  private sanitizeError(error: AppError): AppError {
    // Remove sensitive information before logging
    const sanitized = { ...error };

    if (sanitized.context?.additionalData) {
      const { additionalData } = sanitized.context;
      const sanitizedData: Record<string, unknown> = {};

      // Only include non-sensitive data
      for (const [key, value] of Object.entries(additionalData)) {
        if (!this.isSensitiveKey(key) && !this.containsSensitiveData(value)) {
          sanitizedData[key] = value;
        }
      }

      sanitized.context.additionalData = sanitizedData;
    }

    // Remove potentially sensitive technical details in production
    if (import.meta.env.PROD) {
      sanitized.technicalDetails = undefined;
    }

    return sanitized;
  }

  private isSensitiveKey(key: string): boolean {
    const sensitiveKeys = [
      'password', 'token', 'key', 'secret', 'auth', 'credential',
      'ssn', 'social', 'credit', 'card', 'email', 'phone'
    ];

    return sensitiveKeys.some(sensitiveKey =>
      key.toLowerCase().includes(sensitiveKey.toLowerCase())
    );
  }

  private containsSensitiveData(value: unknown): boolean {
    if (typeof value !== 'string') return false;

    // Basic patterns for sensitive data
    const patterns = [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b\d{3}-?\d{2}-?\d{4}\b/, // SSN
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card
      /^[a-zA-Z0-9+/]*={0,2}$/ // Base64 (potential tokens)
    ];

    return patterns.some(pattern => pattern.test(value));
  }

  private logToConsole(logEntry: LogEntry): void {
    const { error } = logEntry;
    const logMethod = this.getConsoleMethod(error.severity);

    logMethod(`[${error.severity}] ${error.type}: ${error.message}`, {
      id: error.id,
      component: error.component,
      timestamp: logEntry.timestamp,
      context: error.context,
      suggestions: error.suggestions.map(s => s.title)
    });
  }

  private getConsoleMethod(severity: ErrorSeverity): typeof console.log {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return console.error;
      case ErrorSeverity.HIGH:
        return console.error;
      case ErrorSeverity.MEDIUM:
        return console.warn;
      default:
        return console.log;
    }
  }

  private async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const metrics: PerformanceMetrics = {};

    // Memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;
      if (memory) {
        metrics.memory = {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize
        };
      }
    }

    // Timing metrics
    if (performance.timing) {
      const timing = performance.timing;
      metrics.timing = {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart
      };
    }

    // Network information (if available)
    if ('connection' in navigator) {
      const connection = (navigator as { connection?: { effectiveType?: string; downlink?: number; rtt?: number } }).connection;
      if (connection) {
        metrics.networkInfo = {
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0
        };
      }
    }

    return metrics;
  }

  private async flush(): Promise<void> {
    if (this.logQueue.length === 0 || !this.config.remoteEndpoint) {
      return;
    }

    const batch = [...this.logQueue];
    this.logQueue = [];

    try {
      const response = await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          sessionId: this.sessionId,
          errors: batch
        })
      });

      if (!response.ok) {
        console.warn('Failed to send error logs to remote endpoint:', response.statusText);
        // Put failed logs back in queue for retry
        this.logQueue.unshift(...batch);
      }
    } catch (error) {
      console.warn('Error sending logs to remote endpoint:', error);
      // Put failed logs back in queue for retry
      this.logQueue.unshift(...batch);
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  updateConfig(newConfig: Partial<LoggingConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.startFlushTimer();
  }

  async forceFlush(): Promise<void> {
    await this.flush();
  }

  getSessionId(): string {
    return this.sessionId;
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush(); // Final flush
  }
}

// Create and export singleton instance
export const errorLogger = ErrorLogger.getInstance({
  enableConsole: import.meta.env.DEV,
  enableRemote: import.meta.env.PROD,
  remoteEndpoint: import.meta.env.VITE_ERROR_LOGGING_ENDPOINT,
  apiKey: import.meta.env.VITE_ERROR_LOGGING_API_KEY,
});

// Export class for custom instances
export { ErrorLogger };
