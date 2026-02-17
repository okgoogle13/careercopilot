import 'src/design/styles/design-tokens.css';
import type { Meta, StoryObj } from '@storybook/react';
import { Jar } from './Jar';

const options = [
  { value: 'social-work', label: 'Social Worker' },
  { value: 'case-manager', label: 'Case Manager' },
  { value: 'community-officer', label: 'Community Officer' },
];

const meta: Meta<typeof Jar> = {
  title: 'Components/UI/Jar',
  component: Jar,
  tags: ['autodocs'],
  args: {
    label: 'Preferred Role',
    options,
    placeholder: 'Choose a role',
  },
};

export default meta;
type Story = StoryObj<typeof Jar>;

export const Default: Story = {};

export const Hover: Story = {
  args: {
    className: 'hover:border-[var(--sys-color-worker-ash-steps-2)]',
  },
};

export const Focus: Story = {
  args: {
    className: 'ring-2 ring-[var(--sys-color-inkGold-base)]',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'social-work',
  },
};

export const Error: Story = {
  args: {
    error: true,
    errorMessage: 'Selection is required.',
  },
};
