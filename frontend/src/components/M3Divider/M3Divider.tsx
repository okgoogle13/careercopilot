import React from 'react';
import styles from './M3Divider.module.css';

export interface M3DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const M3Divider = React.forwardRef<HTMLDivElement, M3DividerProps>(
  ({ orientation = 'horizontal', className, ...props }, ref) => {
    const orientClass = orientation === 'vertical' ? styles['divider--vertical'] : styles['divider--horizontal'];
    return (
      <div
        ref={ref}
        className={styles.divider + ' ' + orientClass + (className ? ' ' + className : '')}
        {...props}
      />
    );
  }
);

M3Divider.displayName = 'M3Divider';
