import React from 'react';
import styles from './separator.module.css';

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  ({ orientation = 'horizontal', className, ...props }, ref) => {
    const orientationClass = orientation === 'vertical' ? styles['separator--vertical'] : styles['separator--horizontal'];
    return (
      <hr
        ref={ref}
        className={styles.separator + ' ' + orientationClass + (className ? ' ' + className : '')}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';
