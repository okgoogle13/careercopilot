import React from 'react';
import { TextField, TextFieldProps, InputAdornment, Box, SxProps, Theme } from '@mui/material';

export interface InputProps extends Omit<TextFieldProps, 'variant' | 'error'> {
  /** Whether the input has an error */
  error?: boolean;
  /** Optional icon to display inside the input */
  icon?: React.ReactNode;
  /** Additional class name for the input container */
  containerClassName?: string;
  /** Input container sx props */
  containerSx?: SxProps<Theme>;
}

/**
 * A customizable input component with support for icons and error states.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error = false,
      icon,
      containerClassName,
      containerSx,
      sx,
      placeholder,
      disabled,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputSx: SxProps<Theme> = {
      width: '100%',
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.05)',
        transition: 'all 0.2s ease-in-out',
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: error ? 'error.main' : 'action.active',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: error ? 'error.main' : 'primary.main',
          borderWidth: '2px',
        },
        '&.Mui-disabled': {
          backgroundColor: 'action.disabledBackground',
          opacity: 0.5,
        },
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: error ? 'error.main' : 'divider',
      },
      '& .MuiInputBase-input': {
        fontSize: '0.875rem',
        padding: '12px 16px',
        '&::placeholder': {
          color: 'text.secondary',
          opacity: 0.7,
        },
        '&::selection': {
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
        },
      },
      ...sx,
    };

    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          ...containerSx,
        }}
        className={containerClassName}
      >
        <TextField
          ref={ref}
          variant="outlined"
          size="small"
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          sx={inputSx}
          InputProps={{
            startAdornment: icon ? (
              <InputAdornment position="start">
                <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                  {icon}
                </Box>
              </InputAdornment>
            ) : undefined,
          }}
          {...props}
        />
      </Box>
    );
  }
);

Input.displayName = 'Input';

export { Input };
