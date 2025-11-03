# API Response Standardization Migration Guide

This guide outlines the changes needed to update components to work with the new standardized API response format.

## Changes to API Responses

All API responses now follow this format:

```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}
```

## Required Updates

1. **Update Component Imports**:
   - Change imports from `api/` to `services/` for the updated services

2. **Update API Response Handling**:
   - Destructure `data` from the response
   - Update error handling to use the new error format

3. **Update Type Definitions**:
   - Use the new response types from the services

## Example Updates

### Before
```typescript
const { data: jobs, total } = await jobService.fetchJobListings();
```

### After
```typescript
const { data: { jobs, total } } = await jobService.fetchJobListings(params);
```

### Error Handling Before
```typescript
try {
  const result = await someService.someMethod();
  // handle success
} catch (error) {
  // handle error
}
```

### Error Handling After
```typescript
try {
  const { data } = await someService.someMethod();
  // handle success with data
} catch (error) {
  // error is now properly typed as ApiError
  if (error.code === 'SOME_ERROR_CODE') {
    // handle specific error
  }
}
```

## Migration Steps

1. **Update Authentication Components**
   - Update login/logout flows to handle new response format
   - Update token refresh logic

2. **Update Data Fetching**
   - Update all API calls to handle the new response format
   - Update loading/error states

3. **Update Forms**
   - Update form submission handlers
   - Update validation error handling

4. **Testing**
   - Update unit tests for components
   - Update API mock responses
   - Test error scenarios

## Common Issues and Solutions

### Issue: Type errors after update
**Solution**: Make sure to import the correct types from the services and update your component props/interfaces accordingly.

### Issue: Cannot destructure property 'data' of undefined
**Solution**: Ensure you're properly handling the case where the API response might be undefined or null.

### Issue: Error handling not working as expected
**Solution**: Update your error handling to work with the new `ApiError` interface which includes `code`, `message`, and optional `details`.
