/**
 * ELECTRIC ALCHEMIST: DATA TABLE
 *
 * Reusable data table component with sorting and pagination using Electric Alchemist Design System v4.4.
 */

import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components';
import { Button } from '@/components';
import { cn } from '@/lib/utils';

type Order = 'asc' | 'desc';

export interface Column<T> {
  id: keyof T | 'actions';
  label: string;
  minWidth?: number;
  sortable?: boolean;
  renderCell?: (value: any, row: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: keyof T;
  totalItems?: number;
  initialSortBy?: keyof T;
  initialSortOrder?: Order;
  onSortChange?: (sortBy: keyof T, sortOrder: Order) => void;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  page?: number;
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  loading?: boolean;
  emptyComponent?: React.ReactNode;
  showPagination?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  rowKey,
  totalItems = 0,
  initialSortBy,
  initialSortOrder = 'asc',
  onSortChange,
  onPageChange,
  onRowsPerPageChange,
  page: controlledPage,
  rowsPerPage: controlledRowsPerPage,
  rowsPerPageOptions = [10, 25, 50],
  loading = false,
  emptyComponent,
  showPagination = true,
}: DataTableProps<T>) {
  const [uncontrolledPage, setUncontrolledPage] = useState(0);
  const [uncontrolledRowsPerPage, setUncontrolledRowsPerPage] = useState(rowsPerPageOptions[0] || 10);
  const [order, setOrder] = useState<Order>(initialSortOrder);
  const [orderBy, setOrderBy] = useState<keyof T | undefined>(initialSortBy);

  const page = controlledPage ?? uncontrolledPage;
  const rowsPerPage = controlledRowsPerPage ?? uncontrolledRowsPerPage;

  const handleRequestSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';

    setOrder(newOrder);
    setOrderBy(property);

    if (onSortChange) {
      onSortChange(property, newOrder);
    }
  };

  const handleChangePage = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setUncontrolledPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);

    if (onRowsPerPageChange) {
      onRowsPerPageChange(newRowsPerPage);
    } else {
      setUncontrolledRowsPerPage(newRowsPerPage);
    }

    if (onPageChange) {
      onPageChange(0);
    } else {
      setUncontrolledPage(0);
    }
  };

  const sortedData = useMemo(() => {
    if (!orderBy || onSortChange) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue === bValue) return 0;
      if (aValue == null) return order === 'asc' ? -1 : 1;
      if (bValue == null) return order === 'asc' ? 1 : -1;

      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, order, orderBy, onSortChange]);

  const paginatedData = useMemo(() => {
    if (!showPagination || onPageChange) {
      return sortedData;
    }
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage, onPageChange, showPagination]);

  const defaultEmptyState = (
    <TableRow>
      <TableCell colSpan={columns.length} align="center" className="py-8">
        <p className="text-human text-base text-on-surface-variant">No data available</p>
      </TableCell>
    </TableRow>
  );

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-human text-base">Loading...</p>
      </div>
    );
  }

  const totalPages = onPageChange
    ? Math.ceil(totalItems / rowsPerPage)
    : Math.ceil(sortedData.length / rowsPerPage);

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={String(column.id)}
                className={cn(
                  'text-left',
                  column.minWidth && `min-w-[${column.minWidth}px]`
                )}
              >
                {column.sortable ? (
                  <button
                    onClick={() => column.sortable && handleRequestSort(column.id as keyof T)}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    {column.label}
                    {orderBy === column.id ? (
                      order === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    ) : (
                      <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    )}
                  </button>
                ) : (
                  column.label
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length === 0 ? (
            emptyComponent || defaultEmptyState
          ) : (
            paginatedData.map((row) => (
              <TableRow key={String(row[rowKey])} className="hover:bg-surface-container-low">
                {columns.map((column) => {
                  const value = row[column.id as keyof T];
                  const cellValue = column.renderCell ? column.renderCell(value, row) : value;

                  return (
                    <TableCell key={String(column.id)} align={column.align}>
                      {cellValue}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {showPagination && (
        <div className="flex items-center justify-between mt-4 px-4">
          <div className="flex items-center gap-2">
            <span className="text-data text-sm text-on-surface-variant">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="bg-surface-container border border-outline-variant rounded px-2 py-1 text-data text-sm"
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-data text-sm text-on-surface-variant">
              {page * rowsPerPage + 1}-
              {Math.min((page + 1) * rowsPerPage, onPageChange ? totalItems : sortedData.length)} of{' '}
              {onPageChange ? totalItems : sortedData.length}
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleChangePage(page + 1)}
                disabled={page >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;

