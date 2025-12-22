import type { Meta, StoryObj } from '@storybook/react';
import { M3EmptyState } from './M3EmptyState';

const meta: Meta<typeof M3EmptyState> = {
  title: 'M3/Feedback/EmptyState',
  component: M3EmptyState,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The main title text',
    },
    description: {
      control: 'text',
      description: 'Optional description text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3EmptyState>;

/**
 * Basic empty state with title only
 */
export const Basic: Story = {
  args: {
    title: 'No items found',
  },
};

/**
 * Empty state with description
 */
export const WithDescription: Story = {
  args: {
    title: 'No results',
    description: 'Try adjusting your search or filter to find what you\'re looking for.',
  },
};

/**
 * Empty state with illustration
 */
export const WithIllustration: Story = {
  args: {
    title: 'No notifications',
    description: 'When you have notifications, they will appear here.',
    illustration: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="50" fill="#E8F5E9" />
        <path
          d="M60 30C43.43 30 30 43.43 30 60C30 76.57 43.43 90 60 90C76.57 90 90 76.57 90 60C90 43.43 76.57 30 60 30ZM65 70H55V60H65V70ZM65 55H55V45H65V55Z"
          fill="#4CAF50"
        />
      </svg>
    ),
  },
};

/**
 * Empty state with action button
 */
export const WithActionButton: Story = {
  args: {
    title: 'No projects yet',
    description: 'Get started by creating your first project.',
    action: (
      <button
        style={{
          padding: '12px 24px',
          backgroundColor: '#1976D2',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
        }}
        onClick={() => alert('Create project clicked')}
      >
        Create Project
      </button>
    ),
  },
};

/**
 * Complete empty state with all props
 */
export const Complete: Story = {
  args: {
    title: 'No messages',
    description: 'Start a conversation by sending your first message.',
    illustration: (
      <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
        <circle cx="80" cy="80" r="70" fill="#E3F2FD" />
        <path
          d="M110 50H50C44.48 50 40 54.48 40 60V90C40 95.52 44.48 100 50 100H70L80 110L90 100H110C115.52 100 120 95.52 120 90V60C120 54.48 115.52 50 110 50Z"
          fill="#2196F3"
        />
        <circle cx="60" cy="72" r="4" fill="white" />
        <circle cx="80" cy="72" r="4" fill="white" />
        <circle cx="100" cy="72" r="4" fill="white" />
      </svg>
    ),
    action: (
      <button
        style={{
          padding: '12px 24px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
        }}
        onClick={() => alert('Send message clicked')}
      >
        Send Message
      </button>
    ),
  },
};

/**
 * Empty state for search results
 */
export const SearchResults: Story = {
  args: {
    title: 'No search results',
    description: 'We couldn\'t find anything matching your search. Try different keywords.',
    illustration: (
      <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
        <circle cx="70" cy="70" r="60" fill="#FFF3E0" />
        <circle cx="60" cy="60" r="25" stroke="#FF9800" strokeWidth="4" fill="none" />
        <line x1="78" y1="78" x2="95" y2="95" stroke="#FF9800" strokeWidth="4" strokeLinecap="round" />
        <line x1="50" y1="55" x2="70" y2="55" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="65" x2="65" y2="65" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
};
