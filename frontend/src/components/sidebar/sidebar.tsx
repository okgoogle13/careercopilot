import React from 'react';
import styles from './sidebar.module.css';

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ open = true, className, ...props }, ref) => (
    <div
      className={styles.sidebar + ' ' + (open ? styles['sidebar--open'] : styles['sidebar--closed']) + (className ? ' ' + className : '')}
      ref={ref}
      {...props}
    />
  )
);

Sidebar.displayName = 'Sidebar';

export const SidebarItem = ({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a className={styles['sidebar-item'] + (className ? ' ' + className : '')} {...props} />
);
