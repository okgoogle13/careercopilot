// Comprehensive form management hook with validation
import { useState, useCallback, useMemo } from 'react';
import { ValidationRule, FormValidationResult, validateForm, FieldValidation } from '../utils/validation';

export interface FormField {
  value: any;
  error: string | null;
  touched: boolean;
  valid: boolean;
}

export interface FormConfig<T extends Record<string, any>> {
  initialValues: T;
  validationSchema?: Record<string, ValidationRule<any>[]>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  onSubmit?: (values: T) => Promise<void> | void;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Record<keyof T, string | null>;
  touched: Record<keyof T, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  
  // Field operations
  setValue: (field: keyof T, value: any) => void;
  setFieldTouched: (field: keyof T, touched?: boolean) => void;
  setFieldError: (field: keyof T, error: string | null) => void;
  
  // Form operations
  setValues: (values: Partial<T>) => void;
  resetForm: (newValues?: T) => void;
  validateField: (field: keyof T) => string | null;
  validateForm: () => FormValidationResult;
  submitForm: () => Promise<void>;
  
  // Helper functions
  getFieldProps: (field: keyof T) => {
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    error: string | null;
    touched: boolean;
    valid: boolean;
  };
  
  getFieldError: (field: keyof T) => string | null;
  isFieldTouched: (field: keyof T) => boolean;
  isFieldValid: (field: keyof T) => boolean;
}

export const useForm = <T extends Record<string, any>>(
  config: FormConfig<T>
): UseFormReturn<T> => {
  const {
    initialValues,
    validationSchema = {},
    validateOnChange = true,
    validateOnBlur = true,
    onSubmit,
  } = config;

  // Form state
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrorsState] = useState<Record<keyof T, string | null>>({} as Record<keyof T, string | null>);
  const [touched, setTouchedState] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived state
  const isDirty = useMemo(() => {
    return Object.keys(values).some(key => values[key] !== initialValues[key]);
  }, [values, initialValues]);

  const isValid = useMemo(() => {
    return Object.values(errors).every(error => error === null);
  }, [errors]);

  // Field validation
  const validateField = useCallback((field: keyof T): string | null => {
    if (!validationSchema) return null;
    const fieldKey = String(field);
    const fieldRules = validationSchema[fieldKey];
    if (!fieldRules || fieldRules.length === 0) return null;

    const value = values[field];
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  }, [values, validationSchema]);

  // Form validation
  const validateFormFn = useCallback((): FormValidationResult => {
    if (!validationSchema || Object.keys(validationSchema).length === 0) {
      return { isValid: true, errors: {} };
    }
    return validateForm(values, validationSchema as Record<keyof T, ValidationRule<any>[]>);
  }, [values, validationSchema]);

  // Set field value with optional validation
  const setValue = useCallback((field: keyof T, value: any) => {
    setValuesState(prev => ({ ...prev, [field]: value }));
    
    if (validateOnChange) {
      const error = validateField(field);
      setErrorsState(prev => ({ ...prev, [field]: error }));
    }
  }, [validateField, validateOnChange]);

  // Set field as touched
  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean = true) => {
    setTouchedState(prev => ({ ...prev, [field]: isTouched }));
    
    if (validateOnBlur && isTouched) {
      const error = validateField(field);
      setErrorsState(prev => ({ ...prev, [field]: error }));
    }
  }, [validateField, validateOnBlur]);

  // Set field error manually
  const setFieldError = useCallback((field: keyof T, error: string | null) => {
    setErrorsState(prev => ({ ...prev, [field]: error }));
  }, []);

  // Set multiple values
  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
    
    if (validateOnChange) {
      const newErrors: Partial<Record<keyof T, string | null>> = {};
      Object.keys(newValues).forEach(key => {
        const field = key as keyof T;
        newErrors[field] = validateField(field);
      });
      setErrorsState(prev => ({ ...prev, ...newErrors }));
    }
  }, [validateField, validateOnChange]);

  // Reset form
  const resetForm = useCallback((newValues?: T) => {
    const resetValues = newValues || initialValues;
    setValuesState(resetValues);
    setErrorsState({} as Record<keyof T, string | null>);
    setTouchedState({} as Record<keyof T, boolean>);
    setIsSubmitting(false);
  }, [initialValues]);

  // Submit form
  const submitForm = useCallback(async () => {
    if (isSubmitting) return;

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<keyof T, boolean>
    );
    setTouchedState(allTouched);

    // Validate entire form
    const validation = validateFormFn();
    setErrorsState(validation.errors as Record<keyof T, string | null>);

    if (!validation.isValid) {
      // Focus first error field if possible
      if (validation.firstErrorField) {
        const element = document.querySelector(`[name="${String(validation.firstErrorField)}"]`) as HTMLElement;
        element?.focus();
      }
      return;
    }

    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, isSubmitting, validateFormFn, onSubmit]);

  // Helper functions
  const getFieldProps = useCallback((field: keyof T) => ({
    value: values[field],
    onChange: (value: any) => setValue(field, value),
    onBlur: () => setFieldTouched(field, true),
    error: errors[field],
    touched: touched[field] || false,
    valid: errors[field] === null,
  }), [values, errors, touched, setValue, setFieldTouched]);

  const getFieldError = useCallback((field: keyof T) => {
    return touched[field] ? errors[field] : null;
  }, [errors, touched]);

  const isFieldTouched = useCallback((field: keyof T) => {
    return touched[field] || false;
  }, [touched]);

  const isFieldValid = useCallback((field: keyof T) => {
    return errors[field] === null;
  }, [errors]);

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    isDirty,
    setValue,
    setFieldTouched,
    setFieldError,
    setValues,
    resetForm,
    validateField,
    validateForm: validateFormFn,
    submitForm,
    getFieldProps,
    getFieldError,
    isFieldTouched,
    isFieldValid,
  };
};