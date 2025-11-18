import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField, Paper, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Calendar } from 'lucide-react';

export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disablePast?: boolean;
  disableFuture?: boolean;
}

/**
 * M3DatePicker - Material 3 Expressive Date Picker
 * 
 * Features:
 * - Based on MUI X DatePicker
 * - Uses Material Theme Builder tokens
 * - Input field matches MuiTextField style (surfaceContainerHigh)
 * - Calendar Paper uses surfaceContainer
 * - Selected dates use primary color
 * 
 * Local Styles Used:
 * - surfaceContainerHigh (#2D2831) - Input background
 * - surfaceContainer (#221E26) - Calendar background
 * - primary (#DAB9FF) - Selected date, focus states
 * - onSurface (#E9E0EB) - Text color
 * - outline (#978D9E) - Border
 */

// Styled TextField for consistent input styling
const StyledTextField = styled(TextField)(({ theme }) => ({
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
  '& .MuiInputBase-input': {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    color: theme.palette.text.primary,
  },
  '& .MuiFormHelperText-root': {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    marginLeft: 0,
    marginTop: 1,
  },
}));

// Styled Paper for calendar popup
const CalendarPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.surface.container,
  borderRadius: 16,
  border: `1px solid ${theme.palette.outline.variant}`,
  boxShadow: 'none',
  padding: 16,
  marginTop: 8,
  '& .MuiPickersCalendarHeader-root': {
    fontFamily: '"Roboto Flex", "Roboto", sans-serif',
    color: theme.palette.text.primary,
    marginBottom: 16,
    paddingLeft: 8,
    paddingRight: 8,
  },
  '& .MuiPickersCalendarHeader-label': {
    fontFamily: '"Roboto Flex", "Roboto", sans-serif',
    fontWeight: 600,
    fontSize: '1rem',
  },
  '& .MuiDayCalendar-header': {
    '& .MuiTypography-root': {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      color: theme.palette.text.secondary,
      fontWeight: 500,
    },
  },
  '& .MuiPickersDay-root': {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    color: theme.palette.text.primary,
    borderRadius: 8,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      fontWeight: 600,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    '&.MuiPickersDay-today': {
      border: `2px solid ${theme.palette.primary.main}`,
      backgroundColor: 'transparent',
      '&:not(.Mui-selected)': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
  '& .MuiPickersYear-yearButton': {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    color: theme.palette.text.primary,
    borderRadius: 8,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      fontWeight: 600,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
  '& .MuiIconButton-root': {
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
    },
  },
}));

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  error = false,
  helperText,
  required = false,
  minDate,
  maxDate,
  disablePast = false,
  disableFuture = false,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        value={value}
        onChange={onChange}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        disablePast={disablePast}
        disableFuture={disableFuture}
        slots={{
          textField: StyledTextField,
          desktopPaper: CalendarPaper,
        }}
        slotProps={{
          textField: {
            label,
            placeholder,
            error,
            helperText,
            required,
            fullWidth: true,
            InputProps: {
              endAdornment: (
                <Calendar
                  size={20}
                  style={{ color: 'currentColor', marginRight: 8 }}
                />
              ),
            },
          },
          openPickerIcon: {
            sx: { display: 'none' },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
