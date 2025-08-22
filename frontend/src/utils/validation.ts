// Form validation utilities and rules
import { ValidationError } from './errors';

export type ValidationRule<T = unknown> = (value: T) => string | null;

// Common validation rules
export const validationRules = {
  required: (message: string = 'This field is required'): ValidationRule<unknown> => (value) => {
    if (value === null || value === undefined || value === '') {
      return message;
    }
    if (typeof value === 'string' && value.trim() === '') {
      return message;
    }
    if (Array.isArray(value) && value.length === 0) {
      return message;
    }
    return null;
  },

  email: (message: string = 'Please enter a valid email address'): ValidationRule<string> => (value) => {
    if (!value) return null; // Let required rule handle empty values
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : message;
  },

  minLength: (min: number, message?: string): ValidationRule<string> => (value) => {
    if (!value) return null; // Let required rule handle empty values
    const actualMessage = message || `Must be at least ${min} characters long`;
    return value.length >= min ? null : actualMessage;
  },

  maxLength: (max: number, message?: string): ValidationRule<string> => (value) => {
    if (!value) return null; // Let required rule handle empty values
    const actualMessage = message || `Must be no more than ${max} characters long`;
    return value.length <= max ? null : actualMessage;
  },

  password: (message: string = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'): ValidationRule<string> => (value) => {
    if (!value) return null;
    const hasMinLength = value.length >= 8;
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    if (hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar) {
      return null;
    }
    return message;
  },

  url: (message: string = 'Please enter a valid URL'): ValidationRule<string> => (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return message;
    }
  },

  phoneNumber: (message: string = 'Please enter a valid phone number'): ValidationRule<string> => (value) => {
    if (!value) return null;
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(value.replace(/[\s\-()]/g, '')) ? null : message;
  },

  numeric: (message: string = 'Please enter a valid number'): ValidationRule<string | number> => (value) => {
    if (!value) return null;
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return !isNaN(num) && isFinite(num) ? null : message;
  },

  min: (min: number, message?: string): ValidationRule<string | number> => (value) => {
    if (!value) return null;
    const num = typeof value === 'string' ? parseFloat(value) : value;
    const actualMessage = message || `Must be at least ${min}`;
    return num >= min ? null : actualMessage;
  },

  max: (max: number, message?: string): ValidationRule<string | number> => (value) => {
    if (!value) return null;
    const num = typeof value === 'string' ? parseFloat(value) : value;
    const actualMessage = message || `Must be no more than ${max}`;
    return num <= max ? null : actualMessage;
  },

  pattern: (regex: RegExp, message: string): ValidationRule<string> => (value) => {
    if (!value) return null;
    return regex.test(value) ? null : message;
  },

  custom: <T>(validationFn: (value: T) => boolean, message: string): ValidationRule<T> => (value) => {
    if (!value) return null;
    return validationFn(value) ? null : message;
  },
};

// Field validation state
export interface FieldValidation {
  error: string | null;
  touched: boolean;
  valid: boolean;
}

// Form validation result
export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  firstErrorField?: string;
}

// Validate a single field
export const validateField = <T>(
  value: T,
  rules: ValidationRule<T>[],
  fieldName?: string
): FieldValidation => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) {
      if (fieldName) {
        throw new ValidationError(error, fieldName);
      }
      return {
        error,
        touched: true,
        valid: false,
      };
    }
  }

  return {
    error: null,
    touched: true,
    valid: true,
  };
};

// Validate entire form
export const validateForm = <T extends Record<string, unknown>>(
  values: T,
  validationSchema: Record<keyof T, ValidationRule<unknown>[]>
): FormValidationResult => {
  const errors: Record<string, string> = {};
  let firstErrorField: string | undefined;

  for (const [field, rules] of Object.entries(validationSchema)) {
    const value = values[field as keyof T];
    
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        if (!firstErrorField) {
          firstErrorField = field;
        }
        break; // Stop at first error for this field
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstErrorField,
  };
};

// Real-time form validation hook helper
export const createFormValidator = <T extends Record<string, unknown>>(
  validationSchema: Record<keyof T, ValidationRule<unknown>[]>
) => {
  return {
    validateField: (field: keyof T, value: unknown): string | null => {
      const rules = validationSchema[field];
      if (!rules) return null;

      for (const rule of rules) {
        const error = rule(value);
        if (error) return error;
      }
      return null;
    },
    
    validateForm: (values: T): FormValidationResult => {
      return validateForm(values, validationSchema);
    },
  };
};