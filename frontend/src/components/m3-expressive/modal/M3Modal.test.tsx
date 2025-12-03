import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { M3Modal } from './M3Modal';

describe('M3Modal Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('does not render when open is false', () => {
      const { container } = render(
        <M3Modal open={false} onClose={() => {}}>
          Content
        </M3Modal>
      );
      expect(container.querySelector('.m3-modal')).not.toBeInTheDocument();
    });

    test('renders when open is true', () => {
      render(
        <M3Modal open={true} onClose={() => {}}>
          Content
        </M3Modal>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(
        <M3Modal open={true} onClose={() => {}}>
          Test
        </M3Modal>
      );
      const element = container.querySelector('.m3-modal');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Modal open={true} onClose={() => {}} className="custom-class">
          Test
        </M3Modal>
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    test('renders children correctly', () => {
      render(
        <M3Modal open={true} onClose={() => {}}>
          <div>Child 1</div>
          <div>Child 2</div>
        </M3Modal>
      );
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
  });

  // Size Variants Tests
  describe('Size Variants', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach((size) => {
      test(`applies size class for ${size}`, () => {
        const { container } = render(
          <M3Modal open={true} onClose={() => {}} size={size}>
            Test
          </M3Modal>
        );
        const element = container.querySelector(`.m3-modal--${size}`);
        expect(element).toBeInTheDocument();
      });
    });

    test('defaults to medium size', () => {
      const { container } = render(
        <M3Modal open={true} onClose={() => {}}>
          Test
        </M3Modal>
      );
      const element = container.querySelector('.m3-modal--medium');
      expect(element).toBeInTheDocument();
    });
  });

  // Header and Footer Tests
  describe('Header and Footer', () => {
    test('renders header when provided', () => {
      render(
        <M3Modal open={true} onClose={() => {}} header={<div>Header Content</div>}>
          Content
        </M3Modal>
      );
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    test('renders footer when provided', () => {
      render(
        <M3Modal open={true} onClose={() => {}} footer={<div>Footer Content</div>}>
          Content
        </M3Modal>
      );
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    test('renders close button when header is provided', () => {
      render(
        <M3Modal open={true} onClose={() => {}} header={<div>Header</div>}>
          Content
        </M3Modal>
      );
      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton).toBeInTheDocument();
    });
  });

  // Close Button Functionality
  describe('Close Button Functionality', () => {
    test('calls onClose when close button is clicked', () => {
      const handleClose = jest.fn();
      render(
        <M3Modal open={true} onClose={handleClose} header={<div>Header</div>}>
          Content
        </M3Modal>
      );
      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  // Keyboard Support Tests
  describe('Keyboard Support', () => {
    test('calls onClose when Escape key is pressed', async () => {
      const handleClose = jest.fn();
      render(
        <M3Modal open={true} onClose={handleClose} closeOnEscape={true}>
          Content
        </M3Modal>
      );
      await userEvent.keyboard('{Escape}');
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    test('does not call onClose when Escape is pressed and closeOnEscape is false', async () => {
      const handleClose = jest.fn();
      render(
        <M3Modal open={true} onClose={handleClose} closeOnEscape={false}>
          Content
        </M3Modal>
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
        <M3Modal open={true} onClose={handleClose} closeOnBackdropClick={true}>
          Content
        </M3Modal>
      );
      const backdrop = container.querySelector('.m3-modal__backdrop');
      fireEvent.click(backdrop!);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    test('does not call onClose when backdrop is clicked and closeOnBackdropClick is false', () => {
      const handleClose = jest.fn();
      const { container } = render(
        <M3Modal open={true} onClose={handleClose} closeOnBackdropClick={false}>
          Content
        </M3Modal>
      );
      const backdrop = container.querySelector('.m3-modal__backdrop');
      fireEvent.click(backdrop!);
      expect(handleClose).not.toHaveBeenCalled();
    });

    test('does not call onClose when modal content is clicked', () => {
      const handleClose = jest.fn();
      const { container } = render(
        <M3Modal open={true} onClose={handleClose} closeOnBackdropClick={true}>
          <div>Content</div>
        </M3Modal>
      );
      const modal = container.querySelector('.m3-modal');
      fireEvent.click(modal!);
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  // Focus Management Tests
  describe('Focus Management', () => {
    test('focuses first focusable element when opened', async () => {
      render(
        <M3Modal open={true} onClose={() => {}}>
          <button>First Button</button>
          <button>Second Button</button>
        </M3Modal>
      );
      await waitFor(() => {
        expect(screen.getByText('First Button')).toHaveFocus();
      });
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has role="dialog"', () => {
      const { container } = render(
        <M3Modal open={true} onClose={() => {}}>
          Content
        </M3Modal>
      );
      const modal = container.querySelector('[role="dialog"]');
      expect(modal).toBeInTheDocument();
    });

    test('has aria-modal="true"', () => {
      const { container } = render(
        <M3Modal open={true} onClose={() => {}}>
          Content
        </M3Modal>
      );
      const modal = container.querySelector('[aria-modal="true"]');
      expect(modal).toBeInTheDocument();
    });

    test('supports aria-labelledby', () => {
      const { container } = render(
        <M3Modal open={true} onClose={() => {}} aria-labelledby="modal-title">
          Content
        </M3Modal>
      );
      const modal = container.querySelector('[aria-labelledby="modal-title"]');
      expect(modal).toBeInTheDocument();
    });

    test('supports aria-describedby', () => {
      const { container } = render(
        <M3Modal open={true} onClose={() => {}} aria-describedby="modal-description">
          Content
        </M3Modal>
      );
      const modal = container.querySelector('[aria-describedby="modal-description"]');
      expect(modal).toBeInTheDocument();
    });
  });
});
