import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { M3Listitem } from './M3Listitem';

describe('M3Listitem Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders with children', () => {
      render(<M3Listitem>Content</M3Listitem>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    test('renders with primary text', () => {
      render(<M3Listitem primary="Item Title" />);
      expect(screen.getByText('Item Title')).toBeInTheDocument();
    });

    test('renders with primary and secondary text', () => {
      render(<M3Listitem primary="Title" secondary="Description" />);
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Listitem primary="Test" />);
      const element = container.querySelector('.m3-listitem');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Listitem primary="Test" className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });
  });

  // Leading/Trailing Tests
  describe('Leading and Trailing Elements', () => {
    test('renders leading element', () => {
      render(<M3Listitem primary="Item" leading={<span>Icon</span>} />);
      expect(screen.getByText('Icon')).toBeInTheDocument();
    });

    test('renders trailing element', () => {
      render(<M3Listitem primary="Item" trailing={<span>Action</span>} />);
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });

  // Clickable Tests
  describe('Clickable State', () => {
    test('applies clickable class when clickable is true', () => {
      const { container } = render(
        <M3Listitem primary="Item" clickable />
      );
      const item = container.querySelector('.m3-listitem--clickable');
      expect(item).toBeInTheDocument();
    });

    test('renders as button when clickable', () => {
      const { container } = render(
        <M3Listitem primary="Item" clickable />
      );
      const button = container.querySelector('button.m3-listitem--clickable');
      expect(button).toBeInTheDocument();
    });

    test('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<M3Listitem primary="Item" clickable onClick={handleClick} />);
      const item = screen.getByText('Item');
      fireEvent.click(item);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('handles keyboard Enter key', async () => {
      const handleClick = jest.fn();
      render(<M3Listitem primary="Item" clickable onClick={handleClick} />);
      const item = screen.getByText('Item');
      item.focus();
      await userEvent.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('handles keyboard Space key', async () => {
      const handleClick = jest.fn();
      render(<M3Listitem primary="Item" clickable onClick={handleClick} />);
      const item = screen.getByText('Item');
      item.focus();
      await userEvent.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // Selected State Tests
  describe('Selected State', () => {
    test('applies selected class when selected is true', () => {
      const { container } = render(
        <M3Listitem primary="Item" selected />
      );
      const item = container.querySelector('.m3-listitem--selected');
      expect(item).toBeInTheDocument();
    });

    test('has aria-selected when selected', () => {
      render(<M3Listitem primary="Item" selected />);
      const item = screen.getByText('Item');
      expect(item).toHaveAttribute('aria-selected', 'true');
    });
  });

  // Disabled State Tests
  describe('Disabled State', () => {
    test('applies disabled class when disabled is true', () => {
      const { container } = render(
        <M3Listitem primary="Item" disabled />
      );
      const item = container.querySelector('.m3-listitem--disabled');
      expect(item).toBeInTheDocument();
    });

    test('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<M3Listitem primary="Item" clickable disabled onClick={handleClick} />);
      const item = screen.getByText('Item');
      fireEvent.click(item);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has role="listitem" by default', () => {
      render(<M3Listitem primary="Item" />);
      const item = screen.getByRole('listitem');
      expect(item).toBeInTheDocument();
    });

    test('has role="button" when clickable', () => {
      render(<M3Listitem primary="Item" clickable />);
      const item = screen.getByRole('button');
      expect(item).toBeInTheDocument();
    });

    test('has tabIndex when clickable and not disabled', () => {
      render(<M3Listitem primary="Item" clickable />);
      const item = screen.getByText('Item');
      expect(item).toHaveAttribute('tabIndex', '0');
    });
  });
});
