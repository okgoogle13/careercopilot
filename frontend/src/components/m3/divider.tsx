import React from 'react';
import styles from './divider.module.css';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = 'horizontal', className, ...props }, ref) => {
    const orientationClass = orientation === 'vertical' ? styles['divider--vertical'] : styles['divider--horizontal'];

    return (
      <div
        ref={ref}
        className={styles.divider + ' ' + orientationClass + (className ? ' ' + className : '')}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
