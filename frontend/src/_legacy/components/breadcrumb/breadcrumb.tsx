import React from 'react';
import styles from './breadcrumb.module.css';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLOListElement> {}

export const Breadcrumb = React.forwardRef<HTMLOListElement, BreadcrumbProps>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={styles.breadcrumb + (className ? ' ' + className : '')}
      {...props}
    />
  )
);

Breadcrumb.displayName = 'Breadcrumb';

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  isCurrentPage?: boolean;
}

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ isCurrentPage, className, children, ...props }, ref) => (
    <li
      ref={ref}
      className={styles['breadcrumb-item'] + ' ' + (isCurrentPage ? styles['breadcrumb-item--current'] : '') + (className ? ' ' + className : '')}
      aria-current={isCurrentPage ? 'page' : undefined}
      {...props}
    >
      {children}
      {!isCurrentPage && <ChevronRight size={16} className={styles['breadcrumb-separator']} />}
    </li>
  )
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

export const BreadcrumbLink = ({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a className={styles['breadcrumb-link'] + (className ? ' ' + className : '')} {...props} />
);
