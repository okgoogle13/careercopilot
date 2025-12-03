import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { M3Dialog } from './M3Dialog';

describe('M3Dialog Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('does not render when open is false', () => {
      const { container } = render(
        <M3Dialog open={false} onClose={() => {}} title="Test" />
      );
      expect(container.querySelector('.m3-dialog')).not.toBeInTheDocument();
    });

    test('renders when open is true', () => {
      render(
        <M3Dialog open={true} onClose={() => {}} title="Test Dialog" content="Test content" />
      );
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(
        <M3Dialog open={true} onClose={() => {}} title="Test" />
      );
      const element = container.querySelector('.m3-dialog');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Dialog open={true} onClose={() => {}} title="Test" className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    test('renders title when provided', () => {
      render(
        <M3Dialog open={true} onClose={() => {}} title="Dialog Title" />
      );
      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    });

    test('renders content when provided', () => {
      render(
        <M3Dialog open={true} onClose={() => {}} content="Dialog content" />
      );
      expect(screen.getByText('Dialog content')).toBeInTheDocument();
    });
  });

  // Button Tests
  describe('Button Functionality', () => {
    test('renders confirm and cancel buttons with default labels', () => {
      render(
        <M3Dialog open={true} onClose={() => {}} title="Test" />
      );
      expect(screen.getByText('Confirm')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('renders custom button labels', () => {
      render(
        <M3Dialog
          open={true}
          onClose={() => {}}
          title="Test"
          confirmLabel="Save"
          cancelLabel="Discard"
        />
      );
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Discard')).toBeInTheDocument();
    });

    test('calls onConfirm when confirm button is clicked', () => {
      const handleConfirm = jest.fn();
      render(
        <M3Dialog open={true} onClose={() => {}} title="Test" onConfirm={handleConfirm} />
      );
      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);
      expect(handleConfirm).toHaveBeenCalledTimes(1);
    });

    test('calls onCancel when cancel button is clicked', () => {
      const handleCancel = jest.fn();
      render(
        <M3Dialog open={true} onClose={() => {}} title="Test" onCancel={handleCancel} />
      );
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      expect(handleCancel).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when confirm button is clicked', () => {
      const handleClose = jest.fn();
      render(
        <M3Dialog open={true} onClose={handleClose} title="Test" />
      );
      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when cancel button is clicked', () => {
      const handleClose = jest.fn();
      render(
        <M3Dialog open={true} onClose={handleClose} title="Test" />
      );
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  // Destructive Action Tests
  describe('Destructive Action Styling', () => {
    test('applies destructive class when destructive is true', () => {
      const { container } = render(
        <M3Dialog open={true} onClose={() => {}} title="Test" destructive />
      );
      const element = container.querySelector('.m3-dialog--destructive');
      expect(element).toBeInTheDocument();
    });

    test('does not apply destructive class when destructive is false', () => {
      const { container } = render(
        <M3Dialog open={true} onClose={() => {}} title="Test" destructive={false} />
      );
      const element = container.querySelector('.m3-dialog--destructive');
      expect(element).not.toBeInTheDocument();
    });
  });

  // Keyboard Support Tests
  describe('Keyboard Support', () => {
    test('calls onClose when Escape key is pressed', async () => {
      const handleClose = jest.fn();
      render(
        <M3Dialog open={true} onClose={handleClose} title="Test" closeOnEscape={true} />
      );
      await userEvent.keyboard('{Escape}');
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    test('does not call onClose when Escape is pressed and closeOnEscape is false', async () => {
      const handleClose = jest.fn();
      render(
        <M3Dialog open={true} onClose={handleClose} title="Test" closeOnEscape={false} />
      );
      await userEvent.keyboard('{Escape}');
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  // Backdrop Click Tests
  describe('Backdrop Click', () => {
    test('calls onClose when backdrop is clicked', () => {
      const handleClose = jest.fn();
      const { container } = render(
        <M3Dialog open={true} onClose={handleClose} title="Test" closeOnBackdropClick={true} />
      );
      const backdrop = container.querySelector('.m3-dialog__backdrop');
      fireEvent.click(backdrop!);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    test('does not call onClose when backdrop is clicked and closeOnBackdropClick is false', () => {
      const handleClose = jest.fn();
      const { container } = render(
        <M3Dialog open={true} onClose={handleClose} title="Test" closeOnBackdropClick={false} />
      );
      const backdrop = container.querySelector('.m3-dialog__backdrop');
      fireEvent.click(backdrop!);
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has role="dialog"', () => {
      const { container } = render(
        <M3Dialog open={true} onClose={() => {}} title="Test" />
      );
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toBeInTheDocument();
    });

    test('has aria-modal="true"', () => {
      const { container } = render(
        <M3Dialog open={true} onClose={() => {}} title="Test" />
      );
      const dialog = container.querySelector('[aria-modal="true"]');
      expect(dialog).toBeInTheDocument();
    });

    test('supports aria-labelledby', () => {
      const { container } = render(
        <M3Dialog open={true} onClose={() => {}} title="Test" aria-labelledby="dialog-title" />
      );
      const dialog = container.querySelector('[aria-labelledby="dialog-title"]');
      expect(dialog).toBeInTheDocument();
    });

    test('supports aria-describedby', () => {
      const { container } = render(
        <M3Dialog open={true} onClose={() => {}} title="Test" aria-describedby="dialog-description" />
      );
      const dialog = container.querySelector('[aria-describedby="dialog-description"]');
      expect(dialog).toBeInTheDocument();
    });
  });
});
