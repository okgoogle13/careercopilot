import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Box,
  Typography,
  Toolbar,
  alpha,
  Tooltip,
  TextField,
  InputAdornment,
  Skeleton,
} from '@mui/material';
import {
  MoreVertical,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Edit,
  ArrowUpDown,
} from 'lucide-react';

// Column definition interface
export interface Column<T = any> {
  id: keyof T;
  label: string;
  minWidth?: number;
  maxWidth?: number;
  width?: string | number;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  filterable?: boolean;
  format?: (value: any, row: T) => React.ReactNode;
  render?: (value: any, row: T) => React.ReactNode;
  sticky?: 'left' | 'right';
}

// Row action interface
export interface RowAction<T = any> {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size?: number }>;
  onClick: (row: T) => void;
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  divider?: boolean;
}

// Bulk action interface
export interface BulkAction<T = any> {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size?: number }>;
  onClick: (rows: T[]) => void;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

// Sort direction type
type SortDirection = 'asc' | 'desc';

// Props interface
export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  selectable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  dense?: boolean;
  stickyHeader?: boolean;
  rowActions?: RowAction<T>[];
  bulkActions?: BulkAction<T>[];
  onRowClick?: (row: T) => void;
  onSort?: (column: keyof T, direction: SortDirection) => void;
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, any>) => void;
  emptyState?: React.ReactNode;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  getRowId?: (row: T) => string | number;
  isRowSelected?: (row: T) => boolean;
  onRowSelect?: (row: T, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  className?: string;
}

// Empty state component
const EmptyState: React.FC<{ message?: string }> = ({ message = 'No data available' }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      px: 3,
      textAlign: 'center',
    }}
  >
    <Typography variant="h6" color="text.secondary" gutterBottom>
      {message}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Try adjusting your search or filter criteria
    </Typography>
  </Box>
);

// Loading skeleton component
const LoadingSkeleton: React.FC<{ columns: number; rows?: number }> = ({ columns, rows = 5 }) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <TableRow key={rowIndex}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <TableCell key={colIndex}>
            <Skeleton variant="text" height={20} />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  subtitle,
  loading = false,
  selectable = false,
  searchable = false,
  filterable = false,
  pagination = true,
  dense = false,
  stickyHeader = false,
  rowActions = [],
  bulkActions = [],
  onRowClick,
  onSort,
  onSearch,
  onFilter,
  emptyState,
  rowsPerPageOptions = [10, 25, 50, 100],
  defaultRowsPerPage = 10,
  getRowId = (row: T) => row.id || JSON.stringify(row),
  isRowSelected = () => false,
  onRowSelect,
  onSelectAll,
  className,
}: DataTableProps<T>) {
  // State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMenuAnchor, setActionMenuAnchor] = useState<{
    element: HTMLElement;
    row: T;
  } | null>(null);

  // Computed values
  const selectedRows = useMemo(() => {
    return data.filter(row => isRowSelected(row));
  }, [data, isRowSelected]);

  const allRowsSelected = useMemo(() => {
    return data.length > 0 && selectedRows.length === data.length;
  }, [data.length, selectedRows.length]);

  const someRowsSelected = useMemo(() => {
    return selectedRows.length > 0 && selectedRows.length < data.length;
  }, [data.length, selectedRows.length]);

  // Handlers
  const handleSort = (column: keyof T) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    const newDirection: SortDirection = isAsc ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);
    onSort?.(column, newDirection);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch?.(query);
    setPage(0); // Reset to first page on search
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelectAll?.(event.target.checked);
  };

  const handleRowSelect = (row: T) => {
    const isSelected = isRowSelected(row);
    onRowSelect?.(row, !isSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, row: T) => {
    event.stopPropagation();
    setActionMenuAnchor({ element: event.currentTarget, row });
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
  };

  const handleRowAction = (action: RowAction<T>, row: T) => {
    action.onClick(row);
    handleActionMenuClose();
  };

  const handleBulkAction = (action: BulkAction<T>) => {
    action.onClick(selectedRows);
  };

  // Get visible actions for a row
  const getVisibleActions = (row: T) => {
    return rowActions.filter(action => !action.hidden?.(row));
  };

  // Render cell content
  const renderCellContent = (column: Column<T>, row: T) => {
    const value = row[column.id];

    if (column.render) {
      return column.render(value, row);
    }

    if (column.format) {
      return column.format(value, row);
    }

    return value;
  };

  return (
    <Paper
      className={className}
      sx={{
        width: '100%',
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      {(title || subtitle || searchable || bulkActions.length > 0) && (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            bgcolor: selectedRows.length > 0
              ? alpha(theme => theme.palette.primary.main, 0.08)
              : 'transparent',
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          {selectedRows.length > 0 ? (
            <Typography
              sx={{ flex: '1 1 100%' }}
              color="primary"
              variant="subtitle1"
              component="div"
            >
              {selectedRows.length} selected
            </Typography>
          ) : (
            <Box sx={{ flex: '1 1 100%' }}>
              {title && (
                <Typography variant="h6" component="div">
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          )}

          {/* Search */}
          {searchable && selectedRows.length === 0 && (
            <TextField
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              sx={{ mr: 1, minWidth: 200 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {/* Bulk Actions */}
          {selectedRows.length > 0 && bulkActions.map((action) => {
            const Icon = action.icon;
            return (
              <Tooltip key={action.id} title={action.label}>
                <IconButton
                  onClick={() => handleBulkAction(action)}
                  color={action.color || 'default'}
                >
                  {Icon && <Icon size={20} />}
                </IconButton>
              </Tooltip>
            );
          })}

          {/* Filter Button */}
          {filterable && selectedRows.length === 0 && (
            <Tooltip title="Filter">
              <IconButton>
                <Filter size={20} />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      )}

      {/* Table */}
      <TableContainer sx={{ maxHeight: stickyHeader ? 400 : undefined }}>
        <Table
          stickyHeader={stickyHeader}
          size={dense ? 'small' : 'medium'}
          aria-label={title || 'data table'}
        >
          <TableHead>
            <TableRow>
              {/* Selection checkbox */}
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={someRowsSelected}
                    checked={allRowsSelected}
                    onChange={handleSelectAllClick}
                    inputProps={{
                      'aria-label': 'select all rows',
                    }}
                  />
                </TableCell>
              )}

              {/* Column headers */}
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align}
                  padding={dense ? 'none' : 'normal'}
                  style={{
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    width: column.width,
                    position: column.sticky ? 'sticky' : 'static',
                    left: column.sticky === 'left' ? 0 : undefined,
                    right: column.sticky === 'right' ? 0 : undefined,
                    zIndex: column.sticky ? 1 : undefined,
                    backgroundColor: column.sticky ? 'background.paper' : undefined,
                  }}
                  sortDirection={sortColumn === column.id ? sortDirection : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortColumn === column.id}
                      direction={sortColumn === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.id)}
                      IconComponent={ArrowUpDown}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}

              {/* Actions column */}
              {rowActions.length > 0 && (
                <TableCell align="right" padding="checkbox">
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <LoadingSkeleton columns={columns.length + (selectable ? 1 : 0) + (rowActions.length > 0 ? 1 : 0)} />
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0) + (rowActions.length > 0 ? 1 : 0)}
                  sx={{ p: 0 }}
                >
                  {emptyState || <EmptyState />}
                </TableCell>
              </TableRow>
            ) : (
              data
                .slice(pagination ? page * rowsPerPage : 0, pagination ? page * rowsPerPage + rowsPerPage : undefined)
                .map((row) => {
                  const rowId = getRowId(row);
                  const isSelected = isRowSelected(row);
                  const visibleActions = getVisibleActions(row);

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={rowId}
                      selected={isSelected}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                      sx={{
                        cursor: onRowClick ? 'pointer' : 'default',
                        '&:hover': {
                          backgroundColor: alpha(theme => theme.palette.primary.main, 0.04),
                        },
                      }}
                    >
                      {/* Selection checkbox */}
                      {selectable && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isSelected}
                            onChange={() => handleRowSelect(row)}
                            onClick={(e) => e.stopPropagation()}
                            inputProps={{
                              'aria-labelledby': `row-${rowId}`,
                            }}
                          />
                        </TableCell>
                      )}

                      {/* Data cells */}
                      {columns.map((column) => (
                        <TableCell
                          key={String(column.id)}
                          align={column.align}
                          padding={dense ? 'none' : 'normal'}
                          style={{
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth,
                            width: column.width,
                            position: column.sticky ? 'sticky' : 'static',
                            left: column.sticky === 'left' ? 0 : undefined,
                            right: column.sticky === 'right' ? 0 : undefined,
                            zIndex: column.sticky ? 1 : undefined,
                            backgroundColor: column.sticky ? 'background.paper' : undefined,
                          }}
                        >
                          {renderCellContent(column, row)}
                        </TableCell>
                      ))}

                      {/* Actions */}
                      {rowActions.length > 0 && (
                        <TableCell align="right" padding="checkbox">
                          {visibleActions.length > 0 && (
                            <IconButton
                              size="small"
                              onClick={(e) => handleActionMenuOpen(e, row)}
                              aria-label="row actions"
                            >
                              <MoreVertical size={16} />
                            </IconButton>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && !loading && data.length > 0 && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      {/* Action Menu */}
      {actionMenuAnchor && (
        <Menu
          anchorEl={actionMenuAnchor.element}
          open={Boolean(actionMenuAnchor)}
          onClose={handleActionMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {getVisibleActions(actionMenuAnchor.row).map((action) => {
            const Icon = action.icon;
            const isDisabled = action.disabled?.(actionMenuAnchor.row);

            return (
              <React.Fragment key={action.id}>
                <MenuItem
                  onClick={() => handleRowAction(action, actionMenuAnchor.row)}
                  disabled={isDisabled}
                  sx={{
                    color: action.color === 'error' ? 'error.main' :
                           action.color === 'warning' ? 'warning.main' :
                           action.color === 'success' ? 'success.main' : 'inherit',
                  }}
                >
                  {Icon && (
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                      <Icon size={16} />
                    </Box>
                  )}
                  {action.label}
                </MenuItem>
                {action.divider && <Box component="hr" sx={{ my: 1, border: 'none', borderTop: 1, borderColor: 'divider' }} />}
              </React.Fragment>
            );
          })}
        </Menu>
      )}
    </Paper>
  );
}

// Export preset column formatters
export const ColumnFormatters = {
  date: (value: string | Date) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString();
  },

  dateTime: (value: string | Date) => {
    if (!value) return '-';
    return new Date(value).toLocaleString();
  },

  currency: (value: number, currency = 'USD') => {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value);
  },

  number: (value: number, decimals = 0) => {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  },

  percentage: (value: number, decimals = 1) => {
    if (value === undefined || value === null) return '-';
    return `${(value * 100).toFixed(decimals)}%`;
  },

  chip: (value: string, color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning') => (
    <Chip label={value} size="small" color={color} />
  ),

  boolean: (value: boolean) => (
    <Chip
      label={value ? 'Yes' : 'No'}
      size="small"
      color={value ? 'success' : 'default'}
      variant={value ? 'filled' : 'outlined'}
    />
  ),

  truncate: (value: string, maxLength = 50) => {
    if (!value) return '-';
    return value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
  },
};

export default DataTable;