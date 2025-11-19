import type { Meta, StoryObj } from '@storybook/react';
import { M3EmptyState } from './M3EmptyState';

const meta: Meta<typeof M3EmptyState> = {
  title: 'M3/Feedback/EmptyState',
  component: M3EmptyState,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3EmptyState>;

// Default search icon
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

// Inbox icon
const InboxIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z" />
  </svg>
);

// Folder icon
const FolderIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
  </svg>
);

// Cloud icon
const CloudIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
  </svg>
);

export const NoResults: Story = {
  args: {
    icon: <SearchIcon />,
    title: 'No results found',
    description: 'Try adjusting your search or filter criteria to find what you\'re looking for.',
  },
};

export const EmptyInbox: Story = {
  args: {
    icon: <InboxIcon />,
    title: 'Your inbox is empty',
    description: 'When you receive new messages, they will appear here.',
  },
};

export const NoFiles: Story = {
  args: {
    icon: <FolderIcon />,
    title: 'No files yet',
    description: 'Upload your first file to get started.',
    primaryAction: (
      <button style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
        Upload File
      </button>
    ),
  },
};

export const WithActions: Story = {
  args: {
    icon: <CloudIcon />,
    title: 'No documents uploaded',
    description: 'Start by uploading your first document or create a new one from scratch.',
    primaryAction: (
      <button style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 500, backgroundColor: '#1976d2', color: 'white' }}>
        Upload Document
      </button>
    ),
    secondaryAction: (
      <button style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #ccc', cursor: 'pointer', fontWeight: 500, backgroundColor: 'transparent' }}>
        Create New
      </button>
    ),
  },
};

export const SmallSize: Story = {
  args: {
    icon: <SearchIcon />,
    title: 'No results',
    description: 'Try a different search term.',
    size: 'small',
  },
};

export const MediumSize: Story = {
  args: {
    icon: <InboxIcon />,
    title: 'Nothing here',
    description: 'This is the default medium size empty state.',
    size: 'medium',
  },
};

export const LargeSize: Story = {
  args: {
    icon: <FolderIcon />,
    title: 'Get started',
    description: 'This large empty state is perfect for onboarding screens and important call-to-actions.',
    size: 'large',
    primaryAction: (
      <button style={{ padding: '12px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '16px', backgroundColor: '#1976d2', color: 'white' }}>
        Get Started
      </button>
    ),
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <div style={{ border: '1px dashed #ccc', borderRadius: '8px' }}>
        <M3EmptyState
          icon={<SearchIcon />}
          title="Small Size"
          description="Compact empty state for smaller spaces"
          size="small"
        />
      </div>
      <div style={{ border: '1px dashed #ccc', borderRadius: '8px' }}>
        <M3EmptyState
          icon={<InboxIcon />}
          title="Medium Size (Default)"
          description="Standard empty state for most use cases"
          size="medium"
        />
      </div>
      <div style={{ border: '1px dashed #ccc', borderRadius: '8px' }}>
        <M3EmptyState
          icon={<FolderIcon />}
          title="Large Size"
          description="Prominent empty state for important screens and onboarding"
          size="large"
        />
      </div>
    </div>
  ),
};

export const NoIcon: Story = {
  args: {
    title: 'No content available',
    description: 'This empty state has no icon, just text content.',
  },
};

export const NoDescription: Story = {
  args: {
    icon: <SearchIcon />,
    title: 'No results found',
  },
};

export const ErrorState: Story = {
  render: () => (
    <M3EmptyState
      icon={
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      }
      title="Something went wrong"
      description="We couldn't load your data. Please try again or contact support if the problem persists."
      primaryAction={
        <button style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 500, backgroundColor: '#1976d2', color: 'white' }}>
          Try Again
        </button>
      }
      secondaryAction={
        <button style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #ccc', cursor: 'pointer', fontWeight: 500, backgroundColor: 'transparent' }}>
          Contact Support
        </button>
      }
    />
  ),
};

export const Onboarding: Story = {
  render: () => (
    <M3EmptyState
      icon={
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '96px', height: '96px' }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      }
      title="Welcome to CareerCopilot!"
      description="Let's get you started on your journey. Create your first profile to begin exploring opportunities."
      size="large"
      primaryAction={
        <button style={{ padding: '12px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '16px', backgroundColor: '#1976d2', color: 'white' }}>
          Create Profile
        </button>
      }
      secondaryAction={
        <button style={{ padding: '12px 32px', borderRadius: '8px', border: '1px solid #1976d2', cursor: 'pointer', fontWeight: 500, fontSize: '16px', backgroundColor: 'transparent', color: '#1976d2' }}>
          Learn More
        </button>
      }
    />
  ),
};
