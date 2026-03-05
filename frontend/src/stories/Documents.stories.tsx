import type { Meta, StoryObj } from '@storybook/react';
import { Documents } from '../features/documents/Documents';

const meta: Meta<typeof Documents> = {
  title: 'Features/Documents',
  component: Documents,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Documents>;

export const Default: Story = {};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
