import React from 'react';
import {
  TextField,
  TextFieldProps,
  Box,
  SxProps,
  Theme,
} from '@mui/material';

export interface TextareaProps extends Omit<TextFieldProps, 'variant' | 'multiline'> {
  /** Additional class name for the textarea container */
  containerClassName?: string;
  /** Container sx props */
  containerSx?: SxProps<Theme>;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    containerClassName,
    containerSx,
    sx,
    placeholder,
    disabled,
    error = false,
    rows = 4,
    ...props
  }, ref) => {

    const textareaSx: SxProps<Theme> = {
      width: '100%',
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? 'rgba(0, 0, 0, 0.02)'
            : 'rgba(255, 255, 255, 0.05)',
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
        resize: 'none',
        minHeight: '64px',
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
          ...containerSx
        }}
        className={containerClassName}
      >
        <TextField
          ref={ref}
          variant="outlined"
          multiline
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          sx={textareaSx}
          {...props}
        />
      </Box>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };