import React from 'react';
import styles from './pagination.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ currentPage = 1, totalPages = 10, onPageChange, className, ...props }, ref) => {
    const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => currentPage + i - 2).filter(p => p > 0 && p <= totalPages);

    return (
      <div className={styles.pagination + (className ? ' ' + className : '')} ref={ref} {...props}>
        <button onClick={() => onPageChange?.(Math.max(1, currentPage - 1))} className={styles['pagination-btn']} disabled={currentPage === 1}>
          <ChevronLeft size={16} />
        </button>
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange?.(page)}
            className={styles['pagination-btn'] + ' ' + (page === currentPage ? styles['pagination-btn--active'] : '')}
          >
            {page}
          </button>
        ))}
        <button onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))} className={styles['pagination-btn']} disabled={currentPage === totalPages}>
          <ChevronRight size={16} />
        </button>
      </div>
    );
  }
);

Pagination.displayName = 'Pagination';
