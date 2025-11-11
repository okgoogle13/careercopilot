import type { Meta, StoryObj } from '@storybook/react';
import { ProfileCard } from './ProfileCardMUI';

const meta: Meta<typeof ProfileCard> = {
  title: 'Components/ProfileCard',
  component: ProfileCard,
  tags: ['autodocs', 'autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component for displaying user profile information with an avatar, name, title, and contact details.',
      },
    },
  },
  argTypes: {
    profile: {
      control: 'object',
      description: 'Profile information object containing user details',
      table: {
        type: { 
          summary: 'Profile',
          detail: '{\n  name: string;\n  title?: string;\n  email?: string;\n  avatar?: string;\n}'
        },
        defaultValue: { summary: '{}' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS class for custom styling',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    sx: {
      control: 'object',
      description: 'MUI system props for custom styling',
      table: {
        type: { summary: 'SxProps<Theme>' },
        defaultValue: { summary: '{}' },
      },
    },
    avatarBackground: {
      description: 'Background color for the avatar',
      control: 'color',
    },
    isSelected: {
      description: 'Whether the card is in a selected state',
      control: 'boolean',
    },
    onEdit: { action: 'onEdit' },
    onDelete: { action: 'onDelete' },
  },
  args: {
    id: '1',
    name: 'John Doe',
    role: 'Senior Frontend Developer',
    activeApplications: 5,
    atsScore: 78,
    lastUpdated: '2 days ago',
    avatarColor: '#4F46E5',
    isSelected: false,
    onEdit: () => {},
    onDelete: () => {},
  },
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default profile card with a medium ATS score
 */
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'A standard profile card with a medium ATS score (70-85). The card includes the user\'s name, role, active applications, and ATS score.',
      },
    },
  },
};

/**
 * Profile card with a high ATS score (85+)
 */
export const HighScore: Story = {
  args: {
    name: 'Jane Smith',
    role: 'Tech Lead',
    activeApplications: 8,
    atsScore: 92,
    lastUpdated: 'yesterday',
    avatarColor: '#10B981',
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile card showing a high ATS score (85+), displayed with a green indicator.',
      },
    },
  },
};

/**
 * Profile card with a low ATS score (<70)
 */
export const LowScore: Story = {
  args: {
    name: 'Alex Johnson',
    role: 'Junior Developer',
    activeApplications: 2,
    atsScore: 45,
    lastUpdated: '1 week ago',
    avatarColor: '#EF4444',
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile card showing a low ATS score (<70), displayed with a red indicator. This indicates areas where the profile might need improvement.',
      },
    },
  },
};

/**
 * Profile card in selected state
 */
export const Selected: Story = {
  args: {
    name: 'Selected Profile',
    isSelected: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile card in selected state, showing a border and shadow to indicate selection.',
      },
    },
  },
};

/**
 * Profile card with long text to test overflow
 */
export const LongText: Story = {
  args: {
    name: 'Dr. Elizabeth Margaret Halsey-Underwood III, PhD',
    role: 'Distinguished Senior Principal Lead Frontend Architect & UI/UX Specialist',
    activeApplications: 12,
    lastUpdated: 'just now',
    avatarColor: '#8B5CF6',
  },
  parameters: {
    docs: {
      description: {
        story: 'Profile card with long text to test how the component handles overflow. The text should truncate with an ellipsis if it\'s too long.',
      },
    },
  },
};
