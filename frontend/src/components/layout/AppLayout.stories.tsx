import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from './AppLayout';
import { Box, Typography, Card, CardContent } from '@mui/material';

const meta: Meta<typeof AppLayout> = {
  title: 'Layout/AppLayout',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The main application layout component that provides navigation, header, and content areas with responsive behavior.',
      },
    },
  },
  argTypes: {
    currentView: {
      control: { type: 'select' },
      options: [
        'dashboard',
        'documents',
        'ats-analysis',
        'job-matching',
        'career-intelligence',
        'interview-prep',
        'profile',
        'settings',
      ],
      description: 'The currently active navigation item',
    },
    showDemoNav: {
      control: 'boolean',
      description: 'Whether to show the navigation sidebar',
    },
    isDarkMode: {
      control: 'boolean',
      description: 'Current theme mode',
    },
    user: {
      control: 'object',
      description: 'User information for the header',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

const SampleContent = ({ title }: { title: string }) => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      {title}
    </Typography>
    <Card>
      <CardContent>
        <Typography variant="body1" paragraph>
          This is sample content for the {title.toLowerCase()} page. The AppLayout component
          provides a consistent navigation experience across all pages of the application.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Features include:
        </Typography>
        <ul>
          <li>Responsive navigation drawer</li>
          <li>User profile management</li>
          <li>Theme toggle functionality</li>
          <li>Breadcrumb navigation</li>
          <li>Mobile-optimized layout</li>
        </ul>
      </CardContent>
    </Card>
  </Box>
);

export const Default: Story = {
  args: {
    currentView: 'dashboard',
    showDemoNav: true,
    isDarkMode: false,
    children: <SampleContent title="Dashboard" />,
    user: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
    },
  },
};

export const DarkMode: Story = {
  args: {
    ...Default.args,
    isDarkMode: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const DocumentsView: Story = {
  args: {
    ...Default.args,
    currentView: 'documents',
    children: <SampleContent title="Documents" />,
  },
};

export const ATSAnalysisView: Story = {
  args: {
    ...Default.args,
    currentView: 'ats-analysis',
    children: <SampleContent title="ATS Analysis" />,
  },
};

export const HiddenNavigation: Story = {
  args: {
    ...Default.args,
    showDemoNav: false,
    children: <SampleContent title="Dashboard" />,
  },
};

export const WithAvatar: Story = {
  args: {
    ...Default.args,
    user: {
      name: 'Alex Chen',
      email: 'alex.chen@example.com',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
  },
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

export const Tablet: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
