import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader, PageHeaderPresets } from './PageHeader';
import { Box, Typography, Chip } from '@mui/material';
import { Edit, Share2, Download, Bookmark, Trash2, Plus, Filter } from '@mui/icons-material';

const meta: Meta<typeof PageHeader> = {
  title: 'Layout/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A flexible page header component with support for breadcrumbs, actions, avatars, and multiple variants.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed'],
      description: 'Visual variant of the header',
    },
    title: {
      control: 'text',
      description: 'Main title text',
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle text',
    },
    description: {
      control: 'text',
      description: 'Longer description text (hidden in compact mode)',
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ minHeight: '300px' }}>
        <Story />
        <Box sx={{ p: 3, bgcolor: 'background.default' }}>
          <Typography variant="body1">
            Page content would appear here...
          </Typography>
        </Box>
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

const sampleBreadcrumbs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Documents', href: '/documents' },
  { label: 'Resume.pdf' },
];

const sampleActions = [
  {
    id: 'edit',
    label: 'Edit',
    icon: Edit,
    variant: 'outlined' as const,
    onClick: () => console.log('Edit'),
  },
  {
    id: 'share',
    label: 'Share',
    icon: Share2,
    variant: 'outlined' as const,
    onClick: () => console.log('Share'),
  },
  {
    id: 'create',
    label: 'Create New',
    icon: Plus,
    variant: 'contained' as const,
    onClick: () => console.log('Create'),
  },
];

const sampleMenuActions = [
  {
    id: 'download',
    label: 'Download',
    icon: Download,
    onClick: () => console.log('Download'),
  },
  {
    id: 'bookmark',
    label: 'Bookmark',
    icon: Bookmark,
    onClick: () => console.log('Bookmark'),
    divider: true,
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: Trash2,
    onClick: () => console.log('Delete'),
    color: 'error' as const,
  },
];

export const Default: Story = {
  args: {
    title: 'Document Overview',
    subtitle: 'Senior Software Engineer Resume',
    description: 'A comprehensive resume showcasing 8+ years of full-stack development experience with React, Node.js, and cloud technologies.',
    breadcrumbs: sampleBreadcrumbs,
    actions: sampleActions.slice(0, 2),
    menuActions: sampleMenuActions,
    onBack: () => console.log('Back'),
  },
};

export const Compact: Story = {
  args: {
    ...Default.args,
    variant: 'compact',
    title: 'Quick Settings',
    subtitle: undefined,
    description: undefined,
  },
};

export const Detailed: Story = {
  args: {
    ...Default.args,
    variant: 'detailed',
    title: 'Career Dashboard',
    subtitle: 'Track your job search progress',
    description: 'Monitor application status, interview schedules, and career milestones all in one place. Get insights into your job search performance and optimize your strategy.',
    breadcrumbs: [{ label: 'Dashboard' }],
    actions: [sampleActions[2]], // Just the create button
  },
};

export const WithStatus: Story = {
  args: {
    ...Default.args,
    status: {
      label: 'Published',
      color: 'success',
      variant: 'filled',
    },
  },
};

export const WithAvatar: Story = {
  args: {
    ...Default.args,
    avatar: {
      src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      alt: 'Profile Picture',
      fallback: 'JD',
    },
    title: 'John Doe',
    subtitle: 'Senior Software Engineer',
    description: 'Full-stack developer with expertise in React, TypeScript, and cloud architecture.',
  },
};

export const ManyActions: Story = {
  args: {
    ...Default.args,
    actions: [
      ...sampleActions,
      {
        id: 'filter',
        label: 'Filter',
        icon: Filter,
        variant: 'outlined' as const,
        onClick: () => console.log('Filter'),
      },
      {
        id: 'export',
        label: 'Export',
        icon: Download,
        variant: 'text' as const,
        onClick: () => console.log('Export'),
      },
    ],
  },
};

export const NoBreadcrumbs: Story = {
  args: {
    ...Default.args,
    breadcrumbs: undefined,
    title: 'Main Dashboard',
    subtitle: 'Welcome back!',
  },
};

export const NoActions: Story = {
  args: {
    title: 'Read-only Document',
    subtitle: 'Viewing mode',
    description: 'This document is in read-only mode.',
    breadcrumbs: sampleBreadcrumbs,
    onBack: () => console.log('Back'),
  },
};

export const CustomContent: Story = {
  args: {
    ...Default.args,
    children: (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip label="React" size="small" />
        <Chip label="TypeScript" size="small" />
        <Chip label="Node.js" size="small" />
        <Chip label="AWS" size="small" />
      </Box>
    ),
  },
};

// Preset Examples
export const DocumentPagePreset: Story = {
  args: PageHeaderPresets.documentPage(
    'Senior_Software_Engineer_Resume.pdf',
    () => console.log('Back to Documents'),
    () => console.log('Edit'),
    () => console.log('Delete')
  ),
};

export const DashboardPagePreset: Story = {
  args: PageHeaderPresets.dashboardPage(
    'Career Dashboard',
    'Track your job search progress'
  ),
};

export const SettingsPagePreset: Story = {
  args: PageHeaderPresets.settingsPage(
    'Account Settings',
    () => console.log('Back to Dashboard')
  ),
};

export const Mobile: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
};