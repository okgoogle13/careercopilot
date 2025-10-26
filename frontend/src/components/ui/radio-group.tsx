import type {
  RadioGroupProps as MuiRadioGroupProps,
  RadioProps,
  FormControlLabelProps} from '@mui/material';
import {
  RadioGroup as MuiRadioGroup,
  Radio,
  FormControlLabel
} from '@mui/material';
import React from 'react';

export type RadioGroupProps = MuiRadioGroupProps

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ children, ...props }, ref) => {
    return (
      <MuiRadioGroup ref={ref} {...props}>
        {children}
      </MuiRadioGroup>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export interface RadioGroupItemProps extends RadioProps {
  value: string;
  label?: React.ReactNode;
  labelProps?: Omit<FormControlLabelProps, 'control' | 'label' | 'value'>;
}

export const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ value, label, labelProps, ...props }, ref) => {
    const radioElement = <Radio ref={ref} value={value} {...props} />;

    if (label) {
      return (
        <FormControlLabel value={value} control={radioElement} label={label} {...labelProps} />
      );
    }

    return radioElement;
  }
);

RadioGroupItem.displayName = 'RadioGroupItem';
