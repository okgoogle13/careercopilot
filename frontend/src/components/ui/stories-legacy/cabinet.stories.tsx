import 'src/design/styles/design-tokens.css';
import type { Meta, StoryObj } from '@storybook/react';
import { Cabinet } from './Cabinet';

const meta: Meta<typeof Cabinet> = {
  title: 'Components/UI/Cabinet',
  component: Cabinet,
  tags: ['autodocs'],
  args: {
    open: true,
    onClose: () => undefined,
    title: 'Application Details',
    children: (
      <p className="text-[var(--sys-color-worker-ash-steps-6)]">
        Review and confirm your submission details.
      </p>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof Cabinet>;

export const Default: Story = {};

export const Hover: Story = {
  args: {
    children: (
      <p className="text-[var(--sys-color-worker-ash-steps-6)]">
        Hover state is represented by elevated close control and card surface.
      </p>
    ),
  },
};

export const Focus: Story = {
  args: {
    title: 'Focused Modal',
    children: (
      <p className="ring-2 ring-[var(--sys-color-inkGold-base)] rounded-[var(--radius-stone)] p-2">
        Primary action area focus indicator.
      </p>
    ),
  },
};

export const Disabled: Story = {
  args: {
    open: false,
  },
};

export const Error: Story = {
  args: {
    variant: '[DEPRECATED_STYLE]',
    title: 'Submission Failed',
    children: (
      <p className="text-[var(--sys-color-solidarityRed-base)]">
        An error occurred while saving your draft.
      </p>
    ),
  },
};
