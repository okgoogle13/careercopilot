import React from 'react';
import styles from './progress.module.css';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'determinate' | 'indeterminate';
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, variant = 'determinate', className, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div
        ref={ref}
        className={styles.progress + ' ' + styles['progress--' + variant] + (className ? ' ' + className : '')}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        <div
          className={styles['progress-bar']}
          style={variant === 'determinate' ? { width: percentage + '%' } : {}}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';
