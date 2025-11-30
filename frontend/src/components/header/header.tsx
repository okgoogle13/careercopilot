import React from 'react';
import styles from './header.module.css';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, ...props }, ref) => (
    <header className={styles.header + (className ? ' ' + className : '')} ref={ref} {...props} />
  )
);

Header.displayName = 'Header';
