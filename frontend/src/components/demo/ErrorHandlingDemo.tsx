import React, { useState } from 'react';
import { Button } from '../ui/Button';
import ErrorDisplay from '../ui/ErrorDisplay';
import { useError, useErrorHandler } from '../../contexts/ErrorContext';
import { useErrorRecovery } from '../../hooks/useErrorRecovery';
import { createError, withErrorHandling, AppError } from '../../utils/errorSystem';

const ErrorHandlingDemo: React.FC = () => {
  const { errors, clearErrors } = useError();
  const { handleAsync, addError } = useErrorHandler();
  const { recoverFromError, isRecovering, recoveryAttempts } = useErrorRecovery();
  const [currentError, setCurrentError] = useState<AppError | null>(null);

  const simulateNetworkError = () => {
    const error = createError.network(
      'Failed to connect to the server',
      { component: 'ErrorHandlingDemo', attemptedUrl: '/api/test' }
    );
    addError(error);
    setCurrentError(error);
  };

  const simulateValidationError = () => {
    const error = createError.validation(
      'Please fill in all required fields',
      { component: 'ErrorHandlingDemo', fields: ['email', 'password'] }
    );
    addError(error);
    setCurrentError(error);
  };

  const simulateAuthError = () => {
    const error = createError.authentication(
      'Your session has expired',
      { component: 'ErrorHandlingDemo', sessionId: 'abc123' }
    );
    addError(error);
    setCurrentError(error);
  };

  const simulateAPIError = () => {
    const error = createError.api(
      'The server returned an error',
      500,
      { component: 'ErrorHandlingDemo', endpoint: '/api/documents' }
    );
    addError(error);
    setCurrentError(error);
  };

  const simulateFileError = () => {
    const error = createError.fileUpload(
      'File is too large or in an unsupported format',
      {
        component: 'ErrorHandlingDemo',
        fileName: 'resume.pdf',
        fileSize: '15MB',
        maxSize: '10MB'
      }
    );
    addError(error);
    setCurrentError(error);
  };

  const simulateAIError = () => {
    const error = createError.ai(
      'AI service is temporarily unavailable',
      { component: 'ErrorHandlingDemo', service: 'resume-analysis' }
    );
    addError(error);
    setCurrentError(error);
  };

  const handleAsyncOperation = async () => {
    const result = await handleAsync(async () => {
      // Simulate an async operation that might fail
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (Math.random() > 0.5) {
        throw new Error('Random async operation failed');
      }

      return 'Success!';
    }, { component: 'ErrorHandlingDemo', operation: 'async-demo' });

    if (result) {
      alert(`Async operation succeeded: ${result}`);
    }
  };

  const testAPIWrapper = async () => {
    const result = await withErrorHandling(async () => {
      const response = await fetch('/api/nonexistent');
      if (!response.ok) {
        throw response;
      }
      return response.json();
    }, { component: 'ErrorHandlingDemo', operation: 'api-test' });

    if (result) {
      console.log('API call succeeded:', result);
    } else {
      console.log('API call failed, error was handled automatically');
    }
  };

  const attemptRecovery = async () => {
    if (currentError) {
      const success = await recoverFromError(currentError);
      if (success) {
        setCurrentError(null);
        alert('Recovery successful!');
      } else {
        alert('Recovery failed, but fallback options are available');
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Error Handling System Demo
        </h2>
        <p className="text-gray-600">
          This demo shows how the comprehensive error handling system works with
          actionable suggestions and recovery mechanisms.
        </p>
      </div>

      {/* Error Simulation Controls */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h3 className="text-lg font-semibold">Simulate Different Error Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Button onClick={simulateNetworkError} variant="outline">
            Network Error
          </Button>
          <Button onClick={simulateValidationError} variant="outline">
            Validation Error
          </Button>
          <Button onClick={simulateAuthError} variant="outline">
            Auth Error
          </Button>
          <Button onClick={simulateAPIError} variant="outline">
            API Error
          </Button>
          <Button onClick={simulateFileError} variant="outline">
            File Error
          </Button>
          <Button onClick={simulateAIError} variant="outline">
            AI Service Error
          </Button>
        </div>
      </div>

      {/* Async Operations */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h3 className="text-lg font-semibold">Async Error Handling</h3>
        <div className="flex space-x-4">
          <Button onClick={handleAsyncOperation}>
            Test Async Operation
          </Button>
          <Button onClick={testAPIWrapper}>
            Test API Wrapper
          </Button>
        </div>
      </div>

      {/* Current Error Display */}
      {currentError && (
        <div className="bg-white p-6 rounded-lg border space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Current Error</h3>
            <Button
              onClick={attemptRecovery}
              disabled={isRecovering}
              size="sm"
            >
              {isRecovering ? 'Recovering...' : 'Attempt Recovery'}
            </Button>
          </div>
          <ErrorDisplay
            error={currentError}
            variant="card"
            showSuggestions={true}
            onDismiss={() => setCurrentError(null)}
          />
        </div>
      )}

      {/* Recovery History */}
      {recoveryAttempts.length > 0 && (
        <div className="bg-white p-6 rounded-lg border space-y-4">
          <h3 className="text-lg font-semibold">Recovery Attempts</h3>
          <div className="space-y-2">
            {recoveryAttempts.slice(0, 5).map((attempt, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm">
                  Strategy: {attempt.strategy}
                </span>
                <span className={`text-sm font-medium ${
                  attempt.success ? 'text-green-600' : 'text-red-600'
                }`}>
                  {attempt.success ? 'Success' : 'Failed'}
                </span>
                <span className="text-xs text-gray-500">
                  {attempt.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Error Queue */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Global Error Queue ({errors.length})
          </h3>
          {errors.length > 0 && (
            <Button onClick={clearErrors} variant="outline" size="sm">
              Clear All Errors
            </Button>
          )}
        </div>

        {errors.length === 0 ? (
          <p className="text-gray-500 text-sm">No active errors</p>
        ) : (
          <div className="space-y-2">
            {errors.map((error) => (
              <div key={error.id} className="p-3 bg-gray-50 rounded text-sm">
                <div className="font-medium">{error.type}</div>
                <div className="text-gray-600">{error.userMessage}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Component: {error.component} |
                  Severity: {error.severity} |
                  Time: {error.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorHandlingDemo;
