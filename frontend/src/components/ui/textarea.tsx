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

export interface TextareaProps extends Omit<TextFieldProps, 'variant' | 'multiline'> {
  variant?: 'default' | 'outlined' | 'filled';
}

export const Textarea = React.forwardRef<HTMLDivElement, TextareaProps>(
  ({ variant = 'outlined', rows = 4, ...props }, ref) => {
    return (
      <StyledTextField
        ref={ref}
        variant={variant === 'default' ? 'outlined' : variant}
        multiline
        rows={rows}
        fullWidth
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
