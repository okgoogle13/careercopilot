export enum ErrorType {
  // Network & API errors
  NETWORK = 'NETWORK',
  API_SERVER_ERROR = 'API_SERVER_ERROR',
  API_CLIENT_ERROR = 'API_CLIENT_ERROR',
  TIMEOUT = 'TIMEOUT',
  
  // Authentication & Authorization
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  
  // Validation errors
  VALIDATION = 'VALIDATION',
  FORM_VALIDATION = 'FORM_VALIDATION',
  FILE_VALIDATION = 'FILE_VALIDATION',
  
  // Business logic errors
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  
  // System & Runtime errors
  SYSTEM = 'SYSTEM',
  MEMORY = 'MEMORY',
  STORAGE = 'STORAGE',
  RENDER = 'RENDER',
  
  // External service errors
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  AI_SERVICE = 'AI_SERVICE',
  FILE_SERVICE = 'FILE_SERVICE',
  
  // Unknown/Generic
  UNKNOWN = 'UNKNOWN'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ActionableSuggestion {
  id: string;
  title: string;
  description: string;
  actionType: 'retry' | 'navigate' | 'refresh' | 'contact' | 'dismiss' | 'custom';
  actionData?: any;
  priority: number;
}

export interface AppError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  technicalDetails?: string;
  timestamp: Date;
  context?: Record<string, any>;
  suggestions: ActionableSuggestion[];
  isRetryable: boolean;
  retryCount?: number;
  maxRetries?: number;
  originalError?: Error;
  component?: string;
  userId?: string;
}

export interface ErrorContext {
  component: string;
  userId?: string;
  sessionId?: string;
  route?: string;
  userAgent?: string;
  timestamp: Date;
  additionalData?: Record<string, any>;
}

export interface ErrorRecoveryStrategy {
  id: string;
  errorTypes: ErrorType[];
  priority: number;
  canRecover: (error: AppError) => boolean;
  recover: (error: AppError) => Promise<boolean>;
  fallback?: () => void;
}