import type { Meta, StoryObj } from '@storybook/react';
import DataTable from './DataTable';
import { Chip, Avatar, Button, Stack, Typography, TableRow, TableCell } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  avatar: string;
};

// Sample data
const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2023-10-15T14:30:00Z',
    avatar: 'JD',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Editor',
    status: 'active',
    lastLogin: '2023-10-14T09:15:00Z',
    avatar: 'JS',
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    role: 'Viewer',
    status: 'inactive',
    lastLogin: '2023-10-10T16:45:00Z',
    avatar: 'RJ',
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    role: 'Editor',
    status: 'pending',
    lastLogin: '2023-10-16T08:20:00Z',
    avatar: 'ED',
  },
  {
    id: 5,
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    role: 'Viewer',
    status: 'active',
    lastLogin: '2023-10-16T11:10:00Z',
    avatar: 'MB',
  },
];

// Column definitions
const columns: any[] = [
  {
    id: 'name',
    label: 'Name',
    minWidth: 200,
    sortable: true,
    renderCell: (value: string, row: User) => (
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>{row.avatar}</Avatar>
        <div>
          <Typography variant="body1" fontWeight={500}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {row.email}
          </Typography>
        </div>
      </Stack>
    ),
  },
  {
    id: 'role',
    label: 'Role',
    minWidth: 120,
    sortable: true,
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 120,
    sortable: true,
    renderCell: (value: string) => {
      const statusColors = {
        active: 'success',
        inactive: 'error',
        pending: 'warning',
      } as const;

      return (
        <Chip
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          color={statusColors[value as keyof typeof statusColors]}
          size="small"
          variant="outlined"
        />
      );
    },
  },
  {
    id: 'lastLogin',
    label: 'Last Login',
    minWidth: 150,
    sortable: true,
    renderCell: (value: string) =>
      new Date(value).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 120,
    align: 'right' as const,
    renderCell: (_: any, row: User) => (
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button
          size="small"
          variant="outlined"
          startIcon={<EditIcon fontSize="small" />}
          onClick={() => console.log('Edit', row.id)}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          variant="outlined"
          startIcon={<DeleteIcon fontSize="small" />}
          onClick={() => console.log('Delete', row.id)}
        >
          Delete
        </Button>
      </Stack>
    ),
  },
];

const meta = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `A highly customizable and reusable DataTable component with sorting, pagination, and server-side operation support.\n\n### Features:\n- **Sorting**: Click on column headers to sort (client or server-side)\n- **Pagination**: Built-in pagination with configurable rows per page\n- **Custom Rendering**: Custom cell rendering with full access to row data\n- **Responsive**: Adapts to different screen sizes\n- **Accessible**: Follows WAI-ARIA patterns for data tables`,
      },
    },
  },
  tags: ['autodocs', 'table', 'data-grid'],
  argTypes: {
    data: { control: { disable: true } },
    columns: { control: { disable: true } },
    rowKey: { control: { disable: true } },
    initialSortBy: { control: { disable: true } },
    initialSortOrder: {
      control: 'select',
      options: ['asc', 'desc'],
      description: 'Initial sort direction',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    showPagination: {
      control: 'boolean',
      description: 'Show/hide pagination',
      defaultValue: true,
    },
    onSortChange: { action: 'sortChanged' },
    onPageChange: { action: 'pageChanged' },
    onRowsPerPageChange: { action: 'rowsPerPageChanged' },
  },
  args: {
    data: users,
    columns,
    rowKey: 'id',
    initialSortBy: 'name',
    initialSortOrder: 'asc',
    showPagination: true,
  },
} satisfies Meta<typeof DataTable<User>>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic usage of the DataTable with client-side sorting and pagination
 */
export const Default: Story = {};

/**
 * DataTable with server-side operations
 */
export const ServerSide: Story = {
  args: {
    data: users.slice(0, 3), // Show only first page of data
    totalItems: 100, // Total items on the server
    onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => {
      console.log('Server-side sort:', { sortBy, sortOrder });
    },
    onPageChange: (page: number) => {
      console.log('Page changed to:', page);
    },
    onRowsPerPageChange: (rowsPerPage: number) => {
      console.log('Rows per page changed to:', rowsPerPage);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of using the DataTable with server-side operations. The table will trigger callbacks for sorting, pagination, and rows per page changes.',
      },
    },
  },
};

/**
 * DataTable with loading state
 */
export const Loading: Story = {
  args: {
    loading: true,
  },
};

/**
 * DataTable with empty state
 */
export const Empty: Story = {
  args: {
    data: [],
    emptyComponent: (
      <TableRow>
        <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
          <Stack alignItems="center" spacing={1}>
            <Typography variant="h6" color="text.secondary">
              No users found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              There are no users matching your criteria.
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }}>
              Add New User
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    ),
  },
};

/**
 * DataTable without pagination
 */
export const WithoutPagination: Story = {
  args: {
    showPagination: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'DataTable with pagination disabled, showing all rows at once.',
      },
    },
  },
};
