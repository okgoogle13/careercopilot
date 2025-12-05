/**
 * ELECTRIC ALCHEMIST: TABLE COMPONENT
 *
 * Table component with design system tokens.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="w-full overflow-auto">
        <table
          ref={ref}
          className={cn(
            'w-full border-collapse',
            'text-human text-sm',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Table.displayName = 'Table';

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ className, ...props }, ref) => {
  return (
    <thead
      ref={ref}
      className={cn('bg-surface-container-low', className)}
      {...props}
    />
  );
});

TableHeader.displayName = 'TableHeader';

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ className, ...props }, ref) => {
  return <tbody ref={ref} className={className} {...props} />;
});

TableBody.displayName = 'TableBody';

export interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(({ className, ...props }, ref) => {
  return (
    <tfoot
      ref={ref}
      className={cn(
        'bg-surface-container-low border-t border-outline-variant',
        className
      )}
      {...props}
    />
  );
});

TableFooter.displayName = 'TableFooter';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  hover?: boolean;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, hover = false, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          'border-b border-outline-variant',
          hover && 'hover:bg-surface-container transition-colors duration-150',
          className
        )}
        {...props}
      />
    );
  }
);

TableRow.displayName = 'TableRow';

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  TableHeadProps
>(
  (
    {
      className,
      children,
      sortable = false,
      sortDirection = null,
      onSort,
      ...props
    },
    ref
  ) => {
    return (
      <th
        ref={ref}
        className={cn(
          'px-4 py-3 text-left',
          'text-ai text-xs font-medium text-on-surface-variant',
          'uppercase tracking-wider',
          sortable && 'cursor-pointer select-none',
          className
        )}
        onClick={sortable ? onSort : undefined}
        {...props}
      >
        <div className="flex items-center gap-2">
          {children}
          {sortable && (
            <span className="inline-flex flex-col">
              <ChevronUp
                className={cn(
                  'h-3 w-3',
                  sortDirection === 'asc'
                    ? 'text-primary'
                    : 'text-on-surface-variant opacity-30'
                )}
              />
              <ChevronDown
                className={cn(
                  'h-3 w-3 -mt-1',
                  sortDirection === 'desc'
                    ? 'text-primary'
                    : 'text-on-surface-variant opacity-30'
                )}
              />
            </span>
          )}
        </div>
      </th>
    );
  }
);

TableHead.displayName = 'TableHead';

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  TableCellProps
>(({ className, ...props }, ref) => {
  return (
    <td
      ref={ref}
      className={cn('px-4 py-3 text-on-surface', className)}
      {...props}
    />
  );
});

TableCell.displayName = 'TableCell';

export interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {}

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, ...props }, ref) => {
  return (
    <caption
      ref={ref}
      className={cn(
        'mt-4 text-ai text-sm text-on-surface-variant',
        className
      )}
      {...props}
    />
  );
});

TableCaption.displayName = 'TableCaption';

export default Table;






