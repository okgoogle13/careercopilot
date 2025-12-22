/**
 * M3 Expressive Table Component
 * Implements Material Design 3 Table for CareerCopilot
 *
 * Data table with sorting, pagination, and header/footer. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Table.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useState, useMemo, useCallback } from 'react';
import './M3Table.css';
import { M3Pagination } from '../pagination/M3Pagination';

export interface M3TableColumn<T = any> {
  /**
   * Column key/id
   */
  key: string;

  /**
   * Column header label
   */
  label: string;

  /**
   * If true, column is sortable
   */
  sortable?: boolean;

  /**
   * Column width
   */
  width?: string;

  /**
   * Cell renderer function
   */
  render?: (value: any, row: T, index: number) => React.ReactNode;

  /**
   * Alignment
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right';
}

export interface M3TableProps<T = any> {
  /**
   * Table columns
   */
  columns: M3TableColumn<T>[];

  /**
   * Table data rows
   */
  data: T[];

  /**
   * Row key getter
   */
  rowKey?: (row: T, index: number) => string | number;

  /**
   * Current sort column key
   */
  sortBy?: string;

  /**
   * Sort direction
   */
  sortDirection?: 'asc' | 'desc';

  /**
   * Sort change handler
   */
  onSort?: (columnKey: string, direction: 'asc' | 'desc') => void;

  /**
   * Current page (1-based)
   */
  page?: number;

  /**
   * Rows per page
   */
  rowsPerPage?: number;

  /**
   * Page change handler
   */
  onPageChange?: (page: number) => void;

  /**
   * Optional header content
   */
  header?: React.ReactNode;

  /**
   * Optional footer content
   */
  footer?: React.ReactNode;

  /**
   * If true, shows pagination
   * @default true
   */
  pagination?: boolean;

  /**
   * If true, table is loading
   * @default false
   */
  loading?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Table component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Table
 *   columns={[
 *     { key: 'name', label: 'Name', sortable: true },
 *     { key: 'age', label: 'Age', sortable: true },
 *   ]}
 *   data={[
 *     { name: 'John', age: 30 },
 *     { name: 'Jane', age: 25 },
 *   ]}
 *   rowKey={(row) => row.name}
 * />
 * ```
 */
export function M3Table<T = any>({
  columns,
  data,
  rowKey = (_, index) => index,
  sortBy,
  sortDirection = 'asc',
  onSort,
  page: controlledPage,
  rowsPerPage = 10,
  onPageChange,
  header,
  footer,
  pagination = true,
  loading = false,
  className = '',
}: M3TableProps<T>) {
  const [internalPage, setInternalPage] = useState(1);
  const [internalSortBy, setInternalSortBy] = useState<string | undefined>(sortBy);
  const [internalSortDirection, setInternalSortDirection] = useState<'asc' | 'desc'>(sortDirection);

  const isControlledPage = controlledPage !== undefined;
  const currentPage = isControlledPage ? controlledPage : internalPage;
  const currentSortBy = sortBy !== undefined ? sortBy : internalSortBy;
  const currentSortDirection = sortBy !== undefined ? sortDirection : internalSortDirection;

  // Sort data
  const sortedData = useMemo(() => {
    if (!currentSortBy) return data;

    const column = columns.find((col) => col.key === currentSortBy);
    if (!column?.sortable) return data;

    return [...data].sort((a, b) => {
      const aValue = (a as any)[currentSortBy];
      const bValue = (b as any)[currentSortBy];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return currentSortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, currentSortBy, currentSortDirection, columns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, rowsPerPage, pagination]);

  const totalPages = pagination ? Math.ceil(sortedData.length / rowsPerPage) : 1;

  const handleSort = useCallback(
    (columnKey: string) => {
      const column = columns.find((col) => col.key === columnKey);
      if (!column?.sortable) return;

      const newDirection =
        currentSortBy === columnKey && currentSortDirection === 'asc' ? 'desc' : 'asc';

      if (sortBy === undefined) {
        setInternalSortBy(columnKey);
        setInternalSortDirection(newDirection);
      }

      onSort?.(columnKey, newDirection);
    },
    [columns, currentSortBy, currentSortDirection, sortBy, onSort]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (!isControlledPage) {
        setInternalPage(newPage);
      }
      onPageChange?.(newPage);
    },
    [isControlledPage, onPageChange]
  );

  const classNames = [
    'm3-table',
    loading && 'm3-table--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames}>
      {header && <div className="m3-table__header">{header}</div>}
      <div className="m3-table__container">
        <table className="m3-table__table">
          <thead className="m3-table__head">
            <tr className="m3-table__row">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={[
                    'm3-table__cell',
                    'm3-table__cell--header',
                    column.sortable && 'm3-table__cell--sortable',
                    currentSortBy === column.key && 'm3-table__cell--sorted',
                    `m3-table__cell--${column.align || 'left'}`,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="m3-table__cell-content">
                    {column.label}
                    {column.sortable && (
                      <span className="m3-table__sort-indicator">
                        {currentSortBy === column.key
                          ? currentSortDirection === 'asc'
                            ? '↑'
                            : '↓'
                          : '⇅'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="m3-table__body">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="m3-table__cell m3-table__cell--loading">
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="m3-table__cell m3-table__cell--empty">
                  No data available
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={rowKey(row, index)} className="m3-table__row">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={[
                        'm3-table__cell',
                        `m3-table__cell--${column.align || 'left'}`,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {column.render
                        ? column.render((row as any)[column.key], row, index)
                        : String((row as any)[column.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination && totalPages > 1 && (
        <div className="m3-table__pagination">
          <M3Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}
      {footer && <div className="m3-table__footer">{footer}</div>}
    </div>
  );
}

M3Table.displayName = 'M3Table';

export default M3Table;
