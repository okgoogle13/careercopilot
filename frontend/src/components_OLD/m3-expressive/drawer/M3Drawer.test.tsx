import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { M3Drawer } from './M3Drawer';

describe('M3Drawer Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('does not render when open is false', () => {
      const { container } = render(
        <M3Drawer open={false} onClose={() => {}}>
          Content
        </M3Drawer>
      );
      expect(container.querySelector('.m3-drawer')).not.toBeInTheDocument();
    });

    test('renders when open is true', () => {
      render(
        <M3Drawer open={true} onClose={() => {}}>
          Content
        </M3Drawer>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(
        <M3Drawer open={true} onClose={() => {}}>
          Test
        </M3Drawer>
      );
      const element = container.querySelector('.m3-drawer');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Drawer open={true} onClose={() => {}} className="custom-class">
          Test
        </M3Drawer>
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    test('renders children correctly', () => {
      render(
        <M3Drawer open={true} onClose={() => {}}>
          <div>Child 1</div>
          <div>Child 2</div>
        </M3Drawer>
      );
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
  });

  // Placement Tests
  describe('Placement', () => {
    test('applies left placement class by default', () => {
      const { container } = render(
        <M3Drawer open={true} onClose={() => {}}>
          Test
        </M3Drawer>
      );
      const element = container.querySelector('.m3-drawer--left');
      expect(element).toBeInTheDocument();
    });

    test('applies left placement class when placement is left', () => {
      const { container } = render(
        <M3Drawer open={true} onClose={() => {}} placement="left">
          Test
        </M3Drawer>
      );
      const element = container.querySelector('.m3-drawer--left');
      expect(element).toBeInTheDocument();
    });

    test('applies right placement class when placement is right', () => {
      const { container } = render(
        <M3Drawer open={true} onClose={() => {}} placement="right">
          Test
        </M3Drawer>
      );
      const element = container.querySelector('.m3-drawer--right');
      expect(element).toBeInTheDocument();
    });
  });

  // Header Tests
  describe('Header', () => {
    test('renders header when provided', () => {
      render(
        <M3Drawer open={true} onClose={() => {}} header={<M3Drawer.Header>Header Content</M3Drawer.Header>}>
          Content
        </M3Drawer>
      );
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    test('renders close button when header is provided', () => {
      render(
        <M3Drawer open={true} onClose={() => {}} header={<M3Drawer.Header>Header</M3Drawer.Header>}>
          Content
        </M3Drawer>
      );
      const closeButton = screen.getByLabelText('Close drawer');
      expect(closeButton).toBeInTheDocument();
    });
  });

  // Close Button Functionality
  describe('Close Button Functionality', () => {
    test('calls onClose when close button is clicked', () => {
      const handleClose = jest.fn();
      render(
        <M3Drawer open={true} onClose={handleClose} header={<M3Drawer.Header>Header</M3Drawer.Header>}>
          Content
        </M3Drawer>
      );
      const closeButton = screen.getByLabelText('Close drawer');
      fireEvent.click(closeButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  // Backdrop Tests
  describe('Backdrop', () => {
    test('shows backdrop by default', () => {
      const { container } = render(
        <M3Drawer open={true} onClose={() => {}}>
          Content
        </M3Drawer>
      );
      const backdrop = container.querySelector('.m3-drawer__backdrop');
      expect(backdrop).toBeInTheDocument();
    });

    test('does not show backdrop when showBackdrop is false', () => {
      const { container } = render(
        <M3Drawer open={true} onClose={() => {}} showBackdrop={false}>
          Content
        </M3Drawer>
      );
      const backdrop = container.querySelector('.m3-drawer__backdrop');
      expect(backdrop).not.toBeInTheDocument();
    });

    test('calls onClose when backdrop is clicked', () => {
      const handleClose = jest.fn();
      const { container } = render(
        <M3Drawer open={true} onClose={handleClose} closeOnBackdropClick={true}>
          Content
        </M3Drawer>
      );
      const backdrop = container.querySelector('.m3-drawer__backdrop');
      fireEvent.click(backdrop!);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    test('does not call onClose when backdrop is clicked and closeOnBackdropClick is false', () => {
      const handleClose = jest.fn();
      const { container } = render(
        <M3Drawer open={true} onClose={handleClose} closeOnBackdropClick={false}>
          Content
        </M3Drawer>
      );
      const backdrop = container.querySelector('.m3-drawer__backdrop');
      fireEvent.click(backdrop!);
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  // Keyboard Support Tests
  describe('Keyboard Support', () => {
    test('calls onClose when Escape key is pressed', async () => {
      const handleClose = jest.fn();
      render(
        <M3Drawer open={true} onClose={handleClose} closeOnEscape={true}>
          Content
        </M3Drawer>
      );
      await userEvent.keyboard('{Escape}');
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    test('does not call onClose when Escape is pressed and closeOnEscape is false', async () => {
      const handleClose = jest.fn();
      render(
        <M3Drawer open={true} onClose={handleClose} closeOnEscape={false}>
          Content
        </M3Drawer>
      );
      await userEvent.keyboard('{Escape}');
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  // Width Sizing Tests
  describe('Width Sizing', () => {
    test('applies custom width when provided', () => {
      const { container } = render(
        <M3Drawer open={true} onClose={() => {}} width="400px">
          Content
        </M3Drawer>
      );
      const drawer = container.querySelector('.m3-drawer');
      expect(drawer).toHaveStyle({ width: '400px' });
    });
  });
});
