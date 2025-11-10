import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TablePagination,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import type { SxProps, Theme, TableCellProps } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

type Order = 'asc' | 'desc';

interface Column<T> {
  /** Unique identifier for the column */
  id: keyof T | 'actions';
  /** Display label for the column header */
  label: string;
  /** Minimum width of the column */
  minWidth?: number;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Custom cell render function */
  renderCell?: (value: any, row: T) => React.ReactNode;
  /** Alignment of the cell content */
  align?: TableCellProps['align'];
  /** Custom styles for the cell */
  sx?: SxProps<Theme>;
}

interface DataTableProps<T> {
  /** Array of data objects to display in the table */
  data: T[];
  /** Column configuration */
  columns: Column<T>[];
  /** Unique row identifier key */
  rowKey: keyof T;
  /** Total number of items for server-side pagination */
  totalItems?: number;
  /** Initial sort field */
  initialSortBy?: keyof T;
  /** Initial sort order */
  initialSortOrder?: Order;
  /** Callback when sort changes */
  onSortChange?: (sortBy: keyof T, sortOrder: Order) => void;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Callback when rows per page changes */
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  /** Current page for controlled pagination */
  page?: number;
  /** Rows per page for controlled pagination */
  rowsPerPage?: number;
  /** Available rows per page options */
  rowsPerPageOptions?: number[];
  /** Loading state */
  loading?: boolean;
  /** Empty state component */
  emptyComponent?: React.ReactNode;
  /** Custom table container styles */
  sx?: SxProps<Theme>;
  /** Whether to show pagination */
  showPagination?: boolean;
}

/**
 * A reusable DataTable component with sorting and pagination support.
 * Supports both client-side and server-side operations.
 * 
 * @component
 * @template T - Type of the data items in the table
 * 
 * @example
 * ```tsx
 * const columns: Column<User>[] = [
 *   { id: 'name', label: 'Name', sortable: true },
 *   { id: 'email', label: 'Email', sortable: true },
 *   { 
 *     id: 'status', 
 *     label: 'Status',
 *     renderCell: (value) => (
 *       <Chip 
 *         label={value} 
 *         color={value === 'active' ? 'success' : 'default'}
 *         size="small"
 *       />
 *     )
 *   }
 * ];
 * 
 * <DataTable
 *   data={users}
 *   columns={columns}
 *   rowKey="id"
 *   onSortChange={(sortBy, sortOrder) => {
 *     // Handle sort change
 *   }}
 *   onPageChange={(page) => {
 *     // Handle page change
 *   }}
 *   onRowsPerPageChange={(rowsPerPage) => {
 *     // Handle rows per page change
 *   }}
 *   totalItems={totalUsers}
 *   page={currentPage}
 *   rowsPerPage={rowsPerPage}
 *   loading={isLoading}
 * />
 * ```
 */
const DataTable = <T extends Record<string, any>>({
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
  sx,
  showPagination = true,
}: DataTableProps<T>) => {
  // State for uncontrolled mode
  const [uncontrolledPage, setUncontrolledPage] = useState(0);
  const [uncontrolledRowsPerPage, setUncontrolledRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [order, setOrder] = useState<Order>(initialSortOrder);
  const [orderBy, setOrderBy] = useState<keyof T | undefined>(initialSortBy);
  const [focusedCell, setFocusedCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const theme = useTheme();
  
  // Set focus on the table when it loads
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.setAttribute('role', 'grid');
      tableRef.current.setAttribute('aria-label', 'Data table with sorting and pagination');
    }
  }, []);
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, colIndex: number): void => {
    if (!tableRef.current) return;
    
    const rows = Array.from(tableRef.current.querySelectorAll('tr[role="row"]'));
    const cells = Array.from(rows[rowIndex]?.querySelectorAll('td, th') || []);
    const rowCount = rows.length;
    const colCount = cells.length;
    
    let newRowIndex = rowIndex;
    let newColIndex = colIndex;
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newRowIndex = Math.max(0, rowIndex - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newRowIndex = Math.min(rowCount - 1, rowIndex + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newColIndex = Math.max(0, colIndex - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newColIndex = Math.min(colCount - 1, colIndex + 1);
        break;
      case 'Home':
        e.preventDefault();
        newColIndex = 0;
        if (e.ctrlKey) newRowIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newColIndex = colCount - 1;
        if (e.ctrlKey) newRowIndex = rowCount - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        const cell = cells[colIndex];
        const button = cell?.querySelector('button');
        if (button) button.click();
        return;
      default:
        return;
    }
    
    if (newRowIndex !== rowIndex || newColIndex !== colIndex) {
      setFocusedCell({ rowIndex: newRowIndex, colIndex: newColIndex });
      const newCell = rows[newRowIndex]?.querySelectorAll('td, th')[newColIndex] as HTMLElement;
      newCell?.focus();
    }

  // Use controlled props if provided, otherwise use local state
  const page = controlledPage ?? uncontrolledPage;
  const rowsPerPage = controlledRowsPerPage ?? uncontrolledRowsPerPage;

  // Handle sort request
  const handleRequestSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    
    setOrder(newOrder);
    setOrderBy(property);
    
    if (onSortChange) {
      onSortChange(property, newOrder);
    }
  };

  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setUncontrolledPage(newPage);
    }
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    
    if (onRowsPerPageChange) {
      onRowsPerPageChange(newRowsPerPage);
    } else {
      setUncontrolledRowsPerPage(newRowsPerPage);
    }
    
    // Reset to first page when changing rows per page
    if (onPageChange) {
      onPageChange(0);
    } else {
      setUncontrolledPage(0);
    }
  };

  // Sort data if not using server-side sorting
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

  // Paginate data if not using server-side pagination
  const paginatedData = useMemo(() => {
    if (!showPagination || onPageChange) {
      return sortedData;
    }
    return sortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedData, page, rowsPerPage, onPageChange, showPagination]);

  // Default empty state
  const defaultEmptyState = (
    <TableRow>
      <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No data available
        </Typography>
      </TableCell>
    </TableRow>
  );

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    ) as React.ReactElement;
  }

  // Generate a unique ID for the table for ARIA references
  const tableId = useMemo(() => `data-table-${Math.random().toString(36).substring(2, 11)}`, []);
  
  const handleContainerKeyDown = (e: React.KeyboardEvent) => {
    // Handle focus management for the table container
    if (e.key === 'Tab' && !e.shiftKey && tableRef.current) {
      e.preventDefault();
      const firstFocusable = tableRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
      firstFocusable?.focus();
    }
  };

  return (
    <Paper 
      component="div"
      sx={{ 
        width: '100%', 
        overflow: 'hidden', 
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
        ...sx 
      }}
      tabIndex={-1}
      onKeyDown={handleContainerKeyDown}
    >
      <TableContainer>
        <Table 
          ref={tableRef}
          stickyHeader 
          aria-label="Data table with sorting and pagination"
          aria-describedby={`${tableId}-description`}
          role="grid"
          onKeyDown={(e) => {
            if (focusedCell) {
              handleKeyDown(e, focusedCell.rowIndex, focusedCell.colIndex);
            }
          }}
        >
          <Box component="span" id={`${tableId}-description`} sx={visuallyHidden}>
            Interactive data table with {data.length} rows and {columns.length} columns. 
            Use arrow keys to navigate, Enter or Space to interact with cells.
          </Box>
          <TableHead>
            <TableRow role="row">
              {columns.map((column, colIndex) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align}
                  sortDirection={orderBy === column.id ? order : false}
                  sx={{
                    minWidth: column.minWidth,
                    fontWeight: 600,
                    '&:focus': {
                      outline: `2px solid ${theme.palette.primary.main}`,
                      outlineOffset: -2,
                    },
                    ...column.sx,
                  }}
                  role="columnheader"
                  aria-sort={orderBy === column.id ? 
                    (order === 'asc' ? 'ascending' : 'descending') : 
                    'none'}
                  scope="col"
                  tabIndex={0}
                  onFocus={() => setFocusedCell({ rowIndex: 0, colIndex })}
                  onKeyDown={(e) => handleKeyDown(e, 0, colIndex)}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => column.sortable && handleRequestSort(column.id as keyof T)}
                    >
                      {column.label}
                      {orderBy === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              emptyComponent || defaultEmptyState
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow 
                  hover 
                  tabIndex={-1} 
                  key={String(row[rowKey])}
                  role="row"
                  aria-rowindex={rowIndex + 2} // +2 because header row is 1
                  sx={{
                    '&:focus-within': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  {columns.map((column, colIndex) => {
                    const value = row[column.id as keyof T];
                    const cellValue = column.renderCell ? column.renderCell(value, row) : value;
                    const isCellFocusable = rowIndex === focusedCell?.rowIndex && colIndex === focusedCell?.colIndex;
                    
                    return (
                      <TableCell 
                        key={String(column.id)} 
                        align={column.align}
                        sx={{
                          '&:focus': {
                            outline: `2px solid ${theme.palette.primary.main}`,
                            outlineOffset: -2,
                          },
                          ...column.sx,
                        }}
                        role="gridcell"
                        tabIndex={isCellFocusable ? 0 : -1}
                        onFocus={() => setFocusedCell({ rowIndex, colIndex })}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                        aria-label={`${String(column.label)}: ${String(cellValue)}`}
                      >
                        {cellValue}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {showPagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={onPageChange ? totalItems : data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '& .MuiTablePagination-toolbar': {
              flexWrap: 'wrap',
              justifyContent: 'center',
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              marginBottom: 1,
            },
          }}
        />
      )}
    </Paper>
  );
};

export default DataTable;
