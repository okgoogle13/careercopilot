import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SolidarityCard } from './SolidarityCard';

const meta: Meta<typeof SolidarityCard> = {
  title: 'KeralaRage/SolidarityCard',
  component: SolidarityCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['standard', 'ghost', 'active'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SolidarityCard>;

export const Standard: Story = {
  args: {
    variant: 'standard',
    children: (
      <div className="flex flex-col gap-2">
        <h3 className="font-proclamation text-white">Card Title</h3>
        <p className="font-field-note text-paper-white/80">
          This is a standard SolidarityCard component.
        </p>
      </div>
    ),
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: (
      <div className="flex flex-col gap-2">
        <h3 className="font-proclamation text-ink-gold">Ghost Card</h3>
        <p className="font-field-note text-paper-white/80">
          This is a ghost card variant.
        </p>
      </div>
    ),
  },
};

export const Active: Story = {
  args: {
    variant: 'active',
    children: (
      <div className="flex flex-col gap-2">
        <h3 className="font-proclamation text-white">Active Card</h3>
        <p className="font-field-note text-paper-white/80">
          This is an active card variant.
        </p>
      </div>
    ),
  },
};
