import 'src/design/styles/design-tokens.css';
import type { Meta, StoryObj } from '@storybook/react';
import { Briefcase } from 'lucide-react';
import { Vessel } from './Vessel';

const meta: Meta<typeof Vessel> = {
  title: 'Components/UI/Vessel',
  component: Vessel,
  tags: ['autodocs'],
  args: {
    title: 'Application Milestones',
    icon: <Briefcase className="h-5 w-5" />,
    defaultExpanded: true,
    children: <p className="text-[var(--sys-color-worker-ash-steps-6)]">Track draft, submitted, and interview stages.</p>,
  },
};

export default meta;
type Story = StoryObj<typeof Vessel>;

export const Default: Story = {};

export const Hover: Story = {
  args: {
    className: 'hover:border-[var(--sys-color-worker-ash-base)]',
  },
};

export const Focus: Story = {
  args: {
    className: 'ring-2 ring-[var(--sys-color-inkGold-base)]',
  },
};

export const Disabled: Story = {
  args: {
    defaultExpanded: false,
    className: 'opacity-60 pointer-events-none',
  },
};

export const Error: Story = {
  args: {
    title: 'Validation Error',
    children: <p className="text-[var(--sys-color-solidarityRed-base)]">Unable to load details for this accordion section.</p>,
  },
};
