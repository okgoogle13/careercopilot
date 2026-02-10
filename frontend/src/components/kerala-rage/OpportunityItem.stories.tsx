import type { Meta, StoryObj } from '@storybook/react';
import { OpportunityItem } from './OpportunityItem';

const meta: Meta<typeof OpportunityItem> = {
  title: 'KeralaRage/OpportunityItem',
  component: OpportunityItem,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OpportunityItem>;

export const Default: Story = {
  args: {
    title: 'Senior Frontend Engineer',
    subtitle: 'Canva — Surry Hills, NSW',
    meta: 'MATCH: 98%',
    actionLabel: 'Apply',
    onAction: () => console.log('Action View clicked'),
  },
};

export const Priority: Story = {
  args: {
    title: 'Staff Software Engineer (Design Systems)',
    subtitle: 'Atlassian — Sydney, NSW',
    meta: 'URGENT MATCH',
    priority: true,
    actionLabel: 'Review',
  },
};

export const Minimal: Story = {
  args: {
    title: 'React Contractor',
    meta: 'Contract',
    priority: false,
  },
};
