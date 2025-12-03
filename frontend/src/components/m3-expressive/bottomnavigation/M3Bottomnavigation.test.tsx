import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { M3Bottomnavigation } from './M3Bottomnavigation';

describe('M3Bottomnavigation Component', () => {
  const mockItems = [
    { label: 'Home', value: 'home', icon: <span>🏠</span> },
    { label: 'Search', value: 'search', icon: <span>🔍</span> },
    { label: 'Profile', value: 'profile', icon: <span>👤</span> },
  ];

  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders navigation items', () => {
      render(<M3Bottomnavigation items={mockItems} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Search')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Bottomnavigation items={mockItems} />);
      const element = container.querySelector('.m3-bottomnavigation');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Bottomnavigation items={mockItems} className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    test('renders icons', () => {
      render(<M3Bottomnavigation items={mockItems} />);
      expect(screen.getByText('🏠')).toBeInTheDocument();
      expect(screen.getByText('🔍')).toBeInTheDocument();
    });

    test('renders badges', () => {
      const itemsWithBadges = [
        { label: 'Home', value: 'home', icon: <span>🏠</span>, badge: 5 },
      ];
      render(<M3Bottomnavigation items={itemsWithBadges} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  // Selection Tests
  describe('Item Selection', () => {
    test('selects first item by default', () => {
      const { container } = render(<M3Bottomnavigation items={mockItems} />);
      const firstItem = container.querySelector('.m3-bottomnavigation__item--active');
      expect(firstItem?.getAttribute('aria-label')).toBe('Home');
    });

    test('selects item based on defaultValue', () => {
      const { container } = render(
        <M3Bottomnavigation items={mockItems} defaultValue="search" />
      );
      const activeItem = container.querySelector('.m3-bottomnavigation__item--active');
      expect(activeItem?.getAttribute('aria-label')).toBe('Search');
    });

    test('selects item based on controlled value', () => {
      const { container } = render(
        <M3Bottomnavigation items={mockItems} value="profile" />
      );
      const activeItem = container.querySelector('.m3-bottomnavigation__item--active');
      expect(activeItem?.getAttribute('aria-label')).toBe('Profile');
    });

    test('calls onChange when item is clicked', () => {
      const handleChange = jest.fn();
      render(<M3Bottomnavigation items={mockItems} onChange={handleChange} />);
      const searchItem = screen.getByLabelText('Search');
      fireEvent.click(searchItem);
      expect(handleChange).toHaveBeenCalledWith('search');
    });
  });

  // Disabled State Tests
  describe('Disabled State', () => {
    test('renders disabled item', () => {
      const itemsWithDisabled = [
        { label: 'Home', value: 'home', icon: <span>🏠</span> },
        { label: 'Disabled', value: 'disabled', icon: <span>🚫</span>, disabled: true },
      ];
      const { container } = render(<M3Bottomnavigation items={itemsWithDisabled} />);
      const disabledItem = container.querySelector('.m3-bottomnavigation__item--disabled');
      expect(disabledItem).toBeInTheDocument();
    });

    test('does not call onChange when disabled item is clicked', () => {
      const handleChange = jest.fn();
      const itemsWithDisabled = [
        { label: 'Home', value: 'home', icon: <span>🏠</span> },
        { label: 'Disabled', value: 'disabled', icon: <span>🚫</span>, disabled: true },
      ];
      render(<M3Bottomnavigation items={itemsWithDisabled} onChange={handleChange} />);
      const disabledItem = screen.getByLabelText('Disabled');
      fireEvent.click(disabledItem);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // Color Variants Tests
  describe('Color Variants', () => {
    const colors = ['primary', 'secondary', 'tertiary', 'error'] as const;

    colors.forEach((color) => {
      test(`applies ${color} color class`, () => {
        const { container } = render(
          <M3Bottomnavigation items={mockItems} color={color} />
        );
        const nav = container.querySelector(`.m3-bottomnavigation--${color}`);
        expect(nav).toBeInTheDocument();
      });
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has nav element with role="tablist" and aria-label', () => {
      const { container } = render(<M3Bottomnavigation items={mockItems} />);
      const nav = container.querySelector('nav[role="tablist"][aria-label="Bottom navigation"]');
      expect(nav).toBeInTheDocument();
    });

    test('items have role="tab"', () => {
      const { container } = render(<M3Bottomnavigation items={mockItems} />);
      const tabs = container.querySelectorAll('[role="tab"]');
      expect(tabs.length).toBe(3);
    });

    test('active item has aria-selected="true"', () => {
      render(<M3Bottomnavigation items={mockItems} defaultValue="search" />);
      const searchItem = screen.getByLabelText('Search');
      expect(searchItem).toHaveAttribute('aria-selected', 'true');
    });

    test('inactive items have aria-selected="false"', () => {
      render(<M3Bottomnavigation items={mockItems} defaultValue="search" />);
      const homeItem = screen.getByLabelText('Home');
      expect(homeItem).toHaveAttribute('aria-selected', 'false');
    });
  });
});
