import React from 'react';
import {
  Switch as MuiSwitch,
  SwitchProps as MuiSwitchProps,
  FormControlLabel,
  FormControlLabelProps,
} from '@mui/material';

export interface SwitchProps extends MuiSwitchProps {
  label?: React.ReactNode;
  labelProps?: Omit<FormControlLabelProps, 'control' | 'label'>;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ label, labelProps, onCheckedChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(event.target.checked);
      }
      if (props.onChange) {
        props.onChange(event, event.target.checked);
      }
    };

    const switchElement = (
      <MuiSwitch
        ref={ref}
        {...props}
        onChange={handleChange}
      />
    );

    if (label) {
      return (
        <FormControlLabel
          control={switchElement}
          label={label}
          {...labelProps}
        />
      );
    }

    return switchElement;
  }
);

Switch.displayName = 'Switch';