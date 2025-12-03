import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { M3Breadcrumb } from './M3Breadcrumb';

describe('M3Breadcrumb Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders breadcrumb with items', () => {
      render(
        <M3Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: 'Details', current: true },
          ]}
        />
      );
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(
        <M3Breadcrumb items={[{ label: 'Home' }]} />
      );
      const element = container.querySelector('.m3-breadcrumb');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Breadcrumb items={[{ label: 'Home' }]} className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    test('does not render when items array is empty', () => {
      const { container } = render(<M3Breadcrumb items={[]} />);
      expect(container.querySelector('.m3-breadcrumb')).not.toBeInTheDocument();
    });
  });

  // Separator Tests
  describe('Separator', () => {
    test('renders default separator (/)', () => {
      const { container } = render(
        <M3Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products' },
          ]}
        />
      );
      const separators = container.querySelectorAll('.m3-breadcrumb__separator');
      expect(separators.length).toBeGreaterThan(0);
    });

    test('renders custom separator', () => {
      const { container } = render(
        <M3Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products' },
          ]}
          separator=">"
        />
      );
      const separator = container.querySelector('.m3-breadcrumb__separator');
      expect(separator?.textContent).toBe('>');
    });

    test('does not render separator after last item', () => {
      const { container } = render(
        <M3Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products' },
          ]}
        />
      );
      const items = container.querySelectorAll('.m3-breadcrumb__item');
      const lastItem = items[items.length - 1];
      const separator = lastItem.querySelector('.m3-breadcrumb__separator');
      expect(separator).not.toBeInTheDocument();
    });
  });

  // Current Item Tests
  describe('Current Item', () => {
    test('marks last item as current by default', () => {
      const { container } = render(
        <M3Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products' },
          ]}
        />
      );
      const lastLink = container.querySelector('.m3-breadcrumb__link--current');
      expect(lastLink?.textContent).toBe('Products');
    });

    test('marks item with current prop as current', () => {
      const { container } = render(
        <M3Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', current: true },
            { label: 'Details' },
          ]}
        />
      );
      const currentLink = container.querySelector('.m3-breadcrumb__link--current');
      expect(currentLink?.textContent).toBe('Products');
    });

    test('current item has aria-current="page"', () => {
      render(
        <M3Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products' },
          ]}
        />
      );
      const currentLink = screen.getByText('Products');
      expect(currentLink).toHaveAttribute('aria-current', 'page');
    });
  });

  // Link Tests
  describe('Links', () => {
    test('renders anchor tag when href is provided', () => {
      const { container } = render(
        <M3Breadcrumb
          items={[{ label: 'Home', href: '/' }]}
        />
      );
      const link = container.querySelector('a.m3-breadcrumb__link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/');
    });

    test('renders button when onClick is provided without href', () => {
      const handleClick = jest.fn();
      const { container } = render(
        <M3Breadcrumb
          items={[{ label: 'Home', onClick: handleClick }]}
        />
      );
      const button = container.querySelector('button.m3-breadcrumb__link');
      expect(button).toBeInTheDocument();
    });

    test('calls onClick when link is clicked', () => {
      const handleClick = jest.fn();
      render(
        <M3Breadcrumb
          items={[{ label: 'Home', onClick: handleClick }]}
        />
      );
      const link = screen.getByText('Home');
      fireEvent.click(link);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('calls onClick when anchor with onClick is clicked', () => {
      const handleClick = jest.fn();
      render(
        <M3Breadcrumb
          items={[{ label: 'Home', href: '/', onClick: handleClick }]}
        />
      );
      const link = screen.getByText('Home');
      fireEvent.click(link);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has nav element with aria-label', () => {
      const { container } = render(
        <M3Breadcrumb items={[{ label: 'Home' }]} />
      );
      const nav = container.querySelector('nav[aria-label="Breadcrumb"]');
      expect(nav).toBeInTheDocument();
    });

    test('uses ordered list for breadcrumb items', () => {
      const { container } = render(
        <M3Breadcrumb items={[{ label: 'Home' }]} />
      );
      const list = container.querySelector('ol.m3-breadcrumb__list');
      expect(list).toBeInTheDocument();
    });

    test('separator has aria-hidden', () => {
      const { container } = render(
        <M3Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products' },
          ]}
        />
      );
      const separator = container.querySelector('.m3-breadcrumb__separator');
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
