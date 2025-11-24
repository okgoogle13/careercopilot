import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Breadcrumbs, BreadcrumbItem } from '../breadcrumb';

describe('Breadcrumbs', () => {
  const defaultItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Current Page' },
  ];

  describe('Rendering', () => {
    it('renders breadcrumbs with items', () => {
      render(<Breadcrumbs items={defaultItems} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Current Page')).toBeInTheDocument();
    });

    it('renders with home icon on first item by default', () => {
      render(<Breadcrumbs items={defaultItems} />);
      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeInTheDocument();
    });

    it('renders without home icon when showHomeIcon is false', () => {
      render(<Breadcrumbs items={defaultItems} showHomeIcon={false} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('renders with custom separator', () => {
      render(<Breadcrumbs items={defaultItems} separator=">" />);
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('respects maxItems prop', () => {
      const manyItems: BreadcrumbItem[] = [
        { label: 'Item 1' },
        { label: 'Item 2' },
        { label: 'Item 3' },
        { label: 'Item 4' },
        { label: 'Item 5' },
      ];
      render(<Breadcrumbs items={manyItems} maxItems={3} />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 5')).toBeInTheDocument();
    });
  });

  describe('Links', () => {
    it('renders clickable links for non-last items', () => {
      render(<Breadcrumbs items={defaultItems} />);
      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders current page as non-clickable', () => {
      render(<Breadcrumbs items={defaultItems} />);
      const currentPage = screen.getByText('Current Page');
      expect(currentPage.tagName).not.toBe('A');
    });

    it('calls onClick handler when link is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const items: BreadcrumbItem[] = [
        { label: 'Home', onClick: handleClick },
        { label: 'Current' },
      ];

      render(<Breadcrumbs items={items} />);

      await user.click(screen.getByText('Home'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('prevents default when onClick is provided', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/', onClick: handleClick },
        { label: 'Current' },
      ];

      render(<Breadcrumbs items={items} />);

      await user.click(screen.getByText('Home'));
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Icons', () => {
    it('renders custom icon for item', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', icon: \u003csvg data- testid="home-icon" /\u003e },
      { label: 'Current' },
      ];
    render(\u003cBreadcrumbs items = { items } /\u003e);
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  });
});
});
