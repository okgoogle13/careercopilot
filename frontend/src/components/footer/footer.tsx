import React from 'react';
import styles from './footer.module.css';

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, ...props }, ref) => (
    <footer className={styles.footer + (className ? ' ' + className : '')} ref={ref} {...props} />
  )
);

Footer.displayName = 'Footer';
