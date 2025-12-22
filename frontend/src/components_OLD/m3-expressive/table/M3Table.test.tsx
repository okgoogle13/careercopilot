import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { M3Table } from './M3Table';

describe('M3Table Component', () => {
  const mockColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
    { key: 'city', label: 'City' },
  ];

  const mockData = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' },
    { name: 'Bob', age: 35, city: 'Chicago' },
  ];

  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders table with columns and data', () => {
      render(<M3Table columns={mockColumns} data={mockData} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(
        <M3Table columns={mockColumns} data={mockData} />
      );
      const element = container.querySelector('.m3-table');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Table columns={mockColumns} data={mockData} className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });
  });

  // Sorting Tests
  describe('Sorting', () => {
    test('sorts data when sortable column header is clicked', () => {
      render(<M3Table columns={mockColumns} data={mockData} />);
      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);
      const rows = screen.getAllByRole('row');
      expect(rows[1].textContent).toContain('Bob');
    });

    test('calls onSort when column is clicked', () => {
      const handleSort = jest.fn();
      render(<M3Table columns={mockColumns} data={mockData} onSort={handleSort} />);
      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);
      expect(handleSort).toHaveBeenCalledWith('name', 'asc');
    });

    test('toggles sort direction on second click', () => {
      const handleSort = jest.fn();
      render(<M3Table columns={mockColumns} data={mockData} onSort={handleSort} />);
      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);
      fireEvent.click(nameHeader);
      expect(handleSort).toHaveBeenLastCalledWith('name', 'desc');
    });

    test('does not sort non-sortable columns', () => {
      const handleSort = jest.fn();
      render(<M3Table columns={mockColumns} data={mockData} onSort={handleSort} />);
      const cityHeader = screen.getByText('City');
      fireEvent.click(cityHeader);
      expect(handleSort).not.toHaveBeenCalled();
    });
  });

  // Pagination Tests
  describe('Pagination', () => {
    test('shows pagination when pagination is true', () => {
      const largeData = Array.from({ length: 25 }, (_, i) => ({
        name: `User ${i}`,
        age: 20 + i,
        city: 'City',
      }));
      render(
        <M3Table columns={mockColumns} data={largeData} rowsPerPage={10} />
      );
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    test('hides pagination when pagination is false', () => {
      render(
        <M3Table columns={mockColumns} data={mockData} pagination={false} />
      );
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    test('calls onPageChange when page changes', () => {
      const handlePageChange = jest.fn();
      const largeData = Array.from({ length: 25 }, (_, i) => ({
        name: `User ${i}`,
        age: 20 + i,
        city: 'City',
      }));
      render(
        <M3Table
          columns={mockColumns}
          data={largeData}
          rowsPerPage={10}
          onPageChange={handlePageChange}
        />
      );
      const nextButton = screen.getByLabelText(/next/i);
      fireEvent.click(nextButton);
      expect(handlePageChange).toHaveBeenCalledWith(2);
    });
  });

  // Header/Footer Tests
  describe('Header and Footer', () => {
    test('renders header when provided', () => {
      render(
        <M3Table columns={mockColumns} data={mockData} header={<div>Table Header</div>} />
      );
      expect(screen.getByText('Table Header')).toBeInTheDocument();
    });

    test('renders footer when provided', () => {
      render(
        <M3Table columns={mockColumns} data={mockData} footer={<div>Table Footer</div>} />
      );
      expect(screen.getByText('Table Footer')).toBeInTheDocument();
    });
  });

  // Loading State Tests
  describe('Loading State', () => {
    test('shows loading message when loading is true', () => {
      render(<M3Table columns={mockColumns} data={mockData} loading />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  // Empty State Tests
  describe('Empty State', () => {
    test('shows empty message when data is empty', () => {
      render(<M3Table columns={mockColumns} data={[]} />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  // Custom Render Tests
  describe('Custom Cell Renderer', () => {
    test('uses custom render function when provided', () => {
      const columnsWithRender = [
        {
          key: 'name',
          label: 'Name',
          render: (value: string) => <strong>{value.toUpperCase()}</strong>,
        },
      ];
      render(<M3Table columns={columnsWithRender} data={[{ name: 'John' }]} />);
      expect(screen.getByText('JOHN')).toBeInTheDocument();
    });
  });
});
