/**
 * ELECTRIC ALCHEMIST: PAGINATION COMPONENT
 * Page navigation with Tactile Press
 */

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/cn';
import { tactilePress } from '../../../lib/motion';

export interface ElectricPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export const ElectricPagination: React.FC<ElectricPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}) => {
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];

    // Always show first page
    pages.push(1);

    // Calculate range
    const leftSibling = Math.max(currentPage - siblingCount, 2);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);

    // Add left ellipsis
    if (leftSibling > 2) {
      pages.push('...');
    }

    // Add middle pages
    for (let i = leftSibling; i <= rightSibling; i++) {
      pages.push(i);
    }

    // Add right ellipsis
    if (rightSibling < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center gap-2', className)}
    >
      {/* Previous Button */}
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variants={tactilePress}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        className={cn(
          'px-3 py-2 rounded-button',
          'bg-surface-container border border-outline-variant',
          'text-ai',
          'transition-colors duration-150',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-outline">
              ...
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <motion.button
            key={page}
            onClick={() => onPageChange(page as number)}
            variants={tactilePress}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className={cn(
              'px-4 py-2 rounded-button',
              'border border-outline-variant',
              'text-ai',
              'transition-colors duration-150',
              isActive
                ? 'bg-primary-container text-on-primary-container border-primary-container'
                : 'bg-surface-container hover:bg-surface-container-high'
            )}
          >
            {page}
          </motion.button>
        );
      })}

      {/* Next Button */}
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variants={tactilePress}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        className={cn(
          'px-3 py-2 rounded-button',
          'bg-surface-container border border-outline-variant',
          'text-ai',
          'transition-colors duration-150',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </nav>
  );
};

ElectricPagination.displayName = 'ElectricPagination';
