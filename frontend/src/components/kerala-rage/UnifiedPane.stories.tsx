import type { Meta, StoryObj } from '@storybook/react';
import { UnifiedPane } from './UnifiedPane';
import { ActionButton } from './ActionButton';
import { NexusInput } from './NexusInput';

const meta: Meta<typeof UnifiedPane> = {
  title: 'KeralaRage/UnifiedPane',
  component: UnifiedPane,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof UnifiedPane>;

const DemoSidebar = () => (
  <div className="flex flex-col gap-4">
    <div className="text-sm font-mono text-white/50 uppercase tracking-widest mb-2">Filters</div>
    <NexusInput
      placeholder="Search..."
      icon="search"
      className="mb-2"
    />
    <ActionButton
      label="Filter A"
      variant="primary"
      size="sm"
      className="w-full text-center"
    />
    <ActionButton
      label="Filter B"
      variant="secondary"
      size="sm"
      className="w-full text-center"
    />
  </div>
);

const DemoContent = () => (
  <div className="space-y-4">
    <p className="font-primary text-paper-white/80">
      This is the main content area of the UnifiedPane. It handles internal scrolling while
      maintaining the Stone container aesthetic.
    </p>
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="p-4 rounded-pebble bg-white/5 border border-white/5"
      >
        <h3 className="font-display text-lg text-ink-gold mb-1">Item {i}</h3>
        <p className="text-sm text-white/60">Description text for item {i} goes here.</p>
      </div>
    ))}
  </div>
);

export const Default: Story = {
  args: {
    title: 'Tactical View',
    children: <DemoContent />,
  },
  decorators: [
    (Story) => (
      <div className="p-8 h-screen bg-asphalt-black">
        <Story />
      </div>
    ),
  ],
};

export const WithSidebar: Story = {
  args: {
    title: 'Filtered View',
    sidebar: <DemoSidebar />,
    children: <DemoContent />,
  },
  decorators: [
    (Story) => (
      <div className="p-8 h-screen bg-asphalt-black">
        <Story />
      </div>
    ),
  ],
};
