import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

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

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'default' | 'outlined' | 'filled';
}

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
