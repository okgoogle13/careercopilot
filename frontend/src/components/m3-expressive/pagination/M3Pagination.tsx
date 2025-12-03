/**
 * M3 Expressive Pagination Component
 * Implements Material Design 3 Pagination for CareerCopilot
 *
 * Page navigation component. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Pagination.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useMemo } from 'react';
import './M3Pagination.css';
import { M3Button } from '../button/M3Button';

export interface M3PaginationProps {
  /**
   * Current page (1-based)
   */
  page: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Change handler
   */
  onChange: (page: number) => void;

  /**
   * Number of page buttons to show (excluding first/last/prev/next)
   * @default 5
   */
  siblingCount?: number;

  /**
   * Color role from M3 palette
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';

  /**
   * If true, shows first/last page buttons
   * @default true
   */
  showFirstLast?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Pagination component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Pagination
 *   page={currentPage}
 *   totalPages={10}
 *   onChange={(page) => setCurrentPage(page)}
 * />
 * ```
 */
export const M3Pagination: React.FC<M3PaginationProps> = ({
  page,
  totalPages,
  onChange,
  siblingCount = 5,
  color = 'primary',
  showFirstLast = true,
  className = '',
}) => {
  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];
    const totalNumbers = siblingCount + 5; // siblingCount + first + last + current + 2 ellipsis

    if (totalPages <= totalNumbers) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftSiblingIndex = Math.max(page - siblingCount, 1);
      const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

      const shouldShowLeftEllipsis = leftSiblingIndex > 2;
      const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

      if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
        const leftItemCount = 3 + 2 * siblingCount;
        const leftRange: number[] = [];
        for (let i = 1; i <= leftItemCount; i++) {
          leftRange.push(i);
        }
        pages.push(...leftRange, 'ellipsis', totalPages);
      } else if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
        const rightItemCount = 3 + 2 * siblingCount;
        const rightRange: number[] = [];
        for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
          rightRange.push(i);
        }
        pages.push(1, 'ellipsis', ...rightRange);
      } else if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
        const middleRange: number[] = [];
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          middleRange.push(i);
        }
        pages.push(1, 'ellipsis', ...middleRange, 'ellipsis', totalPages);
      }
    }

    return pages;
  }, [page, totalPages, siblingCount]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onChange(newPage);
    }
  };

  const classNames = [
    'm3-pagination',
    `m3-pagination--${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (totalPages <= 1) return null;

  return (
    <nav className={classNames} aria-label="Pagination">
      <div className="m3-pagination__controls">
        {showFirstLast && (
          <M3Button
            variant="text"
            color={color}
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
            aria-label="First page"
          >
            ««
          </M3Button>
        )}
        <M3Button
          variant="text"
          color={color}
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          ‹
        </M3Button>

        {pageNumbers.map((pageNum, index) => {
          if (pageNum === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className="m3-pagination__ellipsis" aria-hidden="true">
                ...
              </span>
            );
          }

          return (
            <M3Button
              key={pageNum}
              variant={pageNum === page ? 'filled' : 'text'}
              color={color}
              onClick={() => handlePageChange(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={pageNum === page ? 'page' : undefined}
            >
              {pageNum}
            </M3Button>
          );
        })}

        <M3Button
          variant="text"
          color={color}
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          ›
        </M3Button>
        {showFirstLast && (
          <M3Button
            variant="text"
            color={color}
            onClick={() => handlePageChange(totalPages)}
            disabled={page === totalPages}
            aria-label="Last page"
          >
            »»
          </M3Button>
        )}
      </div>
    </nav>
  );
};

M3Pagination.displayName = 'M3Pagination';

export default M3Pagination;
