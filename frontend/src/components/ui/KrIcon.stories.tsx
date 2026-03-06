import type { Meta, StoryObj } from '@storybook/react';
import { KrIcon } from './KrIcon';

const meta: Meta<typeof KrIcon> = {
  title: 'UI/KrIcon',
  component: KrIcon,
  tags: ['autodocs'],
  args: {
    name: 'stencil',
    size: 24,
    ariaLabel: 'Stencil icon',
  },
  argTypes: {
    name: {
      control: 'select',
      options: ['stencil', 'tram', 'seal', 'wheat'],
    },
    size: {
      control: { type: 'number', min: 16, max: 64, step: 4 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof KrIcon>;

export const Playground: Story = {};

export const AllIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6 bg-surface-KrDark-slate-smoke-high p-6 text-on-surface-paper-white">
      {(['stencil', 'tram', 'seal', 'wheat'] as const).map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2"
        >
          <KrIcon
            name={name}
            ariaLabel={`${name} icon`}
            size={24}
          />
          <span className="font-annotation text-xs uppercase tracking-widest">{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6 bg-surface-KrDark-slate-smoke-high p-6 text-on-surface-paper-white">
      {[16, 24, 32, 48].map((size) => (
        <div
          key={size}
          className="flex flex-col items-center gap-2"
        >
          <KrIcon
            name="seal"
            size={size}
            ariaLabel={`Seal icon ${size}px`}
          />
          <span className="font-annotation text-xs uppercase tracking-widest">{size}px</span>
        </div>
      ))}
    </div>
  ),
};

export const CustomClassName: Story = {
  render: () => (
    <div className="bg-surface-KrDark-slate-smoke-high p-6">
      <KrIcon
        name="wheat"
        size={48}
        ariaLabel="Wheat icon with framed wrapper"
        className="rounded-sentry border border-ink-gold/30 bg-surface-KrDark-slate-smoke-highest p-2 shadow-sm"
      />
    </div>
  ),
};
