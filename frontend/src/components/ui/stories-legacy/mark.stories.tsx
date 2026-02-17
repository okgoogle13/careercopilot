import 'src/design/styles/design-tokens.css';
import type { Meta, StoryObj } from '@storybook/react';
import { Mark } from './Mark';

const meta: Meta<typeof Mark> = {
  title: 'Components/UI/Mark',
  component: Mark,
  tags: ['autodocs'],
  args: {
    label: 'I agree to share this application with my advisor',
    checked: true,
  },
};

export default meta;
type Story = StoryObj<typeof Mark>;

export const Default: Story = {};

export const Hover: Story = {
  args: {
    containerClassName: 'hover:opacity-90',
  },
};

export const Focus: Story = {
  args: {
    containerClassName: 'ring-2 ring-[var(--sys-color-inkGold-base)] rounded-[var(--radius-seed)] p-1',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    error: true,
    checked: true,
    label: 'A required acknowledgement is missing.',
  },
};
