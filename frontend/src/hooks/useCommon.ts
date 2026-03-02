/**
 * Custom React Hooks for Common Patterns
 * 
 * Eliminates duplication of common state management patterns across components.
 */

import { useState, useCallback, ChangeEvent } from 'react';

/**
 * Hook for managing form field state with validation
 * 
 * Replaces the pattern of:
 *   const [value, setValue] = useState('');
 *   const [error, setError] = useState('');
 *   const [isValid, setIsValid] = useState(false);
 * 
 * Used in: JobInput, UploadResume, LoginCard, EditableField, etc.
 */
export interface UseFormFieldOptions<T = string> {
  initialValue?: T;
  validate?: (value: T) => string | null;
  onChange?: (value: T) => void;
}

export function useFormField<T = string>(options: UseFormFieldOptions<T> = {}) {
  const { initialValue, validate, onChange: onChangeCallback } = options;
  
  const [value, setValue] = useState<T>(initialValue as T);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback((newValue: T) => {
    setValue(newValue);
    
    // Run validation if provided
    if (validate) {
      const validationError = validate(newValue);
      setError(validationError);
    }
    
    // Call external onChange handler
    if (onChangeCallback) {
      onChangeCallback(newValue);
    }
  }, [validate, onChangeCallback]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    
    // Run validation on blur
    if (validate && !error) {
      const validationError = validate(value);
      setError(validationError);
    }
  }, [validate, value, error]);

  const reset = useCallback(() => {
    setValue(initialValue as T);
    setError(null);
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    error,
    touched,
    isValid: !error && touched,
    setValue: handleChange,
    setError,
    handleBlur,
    reset,
    // Convenience props for input elements
    inputProps: {
      value: value as any,
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleChange(e.target.value as T),
      onBlur: handleBlur,
    },
  };
}

/**
 * Hook for managing async operations with loading and error states
 * 
 * Replaces the pattern of:
 *   const [isLoading, setIsLoading] = useState(false);
 *   const [error, setError] = useState<string | null>(null);
 *   const [data, setData] = useState<T | null>(null);
 * 
 * Used extensively in service calls across components.
 */
export interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useAsync<T = any>(options: UseAsyncOptions<T> = {}) {
  const { onSuccess, onError } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    isLoading,
    error,
    data,
    reset,
  };
}

/**
 * Hook for managing debounced input
 * 
 * Prevents expensive operations from running on every keystroke.
 * Used in: JobSearch filter, search inputs, etc.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useCallback(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for managing toggle state
 * 
 * Simpler alternative to useState for boolean flags.
 */
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return { value, toggle, setTrue, setFalse, setValue };
}

/**
 * Example usage:
 * 
 * ```typescript
 * // Form field with validation
 * const email = useFormField({
 *   initialValue: '',
 *   validate: (value) => {
 *     if (!value) return 'Email is required';
 *     if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format';
 *     return null;
 *   },
 * });
 * 
 * <input {...email.inputProps} />
 * {email.touched && email.error && <span>{email.error}</span>}
 * 
 * // Async operation
 * const apiCall = useAsync({
 *   onSuccess: (data) => console.log('Success:', data),
 *   onError: (error) => console.error('Error:', error),
 * });
 * 
 * const handleSubmit = async () => {
 *   await apiCall.execute(() => fetchData());
 * };
 * 
 * {apiCall.isLoading && <Spinner />}
 * {apiCall.error && <ErrorMessage error={apiCall.error} />}
 * {apiCall.data && <DataDisplay data={apiCall.data} />}
 * ```
 */
