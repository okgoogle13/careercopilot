import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { M3Dialog } from './M3Dialog';
import { Button } from '@/components/ui/button';

/**
 * M3 Expressive Dialog Component
 *
 * Lightweight confirmation dialog with built-in buttons.
 * Simpler than Modal, optimized for confirm/cancel patterns.
 */
const meta: Meta<typeof M3Dialog> = {
  component: M3Dialog,
  title: 'M3 Expressive/Dialog',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'If true, dialog is open',
    },
    destructive: {
      control: 'boolean',
      description: 'If true, confirm action is destructive',
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: 'If true, clicking backdrop closes dialog',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'If true, pressing Escape closes dialog',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Dialog
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <M3Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm Action"
          content="Are you sure you want to proceed with this action?"
          onConfirm={() => alert('Confirmed!')}
        />
      </>
    );
  },
};

/**
 * Destructive Action Dialog
 */
export const Destructive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)} variant="destructive">
          Delete Item
        </Button>
        <M3Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Delete Item?"
          content="This action cannot be undone. The item will be permanently deleted."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          destructive
          onConfirm={() => alert('Deleted!')}
        />
      </>
    );
  },
};

/**
 * Custom Button Labels
 */
export const CustomLabels: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Save Changes</Button>
        <M3Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Save Changes?"
          content="You have unsaved changes. Do you want to save them before leaving?"
          confirmLabel="Save"
          cancelLabel="Discard"
          onConfirm={() => alert('Saved!')}
        />
      </>
    );
  },
};
