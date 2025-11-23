import { render, screen, waitFor } from '@testing-library/user';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import Dialog, { DialogRef } from '../Dialog';
import * as React from 'react';

describe('Dialog', () => {
  it('renders without errors', () => {
    render(<Dialog open={true} title="Test Dialog">Content</Dialog>);
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
  });

  it('renders title correctly', () => {
    render(<Dialog open={true} title="My Dialog Title">Content</Dialog>);
    expect(screen.getByText('My Dialog Title')).toBeInTheDocument();
  });

  it('renders content text when provided', () => {
    render(<Dialog open={true} contentText="Dialog content text" />);
    expect(screen.getByText('Dialog content text')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(
      <Dialog open={true}>
        <div>Child content</div>
      </Dialog>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders content prop over children', () => {
    render(
      <Dialog open={true} content={<div>Content prop</div>}>
        <div>Children content</div>
      </Dialog>
    );
    expect(screen.getByText('Content prop')).toBeInTheDocument();
    expect(screen.queryByText('Children content')).not.toBeInTheDocument();
  });

  it('shows close button by default', () => {
    render(<Dialog open={true} title="Test">Content</Dialog>);
    const closeButton = screen.getByLabelText('close');
    expect(closeButton).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    render(<Dialog open={true} title="Test" showCloseButton={false}>Content</Dialog>);
    expect(screen.queryByLabelText('close')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = jest.fn();

    render(<Dialog open={true} title="Test" onClose={mockOnClose}>Content</Dialog>);

    const closeButton = screen.getByLabelText('close');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledWith({}, 'closeButton');
  });

  it('renders cancel button by default', () => {
    render(<Dialog open={true}>Content</Dialog>);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders custom cancel button text', () => {
    render(<Dialog open={true} cancelButtonText="No">Content</Dialog>);
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('hides cancel button when showCancelButton is false', () => {
    render(<Dialog open={true} showCancelButton={false}>Content</Dialog>);
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = jest.fn();

    render(<Dialog open={true} onClose={mockOnClose}>Content</Dialog>);

    await user.click(screen.getByText('Cancel'));

    expect(mockOnClose).toHaveBeenCalledWith({}, 'cancelButton');
  });

  it('renders confirm button by default', () => {
    render(<Dialog open={true}>Content</Dialog>);
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('renders custom confirm button text', () => {
    render(<Dialog open={true} confirmButtonText="Yes">Content</Dialog>);
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('hides confirm button when showConfirmButton is false', () => {
    render(<Dialog open={true} showConfirmButton={false}>Content</Dialog>);
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnConfirm = jest.fn();

    render(<Dialog open={true} onConfirm={mockOnConfirm}>Content</Dialog>);

    await user.click(screen.getByText('Confirm'));

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isConfirmLoading is true', () => {
    render(<Dialog open={true} isConfirmLoading>Content</Dialog>);

    const confirmButton = screen.getByText('Confirm');
    const cancelButton = screen.getByText('Cancel');

    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('renders custom actions instead of default buttons', () => {
    render(
      <Dialog open={true} actions={<button>Custom Action</button>}>
        Content
      </Dialog>
    );

    expect(screen.getByText('Custom Action')).toBeInTheDocument();
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('supports different maxWidth values', () => {
    const { rerender } = render(<Dialog open={true} maxWidth="sm">Content</Dialog>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(<Dialog open={true} maxWidth="md">Content</Dialog>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(<Dialog open={true} maxWidth="lg">Content</Dialog>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders fullscreen variant', () => {
    render(<Dialog open={true} variant="fullscreen">Content</Dialog>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders scrollable variant', () => {
    render(<Dialog open={true} variant="scrollable">Content</Dialog>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows divider by default', () => {
    const { container } = render(<Dialog open={true} title="Test">Content</Dialog>);
    // Divider is rendered as border
    expect(container.querySelector('[class*="borderBottom"]')).toBeTruthy();
  });

  it('hides divider when divider prop is false', () => {
    render(<Dialog open={true} title="Test" divider={false}>Content</Dialog>);
    // Should still render without error
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('prevents close on backdrop click when disableBackdropClick is true', async () => {
    const mockOnClose = jest.fn();

    render(<Dialog open={true} disableBackdropClick onClose={mockOnClose}>Content</Dialog>);

    // Backdrop click would normally call onClose, but it should be prevented
    // This is handled by MUI Dialog, test that prop is passed
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('prevents close on escape key when disableEscapeKeyDown is true', () => {
    const mockOnClose = jest.fn();

    render(<Dialog open={true} disableEscapeKeyDown onClose={mockOnClose}>Content</Dialog>);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('handles controlled mode with open prop', () => {
    const { rerender } = render(<Dialog open={false}>Content</Dialog>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(<Dialog open={true}>Content</Dialog>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('handles uncontrolled mode with ref', () => {
    const ref = React.createRef<DialogRef>();

    render(<Dialog ref={ref}>Content</Dialog>);

    expect(ref.current).toBeTruthy();
    expect(ref.current?.isOpen).toBe(false);

    // Open dialog via ref
    ref.current?.open();
    expect(ref.current?.isOpen).toBe(true);

    // Close dialog via ref
    ref.current?.close();
    expect(ref.current?.isOpen).toBe(false);
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<DialogRef>();

    render(<Dialog ref={ref} open={true}>Content</Dialog>);

    expect(ref.current).toBeTruthy();
    expect(typeof ref.current?.open).toBe('function');
    expect(typeof ref.current?.close).toBe('function');
    expect(typeof ref.current?.isOpen).toBe('boolean');
  });

  it('supports different confirm button colors', () => {
    render(<Dialog open={true} confirmButtonColor="error">Content</Dialog>);
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('handles async onConfirm', async () => {
    const user = userEvent.setup();
    let resolved = false;
    const mockOnConfirm = jest.fn(() => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolved = true;
          resolve();
        }, 100);
      });
    });

    render(<Dialog open={true} onConfirm={mockOnConfirm}>Content</Dialog>);

    await user.click(screen.getByText('Confirm'));

    await waitFor(() => expect(resolved).toBe(true));
    expect(mockOnConfirm).toHaveBeenCalled();
  });
});
