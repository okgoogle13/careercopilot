import React from 'react';
import {
  Alert as MuiAlert,
  AlertProps as MuiAlertProps,
  AlertTitle as MuiAlertTitle,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAlert = styled(MuiAlert)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  '& .MuiAlert-icon': {
    marginRight: theme.spacing(1),
  },
}));

export interface AlertProps extends Omit<MuiAlertProps, 'variant'> {
  variant?: 'default' | 'destructive';
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ children, variant = 'default', severity, ...props }, ref) => {
    const getSeverity = (variant: string): MuiAlertProps['severity'] => {
      switch (variant) {
        case 'destructive':
          return 'error';
        default:
          return severity || 'info';
      }
    };

    return (
      <StyledAlert ref={ref} severity={getSeverity(variant)} {...props}>
        {children}
      </StyledAlert>
    );
  }
);

Alert.displayName = 'Alert';

export interface AlertTitleProps extends React.ComponentProps<typeof Typography> {}

export const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ children, ...props }, ref) => {
    return (
      <Typography
        ref={ref}
        component="h5"
        variant="subtitle2"
        fontWeight={600}
        gutterBottom
        {...props}
      >
        {children}
      </Typography>
    );
  }
);

AlertTitle.displayName = 'AlertTitle';

export interface AlertDescriptionProps extends React.ComponentProps<typeof Typography> {}

export const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ children, ...props }, ref) => {
    return (
      <Typography ref={ref} variant="body2" {...props}>
        {children}
      </Typography>
    );
  }
);

AlertDescription.displayName = 'AlertDescription';
