/**
 * ELECTRIC ALCHEMIST: TABLE COMPONENT
 * Data table with Data tier typography
 */

import * as React from 'react';
import { cn } from '../../../lib/cn';

export interface ElectricTableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export const ElectricTable = React.forwardRef<HTMLTableElement, ElectricTableProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="w-full overflow-auto">
        <table
          ref={ref}
          className={cn(
            'w-full border-collapse',
            'text-ai',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
ElectricTable.displayName = 'ElectricTable';

export interface ElectricTableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const ElectricTableHeader = React.forwardRef<HTMLTableSectionElement, ElectricTableHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={cn('border-b-2 border-outline-variant', className)}
        {...props}
      />
    );
  }
);
ElectricTableHeader.displayName = 'ElectricTableHeader';

export interface ElectricTableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const ElectricTableBody = React.forwardRef<HTMLTableSectionElement, ElectricTableBodyProps>(
  ({ className, ...props }, ref) => {
    return <tbody ref={ref} className={cn(className)} {...props} />;
  }
);
ElectricTableBody.displayName = 'ElectricTableBody';

export interface ElectricTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const ElectricTableRow = React.forwardRef<HTMLTableRowElement, ElectricTableRowProps>(
  ({ className, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          'border-b border-outline-variant',
          'transition-colors duration-150',
          'hover:bg-surface-container-low',
          className
        )}
        {...props}
      />
    );
  }
);
ElectricTableRow.displayName = 'ElectricTableRow';

export interface ElectricTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const ElectricTableHead = React.forwardRef<HTMLTableCellElement, ElectricTableHeadProps>(
  ({ className, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn(
          'px-4 py-3 text-left',
          'text-data font-data uppercase',
          'text-outline',
          className
        )}
        {...props}
      />
    );
  }
);
ElectricTableHead.displayName = 'ElectricTableHead';

export interface ElectricTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const ElectricTableCell = React.forwardRef<HTMLTableCellElement, ElectricTableCellProps>(
  ({ className, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn(
          'px-4 py-3',
          'text-ai',
          className
        )}
        {...props}
      />
    );
  }
);
ElectricTableCell.displayName = 'ElectricTableCell';
