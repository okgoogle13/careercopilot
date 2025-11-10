import React from 'react';
import type { ReactNode } from 'react';
import { Box, FormControl, FormHelperText, FormLabel } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface FormFieldProps {
  /**
   * The label text for the form field
   */
  label?: string;
  /**
   * The form control content (input, select, etc.)
   */
  children: ReactNode;
  /**
   * Helper text displayed below the field
   */
  helperText?: string;
  /**
   * Displays error state and message
   */
  error?: boolean | string;
  /**
   * Makes the field required
   */
  required?: boolean;
  /**
   * Additional styles
   */
  sx?: SxProps<Theme>;
  /**
   * HTML id attribute for the form control
   */
  id?: string;
  /**
   * Additional props for the FormControl component
   */
  formControlProps?: object;
}

/**
 * A standardized form field wrapper that provides consistent styling, labels, help text,
 * and error states for form controls.
 * 
 * @component
 * @example
 * <FormField 
 *   label="Email"
 *   helperText="Enter your email address"
 *   error={errors.email ? 'Invalid email' : false}
 *   required
 * >
 *   <TextField id="email" />
 * </FormField>
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  helperText,
  error,
  required = false,
  sx = {},
  id,
  formControlProps = {},
}) => {
  const errorMessage = typeof error === 'string' ? error : undefined;
  const showError = !!error;
  const showHelperText = helperText || showError;

  return (
    <FormControl 
      fullWidth 
      error={showError} 
      required={required}
      sx={{ mb: 3, ...sx }}
      id={id}
      {...formControlProps}
    >
      {label && (
        <FormLabel 
          htmlFor={id} 
          sx={{ 
            mb: 1, 
            color: 'text.primary',
            fontWeight: 500,
            '&.Mui-required::after': {
              content: '" *"',
              color: 'error.main',
            }
          }}
        >
          {label}
        </FormLabel>
      )}
      <Box>
        {children}
      </Box>
      {showHelperText && (
        <FormHelperText error={showError}>
          {errorMessage || helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default FormField;
