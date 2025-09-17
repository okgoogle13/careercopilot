# Comprehensive Error Handling System

This document describes the comprehensive error handling system implemented for CareerCopilot, which provides actionable suggestions, automatic recovery, and robust error management.

## Overview

The error handling system consists of several interconnected components:

1. **Error Types & Classifications** - Structured error categorization
2. **Error Handler** - Central error processing and suggestion generation
3. **Error Context** - React context for global error management
4. **Error Display Components** - UI components for showing errors with suggestions
5. **Error Recovery System** - Automatic and manual error recovery
6. **Error Logging** - Comprehensive logging and monitoring
7. **Error Boundaries** - React error boundaries with enhanced features

## Quick Start

### 1. Basic Setup

Wrap your app with the `ErrorProvider`:

```tsx
import { ErrorProvider } from "./contexts/ErrorContext";
import ErrorToastContainer from "./components/ui/ErrorToastContainer";

function App() {
  return (
    <ErrorProvider>
      <YourAppContent />
      <ErrorToastContainer position="top-right" />
    </ErrorProvider>
  );
}
```

### 2. Using Error Handling in Components

```tsx
import { useError, useErrorHandler } from "../contexts/ErrorContext";
import { createError } from "../utils/errorSystem";

function MyComponent() {
  const { addError } = useError();
  const { handleAsync } = useErrorHandler();

  const handleSubmit = async () => {
    // Method 1: Using handleAsync wrapper
    const result = await handleAsync(
      async () => {
        return await api.submitForm(formData);
      },
      { component: "MyComponent", operation: "form-submit" },
    );

    if (result) {
      // Success handling
    }
  };

  const handleFileUpload = (file: File) => {
    // Method 2: Manual error creation
    if (file.size > 10 * 1024 * 1024) {
      const error = createError.fileUpload("File is too large. Please select a file under 10MB.", {
        component: "MyComponent",
        fileName: file.name,
        fileSize: file.size,
        maxSize: 10 * 1024 * 1024,
      });
      addError(error);
      return;
    }
  };

  return <div>...</div>;
}
```

### 3. Error Boundaries

```tsx
import ErrorBoundary from "../components/ui/ErrorBoundary";

function PageComponent() {
  return (
    <ErrorBoundary componentName="PageComponent" showActionableSuggestions={true}>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

## Error Types

The system categorizes errors into the following types:

### Network & API Errors

- `NETWORK` - Connection issues, network failures
- `API_SERVER_ERROR` - 5xx server errors
- `API_CLIENT_ERROR` - 4xx client errors
- `TIMEOUT` - Request timeout errors

### Authentication & Authorization

- `AUTHENTICATION` - Login failures, expired tokens
- `AUTHORIZATION` - Permission denied, insufficient privileges
- `SESSION_EXPIRED` - Session timeout

### Validation Errors

- `VALIDATION` - General validation failures
- `FORM_VALIDATION` - Form field validation errors
- `FILE_VALIDATION` - File upload validation errors

### Business Logic Errors

- `BUSINESS_LOGIC` - Business rule violations
- `RESOURCE_NOT_FOUND` - Missing resources
- `RESOURCE_CONFLICT` - Conflicting resources
- `QUOTA_EXCEEDED` - Usage limits exceeded

### System & Runtime Errors

- `SYSTEM` - System-level errors
- `MEMORY` - Memory-related issues
- `STORAGE` - Storage/localStorage issues
- `RENDER` - React rendering errors

### External Service Errors

- `EXTERNAL_SERVICE` - Third-party service failures
- `AI_SERVICE` - AI/ML service issues
- `FILE_SERVICE` - File processing service errors

## Error Severity Levels

- `LOW` - Minor issues, user can continue
- `MEDIUM` - Moderate issues, some functionality affected
- `HIGH` - Significant issues, major functionality affected
- `CRITICAL` - Severe issues, application may be unusable

## Actionable Suggestions

Each error automatically generates contextual suggestions:

### Network Errors

- Check internet connection
- Retry the request
- Refresh the page

### Authentication Errors

- Sign in again
- Clear browser cache
- Contact support

### Validation Errors

- Review input fields
- Check required fields
- Clear and restart form

### File Upload Errors

- Check file type (PDF, DOC, DOCX supported)
- Verify file size (under 10MB)
- Try a different file

## Error Recovery

The system includes automatic recovery strategies:

### Built-in Recovery Strategies

1. **Network Retry** - Automatic retry with exponential backoff
2. **Auth Refresh** - Attempt to refresh authentication tokens
3. **Storage Cleanup** - Clear temporary storage items
4. **Component Remount** - Force component re-rendering
5. **Cache Clear** - Clear browser caches

### Custom Recovery Strategies

```tsx
import { useErrorRecovery, recoveryStrategies } from "../hooks/useErrorRecovery";

function MyComponent() {
  const { registerRecoveryStrategy, recoverFromError } = useErrorRecovery();

  useEffect(() => {
    // Register custom recovery strategy
    registerRecoveryStrategy({
      id: "custom-api-recovery",
      errorTypes: [ErrorType.API_SERVER_ERROR],
      priority: 1,
      canRecover: (error) => error.context?.endpoint === "/api/special",
      recover: async (error) => {
        // Custom recovery logic
        return await customRecoveryFunction();
      },
    });
  }, []);

  const handleError = async (error) => {
    const success = await recoverFromError(error);
    if (!success) {
      // Handle recovery failure
    }
  };
}
```

## Error Display Components

### ErrorDisplay Component

```tsx
import ErrorDisplay from "../components/ui/ErrorDisplay";

<ErrorDisplay
  error={error} // string or AppError object
  variant="card" // inline|banner|card|toast
  showSuggestions={true} // Show actionable suggestions
  maxSuggestions={3} // Limit number of suggestions
  onAction={handleAction} // Handle suggestion actions
  onDismiss={handleDismiss} // Handle error dismissal
/>;
```

### ErrorToastContainer

```tsx
import ErrorToastContainer from "../components/ui/ErrorToastContainer";

<ErrorToastContainer
  position="top-right" // top-right|top-left|bottom-right|etc.
/>;
```

## Error Logging

The system includes comprehensive logging:

### Configuration

```tsx
import { errorLogger } from "../utils/errorLogger";

// Configure logging
errorLogger.updateConfig({
  enableConsole: true,
  enableRemote: true,
  remoteEndpoint: "https://api.example.com/errors",
  apiKey: "your-api-key",
  batchSize: 10,
  flushInterval: 30000,
});
```

### Environment Variables

```env
REACT_APP_ERROR_LOGGING_ENDPOINT=https://api.example.com/errors
REACT_APP_ERROR_LOGGING_API_KEY=your-api-key
```

## API Integration

### Error Wrapper for API Calls

```tsx
import { withErrorHandling } from "../utils/errorSystem";

const fetchUserData = async (userId: string) => {
  return await withErrorHandling(
    async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw response;
      return response.json();
    },
    { component: "UserProfile", userId },
  );
};
```

### Handling API Validation Errors

```tsx
import { handleValidationErrors } from "../utils/errorSystem";

const submitForm = async (formData) => {
  try {
    await api.submit(formData);
  } catch (error) {
    if (error.status === 422) {
      const validationErrors = await error.json();
      handleValidationErrors(validationErrors.errors);
    }
  }
};
```

## Best Practices

### 1. Always Provide Context

```tsx
// Good
addError(error, {
  component: "DocumentUpload",
  operation: "file-upload",
  fileName: file.name,
  fileSize: file.size,
});

// Bad
addError(error);
```

### 2. Use Appropriate Error Types

```tsx
// Good - Specific error type
const error = createError.fileUpload("File too large", context);

// Less ideal - Generic error
const error = createError.validation("File too large", context);
```

### 3. Wrap Async Operations

```tsx
// Good - Automatic error handling
const result = await handleAsync(() => apiCall(), context);

// Manual - More control but requires error handling
try {
  const result = await apiCall();
} catch (error) {
  addError(error, context);
}
```

### 4. Use Error Boundaries Strategically

```tsx
// Good - Boundary around major sections
<ErrorBoundary componentName="DocumentEditor">
  <DocumentEditor />
</ErrorBoundary>

// Over-use - Too granular
<ErrorBoundary>
  <Button>Click me</Button>
</ErrorBoundary>
```

## Testing

### Testing Error Scenarios

```tsx
// Test error creation
import { createError } from "../utils/errorSystem";

test("should create network error with suggestions", () => {
  const error = createError.network("Connection failed");

  expect(error.type).toBe("NETWORK");
  expect(error.suggestions).toHaveLength(3);
  expect(error.suggestions[0].actionType).toBe("retry");
});
```

### Testing Error Recovery

```tsx
// Mock recovery strategies for testing
const mockRecoveryStrategy = {
  id: "test-recovery",
  errorTypes: [ErrorType.NETWORK],
  priority: 1,
  canRecover: () => true,
  recover: jest.fn().mockResolvedValue(true),
};
```

## Performance Considerations

1. **Error Batching** - Errors are batched for remote logging
2. **Auto-cleanup** - Non-critical errors auto-dismiss after 5 seconds
3. **Memory Management** - Error queues have size limits
4. **Lazy Loading** - Recovery strategies are lazy-loaded when needed

## Security

1. **Data Sanitization** - Sensitive data is removed before logging
2. **Rate Limiting** - Error generation is rate-limited to prevent spam
3. **Secure Logging** - Remote logging uses HTTPS and API keys
4. **Local Storage** - Sensitive errors are not persisted locally

## Troubleshooting

### Common Issues

1. **Errors not appearing** - Ensure `ErrorProvider` wraps your app
2. **Suggestions not working** - Check `onAction` handler implementation
3. **Recovery failing** - Verify recovery strategies are registered
4. **Logging not working** - Check environment variables and network

### Debug Mode

Enable debug logging in development:

```tsx
// In development, enable verbose logging
if (process.env.NODE_ENV === "development") {
  errorLogger.updateConfig({ enableConsole: true });
}
```

## Migration Guide

### From Basic Error Handling

```tsx
// Old way
try {
  await apiCall();
} catch (error) {
  setError(error.message);
}

// New way
const result = await handleAsync(() => apiCall(), {
  component: "MyComponent",
});
```

### From React Error Boundaries

```tsx
// Old way
<ErrorBoundary fallback={<ErrorFallback />}>
  <MyComponent />
</ErrorBoundary>

// New way
<ErrorBoundary
  componentName="MyComponent"
  showActionableSuggestions={true}
>
  <MyComponent />
</ErrorBoundary>
```

This comprehensive error handling system provides a robust foundation for managing errors in your React application with actionable user guidance and automatic recovery capabilities.
