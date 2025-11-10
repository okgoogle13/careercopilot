import React from 'react';
import { TextField, InputAdornment, IconButton, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Search, X } from 'lucide-react';

export interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  autoFocus?: boolean;
  onSearch?: (value: string) => void;
}

/**
 * M3SearchInput - Material 3 Expressive Search Input
 * 
 * Features:
 * - Based on MUI TextField with InputAdornment
 * - Uses Material Theme Builder tokens
 * - Background uses surfaceContainerHigh
 * - Border on hover/focus uses primary
 * - Built-in clear button
 * 
 * Local Styles Used:
 * - surfaceContainerHigh (#2D2831) - Background
 * - primary (#DAB9FF) - Focus border, icons on hover
 * - onSurface (#E9E0EB) - Text color
 * - outline (#978D9E) - Border
 * - outlineVariant (#4B4452) - Subtle borders
 */

const StyledSearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.surface.containerHigh,
    borderRadius: 12,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: '1rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
      '& .MuiInputAdornment-root .MuiSvgIcon-root': {
        color: theme.palette.primary.main,
      },
    },
    '&.Mui-disabled': {
      backgroundColor: alpha(theme.palette.surface.containerHigh, 0.5),
      '& fieldset': {
        borderColor: theme.palette.outline.variant,
      },
    },
  },
  '& .MuiInputBase-input': {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    color: theme.palette.text.primary,
    padding: '12px 0',
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 1,
    },
  },
  '& .MuiInputAdornment-root': {
    color: theme.palette.text.secondary,
  },
}));

export const SearchInput: React.FC<SearchInputProps> = ({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  disabled = false,
  fullWidth = true,
  autoFocus = false,
  onSearch,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleClear = () => {
    if (onChange) {
      onChange('');
    }
    if (onClear) {
      onClear();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <StyledSearchInput
      value={value}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      fullWidth={fullWidth}
      autoFocus={autoFocus}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search size={20} />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClear}
              edge="end"
              size="small"
              disabled={disabled}
              sx={{
                color: (theme) => theme.palette.text.secondary,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.12),
                  color: (theme) => theme.palette.primary.main,
                },
              }}
            >
              <X size={18} />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
};

export default SearchInput;
