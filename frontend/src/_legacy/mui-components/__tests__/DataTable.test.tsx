import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DataTable } from '../DataTable';
import { axe } from 'jest-axe';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

type TestData = {
  id: number;
  name: string;
  age: number;
  status: 'active' | 'inactive';
};

const testData: TestData[] = [
  { id: 1, name: 'Alice', age: 30, status: 'active' },
  { id: 2, name: 'Bob', age: 25, status: 'inactive' },
  { id: 3, name: 'Charlie', age: 35, status: 'active' },
];

const columns = [
  { id: 'name', label: 'Name', sortable: true },
  { id: 'age', label: 'Age', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
];

const renderWithTheme = (component: React.ReactElement) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('DataTable', () => {
  it('renders without crashing', () => {
    const { container } = renderWithTheme(
      <DataTable
        data={testData}
        columns={columns}
        rowKey="id"
        onSortChange={jest.fn()}
      />
    );
    
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getAllByRole('row').length).toBe(testData.length + 1); // +1 for header
    expect(container).toMatchSnapshot();
  });

  it('passes accessibility checks', async () => {
    const { container } = renderWithTheme(
      <DataTable
        data={testData}
        columns={columns}
        rowKey="id"
        onSortChange={jest.fn()}
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders with custom class names', () => {
    const { container } = renderWithTheme(
      <DataTable
        data={testData}
        columns={columns}
        rowKey="id"
        className="custom-table"
        headerClassName="custom-header"
        rowClassName="custom-row"
      />
    );
    
    expect(container.querySelector('.custom-table')).toBeInTheDocument();
    expect(screen.getByRole('row')).toHaveClass('custom-header');
    expect(screen.getAllByRole('row')[1]).toHaveClass('custom-row');
  });

  it('displays correct column headers', () => {
    renderWithTheme(
      <DataTable
        data={testData}
        columns={columns}
        rowKey="id"
        onSortChange={jest.fn()}
      />
    );

    columns.forEach(column => {
      expect(screen.getByText(column.label)).toBeInTheDocument();
    });
  });

  it('calls onSortChange when column header is clicked', () => {
    const handleSort = jest.fn();
    renderWithTheme(
      <DataTable
        data={testData}
        columns={columns}
        rowKey="id"
        onSortChange={handleSort}
      />
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    
    expect(handleSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('sorts data when sortable column is clicked', () => {
    renderWithTheme(
      <DataTable
        data={testData}
        columns={columns}
        rowKey="id"
        onSortChange={jest.fn()}
      />
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    
    const rows = screen.getAllByRole('row');
    const firstRowCells = within(rows[1]).getAllByRole('gridcell');
    expect(firstRowCells[0]).toHaveTextContent('Alice');
  });

  it('handles pagination correctly', () => {
    const paginatedData = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      age: 20 + i,
      status: i % 2 === 0 ? 'active' : 'inactive' as const,
    }));

    renderWithTheme(
      <DataTable
        data={paginatedData}
        columns={columns}
        rowKey="id"
        rowsPerPage={5}
        onPageChange={jest.fn()}
        onSortChange={jest.fn()}
      />
    );

    // Should show 5 rows + header by default
    expect(screen.getAllByRole('row').length).toBe(6);
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <DataTable
        data={testData}
        columns={columns}
        rowKey="id"
        onSortChange={jest.fn()}
      />
    );

    const nameHeader = screen.getByText('Name');
    await user.tab();
    expect(nameHeader.closest('th')).toHaveFocus();
    
    // Test arrow down
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Alice').closest('td')).toHaveFocus();
    
    // Test arrow right
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('30').closest('td')).toHaveFocus();
    
    // Test arrow up
    await user.keyboard('{ArrowUp}');
    expect(screen.getByText('Name').closest('th')).toHaveFocus();
    
    // Test Home key
    await user.keyboard('{Home}');
    expect(screen.getByText('Name').closest('th')).toHaveFocus();
    
    // Test End key
    await user.keyboard('{End}');
    expect(screen.getByText('Status').closest('th')).toHaveFocus();
  });

  it('handles row click when onRowClick is provided', async () => {
    const handleRowClick = jest.fn();
    const user = userEvent.setup();
    
    renderWithTheme(
      <DataTable
        data={testData}
        columns={columns}
        rowKey="id"
        onRowClick={handleRowClick}
      />
    );

    const firstRow = screen.getAllByRole('row')[1];
    await user.click(firstRow);
    
    expect(handleRowClick).toHaveBeenCalledWith(testData[0]);
  });

  it('handles large datasets with virtualization', () => {
    const largeData = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      age: 20 + (i % 50),
      status: i % 2 === 0 ? 'active' : 'inactive' as const,
    }));

    renderWithTheme(
      <DataTable
        data={largeData}
        columns={columns}
        rowKey="id"
        rowsPerPage={10}
      />
    );

    // Should only render a subset of rows for performance
    expect(screen.getAllByRole('row').length).toBeLessThan(20);
  });

  it('handles column resizing', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <DataTable
        data={testData}
        columns={[...columns, { id: 'actions', label: 'Actions', resizable: true }]}
        rowKey="id"
      />
    );

    const resizer = screen.getByRole('separator', { name: /resize column/i });
    expect(resizer).toBeInTheDocument();
    
    // Test column resizing would go here
    // This is a placeholder as actual resizing would require more complex testing
  });

  it('handles empty state', () => {
    const { container } = renderWithTheme(
      <DataTable
        data={[]}
        columns={columns}
        rowKey="id"
        emptyComponent={
          <tr>
            <td colSpan={columns.length} data-testid="empty-state">
              No data available
            </td>
          </tr>
        }
      />
    );

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No data available')).toBeInTheDocument();
    expect(container).toMatchSnapshot('empty-state');
  });

  it('handles loading state', () => {
    const { container } = renderWithTheme(
      <DataTable
        data={[]}
        columns={columns}
        rowKey="id"
        loading={true}
        loadingText="Loading data..."
      />
    );

    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    expect(container).toMatchSnapshot('loading-state');
  });

  it('handles error state', () => {
    const errorMessage = 'Failed to load data';
    const { container } = renderWithTheme(
      <DataTable
        data={[]}
        columns={columns}
        rowKey="id"
        error={new Error(errorMessage)}
        errorText="Failed to load data"
      />
    );

    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    expect(container).toMatchSnapshot('error-state');
  });

  it('handles column visibility toggling', async () => {
    const user = userEvent.setup();
    const { container } = renderWithTheme(
      <DataTable
        data={testData}
        columns={columns}
        rowKey="id"
        showColumnVisibilityToggle={true}
      />
    );

    const menuButton = screen.getByRole('button', { name: /columns/i });
    await user.click(menuButton);
    
    const nameCheckbox = screen.getByLabelText('Name');
    await user.click(nameCheckbox);
    
    expect(screen.queryByText('Name')).not.toBeInTheDocument();
    expect(container).toMatchSnapshot('column-toggled');
  });

  it('handles column reordering', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <DataTable
        data={testData}
        columns={columns}
        rowKey="id"
        reorderable={true}
      />
    );

    // Test column reordering would go here
    // This is a placeholder as actual drag-and-drop testing would require more complex setup
    const nameHeader = screen.getByText('Name');
    const ageHeader = screen.getByText('Age');
    
    // In a real test, we would simulate drag and drop here
    expect(nameHeader).toBeInTheDocument();
    expect(ageHeader).toBeInTheDocument();
  });

  it('handles column filtering', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <DataTable
        data={testData}
        columns={columns}
        rowKey="id"
        filterable={true}
      />
    );

    const filterInput = screen.getByPlaceholderText(/filter/i);
    await user.type(filterInput, 'Alice');
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('handles column grouping', () => {
    renderWithTheme(
      <DataTable
        data={testData}
        columns={[
          {
            id: 'group1',
            label: 'Group 1',
            columns: [
              { id: 'name', label: 'Name' },
              { id: 'age', label: 'Age' },
            ],
          },
          {
            id: 'status',
            label: 'Status',
          },
        ]}
        rowKey="id"
      />
    );

    expect(screen.getByText('Group 1')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('applies custom cell rendering', () => {
    const customColumns = [
      {
        id: 'status',
        label: 'Status',
        renderCell: (value: string) => (
          <span data-testid="status-badge" className={`status-${value}`}>
            {value.toUpperCase()}
          </span>
        ),
      },
    ];

    renderWithTheme(
      <DataTable
        data={testData}
        columns={customColumns}
        rowKey="id"
      />
    );

    const badges = screen.getAllByTestId('status-badge');
    expect(badges.length).toBe(testData.length);
    expect(badges[0]).toHaveClass('status-active');
    expect(badges[0]).toHaveTextContent('ACTIVE');
  });

  it('handles row click when onRowClick is provided', () => {
    const handleRowClick = jest.fn();
    
    renderWithTheme(
      <DataTable
        data={testData}
        columns={columns}
        rowKey="id"
        onRowClick={handleRowClick}
      />
    );

    const firstRow = screen.getAllByRole('row')[1];
    fireEvent.click(firstRow);
    
    expect(handleRowClick).toHaveBeenCalledWith(testData[0]);
  });

  it('applies custom class names', () => {
    renderWithTheme(
      <DataTable
        data={testData}
        columns={columns}
        rowKey="id"
        className="custom-table"
        headerClassName="custom-header"
        rowClassName="custom-row"
      />
    );

    expect(screen.getByRole('grid')).toHaveClass('custom-table');
    expect(screen.getByRole('row')).toHaveClass('custom-header');
    expect(screen.getAllByRole('row')[1]).toHaveClass('custom-row');
  });

  it('shows loading state', () => {
    renderWithTheme(
      <DataTable
        data={[]}
        columns={columns}
        rowKey="id"
        loading={true}
        loadingText="Loading data..."
      />
    );

    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });
});
