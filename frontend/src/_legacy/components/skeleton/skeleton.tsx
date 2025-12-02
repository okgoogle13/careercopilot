import React from 'react';
import styles from './skeleton.module.css';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'text', width, height, animation = 'pulse', className, style, ...props }, ref) => {
    const animationClass = styles['skeleton--' + animation];
    const variantClass = styles['skeleton--' + variant];

    return (
      <div
        ref={ref}
        className={styles.skeleton + ' ' + variantClass + ' ' + animationClass + (className ? ' ' + className : '')}
        style={{
          width: typeof width === 'number' ? width + 'px' : width,
          height: typeof height === 'number' ? height + 'px' : height,
          ...style,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
