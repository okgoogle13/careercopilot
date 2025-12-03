import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { M3Datagrid } from './M3Datagrid';

describe('M3Datagrid Component', () => {
  const mockColumns = [
    { key: 'name', label: 'Name', editable: true },
    { key: 'age', label: 'Age', editable: true, inputType: 'number' },
    { key: 'city', label: 'City' },
  ];

  const mockData = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' },
  ];

  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders datagrid with columns and data', () => {
      render(<M3Datagrid columns={mockColumns} data={mockData} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(
        <M3Datagrid columns={mockColumns} data={mockData} />
      );
      const element = container.querySelector('.m3-datagrid');
      expect(element).toBeInTheDocument();
    });
  });

  // Inline Editing Tests
  describe('Inline Editing', () => {
    test('enters edit mode when editable cell is clicked', () => {
      render(<M3Datagrid columns={mockColumns} data={mockData} />);
      const nameCell = screen.getByText('John');
      fireEvent.click(nameCell);
      const input = screen.getByDisplayValue('John');
      expect(input).toBeInTheDocument();
    });

    test('calls onDataChange when cell value is changed', async () => {
      const handleDataChange = jest.fn();
      render(
        <M3Datagrid
          columns={mockColumns}
          data={mockData}
          onDataChange={handleDataChange}
        />
      );
      const nameCell = screen.getByText('John');
      fireEvent.click(nameCell);
      const input = screen.getByDisplayValue('John');
      await userEvent.clear(input);
      await userEvent.type(input, 'Johnny');
      fireEvent.blur(input);
      expect(handleDataChange).toHaveBeenCalledWith(0, 'name', 'Johnny', mockData[0]);
    });

    test('saves on Enter key', async () => {
      const handleDataChange = jest.fn();
      render(
        <M3Datagrid
          columns={mockColumns}
          data={mockData}
          onDataChange={handleDataChange}
        />
      );
      const nameCell = screen.getByText('John');
      fireEvent.click(nameCell);
      const input = screen.getByDisplayValue('John');
      await userEvent.clear(input);
      await userEvent.type(input, 'Johnny{Enter}');
      expect(handleDataChange).toHaveBeenCalled();
    });

    test('cancels edit on Escape key', async () => {
      render(<M3Datagrid columns={mockColumns} data={mockData} />);
      const nameCell = screen.getByText('John');
      fireEvent.click(nameCell);
      const input = screen.getByDisplayValue('John');
      await userEvent.type(input, '{Escape}');
      expect(screen.queryByDisplayValue('John')).not.toBeInTheDocument();
    });

    test('uses correct input type for editable columns', () => {
      render(<M3Datagrid columns={mockColumns} data={mockData} />);
      const ageCell = screen.getByText('30');
      fireEvent.click(ageCell);
      const input = screen.getByDisplayValue('30');
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  // Row Selection Tests
  describe('Row Selection', () => {
    test('calls onRowSelect when row is clicked and selectable is true', () => {
      const handleRowSelect = jest.fn();
      render(
        <M3Datagrid
          columns={mockColumns}
          data={mockData}
          selectable
          onRowSelect={handleRowSelect}
        />
      );
      const nameCell = screen.getByText('John');
      fireEvent.click(nameCell);
      expect(handleRowSelect).toHaveBeenCalledWith(mockData[0], 0);
    });
  });

  // Validation Tests
  describe('Cell Validation', () => {
    test('does not save invalid data when validator fails', async () => {
      const handleDataChange = jest.fn();
      const columnsWithValidation = [
        {
          key: 'age',
          label: 'Age',
          editable: true,
          inputType: 'number' as const,
          validate: (value: number) => value > 0 || 'Age must be positive',
        },
      ];
      render(
        <M3Datagrid
          columns={columnsWithValidation}
          data={[{ age: 30 }]}
          onDataChange={handleDataChange}
        />
      );
      const ageCell = screen.getByText('30');
      fireEvent.click(ageCell);
      const input = screen.getByDisplayValue('30');
      await userEvent.clear(input);
      await userEvent.type(input, '-5');
      fireEvent.blur(input);
      expect(handleDataChange).not.toHaveBeenCalled();
    });
  });
});
