import React from 'react';
import {
  Autocomplete,
  TextField,
  Paper,
  Box,
  Chip,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Search } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: SelectOption | SelectOption[] | null;
  onChange?: (value: SelectOption | SelectOption[] | null) => void;
  label?: string;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  searchPlaceholder?: string;
}

/**
 * M3Select - Material 3 Expressive Select with Search
 * 
 * Features:
 * - Based on MUI Autocomplete
 * - Uses Material Theme Builder tokens
 * - Input field uses surfaceContainerHigh background
 * - Dropdown Paper uses surfaceContainer
 * - Search functionality built-in
 * 
 * Local Styles Used:
 * - surfaceContainerHigh (#2D2831) - Input background
 * - surfaceContainer (#221E26) - Dropdown background
 * - primary (#DAB9FF) - Focus/active states
 * - onSurface (#E9E0EB) - Text color
 * - outline (#978D9E) - Border
 * - outlineVariant (#4B4452) - Subtle borders
 */

// Styled Autocomplete using M3 tokens
const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.surface.containerHigh,
    borderRadius: 12,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    transition: 'all var(--sys-motion-duration-medium2) cubic-bezier(0.4, 0, 0.2, 1)',
    '& fieldset': {
      borderColor: theme.palette.outline.main,
      borderWidth: 1,
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.surface.containerHighest, 0.9),
      '& fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.surface.containerHighest,
      '& fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
    '&.Mui-disabled': {
      backgroundColor: alpha(theme.palette.surface.containerHigh, 0.5),
      '& fieldset': {
        borderColor: theme.palette.outline.variant,
      },
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiAutocomplete-input': {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    color: theme.palette.text.primary,
  },
})) as typeof Autocomplete;

// Styled Paper for dropdown using M3 tokens
const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.surface.container,
  borderRadius: 12,
  border: `1px solid ${theme.palette.outline.variant}`,
  boxShadow: 'none',
  marginTop: 8,
  '& .MuiAutocomplete-listbox': {
    padding: 8,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    '& .MuiAutocomplete-option': {
      borderRadius: 8,
      padding: '12px 16px',
      marginBottom: 4,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      color: theme.palette.text.primary,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:last-child': {
        marginBottom: 0,
      },
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
      },
      '&.Mui-focused': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
      },
      '&[aria-selected="true"]': {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
        color: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.25),
        },
      },
    },
  },
  '& .MuiAutocomplete-noOptions': {
    padding: 'var(--sys-space-md)',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    color: theme.palette.text.secondary,
  },
}));

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder,
  multiple = false,
  disabled = false,
  error = false,
  helperText,
  required = false,
  searchPlaceholder = 'Search...',
}) => {
  return (
    <StyledAutocomplete
      options={options}
      value={value}
      onChange={(_, newValue) => {
        if (onChange) {
          onChange(newValue);
        }
      }}
      multiple={multiple}
      disabled={disabled}
      disableCloseOnSelect={multiple}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      PaperComponent={StyledPaper}
      popupIcon={<Search size={20} />}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder || searchPlaceholder}
          error={error}
          helperText={helperText}
          required={required}
          sx={{
            '& .MuiFormHelperText-root': {
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              marginLeft: 0,
              marginTop: 1,
            },
          }}
        />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option.value}
            label={option.label}
            size="small"
            sx={{
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.2),
              color: (theme) => theme.palette.primary.main,
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              borderRadius: 2,
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
              '& .MuiChip-deleteIcon': {
                color: (theme) => theme.palette.primary.main,
                '&:hover': {
                  color: (theme) => theme.palette.primary.light,
                },
              },
            }}
          />
        ))
      }
      sx={{
        width: '100%',
      }}
    />
  );
};

export default Select;
