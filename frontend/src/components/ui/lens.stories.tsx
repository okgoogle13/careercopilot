import 'src/design/styles/design-tokens.css';
import type { Meta, StoryObj } from '@storybook/react';
import { Search } from 'lucide-react';
import { Lens } from './Lens';

const meta: Meta<typeof Lens> = {
  title: 'Components/UI/Lens',
  component: Lens,
  tags: ['autodocs'],
  args: {
    id: 'lens-story',
    label: 'Job Search',
    placeholder: 'Find roles in community services',
    fullWidth: true,
  },
};

export default meta;
type Story = StoryObj<typeof Lens>;

export const Default: Story = {
  args: {
    startAdornment: <Search className="h-4 w-4" />,
  },
};

export const Hover: Story = {
  args: {
    className: 'hover:text-[var(--sys-color-worker-ash-steps-6)]',
  },
};

export const Focus: Story = {
  args: {
    autoFocus: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Disabled search',
  },
};

export const Error: Story = {
  args: {
    error: true,
    errorMessage: 'Please enter at least 2 characters.',
    value: 'x',
  },
};
