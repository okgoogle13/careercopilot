import React, { forwardRef } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      disabled,
      className = '',
      showFirstLast = true,
      maxVisiblePages = 7,
    },
    ref
  ) => {
    const getPageNumbers = () => {
      const pages: (number | 'ellipsis')[] = [];

      if (totalPages <= maxVisiblePages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const leftSiblingIndex = Math.max(currentPage - 1, 1);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

      const shouldShowLeftEllipsis = leftSiblingIndex > 2;
      const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

      if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
        const leftRange = Array.from({ length: 5 }, (_, i) => i + 1);
        return [...leftRange, 'ellipsis', totalPages];
      }

      if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
        const rightRange = Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
        return [1, 'ellipsis', ...rightRange];
      }

      if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
        const middleRange = [currentPage - 1, currentPage, currentPage + 1];
        return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
      }

      return Array.from({ length: totalPages }, (_, i) => i + 1);
    };

    const pages = getPageNumbers();

    const handlePageClick = (page: number) => {
      if (disabled || page < 1 || page > totalPages || page === currentPage) return;
      onPageChange(page);
    };

    return (
      <div ref={ref} className={`flex items-center gap-2 ${className}`}>
        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={disabled || currentPage === 1}
          className={`
            px-3 py-2 flex items-center gap-2
            bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
            border-2 border-[var(--glass-border)] rounded-[var(--radius-lg)]
            text-[var(--on-surface)]
            transition-all duration-300
            hover:border-[var(--glass-border-hover)] hover:shadow-[var(--shadow-glow-aurora)] hover:-translate-y-0.5
            ${(disabled || currentPage === 1) && 'opacity-50 cursor-not-allowed'}
          `}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-[var(--on-surface-variant)]"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              );
            }

            const isActive = page === currentPage;

            return (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                disabled={disabled}
                className={`
                  min-w-[2.5rem] px-3 py-2 rounded-[var(--radius-lg)]
                  border-2 transition-all duration-300
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)] text-white border-transparent shadow-[var(--shadow-glow-aurora)]'
                      : 'bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] border-[var(--glass-border)] text-[var(--on-surface)] hover:border-[var(--glass-border-hover)] hover:shadow-[var(--shadow-glow-aurora)] hover:-translate-y-0.5'
                  }
                  ${disabled && 'opacity-50 cursor-not-allowed'}
                `}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={disabled || currentPage === totalPages}
          className={`
            px-3 py-2 flex items-center gap-2
            bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
            border-2 border-[var(--glass-border)] rounded-[var(--radius-lg)]
            text-[var(--on-surface)]
            transition-all duration-300
            hover:border-[var(--glass-border-hover)] hover:shadow-[var(--shadow-glow-aurora)] hover:-translate-y-0.5
            ${(disabled || currentPage === totalPages) && 'opacity-50 cursor-not-allowed'}
          `}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }
);

Pagination.displayName = 'Pagination';
