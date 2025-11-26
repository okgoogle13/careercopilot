import React from 'react';
import { M3Alert } from '../M3Alert/M3Alert';
import type { M3AlertProps } from '../M3Alert/M3Alert';

export type AlertProps = M3AlertProps & {
  variant?: 'default' | 'destructive';
};

/**
 * Migrated to M3Alert - uses M3 design tokens instead of MUI theme
 * Maps variant 'destructive' to severity 'error'
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ children, variant = 'default', severity, ...props }, ref) => {
    const getSeverity = (variant: string): M3AlertProps['severity'] => {
      switch (variant) {
        case 'destructive':
          return 'error';
        default:
          return severity || 'info';
      }
    };

    return (
      <M3Alert ref={ref} severity={getSeverity(variant)} {...props}>
        {children}
      </M3Alert>
    );
  }
);

Alert.displayName = 'Alert';

/**
 * AlertTitle wrapper for M3Alert title prop
 */
export const AlertTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} className="m3-alert__title" {...props}>
        {children}
      </div>
    );
  }
);

AlertTitle.displayName = 'AlertTitle';

/**
 * AlertDescription wrapper for M3Alert children content
 */
export const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} className="m3-alert__message" {...props}>
        {children}
      </div>
    );
  }
);

AlertDescription.displayName = 'AlertDescription';
