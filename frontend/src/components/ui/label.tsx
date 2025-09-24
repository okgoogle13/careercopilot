import React from 'react';
import {
  FormLabel,
  FormLabelProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledLabel = styled(FormLabel)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),
  display: 'block',
}));

export interface LabelProps extends FormLabelProps {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, ...props }, ref) => {
    return (
      <StyledLabel ref={ref} {...props}>
        {children}
      </StyledLabel>
    );
  }
);

Label.displayName = 'Label';