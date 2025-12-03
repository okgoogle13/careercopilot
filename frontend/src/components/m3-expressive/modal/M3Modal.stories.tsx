import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { M3Modal } from './M3Modal';
import { M3Button } from '../button/M3Button';

/**
 * M3 Expressive Modal Component
 *
 * Full-screen overlay modal with backdrop, focus trap, and keyboard support.
 * Use for important dialogs, forms, and content that requires user attention.
 */
const meta: Meta<typeof M3Modal> = {
  component: M3Modal,
  title: 'M3 Expressive/Modal',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'If true, modal is open',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Modal size variant',
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: 'If true, clicking backdrop closes modal',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'If true, pressing Escape closes modal',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Modal (Medium size)
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <M3Button onClick={() => setOpen(true)}>Open Modal</M3Button>
        <M3Modal open={open} onClose={() => setOpen(false)}>
          <div style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0' }}>Modal Title</h3>
            <p>This is the modal content. Click outside or press Escape to close.</p>
          </div>
        </M3Modal>
      </>
    );
  },
};

/**
 * Modal with Header and Footer
 */
export const WithHeaderFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <M3Button onClick={() => setOpen(true)}>Open Modal with Header/Footer</M3Button>
        <M3Modal
          open={open}
          onClose={() => setOpen(false)}
          header={<M3Modal.Header>Modal Title</M3Modal.Header>}
          footer={
            <M3Modal.Footer>
              <M3Button variant="text" onClick={() => setOpen(false)}>
                Cancel
              </M3Button>
              <M3Button variant="filled" onClick={() => setOpen(false)}>
                Save
              </M3Button>
            </M3Modal.Footer>
          }
        >
          <div>
            <p>This modal has a header with title and close button, and a footer with action buttons.</p>
          </div>
        </M3Modal>
      </>
    );
  },
};

/**
 * Size Variants
 */
export const Sizes: Story = {
  render: () => {
    const [openSize, setOpenSize] = useState<'small' | 'medium' | 'large' | null>(null);
    return (
      <>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <M3Button onClick={() => setOpenSize('small')}>Small Modal</M3Button>
          <M3Button onClick={() => setOpenSize('medium')}>Medium Modal</M3Button>
          <M3Button onClick={() => setOpenSize('large')}>Large Modal</M3Button>
        </div>
        {openSize && (
          <M3Modal
            open={true}
            onClose={() => setOpenSize(null)}
            size={openSize}
            header={<M3Modal.Header>{openSize.charAt(0).toUpperCase() + openSize.slice(1)} Modal</M3Modal.Header>}
          >
            <div>
              <p>This is a {openSize} sized modal.</p>
            </div>
          </M3Modal>
        )}
      </>
    );
  },
};

/**
 * Modal that doesn't close on backdrop click
 */
export const NoBackdropClose: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <M3Button onClick={() => setOpen(true)}>Open Modal (No Backdrop Close)</M3Button>
        <M3Modal
          open={open}
          onClose={() => setOpen(false)}
          closeOnBackdropClick={false}
          header={<M3Modal.Header>Required Action</M3Modal.Header>}
          footer={
            <M3Modal.Footer>
              <M3Button variant="filled" onClick={() => setOpen(false)}>
                Confirm
              </M3Button>
            </M3Modal.Footer>
          }
        >
          <div>
            <p>This modal cannot be closed by clicking the backdrop. You must use the close button or confirm action.</p>
          </div>
        </M3Modal>
      </>
    );
  },
};
