import React from 'react';
import styles from './card.module.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'filled' | 'outlined';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'elevated', className, ...props }, ref) => (
    <div
      ref={ref}
      className={styles.card + ' ' + styles['card--' + variant] + (className ? ' ' + className : '')}
      {...props}
    />
  )
);

Card.displayName = 'Card';

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={styles['card-header'] + (className ? ' ' + className : '')} {...props} />
);

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={styles['card-content'] + (className ? ' ' + className : '')} {...props} />
);

export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={styles['card-footer'] + (className ? ' ' + className : '')} {...props} />
);
