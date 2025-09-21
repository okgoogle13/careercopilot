import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import { Edit, Trash2, Eye, Download, Send } from 'lucide-react';

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive data table component with sorting, filtering, pagination, and bulk actions built with Material Design 3 principles.',
      },
    },
  },
  argTypes: {
    selectable: {
      control: 'boolean',
      description: 'Enable row selection with checkboxes',
    },
    searchable: {
      control: 'boolean',
      description: 'Show search/filter input',
    },
    pagination: {
      control: 'boolean',
      description: 'Enable pagination controls',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

// Sample data for documents
const documentData = [
  {
    id: 1,
    name: 'Senior_Software_Engineer_Resume.pdf',
    type: 'Resume',
    status: 'Published',
    lastModified: '2024-01-15',
    size: '245 KB',
    atsScore: 92,
  },
  {
    id: 2,
    name: 'Cover_Letter_TechCorp.docx',
    type: 'Cover Letter',
    status: 'Draft',
    lastModified: '2024-01-14',
    size: '89 KB',
    atsScore: 88,
  },
  {
    id: 3,
    name: 'Portfolio_Projects_Summary.pdf',
    type: 'Portfolio',
    status: 'Published',
    lastModified: '2024-01-12',
    size: '1.2 MB',
    atsScore: 85,
  },
  {
    id: 4,
    name: 'Data_Scientist_Resume_V2.pdf',
    type: 'Resume',
    status: 'Draft',
    lastModified: '2024-01-10',
    size: '198 KB',
    atsScore: 76,
  },
  {
    id: 5,
    name: 'Frontend_Developer_Cover_Letter.pdf',
    type: 'Cover Letter',
    status: 'Published',
    lastModified: '2024-01-08',
    size: '156 KB',
    atsScore: 90,
  },
];

const StatusChip = ({ status }: { status: string }) => (
  <Chip
    label={status}
    size="small"
    color={status === 'Published' ? 'success' : 'default'}
    variant={status === 'Published' ? 'filled' : 'outlined'}
  />
);

const ScoreDisplay = ({ score }: { score: number }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Typography
      variant="body2"
      sx={{
        fontWeight: 600,
        color: score >= 90 ? 'success.main' : score >= 80 ? 'warning.main' : 'error.main',
      }}
    >
      {score}%
    </Typography>
  </Box>
);

const documentColumns = [
  {
    id: 'name',
    label: 'Document Name',
    sortable: true,
    render: (value: string) => (
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    ),
  },
  {
    id: 'type',
    label: 'Type',
    sortable: true,
    filterable: true,
    filterOptions: ['Resume', 'Cover Letter', 'Portfolio'],
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    filterable: true,
    filterOptions: ['Published', 'Draft'],
    render: (value: string) => <StatusChip status={value} />,
  },
  {
    id: 'atsScore',
    label: 'ATS Score',
    sortable: true,
    align: 'right' as const,
    render: (value: number) => <ScoreDisplay score={value} />,
  },
  {
    id: 'lastModified',
    label: 'Last Modified',
    sortable: true,
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    id: 'size',
    label: 'Size',
    align: 'right' as const,
  },
];

const rowActions = [
  {
    id: 'view',
    label: 'View',
    icon: Eye,
    onClick: (row: any) => console.log('View:', row.name),
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: Edit,
    onClick: (row: any) => console.log('Edit:', row.name),
  },
  {
    id: 'download',
    label: 'Download',
    icon: Download,
    onClick: (row: any) => console.log('Download:', row.name),
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: Trash2,
    color: 'error' as const,
    onClick: (row: any) => console.log('Delete:', row.name),
  },
];

const bulkActions = [
  {
    id: 'download-all',
    label: 'Download Selected',
    icon: Download,
    onClick: (selectedRows: any[]) => console.log('Download selected:', selectedRows.length),
  },
  {
    id: 'send-all',
    label: 'Send Selected',
    icon: Send,
    onClick: (selectedRows: any[]) => console.log('Send selected:', selectedRows.length),
  },
  {
    id: 'delete-all',
    label: 'Delete Selected',
    icon: Trash2,
    color: 'error' as const,
    onClick: (selectedRows: any[]) => console.log('Delete selected:', selectedRows.length),
  },
];

export const Default: Story = {
  args: {
    data: documentData,
    columns: documentColumns,
    searchable: true,
    pagination: true,
  },
};

export const Selectable: Story = {
  args: {
    ...Default.args,
    selectable: true,
    bulkActions,
  },
};

export const WithRowActions: Story = {
  args: {
    ...Default.args,
    rowActions,
  },
};

export const FullFeatured: Story = {
  args: {
    ...Default.args,
    selectable: true,
    rowActions,
    bulkActions,
  },
};

export const CompactMode: Story = {
  args: {
    ...Default.args,
    density: 'compact' as const,
    rowActions: rowActions.slice(0, 2), // Only view and edit
  },
};

export const NoSearch: Story = {
  args: {
    data: documentData,
    columns: documentColumns,
    searchable: false,
    pagination: true,
  },
};

export const NoPagination: Story = {
  args: {
    data: documentData.slice(0, 3), // Fewer items
    columns: documentColumns,
    searchable: true,
    pagination: false,
  },
};

// Job applications data example
const jobApplicationData = [
  {
    id: 1,
    position: 'Senior Frontend Developer',
    company: 'TechCorp Solutions',
    status: 'Interview Scheduled',
    applied: '2024-01-14',
    salary: '$120,000 - $140,000',
    match: 95,
  },
  {
    id: 2,
    position: 'Full Stack Engineer',
    company: 'StartupXYZ',
    status: 'Application Sent',
    applied: '2024-01-12',
    salary: '$90,000 - $110,000',
    match: 88,
  },
  {
    id: 3,
    position: 'React Developer',
    company: 'Digital Agency Inc',
    status: 'Rejected',
    applied: '2024-01-10',
    salary: '$85,000 - $100,000',
    match: 82,
  },
];

const jobColumns = [
  {
    id: 'position',
    label: 'Position',
    sortable: true,
    render: (value: string) => (
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    ),
  },
  {
    id: 'company',
    label: 'Company',
    sortable: true,
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    filterable: true,
    filterOptions: ['Application Sent', 'Interview Scheduled', 'Rejected', 'Offer Received'],
    render: (value: string) => (
      <Chip
        label={value}
        size="small"
        color={
          value === 'Interview Scheduled' ? 'primary' :
          value === 'Offer Received' ? 'success' :
          value === 'Rejected' ? 'error' : 'default'
        }
        variant="outlined"
      />
    ),
  },
  {
    id: 'match',
    label: 'Match %',
    sortable: true,
    align: 'right' as const,
    render: (value: number) => <ScoreDisplay score={value} />,
  },
  {
    id: 'applied',
    label: 'Applied Date',
    sortable: true,
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    id: 'salary',
    label: 'Salary Range',
  },
];

export const JobApplicationsExample: Story = {
  args: {
    data: jobApplicationData,
    columns: jobColumns,
    searchable: true,
    pagination: false,
    selectable: true,
    rowActions: [
      {
        id: 'view',
        label: 'View Details',
        icon: Eye,
        onClick: (row: any) => console.log('View job:', row.position),
      },
      {
        id: 'edit',
        label: 'Update Status',
        icon: Edit,
        onClick: (row: any) => console.log('Update:', row.position),
      },
    ],
    bulkActions: [
      {
        id: 'update-status',
        label: 'Update Status',
        icon: Edit,
        onClick: (selectedRows: any[]) => console.log('Update status for:', selectedRows.length),
      },
    ],
  },
};

export const EmptyState: Story = {
  args: {
    data: [],
    columns: documentColumns,
    searchable: true,
    pagination: true,
    emptyMessage: 'No documents found. Create your first document to get started!',
  },
};

export const Loading: Story = {
  args: {
    data: [],
    columns: documentColumns,
    searchable: true,
    pagination: true,
    loading: true,
  },
};

export const LargeDataset: Story = {
  args: {
    data: Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Document_${i + 1}.pdf`,
      type: ['Resume', 'Cover Letter', 'Portfolio'][i % 3],
      status: ['Published', 'Draft'][i % 2],
      lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      size: `${Math.floor(Math.random() * 500 + 100)} KB`,
      atsScore: Math.floor(Math.random() * 40 + 60),
    })),
    columns: documentColumns,
    searchable: true,
    pagination: true,
    selectable: true,
    rowActions,
    bulkActions,
  },
};