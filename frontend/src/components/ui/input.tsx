/**
 * @file Provides a styled Input component.
 *
 * This file defines a custom `Input` component based on Material-UI's TextField.
 * It is styled to match the application's design system, providing a consistent
 * look and feel for all text input fields.
 */
import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * A private styled version of the MUI TextField.
 * It applies custom border radius and border colors for different states.
 * @internal
 */
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1),
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

/**
 * Props for the custom Input component.
 * Extends MUI's TextFieldProps but simplifies the variant options.
 */
export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  /**
   * The visual style of the input.
   * Note: 'default' maps to 'outlined'.
   * @default 'outlined'
   */
  variant?: 'default' | 'outlined' | 'filled';
}

/**
 * A styled text input component for use in forms and other input scenarios.
 *
 * This component is a wrapper around Material-UI's `TextField` and is styled
 * to ensure a consistent appearance across the application. It defaults to the
 * 'outlined' variant and takes up the full width of its container.
 *
 * @param {InputProps} props - The props for the component, which are passed down to the MUI TextField.
 * @param {React.Ref<HTMLInputElement>} ref - The ref to forward to the underlying input element.
 * @returns {JSX.Element} The rendered Input component.
 *
 * @example
 * <Input
 *   label="Email Address"
 *   placeholder="you@example.com"
 *   type="email"
 * />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'outlined', ...props }, ref) => {
    return (
      <StyledTextField
        ref={ref}
        variant={variant === 'default' ? 'outlined' : variant}
        fullWidth
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
