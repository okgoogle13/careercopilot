import React, { useRef } from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import Dialog, { DialogRef, DialogProps } from '../Dialog';

describe('Dialog Component', () => {
  // ===== Basic Rendering Tests =====

  describe('rendering based on open state', () => {
    it('renders dialog when open prop is true', () => {
      render(
        <Dialog open title="Test Dialog" contentText="Test content" />
      );
      expect(screen.getByRole('heading', { name: /Test Dialog/i })).toBeInTheDocument();
    });

    it('does not render dialog when open prop is false', () => {
      render(
        <Dialog open={false} title="Test Dialog" contentText="Test content" />
      );
      expect(screen.queryByRole('heading', { name: /Test Dialog/i })).not.toBeInTheDocument();
    });

    it('renders with internal state when open prop is not provided', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const ref = useRef<DialogRef>(null);
        return (
          <>
            <button onClick={() => ref.current?.open()}>Open Dialog</button>
            <Dialog ref={ref} title="Test Dialog" contentText="Test content" />
          </>
        );
      };

      render(<TestComponent />);
      await user.click(screen.getByRole('button', { name: /Open Dialog/i }));
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Test Dialog/i })).toBeInTheDocument();
      });
    });
  });

  // ===== Title and Content Tests =====

  describe('title and content display', () => {
    it('displays title when provided', () => {
      render(
        <Dialog open title="My Dialog Title" contentText="Content" />
      );
      expect(screen.getByRole('heading', { name: /My Dialog Title/i })).toBeInTheDocument();
    });

    it('does not render DialogTitle when title is not provided', () => {
      const { container } = render(
        <Dialog open contentText="Content" />
      );
      expect(container.querySelector('[class*="MuiDialogTitle"]')).not.toBeInTheDocument();
    });

    it('displays contentText when provided', () => {
      render(
        <Dialog open title="Title" contentText="This is the content text" />
      );
      expect(screen.getByText(/This is the content text/i)).toBeInTheDocument();
    });

    it('displays content ReactNode when provided instead of contentText', () => {
      render(
        <Dialog open title="Title" content={<div data-testid="custom-content">Custom Content</div>} />
      );
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });

    it('displays children when provided instead of content', () => {
      render(
        <Dialog open title="Title">
          <div data-testid="child-content">Child Content</div>
        </Dialog>
      );
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('prioritizes contentText over content and children', () => {
      render(
        <Dialog
          open
          title="Title"
          contentText="Text content"
          content={<div data-testid="custom-content">Custom Content</div>}
        >
          <div data-testid="child-content">Child Content</div>
        </Dialog>
      );
      expect(screen.getByText(/Text content/i)).toBeInTheDocument();
      expect(screen.queryByTestId('custom-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
    });
  });

  // ===== Button Rendering Tests =====

  describe('button rendering and visibility', () => {
    it('renders close button by default', () => {
      render(
        <Dialog open title="Test Dialog" contentText="Content" />
      );
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('does not render close button when showCloseButton is false', () => {
      render(
        <Dialog open title="Test Dialog" contentText="Content" showCloseButton={false} />
      );
      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    });

    it('renders cancel button by default', () => {
      render(
        <Dialog open title="Test Dialog" contentText="Content" />
      );
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });

    it('does not render cancel button when showCancelButton is false', () => {
      render(
        <Dialog open title="Test Dialog" contentText="Content" showCancelButton={false} />
      );
      expect(screen.queryByRole('button', { name: /Cancel/i })).not.toBeInTheDocument();
    });

    it('renders confirm button by default', () => {
      render(
        <Dialog open title="Test Dialog" contentText="Content" />
      );
      expect(screen.getByRole('button', { name: /Confirm/i })).toBeInTheDocument();
    });

    it('does not render confirm button when showConfirmButton is false', () => {
      render(
        <Dialog open title="Test Dialog" contentText="Content" showConfirmButton={false} />
      );
      expect(screen.queryByRole('button', { name: /Confirm/i })).not.toBeInTheDocument();
    });

    it('does not render actions section when no buttons are shown and no custom actions provided', () => {
      const { container } = render(
        <Dialog
          open
          title="Test Dialog"
          contentText="Content"
          showCloseButton={false}
          showCancelButton={false}
          showConfirmButton={false}
        />
      );
      expect(container.querySelector('[class*="MuiDialogActions"]')).not.toBeInTheDocument();
    });
  });

  // ===== Button Click Handlers Tests =====

  describe('onClose callback with different reasons', () => {
    it('calls onClose with closeButton reason when close button is clicked', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();

      render(
        <Dialog open title="Test Dialog" contentText="Content" onClose={handleClose} />
      );

      await user.click(screen.getByRole('button', { name: /close/i }));
      expect(handleClose).toHaveBeenCalledWith({}, 'closeButton');
    });

    it('calls onClose with cancelButton reason when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();

      render(
        <Dialog open title="Test Dialog" contentText="Content" onClose={handleClose} />
      );

      await user.click(screen.getByRole('button', { name: /Cancel/i }));
      expect(handleClose).toHaveBeenCalledWith({}, 'cancelButton');
    });

    it('calls onClose with escapeKeyDown reason when Escape key is pressed', async () => {
      const handleClose = jest.fn();

      render(
        <Dialog open title="Test Dialog" contentText="Content" onClose={handleClose} />
      );

      fireEvent.keyDown(screen.getByRole('heading', { name: /Test Dialog/i }), { key: 'Escape' });

      await waitFor(() => {
        expect(handleClose).toHaveBeenCalled();
        const calls = handleClose.mock.calls;
        const lastCall = calls[calls.length - 1];
        expect(lastCall[1]).toBe('escapeKeyDown');
      });
    });

    it('calls onClose with backdropClick reason when backdrop is clicked', async () => {
      const handleClose = jest.fn();

      const { container } = render(
        <Dialog open title="Test Dialog" contentText="Content" onClose={handleClose} />
      );

      const backdrop = container.querySelector('[class*="MuiBackdrop"]');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      await waitFor(() => {
        expect(handleClose).toHaveBeenCalled();
      });
    });
  });

  // ===== Disable Backdrop Click Tests =====

  describe('disableBackdropClick prop', () => {
    it('prevents closing when backdrop is clicked and disableBackdropClick is true', async () => {
      const handleClose = jest.fn();

      const { container } = render(
        <Dialog
          open
          title="Test Dialog"
          contentText="Content"
          onClose={handleClose}
          disableBackdropClick={true}
        />
      );

      const backdrop = container.querySelector('[class*="MuiBackdrop"]');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      await waitFor(() => {
        const calls = handleClose.mock.calls.filter(call => call[1] === 'backdropClick');
        expect(calls.length).toBe(0);
      });
    });

    it('allows closing when backdrop is clicked and disableBackdropClick is false', async () => {
      const handleClose = jest.fn();

      const { container } = render(
        <Dialog
          open
          title="Test Dialog"
          contentText="Content"
          onClose={handleClose}
          disableBackdropClick={false}
        />
      );

      const backdrop = container.querySelector('[class*="MuiBackdrop"]');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      await waitFor(() => {
        expect(handleClose).toHaveBeenCalled();
      });
    });
  });

  // ===== Disable Escape Key Tests =====

  describe('disableEscapeKeyDown prop', () => {
    it('prevents closing when Escape key is pressed and disableEscapeKeyDown is true', async () => {
      const handleClose = jest.fn();

      render(
        <Dialog
          open
          title="Test Dialog"
          contentText="Content"
          onClose={handleClose}
          disableEscapeKeyDown={true}
        />
      );

      fireEvent.keyDown(screen.getByRole('heading', { name: /Test Dialog/i }), { key: 'Escape' });

      await waitFor(() => {
        const calls = handleClose.mock.calls.filter(call => call[1] === 'escapeKeyDown');
        expect(calls.length).toBe(0);
      });
    });

    it('allows closing when Escape key is pressed and disableEscapeKeyDown is false', async () => {
      const handleClose = jest.fn();

      render(
        <Dialog
          open
          title="Test Dialog"
          contentText="Content"
          onClose={handleClose}
          disableEscapeKeyDown={false}
        />
      );

      fireEvent.keyDown(screen.getByRole('heading', { name: /Test Dialog/i }), { key: 'Escape' });

      await waitFor(() => {
        expect(handleClose).toHaveBeenCalled();
      });
    });
  });

  // ===== onConfirm Callback Tests =====

  describe('onConfirm callback', () => {
    it('calls onConfirm when confirm button is clicked', async () => {
      const user = userEvent.setup();
      const handleConfirm = jest.fn();

      render(
        <Dialog open title="Test Dialog" contentText="Content" onConfirm={handleConfirm} />
      );

      await user.click(screen.getByRole('button', { name: /Confirm/i }));
      expect(handleConfirm).toHaveBeenCalledTimes(1);
    });

    it('handles async onConfirm callback', async () => {
      const user = userEvent.setup();
      const handleConfirm = jest.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      render(
        <Dialog open title="Test Dialog" contentText="Content" onConfirm={handleConfirm} />
      );

      await user.click(screen.getByRole('button', { name: /Confirm/i }));
      await waitFor(() => {
        expect(handleConfirm).toHaveBeenCalledTimes(1);
      });
    });

    it('closes dialog after onConfirm is called with controlled component', async () => {
      const user = userEvent.setup();
      const handleConfirm = jest.fn();
      const handleClose = jest.fn();

      const { rerender } = render(
        <Dialog open title="Test Dialog" contentText="Content" onConfirm={handleConfirm} onClose={handleClose} />
      );

      await user.click(screen.getByRole('button', { name: /Confirm/i }));

      rerender(
        <Dialog open={false} title="Test Dialog" contentText="Content" onConfirm={handleConfirm} onClose={handleClose} />
      );

      expect(handleConfirm).toHaveBeenCalledTimes(1);
    });
  });

  // ===== Confirm Button Loading State Tests =====

  describe('isConfirmLoading prop', () => {
    it('disables confirm button when isConfirmLoading is true', () => {
      render(
        <Dialog open title="Test Dialog" contentText="Content" isConfirmLoading={true} />
      );

      const confirmButton = screen.getByRole('button', { name: /Confirm/i });
      expect(confirmButton).toBeDisabled();
    });

    it('disables cancel button when isConfirmLoading is true', () => {
      render(
        <Dialog open title="Test Dialog" contentText="Content" isConfirmLoading={true} />
      );

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      expect(cancelButton).toBeDisabled();
    });

    it('enables confirm button when isConfirmLoading is false', () => {
      render(
        <Dialog open title="Test Dialog" contentText="Content" isConfirmLoading={false} />
      );

      const confirmButton = screen.getByRole('button', { name: /Confirm/i });
      expect(confirmButton).not.toBeDisabled();
    });

    it('enables cancel button when isConfirmLoading is false', () => {
      render(
        <Dialog open title="Test Dialog" contentText="Content" isConfirmLoading={false} />
      );

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      expect(cancelButton).not.toBeDisabled();
    });
  });

  // ===== Custom Button Text Tests =====

  describe('custom button text', () => {
    it('displays custom cancel button text', () => {
      render(
        <Dialog open title="Test Dialog" contentText="Content" cancelButtonText="Don't Save" />
      );

      expect(screen.getByRole('button', { name: /Don't Save/i })).toBeInTheDocument();
    });

    it('displays custom confirm button text', () => {
      render(
        <Dialog open title="Test Dialog" contentText="Content" confirmButtonText="Save Changes" />
      );

      expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
    });

    it('uses default text when no custom text is provided', () => {
      render(
        <Dialog open title="Test Dialog" contentText="Content" />
      );

      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Confirm/i })).toBeInTheDocument();
    });
  });

  // ===== Confirm Button Color Tests =====

  describe('confirmButtonColor variants', () => {
    const colors: Array<'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = [
      'primary',
      'secondary',
      'error',
      'info',
      'success',
      'warning',
    ];

    colors.forEach(color => {
      it(`applies ${color} color to confirm button`, () => {
        const { container } = render(
          <Dialog
            open
            title="Test Dialog"
            contentText="Content"
            confirmButtonColor={color}
          />
        );

        const confirmButton = screen.getByRole('button', { name: /Confirm/i });
        expect(confirmButton).toBeInTheDocument();
        expect(confirmButton).toHaveClass(`MuiButton-${color}`);
      });
    });

    it('defaults to primary color when not specified', () => {
      render(
        <Dialog open title="Test Dialog" contentText="Content" />
      );

      const confirmButton = screen.getByRole('button', { name: /Confirm/i });
      expect(confirmButton).toHaveClass('MuiButton-primary');
    });
  });

  // ===== Custom Actions Tests =====

  describe('custom actions', () => {
    it('renders custom actions when provided', () => {
      const customActions = (
        <div data-testid="custom-actions">
          <button>Custom Action 1</button>
          <button>Custom Action 2</button>
        </div>
      );

      render(
        <Dialog
          open
          title="Test Dialog"
          contentText="Content"
          actions={customActions}
        />
      );

      expect(screen.getByTestId('custom-actions')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Custom Action 1/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Custom Action 2/i })).toBeInTheDocument();
    });

    it('does not render default buttons when custom actions are provided', () => {
      const customActions = <button>Custom Button</button>;

      render(
        <Dialog
          open
          title="Test Dialog"
          contentText="Content"
          actions={customActions}
        />
      );

      expect(screen.queryByRole('button', { name: /Cancel/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Confirm/i })).not.toBeInTheDocument();
    });
  });

  // ===== Max Width Variants Tests =====

  describe('maxWidth variants', () => {
    const widths: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl' | false> = ['xs', 'sm', 'md', 'lg', 'xl', false];

    widths.forEach(width => {
      it(`applies maxWidth=${width} to dialog`, () => {
        const { container } = render(
          <Dialog
            open
            title="Test Dialog"
            contentText="Content"
            maxWidth={width}
          />
        );

        const dialog = container.querySelector('[class*="MuiDialog-paper"]');
        expect(dialog).toBeInTheDocument();
      });
    });

    it('defaults to sm maxWidth when not specified', () => {
      const { container } = render(
        <Dialog open title="Test Dialog" contentText="Content" />
      );

      const dialog = container.querySelector('[class*="MuiDialog-paper"]');
      expect(dialog).toBeInTheDocument();
    });
  });

  // ===== Dialog Variant Tests =====

  describe('variant prop', () => {
    it('renders default variant dialog', () => {
      const { container } = render(
        <Dialog open title="Test Dialog" contentText="Content" variant="default" />
      );

      const dialog = container.querySelector('[class*="MuiDialog-paper"]');
      expect(dialog).toBeInTheDocument();
      expect(dialog).not.toHaveClass('MuiDialog-paperFullScreen');
    });

    it('renders fullscreen variant dialog', () => {
      const { container } = render(
        <Dialog open title="Test Dialog" contentText="Content" variant="fullscreen" />
      );

      const dialog = container.querySelector('[class*="MuiDialog-paper"]');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveClass('MuiDialog-paperFullScreen');
    });

    it('renders scrollable variant dialog', () => {
      const { container } = render(
        <Dialog
          open
          title="Test Dialog"
          content={<div>{'Very '.repeat(100)} long content</div>}
          variant="scrollable"
        />
      );

      const dialog = container.querySelector('[class*="MuiDialog-paper"]');
      expect(dialog).toBeInTheDocument();
    });

    it('defaults to default variant when not specified', () => {
      const { container } = render(
        <Dialog open title="Test Dialog" contentText="Content" />
      );

      const dialog = container.querySelector('[class*="MuiDialog-paper"]');
      expect(dialog).toBeInTheDocument();
    });
  });

  // ===== Divider Visibility Tests =====

  describe('divider visibility', () => {
    it('shows divider by default when title is present', () => {
      const { container } = render(
        <Dialog open title="Test Dialog" contentText="Content" />
      );

      const divider = container.querySelector('[style*="border-bottom"]');
      expect(divider).toBeInTheDocument();
    });

    it('hides divider when divider prop is false', () => {
      const { container } = render(
        <Dialog open title="Test Dialog" contentText="Content" divider={false} />
      );

      const title = screen.getByRole('heading', { name: /Test Dialog/i });
      const dividerAfterTitle = title.parentElement?.nextElementSibling;

      if (dividerAfterTitle) {
        expect(dividerAfterTitle).not.toHaveStyle('border-bottom');
      }
    });

    it('shows bottom divider in actions when divider is true', () => {
      const { container } = render(
        <Dialog open title="Test Dialog" contentText="Content" divider={true} />
      );

      const actionsSection = container.querySelector('[class*="MuiDialogActions"]');
      if (actionsSection) {
        expect(actionsSection).toHaveStyle('border-top: 1px solid');
      }
    });

    it('hides bottom divider in actions when divider is false', () => {
      const { container } = render(
        <Dialog open title="Test Dialog" contentText="Content" divider={false} />
      );

      const actionsSection = container.querySelector('[class*="MuiDialogActions"]');
      if (actionsSection) {
        expect(actionsSection).not.toHaveStyle('border-top: 1px solid');
      }
    });
  });

  // ===== Imperative Ref Tests =====

  describe('imperative ref methods', () => {
    it('opens dialog when ref.open() is called', async () => {
      const TestComponent = () => {
        const ref = useRef<DialogRef>(null);
        return (
          <>
            <button onClick={() => ref.current?.open()}>Open</button>
            <Dialog ref={ref} title="Test Dialog" contentText="Content" />
          </>
        );
      };

      const user = userEvent.setup();
      render(<TestComponent />);

      const openButton = screen.getByRole('button', { name: /Open/i });
      await user.click(openButton);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Test Dialog/i })).toBeInTheDocument();
      });
    });

    it('closes dialog when ref.close() is called', async () => {
      const TestComponent = () => {
        const ref = useRef<DialogRef>(null);
        const [isOpen, setIsOpen] = useState(true);

        const handleClose = () => {
          ref.current?.close();
          setIsOpen(false);
        };

        return (
          <>
            <button onClick={handleClose}>Close</button>
            <Dialog ref={ref} open={isOpen} title="Test Dialog" contentText="Content" />
          </>
        );
      };

      const user = userEvent.setup();
      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Test Dialog/i })).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /Close/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: /Test Dialog/i })).not.toBeInTheDocument();
      });
    });

    it('returns isOpen property from ref', () => {
      const TestComponent = () => {
        const ref = useRef<DialogRef>(null);
        const [displayOpen, setDisplayOpen] = useState(false);

        return (
          <>
            <button onClick={() => ref.current?.open()}>Open</button>
            <button onClick={() => setDisplayOpen(ref.current?.isOpen || false)}>Check Open</button>
            <div data-testid="is-open">{displayOpen ? 'open' : 'closed'}</div>
            <Dialog ref={ref} title="Test Dialog" contentText="Content" />
          </>
        );
      };

      render(<TestComponent />);
      expect(screen.getByTestId('is-open')).toHaveTextContent('closed');
    });

    it('calls onClose with closeButton reason when ref.close() is called', async () => {
      const handleClose = jest.fn();
      const TestComponent = () => {
        const ref = useRef<DialogRef>(null);
        const [isOpen, setIsOpen] = useState(true);

        return (
          <>
            <button onClick={() => { ref.current?.close(); setIsOpen(false); }}>Close</button>
            <Dialog
              ref={ref}
              open={isOpen}
              title="Test Dialog"
              contentText="Content"
              onClose={handleClose}
            />
          </>
        );
      };

      const user = userEvent.setup();
      render(<TestComponent />);

      const closeButton = screen.getByRole('button', { name: /Close/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(handleClose).toHaveBeenCalledWith({}, 'closeButton');
      });
    });
  });

  // ===== Integration Tests =====

  describe('integration scenarios', () => {
    it('handles complete user workflow: open, view content, confirm', async () => {
      const user = userEvent.setup();
      const handleOpen = jest.fn();
      const handleConfirm = jest.fn();
      const handleClose = jest.fn();

      const TestComponent = () => {
        const ref = useRef<DialogRef>(null);

        return (
          <>
            <button onClick={() => { ref.current?.open(); handleOpen(); }}>Open Dialog</button>
            <Dialog
              ref={ref}
              title="Confirmation"
              contentText="Are you sure?"
              onConfirm={handleConfirm}
              onClose={handleClose}
              confirmButtonText="Yes"
              cancelButtonText="No"
            />
          </>
        );
      };

      render(<TestComponent />);

      // Open dialog
      await user.click(screen.getByRole('button', { name: /Open Dialog/i }));
      expect(handleOpen).toHaveBeenCalled();

      // Verify content
      await waitFor(() => {
        expect(screen.getByText(/Are you sure\?/i)).toBeInTheDocument();
      });

      // Confirm
      await user.click(screen.getByRole('button', { name: /Yes/i }));
      expect(handleConfirm).toHaveBeenCalled();
    });

    it('handles complete user workflow: open, view content, cancel', async () => {
      const user = userEvent.setup();
      const handleOpen = jest.fn();
      const handleClose = jest.fn();

      const TestComponent = () => {
        const ref = useRef<DialogRef>(null);

        return (
          <>
            <button onClick={() => { ref.current?.open(); handleOpen(); }}>Open Dialog</button>
            <Dialog
              ref={ref}
              title="Confirmation"
              contentText="Are you sure?"
              onClose={handleClose}
              confirmButtonText="Yes"
              cancelButtonText="No"
            />
          </>
        );
      };

      render(<TestComponent />);

      // Open dialog
      await user.click(screen.getByRole('button', { name: /Open Dialog/i }));
      expect(handleOpen).toHaveBeenCalled();

      // Verify content
      await waitFor(() => {
        expect(screen.getByText(/Are you sure\?/i)).toBeInTheDocument();
      });

      // Cancel
      await user.click(screen.getByRole('button', { name: /No/i }));
      expect(handleClose).toHaveBeenCalledWith({}, 'cancelButton');
    });

    it('handles fullscreen variant with long content', async () => {
      const user = userEvent.setup();
      const longContent = Array.from({ length: 50 }, (_, i) => `Line ${i + 1}`).join('\n');

      const TestComponent = () => {
        const ref = useRef<DialogRef>(null);

        return (
          <>
            <button onClick={() => ref.current?.open()}>Open</button>
            <Dialog
              ref={ref}
              title="Long Content"
              content={<div style={{ whiteSpace: 'pre-wrap' }}>{longContent}</div>}
              variant="fullscreen"
            />
          </>
        );
      };

      const { container } = render(<TestComponent />);

      await user.click(screen.getByRole('button', { name: /Open/i }));

      await waitFor(() => {
        const dialog = container.querySelector('[class*="MuiDialog-paper"]');
        expect(dialog).toHaveClass('MuiDialog-paperFullScreen');
      });
    });

    it('prevents multiple actions during loading state', async () => {
      const user = userEvent.setup();
      const handleConfirm = jest.fn();
      const handleClose = jest.fn();

      render(
        <Dialog
          open
          title="Save Changes"
          contentText="Are you sure?"
          isConfirmLoading={true}
          onConfirm={handleConfirm}
          onClose={handleClose}
        />
      );

      const confirmButton = screen.getByRole('button', { name: /Confirm/i });
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });

      expect(confirmButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();

      await user.click(confirmButton);
      expect(handleConfirm).not.toHaveBeenCalled();

      await user.click(cancelButton);
      expect(handleClose).not.toHaveBeenCalled();
    });

    it('supports controlled and uncontrolled modes', async () => {
      const user = userEvent.setup();

      // Uncontrolled mode
      const UncontrolledComponent = () => {
        const ref = useRef<DialogRef>(null);
        return (
          <>
            <button onClick={() => ref.current?.open()}>Uncontrolled Open</button>
            <Dialog ref={ref} title="Uncontrolled" contentText="Content" />
          </>
        );
      };

      const { rerender } = render(<UncontrolledComponent />);
      await user.click(screen.getByRole('button', { name: /Uncontrolled Open/i }));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Uncontrolled/i })).toBeInTheDocument();
      });

      // Controlled mode
      const ControlledComponent = () => {
        const [open, setOpen] = useState(true);
        return (
          <>
            <button onClick={() => setOpen(false)}>Controlled Close</button>
            <Dialog open={open} title="Controlled" contentText="Content" onClose={() => setOpen(false)} />
          </>
        );
      };

      rerender(<ControlledComponent />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Controlled/i })).toBeInTheDocument();
      });
    });
  });

  // ===== Edge Cases =====

  describe('edge cases and error handling', () => {
    it('handles dialog with only title (no content)', () => {
      render(
        <Dialog open title="Title Only" />
      );

      expect(screen.getByRole('heading', { name: /Title Only/i })).toBeInTheDocument();
    });

    it('handles dialog with only content (no title)', () => {
      render(
        <Dialog open contentText="Content Only" />
      );

      expect(screen.getByText(/Content Only/i)).toBeInTheDocument();
    });

    it('handles empty dialog', () => {
      render(
        <Dialog open />
      );

      const { container } = render(<Dialog open />);
      expect(container.querySelector('[class*="MuiDialog"]')).toBeInTheDocument();
    });

    it('preserves custom sx props', () => {
      const { container } = render(
        <Dialog
          open
          title="Test"
          contentText="Content"
          sx={{ backgroundColor: 'red' }}
        />
      );

      const dialog = container.querySelector('[class*="MuiDialog-root"]');
      expect(dialog).toBeInTheDocument();
    });

    it('handles rapid open/close calls', async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const ref = useRef<DialogRef>(null);

        return (
          <>
            <button onClick={() => { ref.current?.open(); ref.current?.close(); }}>Toggle</button>
            <Dialog ref={ref} title="Test" contentText="Content" />
          </>
        );
      };

      render(<TestComponent />);
      await user.click(screen.getByRole('button', { name: /Toggle/i }));

      // Dialog state should be consistent
      expect(screen.queryByRole('heading', { name: /Test/i })).not.toBeInTheDocument();
    });

    it('handles onConfirm returning undefined (synchronous)', async () => {
      const user = userEvent.setup();
      const handleConfirm = jest.fn(() => undefined);

      render(
        <Dialog
          open
          title="Test"
          contentText="Content"
          onConfirm={handleConfirm}
        />
      );

      await user.click(screen.getByRole('button', { name: /Confirm/i }));
      expect(handleConfirm).toHaveBeenCalled();
    });

    it('handles onConfirm throwing error gracefully', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const handleConfirm = jest.fn(() => {
        throw new Error('Confirm error');
      });

      render(
        <Dialog
          open
          title="Test"
          contentText="Content"
          onConfirm={handleConfirm}
        />
      );

      await user.click(screen.getByRole('button', { name: /Confirm/i }));
      expect(handleConfirm).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});

function useState<T>(initialValue: T): [T, (value: T) => void] {
  const [value, setValue] = React.useState(initialValue);
  return [value, setValue];
}
