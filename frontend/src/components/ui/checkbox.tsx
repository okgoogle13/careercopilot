import type {
  CheckboxProps as MuiCheckboxProps,
  FormControlLabelProps} from '@mui/material';
import {
  Checkbox as MuiCheckbox,
  FormControlLabel
} from '@mui/material';
import React from 'react';

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
