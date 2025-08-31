import React, { useState, useMemo, useCallback } from 'react';
import { ChevronUp, ChevronDown, Filter, Search, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { Input } from './input';
import { Checkbox } from './checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { Badge } from './badge';
import { Skeleton } from './skeleton';

export interface DataGridColumn<T = any> {
  id: string;
  title: string;
  accessor?: keyof T | ((row: T) => any);
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
  filter?: {
    type: 'text' | 'select' | 'date' | 'number' | 'boolean';
    options?: Array<{ label: string; value: any }>;
    placeholder?: string;
  };
  sticky?: 'left' | 'right';
  hidden?: boolean;
}

export interface DataGridProps<T = any> {
  data: T[];
  columns: DataGridColumn<T>[];
  loading?: boolean;
  error?: string;
  className?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  onRowClick?: (row: T, index: number) => void;
  onRowSelect?: (selectedRows: T[]) => void;
  selectable?: boolean;
  selectedRows?: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyStateText?: string;
  pageSize?: number;
  showRowActions?: boolean;
  rowActions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: (row: T) => void;
    disabled?: (row: T) => boolean;
    variant?: 'default' | 'destructive';
  }>;
  stickyHeader?: boolean;
  virtualScrolling?: boolean;
  height?: number;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  columnId: string | null;
  direction: SortDirection;
}

export function DataGrid<T = any>({
  data,
  columns,
  loading = false,
  error,
  className,
  rowClassName,
  onRowClick,
  onRowSelect,
  selectable = false,
  selectedRows = [],
  keyExtractor = (_, index: number) => index.toString(),
  sortable = true,
  filterable = true,
  searchable = true,
  searchPlaceholder = 'Search...',
  emptyStateText = 'No data available',
  pageSize,
  showRowActions = false,
  rowActions = [],
  stickyHeader = true,
  virtualScrolling = false,
  height = 600,
}: DataGridProps<T>) {
  const [sortState, setSortState] = useState<SortState>({ columnId: null, direction: null });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string | number>>(new Set());

  // Get row key
  const getRowKey = useCallback((row: T, index: number) => {
    return keyExtractor(row, index);
  }, [keyExtractor]);

  // Get cell value
  const getCellValue = useCallback((row: T, column: DataGridColumn<T>) => {
    if (column.accessor) {
      if (typeof column.accessor === 'function') {
        return column.accessor(row);
      }
      return (row as any)[column.accessor];
    }
    return '';
  }, []);

  // Filtering logic
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply column filters
    Object.entries(filters).forEach(([columnId, filterValue]) => {
      if (!filterValue) return;
      
      const column = columns.find(col => col.id === columnId);
      if (!column) return;

      filtered = filtered.filter(row => {
        const value = getCellValue(row, column);
        
        if (column.filter?.type === 'select') {
          return value === filterValue;
        } else if (column.filter?.type === 'boolean') {
          return Boolean(value) === Boolean(filterValue);
        } else if (column.filter?.type === 'number') {
          return Number(value) === Number(filterValue);
        } else {
          // Default text filter
          return String(value || '').toLowerCase().includes(String(filterValue).toLowerCase());
        }
      });
    });

    // Apply global search
    if (globalFilter) {
      const searchTerm = globalFilter.toLowerCase();
      filtered = filtered.filter(row => 
        columns.some(column => {
          const value = getCellValue(row, column);
          return String(value || '').toLowerCase().includes(searchTerm);
        })
      );
    }

    return filtered;
  }, [data, filters, globalFilter, columns, getCellValue]);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortState.columnId || !sortState.direction) {
      return filteredData;
    }

    const column = columns.find(col => col.id === sortState.columnId);
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getCellValue(a, column);
      const bValue = getCellValue(b, column);

      if (aValue === bValue) return 0;
      
      let comparison = 0;
      if (aValue == null) comparison = -1;
      else if (bValue == null) comparison = 1;
      else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortState.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortState, columns, getCellValue]);

  // Handle sorting
  const handleSort = useCallback((columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column?.sortable && !sortable) return;

    setSortState(prev => {
      if (prev.columnId === columnId) {
        if (prev.direction === 'asc') return { columnId, direction: 'desc' };
        if (prev.direction === 'desc') return { columnId: null, direction: null };
      }
      return { columnId, direction: 'asc' };
    });
  }, [columns, sortable]);

  // Handle column filter
  const handleColumnFilter = useCallback((columnId: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [columnId]: value || undefined,
    }));
  }, []);

  // Handle row selection
  const handleRowSelection = useCallback((row: T, selected: boolean) => {
    const rowKey = getRowKey(row, 0);
    const newSelectedKeys = new Set(selectedRowKeys);
    
    if (selected) {
      newSelectedKeys.add(rowKey);
    } else {
      newSelectedKeys.delete(rowKey);
    }
    
    setSelectedRowKeys(newSelectedKeys);
    
    const selectedRowsData = sortedData.filter(dataRow => 
      newSelectedKeys.has(getRowKey(dataRow, 0))
    );
    
    onRowSelect?.(selectedRowsData);
  }, [selectedRowKeys, sortedData, getRowKey, onRowSelect]);

  // Handle select all
  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      const allKeys = new Set(sortedData.map((row, index) => getRowKey(row, index)));
      setSelectedRowKeys(allKeys);
      onRowSelect?.(sortedData);
    } else {
      setSelectedRowKeys(new Set());
      onRowSelect?.([]);
    }
  }, [sortedData, getRowKey, onRowSelect]);

  const visibleColumns = columns.filter(col => !col.hidden);
  const isAllSelected = selectedRowKeys.size > 0 && selectedRowKeys.size === sortedData.length;
  const isSomeSelected = selectedRowKeys.size > 0 && selectedRowKeys.size < sortedData.length;

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Toolbar */}
      {(searchable || filterable) && (
        <div className="flex items-center gap-4 mb-4 p-4 border rounded-lg bg-muted/5">
          {searchable && (
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}
          
          {filterable && (
            <div className="flex items-center gap-2">
              {visibleColumns.filter(col => col.filterable).map(column => (
                <div key={column.id} className="relative">
                  {column.filter?.type === 'select' ? (
                    <select
                      value={filters[column.id] || ''}
                      onChange={(e) => handleColumnFilter(column.id, e.target.value)}
                      className="border rounded px-3 py-1 text-sm bg-background"
                    >
                      <option value="">{column.filter.placeholder || `Filter ${column.title}`}</option>
                      {column.filter.options?.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="relative">
                      <Filter className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <Input
                        placeholder={column.filter?.placeholder || `Filter ${column.title}`}
                        value={filters[column.id] || ''}
                        onChange={(e) => handleColumnFilter(column.id, e.target.value)}
                        className="pl-8 w-32 h-8"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div 
        className="border rounded-lg overflow-hidden"
        style={virtualScrolling ? { height } : undefined}
      >
        <div className={cn('overflow-auto', virtualScrolling && 'h-full')}>
          <table className="w-full">
            {/* Header */}
            <thead className={cn(
              'bg-muted/50',
              stickyHeader && 'sticky top-0 z-10'
            )}>
              <tr>
                {selectable && (
                  <th className="w-10 p-3 text-left">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      ref={(el) => {
                        if (el && 'indeterminate' in el) {
                          (el as HTMLInputElement).indeterminate = isSomeSelected;
                        }
                      }}
                    />
                  </th>
                )}
                
                {visibleColumns.map((column) => (
                  <th
                    key={column.id}
                    className={cn(
                      'p-3 text-left font-medium',
                      column.sortable !== false && sortable && 'cursor-pointer hover:bg-muted',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                    style={{
                      width: column.width,
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                    }}
                    onClick={() => handleSort(column.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.title}</span>
                      {column.sortable !== false && sortable && (
                        <div className="flex flex-col">
                          <ChevronUp className={cn(
                            'h-3 w-3',
                            sortState.columnId === column.id && sortState.direction === 'asc'
                              ? 'text-primary' 
                              : 'text-muted-foreground'
                          )} />
                          <ChevronDown className={cn(
                            'h-3 w-3 -mt-1',
                            sortState.columnId === column.id && sortState.direction === 'desc'
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          )} />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                
                {showRowActions && rowActions.length > 0 && (
                  <th className="w-10 p-3 text-right">Actions</th>
                )}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {loading ? (
                Array.from({ length: pageSize || 10 }).map((_, index) => (
                  <tr key={index}>
                    {selectable && <td className="p-3"><Skeleton className="h-4 w-4" /></td>}
                    {visibleColumns.map(column => (
                      <td key={column.id} className="p-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                    {showRowActions && <td className="p-3"><Skeleton className="h-4 w-8" /></td>}
                  </tr>
                ))
              ) : sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      visibleColumns.length + 
                      (selectable ? 1 : 0) + 
                      (showRowActions ? 1 : 0)
                    }
                    className="p-8 text-center text-muted-foreground"
                  >
                    {emptyStateText}
                  </td>
                </tr>
              ) : (
                sortedData.map((row, index) => {
                  const rowKey = getRowKey(row, index);
                  const isSelected = selectedRowKeys.has(rowKey);
                  const rowClassNameValue = typeof rowClassName === 'function' 
                    ? rowClassName(row, index) 
                    : rowClassName;

                  return (
                    <tr
                      key={rowKey}
                      className={cn(
                        'border-t hover:bg-muted/25 transition-colors',
                        isSelected && 'bg-accent/50',
                        onRowClick && 'cursor-pointer',
                        rowClassNameValue
                      )}
                      onClick={() => onRowClick?.(row, index)}
                    >
                      {selectable && (
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleRowSelection(row, checked as boolean)}
                          />
                        </td>
                      )}
                      
                      {visibleColumns.map((column) => {
                        const value = getCellValue(row, column);
                        
                        return (
                          <td
                            key={column.id}
                            className={cn(
                              'p-3',
                              column.align === 'center' && 'text-center',
                              column.align === 'right' && 'text-right'
                            )}
                          >
                            {column.render ? column.render(value, row, index) : (
                              <span className="truncate">{String(value || '')}</span>
                            )}
                          </td>
                        );
                      })}
                      
                      {showRowActions && rowActions.length > 0 && (
                        <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {rowActions.map((action, actionIndex) => (
                                <DropdownMenuItem
                                  key={actionIndex}
                                  onClick={() => action.onClick(row)}
                                  disabled={action.disabled?.(row)}
                                  className={cn(
                                    action.variant === 'destructive' && 'text-destructive focus:text-destructive'
                                  )}
                                >
                                  {action.icon && <span className="mr-2">{action.icon}</span>}
                                  {action.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      {sortedData.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground">
          <span>
            Showing {sortedData.length} of {data.length} rows
            {selectedRowKeys.size > 0 && ` (${selectedRowKeys.size} selected)`}
          </span>
        </div>
      )}
    </div>
  );
}