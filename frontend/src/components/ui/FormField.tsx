// Form field components with validation display and accessibility
import React, { forwardRef, ReactNode, useId } from 'react';

interface FormFieldProps {
  children: ReactNode;
  label?: string;
  error?: string | null;
  touched?: boolean;
  required?: boolean;
  hint?: string;
  className?: string;
  id?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  children,
  label,
  error,
  touched,
  required,
  hint,
  className = '',
  id: providedId,
}) => {
  const generatedId = useId();
  const fieldId = providedId || generatedId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const showError = touched && error;

  // Clone children to add ARIA attributes
  const enhancedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      const ariaDescribedBy = [hint && !showError ? hintId : '', showError ? errorId : '']
        .filter(Boolean)
        .join(' ');

      return React.cloneElement(child, {
        id: fieldId,
        'aria-invalid': showError ? 'true' : undefined,
        'aria-describedby': ariaDescribedBy || undefined,
        'aria-required': required ? 'true' : undefined,
      } as React.Attributes); // Type assertion needed for dynamic prop spreading
    }
    return child;
  });

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={fieldId} className='block text-sm font-medium text-gray-700'>
          {label}
          {required && (
            <span className='text-red-500 ml-1' aria-label='required'>
              *
            </span>
          )}
        </label>
      )}

      <div className='relative'>
        {enhancedChildren}
        {showError && (
          <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
            <svg
              className='h-5 w-5 text-red-500'
              viewBox='0 0 20 20'
              fill='currentColor'
              aria-hidden='true'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zM9.25 14a.75.75 0 011.5 0v.01a.75.75 0 01-1.5 0V14z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        )}
      </div>

      {showError && (
        <p id={errorId} className='text-sm text-red-600' role='alert'>
          {error}
        </p>
      )}

      {hint && !showError && (
        <p id={hintId} className='text-sm text-gray-600'>
          {hint}
        </p>
      )}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | null;
  touched?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, touched, className = '', ...props }, ref) => {
    const hasError = touched && error;

    return (
      <input
        ref={ref}
        className={`
          block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset
          ${
            hasError
              ? 'ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-600'
              : 'ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600'
          }
          placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none
          disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string | null;
  touched?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, touched, className = '', ...props }, ref) => {
    const hasError = touched && error;

    return (
      <textarea
        ref={ref}
        className={`
          block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset
          ${
            hasError
              ? 'ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-600'
              : 'ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600'
          }
          placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none resize-y
          disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200
          ${className}
        `}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string | null;
  touched?: boolean;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, touched, className = '', placeholder, children, ...props }, ref) => {
    const hasError = touched && error;

    return (
      <select
        ref={ref}
        className={`
          block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset
          ${
            hasError
              ? 'ring-red-300 focus:ring-2 focus:ring-inset focus:ring-red-600'
              : 'ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600'
          }
          focus:ring-2 focus:ring-inset focus:outline-none
          disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value='' disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  touched?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, touched, className = '', ...props }, ref) => {
    const hasError = touched && error;

    return (
      <div className='space-y-1'>
        <div className='flex items-center'>
          <input
            ref={ref}
            type='checkbox'
            className={`
              h-4 w-4 rounded border-gray-300
              ${hasError ? 'text-red-600 focus:ring-red-600' : 'text-blue-600 focus:ring-blue-600'}
              focus:ring-2 focus:ring-offset-2
              ${className}
            `}
            {...props}
          />
          <label className='ml-2 text-sm text-gray-900'>{label}</label>
        </div>

        {hasError && (
          <p className='text-sm text-red-600' role='alert'>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { FormField, Input, Textarea, Select, Checkbox };
