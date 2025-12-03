import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { M3Drawer } from './M3Drawer';
import { M3Button } from '../button/M3Button';

/**
 * M3 Expressive Drawer Component
 *
 * Side panel that slides in from left or right.
 * Use for navigation, filters, or supplementary content.
 */
const meta: Meta<typeof M3Drawer> = {
  component: M3Drawer,
  title: 'M3 Expressive/Drawer',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'If true, drawer is open',
    },
    placement: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Placement of the drawer',
    },
    showBackdrop: {
      control: 'boolean',
      description: 'If true, shows backdrop overlay',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Drawer (Left)
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <M3Button onClick={() => setOpen(true)}>Open Drawer</M3Button>
        <M3Drawer open={open} onClose={() => setOpen(false)} header={<M3Drawer.Header>Drawer Title</M3Drawer.Header>}>
          <div>
            <p>This is the drawer content. It slides in from the left by default.</p>
          </div>
        </M3Drawer>
      </>
    );
  },
};

/**
 * Right Placement
 */
export const RightPlacement: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <M3Button onClick={() => setOpen(true)}>Open Right Drawer</M3Button>
        <M3Drawer
          open={open}
          onClose={() => setOpen(false)}
          placement="right"
          header={<M3Drawer.Header>Right Drawer</M3Drawer.Header>}
        >
          <div>
            <p>This drawer slides in from the right side.</p>
          </div>
        </M3Drawer>
      </>
    );
  },
};

/**
 * Drawer without Backdrop
 */
export const NoBackdrop: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <M3Button onClick={() => setOpen(true)}>Open Drawer (No Backdrop)</M3Button>
        <M3Drawer
          open={open}
          onClose={() => setOpen(false)}
          showBackdrop={false}
          header={<M3Drawer.Header>Drawer without Backdrop</M3Drawer.Header>}
        >
          <div>
            <p>This drawer does not show a backdrop overlay.</p>
          </div>
        </M3Drawer>
      </>
    );
  },
};
