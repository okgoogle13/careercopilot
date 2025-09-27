/**
 * @file Provides a set of composable Alert components.
 *
 * This file defines a custom `Alert` component system, built on top of
 * Material-UI's Alert. It includes `Alert`, `AlertTitle`, and `AlertDescription`
 * components that can be combined to create styled, accessible alert messages
 * consistent with the application's design system.
 */
import React from 'react';
import {
  Alert as MuiAlert,
  AlertProps as MuiAlertProps,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * A private styled version of the MUI Alert.
 * @internal
 */
const StyledAlert = styled(MuiAlert)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  '& .MuiAlert-icon': {
    marginRight: theme.spacing(1),
  },
}));

/**
 * Props for the main Alert component.
 */
export interface AlertProps extends Omit<MuiAlertProps, 'variant'> {
  /**
   * The variant of the alert, which determines its color and icon.
   * - `default`: Standard informational alert.
   * - `destructive`: An alert for critical errors or destructive actions.
   * @default 'default'
   */
  variant?: 'default' | 'destructive';
}

/**
 * A styled alert component for displaying important messages.
 *
 * It wraps the MUI Alert component and provides custom variants.
 *
 * @param {AlertProps} props - The props for the component.
 * @param {React.Ref<HTMLDivElement>} ref - The ref to forward to the underlying div element.
 * @returns {JSX.Element} The rendered Alert component.
 *
 * @example
 * <Alert variant="destructive">
 *   <AlertTitle>Error</AlertTitle>
 *   <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
 * </Alert>
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ children, variant = 'default', severity, ...props }, ref) => {
    const getSeverity = (v: string): MuiAlertProps['severity'] => {
      if (v === 'destructive') {
        return 'error';
      }
      return severity || 'info';
    };

    return (
      <StyledAlert ref={ref} severity={getSeverity(variant)} {...props}>
        {children}
      </StyledAlert>
    );
  }
);
Alert.displayName = 'Alert';

/**
 * Props for the AlertTitle component. Extends Typography props.
 */
export interface AlertTitleProps extends React.ComponentProps<typeof Typography> {}

/**
 * A component for rendering the title of an Alert.
 *
 * It should be used inside an `Alert` component to provide a consistently
 * styled title. It renders an `<h5>` tag with appropriate typography.
 *
 * @param {AlertTitleProps} props - The props for the component.
 * @param {React.Ref<HTMLHeadingElement>} ref - The ref to forward to the underlying heading element.
 * @returns {JSX.Element} The rendered AlertTitle component.
 */
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

/**
 * Props for the AlertDescription component. Extends Typography props.
 */
export interface AlertDescriptionProps extends React.ComponentProps<typeof Typography> {}

/**
 * A component for rendering the description or body of an Alert.
 *
 * It should be used inside an `Alert` component, typically following an
 * `AlertTitle`, to provide the main content of the message.
 *
 * @param {AlertDescriptionProps} props - The props for the component.
 * @param {React.Ref<HTMLParagraphElement>} ref - The ref to forward to the underlying paragraph element.
 * @returns {JSX.Element} The rendered AlertDescription component.
 */
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
