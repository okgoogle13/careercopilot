import React from 'react';
import {
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
  FormControlLabel,
  FormControlLabelProps,
} from '@mui/material';

export interface CheckboxProps extends MuiCheckboxProps {
  label?: React.ReactNode;
  labelProps?: Omit<FormControlLabelProps, 'control' | 'label'>;
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ label, labelProps, ...props }, ref) => {
    const checkbox = <MuiCheckbox ref={ref} {...props} />;

    if (label) {
      return <FormControlLabel control={checkbox} label={label} {...labelProps} />;
    }

    return checkbox;
  }
);

Checkbox.displayName = 'Checkbox';
