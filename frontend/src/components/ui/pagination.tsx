import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  showPageNumbers = true,
  maxVisiblePages = 7,
  size = 'default',
  className,
  disabled = false,
}: PaginationProps) {
  const getVisiblePages = (): (number | 'ellipsis')[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const sidePages = Math.floor((maxVisiblePages - 3) / 2); // -3 for first, last, and current
    const showLeftEllipsis = currentPage > sidePages + 2;
    const showRightEllipsis = currentPage < totalPages - sidePages - 1;

    const pages: (number | 'ellipsis')[] = [];

    // Always show first page
    pages.push(1);

    // Show left ellipsis
    if (showLeftEllipsis) {
      pages.push('ellipsis');
    }

    // Calculate start and end of middle pages
    let start = Math.max(2, currentPage - sidePages);
    let end = Math.min(totalPages - 1, currentPage + sidePages);

    // Adjust range if we're near the beginning or end
    if (!showLeftEllipsis) {
      end = Math.min(totalPages - 1, maxVisiblePages - 1);
    }
    if (!showRightEllipsis) {
      start = Math.max(2, totalPages - maxVisiblePages + 2);
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Show right ellipsis
    if (showRightEllipsis) {
      pages.push('ellipsis');
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const buttonSizes = {
    sm: 'h-8 w-8 text-sm',
    default: 'h-9 w-9',
    lg: 'h-10 w-10 text-lg',
  };

  const buttonSize = buttonSizes[size];

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      role='navigation'
      aria-label='Pagination Navigation'
      className={cn('flex items-center justify-center space-x-1', className)}
    >
      {/* First Page Button */}
      {showFirstLast && (
        <Button
          variant='outline'
          size={size}
          onClick={() => onPageChange(1)}
          disabled={disabled || currentPage === 1}
          className={cn(buttonSize, 'hidden sm:inline-flex')}
          aria-label='Go to first page'
        >
          <ChevronLeft className='h-4 w-4' />
          <ChevronLeft className='h-4 w-4 -ml-2' />
        </Button>
      )}

      {/* Previous Page Button */}
      {showPrevNext && (
        <Button
          variant='outline'
          size={size}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={disabled || currentPage === 1}
          className={buttonSize}
          aria-label='Go to previous page'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>
      )}

      {/* Page Numbers */}
      {showPageNumbers && (
        <>
          {visiblePages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className={cn(
                    'flex items-center justify-center',
                    buttonSize,
                    'text-muted-foreground'
                  )}
                  aria-hidden='true'
                >
                  <MoreHorizontal className='h-4 w-4' />
                </span>
              );
            }

            const isCurrentPage = page === currentPage;

            return (
              <Button
                key={page}
                variant={isCurrentPage ? 'default' : 'outline'}
                size={size}
                onClick={() => onPageChange(page)}
                disabled={disabled}
                className={cn(buttonSize, isCurrentPage && 'pointer-events-none')}
                aria-label={`Go to page ${page}`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {page}
              </Button>
            );
          })}
        </>
      )}

      {/* Next Page Button */}
      {showPrevNext && (
        <Button
          variant='outline'
          size={size}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={disabled || currentPage === totalPages}
          className={buttonSize}
          aria-label='Go to next page'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
      )}

      {/* Last Page Button */}
      {showFirstLast && (
        <Button
          variant='outline'
          size={size}
          onClick={() => onPageChange(totalPages)}
          disabled={disabled || currentPage === totalPages}
          className={cn(buttonSize, 'hidden sm:inline-flex')}
          aria-label='Go to last page'
        >
          <ChevronRight className='h-4 w-4' />
          <ChevronRight className='h-4 w-4 -ml-2' />
        </Button>
      )}
    </nav>
  );
}

// Compact Pagination for mobile/small screens
interface CompactPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  disabled?: boolean;
}

export function CompactPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  disabled = false,
}: CompactPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      role='navigation'
      aria-label='Compact Pagination Navigation'
      className={cn('flex items-center justify-between', className)}
    >
      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        className='flex items-center gap-2'
      >
        <ChevronLeft className='h-4 w-4' />
        Previous
      </Button>

      <span className='text-sm text-muted-foreground'>
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        className='flex items-center gap-2'
      >
        Next
        <ChevronRight className='h-4 w-4' />
      </Button>
    </nav>
  );
}

// Pagination with page size selector
interface PaginationWithPageSizeProps extends PaginationProps {
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  totalItems: number;
  showPageSizeSelector?: boolean;
}

export function PaginationWithPageSize({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  totalItems,
  showPageSizeSelector = true,
  className,
  ...paginationProps
}: PaginationWithPageSizeProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}>
      <div className='flex items-center gap-4 text-sm text-muted-foreground'>
        <span>
          Showing {startItem} to {endItem} of {totalItems} results
        </span>

        {showPageSizeSelector && (
          <div className='flex items-center gap-2'>
            <span>Show</span>
            <select
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
              className='border border-input bg-background px-2 py-1 rounded text-sm'
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>per page</span>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        {...paginationProps}
      />
    </div>
  );
}
