import React from 'react';
import styles from './Alert.module.css';

export type AlertSeverity = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  severity?: AlertSeverity;
  title?: string;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ severity = 'info', title, children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={[styles.alert, styles[`alert--${severity}`], className].filter(Boolean).join(' ')}
      role="alert"
      {...props}
    >
      <div>
        {title && <div className={styles['alert-title']}>{title}</div>}
        <div className={styles['alert-message']}>{children}</div>
      </div>
    </div>
  )
);

Alert.displayName = 'Alert';

export const AlertTitle = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={styles['alert-title']} {...props}>{children}</div>
);

export const AlertDescription = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={styles['alert-message']} {...props}>{children}</div>
);
