/**
 * M3 Expressive DataGrid Component
 * Implements Material Design 3 DataGrid for CareerCopilot
 *
 * Table variant with inline editing capabilities. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Datagrid.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useState, useCallback } from 'react';
import './M3Datagrid.css';
import { M3Table, M3TableColumn, M3TableProps } from '../table/M3Table';
import { M3Input } from '../input/M3Input';

export interface M3DatagridColumn<T = any> extends M3TableColumn<T> {
  /**
   * If true, column is editable
   */
  editable?: boolean;

  /**
   * Input type for editable cells
   * @default 'text'
   */
  inputType?: 'text' | 'number' | 'email' | 'date';

  /**
   * Validation function for editable cells
   */
  validate?: (value: any, row: T) => boolean | string;
}

export interface M3DatagridProps<T = any> extends Omit<M3TableProps<T>, 'columns'> {
  /**
   * DataGrid columns (with editable support)
   */
  columns: M3DatagridColumn<T>[];

  /**
   * Data change handler (called when cell is edited)
   */
  onDataChange?: (rowIndex: number, columnKey: string, value: any, row: T) => void;

  /**
   * Row selection handler
   */
  onRowSelect?: (row: T, index: number) => void;

  /**
   * If true, rows are selectable
   * @default false
   */
  selectable?: boolean;
}

/**
 * M3 Expressive DataGrid component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3DataGrid
 *   columns={[
 *     { key: 'name', label: 'Name', editable: true },
 *     { key: 'age', label: 'Age', editable: true, inputType: 'number' },
 *   ]}
 *   data={data}
 *   onDataChange={(rowIndex, columnKey, value) => {
 *     // Update data
 *   }}
 * />
 * ```
 */
export function M3Datagrid<T = any>({
  columns,
  data,
  onDataChange,
  onRowSelect,
  selectable = false,
  ...tableProps
}: M3DatagridProps<T>) {
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnKey: string } | null>(null);
  const [editValue, setEditValue] = useState<any>('');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const handleCellClick = useCallback(
    (rowIndex: number, columnKey: string, row: T) => {
      const column = columns.find((col) => col.key === columnKey);
      if (column?.editable) {
        setEditingCell({ rowIndex, columnKey });
        setEditValue((row as any)[columnKey] ?? '');
      }

      if (selectable && onRowSelect) {
        setSelectedRow(rowIndex);
        onRowSelect(row, rowIndex);
      }
    },
    [columns, selectable, onRowSelect]
  );

  const handleCellBlur = useCallback(() => {
    if (editingCell && onDataChange) {
      const row = data[editingCell.rowIndex];
      const column = columns.find((col) => col.key === editingCell.columnKey);

      // Validate if validator provided
      if (column?.validate) {
        const validation = column.validate(editValue, row);
        if (validation !== true) {
          // Validation failed, don't save
          setEditingCell(null);
          return;
        }
      }

      onDataChange(editingCell.rowIndex, editingCell.columnKey, editValue, row);
    }
    setEditingCell(null);
  }, [editingCell, editValue, data, columns, onDataChange]);

  const handleCellKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleCellBlur();
      } else if (e.key === 'Escape') {
        setEditingCell(null);
      }
    },
    [handleCellBlur]
  );

  // Convert columns to M3Table columns with custom render
  const tableColumns: M3TableColumn<T>[] = columns.map((column) => ({
    ...column,
    render: (value: any, row: T, rowIndex: number) => {
      const isEditing =
        editingCell?.rowIndex === rowIndex && editingCell?.columnKey === column.key;

      if (isEditing && column.editable) {
        return (
          <M3Input
            type={column.inputType || 'text'}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleCellBlur}
            onKeyDown={handleCellKeyDown}
            autoFocus
            className="m3-datagrid__input"
          />
        );
      }

      if (column.render) {
        return column.render(value, row, rowIndex);
      }

      return (
        <div
          className={[
            'm3-datagrid__cell',
            column.editable && 'm3-datagrid__cell--editable',
            selectedRow === rowIndex && 'm3-datagrid__cell--selected',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => handleCellClick(rowIndex, column.key, row)}
        >
          {String(value ?? '')}
        </div>
      );
    },
  }));

  return (
    <div className="m3-datagrid">
      <M3Table {...tableProps} columns={tableColumns} data={data} />
    </div>
  );
}

M3Datagrid.displayName = 'M3Datagrid';

export default M3Datagrid;
