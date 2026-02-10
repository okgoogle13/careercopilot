import type { Meta, StoryObj } from '@storybook/react';
import { ManifestoSlab } from './ManifestoSlab';

const meta: Meta<typeof ManifestoSlab> = {
  title: 'KeralaRage/ManifestoSlab',
  component: ManifestoSlab,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ManifestoSlab>;

export const Default: Story = {
  args: {
    title: 'STRENGTH IN UNITY',
    subtitle: 'MANIFESTO 001',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'WE REJECT THE ANTAGONIST OF BUREAUCRACY',
    subtitle: 'THE MISSION',
  },
};

export const NoSubtitle: Story = {
  args: {
    title: 'ALWAYS WAS ALWAYS WILL BE',
  },
};
