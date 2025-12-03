import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { M3Accordion } from './M3Accordion';

describe('M3Accordion Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders accordion with items', () => {
      render(
        <M3Accordion>
          <M3Accordion.Item header="Item 1">Content 1</M3Accordion.Item>
          <M3Accordion.Item header="Item 2">Content 2</M3Accordion.Item>
        </M3Accordion>
      );
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(
        <M3Accordion>
          <M3Accordion.Item header="Test">Content</M3Accordion.Item>
        </M3Accordion>
      );
      const element = container.querySelector('.m3-accordion');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Accordion className="custom-class">
          <M3Accordion.Item header="Test">Content</M3Accordion.Item>
        </M3Accordion>
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    test('renders multiple items', () => {
      render(
        <M3Accordion>
          <M3Accordion.Item header="Item 1">Content 1</M3Accordion.Item>
          <M3Accordion.Item header="Item 2">Content 2</M3Accordion.Item>
          <M3Accordion.Item header="Item 3">Content 3</M3Accordion.Item>
        </M3Accordion>
      );
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  // Expand/Collapse Tests
  describe('Expand/Collapse Toggle', () => {
    test('item is collapsed by default', () => {
      const { container } = render(
        <M3Accordion>
          <M3Accordion.Item header="Item 1">Content 1</M3Accordion.Item>
        </M3Accordion>
      );
      const item = container.querySelector('.m3-accordion-item');
      expect(item).not.toHaveClass('m3-accordion-item--expanded');
    });

    test('expands item when header is clicked', () => {
      const { container } = render(
        <M3Accordion>
          <M3Accordion.Item header="Item 1">Content 1</M3Accordion.Item>
        </M3Accordion>
      );
      const header = screen.getByText('Item 1');
      fireEvent.click(header);
      const item = container.querySelector('.m3-accordion-item');
      expect(item).toHaveClass('m3-accordion-item--expanded');
    });

    test('collapses item when header is clicked again', () => {
      const { container } = render(
        <M3Accordion>
          <M3Accordion.Item header="Item 1">Content 1</M3Accordion.Item>
        </M3Accordion>
      );
      const header = screen.getByText('Item 1');
      fireEvent.click(header);
      fireEvent.click(header);
      const item = container.querySelector('.m3-accordion-item');
      expect(item).not.toHaveClass('m3-accordion-item--expanded');
    });

    test('shows content when expanded', () => {
      render(
        <M3Accordion>
          <M3Accordion.Item header="Item 1">Content 1</M3Accordion.Item>
        </M3Accordion>
      );
      const header = screen.getByText('Item 1');
      fireEvent.click(header);
      expect(screen.getByText('Content 1')).toBeVisible();
    });
  });

  // Single vs Multiple Open Tests
  describe('Single vs Multiple Open', () => {
    test('allows multiple items open by default', () => {
      const { container } = render(
        <M3Accordion>
          <M3Accordion.Item header="Item 1">Content 1</M3Accordion.Item>
          <M3Accordion.Item header="Item 2">Content 2</M3Accordion.Item>
        </M3Accordion>
      );
      const header1 = screen.getByText('Item 1');
      const header2 = screen.getByText('Item 2');
      fireEvent.click(header1);
      fireEvent.click(header2);
      const items = container.querySelectorAll('.m3-accordion-item--expanded');
      expect(items).toHaveLength(2);
    });

    test('only allows one item open when singleOpen is true', () => {
      const { container } = render(
        <M3Accordion singleOpen>
          <M3Accordion.Item header="Item 1">Content 1</M3Accordion.Item>
          <M3Accordion.Item header="Item 2">Content 2</M3Accordion.Item>
        </M3Accordion>
      );
      const header1 = screen.getByText('Item 1');
      const header2 = screen.getByText('Item 2');
      fireEvent.click(header1);
      fireEvent.click(header2);
      const items = container.querySelectorAll('.m3-accordion-item--expanded');
      expect(items).toHaveLength(1);
    });

    test('closes previous item when opening new item in singleOpen mode', () => {
      const { container } = render(
        <M3Accordion singleOpen>
          <M3Accordion.Item header="Item 1">Content 1</M3Accordion.Item>
          <M3Accordion.Item header="Item 2">Content 2</M3Accordion.Item>
        </M3Accordion>
      );
      const header1 = screen.getByText('Item 1');
      const header2 = screen.getByText('Item 2');
      fireEvent.click(header1);
      expect(container.querySelector('.m3-accordion-item:first-child')).toHaveClass('m3-accordion-item--expanded');
      fireEvent.click(header2);
      expect(container.querySelector('.m3-accordion-item:first-child')).not.toHaveClass('m3-accordion-item--expanded');
      expect(container.querySelector('.m3-accordion-item:last-child')).toHaveClass('m3-accordion-item--expanded');
    });
  });

  // Icon Rotation Tests
  describe('Icon Rotation', () => {
    test('icon rotates when item is expanded', () => {
      const { container } = render(
        <M3Accordion>
          <M3Accordion.Item header="Item 1">Content 1</M3Accordion.Item>
        </M3Accordion>
      );
      const header = screen.getByText('Item 1');
      const iconWrapper = container.querySelector('.m3-accordion-item__icon-wrapper');
      expect(iconWrapper).not.toHaveClass('m3-accordion-item--expanded');
      fireEvent.click(header);
      const item = container.querySelector('.m3-accordion-item');
      expect(item).toHaveClass('m3-accordion-item--expanded');
    });
  });

  // Keyboard Support Tests
  describe('Keyboard Support', () => {
    test('toggles item when Space key is pressed', async () => {
      const { container } = render(
        <M3Accordion>
          <M3Accordion.Item header="Item 1">Content 1</M3Accordion.Item>
        </M3Accordion>
      );
      const header = screen.getByText('Item 1');
      header.focus();
      await userEvent.keyboard(' ');
      const item = container.querySelector('.m3-accordion-item');
      expect(item).toHaveClass('m3-accordion-item--expanded');
    });

    test('toggles item when Enter key is pressed', async () => {
      const { container } = render(
        <M3Accordion>
          <M3Accordion.Item header="Item 1">Content 1</M3Accordion.Item>
        </M3Accordion>
      );
      const header = screen.getByText('Item 1');
      header.focus();
      await userEvent.keyboard('{Enter}');
      const item = container.querySelector('.m3-accordion-item');
      expect(item).toHaveClass('m3-accordion-item--expanded');
    });
  });

  // Icon Visibility Tests
  describe('Icon Visibility', () => {
    test('shows icon by default', () => {
      const { container } = render(
        <M3Accordion>
          <M3Accordion.Item header="Item 1">Content 1</M3Accordion.Item>
        </M3Accordion>
      );
      const iconWrapper = container.querySelector('.m3-accordion-item__icon-wrapper');
      expect(iconWrapper).toBeInTheDocument();
    });

    test('hides icon when showIcon is false', () => {
      const { container } = render(
        <M3Accordion>
          <M3Accordion.Item header="Item 1" showIcon={false}>Content 1</M3Accordion.Item>
        </M3Accordion>
      );
      const iconWrapper = container.querySelector('.m3-accordion-item__icon-wrapper');
      expect(iconWrapper).not.toBeInTheDocument();
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('header has aria-expanded attribute', () => {
      render(
        <M3Accordion>
          <M3Accordion.Item header="Item 1">Content 1</M3Accordion.Item>
        </M3Accordion>
      );
      const header = screen.getByText('Item 1');
      expect(header).toHaveAttribute('aria-expanded', 'false');
    });

    test('header has aria-controls pointing to content', () => {
      render(
        <M3Accordion>
          <M3Accordion.Item id="item1" header="Item 1">Content 1</M3Accordion.Item>
        </M3Accordion>
      );
      const header = screen.getByText('Item 1');
      expect(header).toHaveAttribute('aria-controls');
    });

    test('content has role="region"', () => {
      const { container } = render(
        <M3Accordion>
          <M3Accordion.Item header="Item 1">Content 1</M3Accordion.Item>
        </M3Accordion>
      );
      const content = container.querySelector('[role="region"]');
      expect(content).toBeInTheDocument();
    });
  });
});
