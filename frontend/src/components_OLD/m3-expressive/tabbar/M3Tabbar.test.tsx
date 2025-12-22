import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { M3Tabbar } from './M3Tabbar';

describe('M3Tabbar Component', () => {
  const mockItems = [
    { label: 'Home', value: 'home' },
    { label: 'Profile', value: 'profile' },
    { label: 'Settings', value: 'settings' },
  ];

  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders tabs with items', () => {
      render(<M3Tabbar items={mockItems} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Tabbar items={mockItems} />);
      const element = container.querySelector('.m3-tabbar');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Tabbar items={mockItems} className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    test('renders tabs with icons', () => {
      const itemsWithIcons = [
        { label: 'Home', value: 'home', icon: <span>🏠</span> },
      ];
      render(<M3Tabbar items={itemsWithIcons} />);
      expect(screen.getByText('🏠')).toBeInTheDocument();
    });

    test('renders tabs with badges', () => {
      const itemsWithBadges = [
        { label: 'Home', value: 'home', badge: 5 },
      ];
      render(<M3Tabbar items={itemsWithBadges} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  // Selection Tests
  describe('Tab Selection', () => {
    test('selects first tab by default', () => {
      const { container } = render(<M3Tabbar items={mockItems} />);
      const firstTab = container.querySelector('.m3-tabbar__tab--active');
      expect(firstTab?.textContent).toBe('Home');
    });

    test('selects tab based on defaultValue', () => {
      const { container } = render(
        <M3Tabbar items={mockItems} defaultValue="profile" />
      );
      const activeTab = container.querySelector('.m3-tabbar__tab--active');
      expect(activeTab?.textContent).toBe('Profile');
    });

    test('selects tab based on controlled value', () => {
      const { container } = render(
        <M3Tabbar items={mockItems} value="settings" />
      );
      const activeTab = container.querySelector('.m3-tabbar__tab--active');
      expect(activeTab?.textContent).toBe('Settings');
    });

    test('calls onChange when tab is clicked', () => {
      const handleChange = jest.fn();
      render(<M3Tabbar items={mockItems} onChange={handleChange} />);
      const profileTab = screen.getByText('Profile');
      fireEvent.click(profileTab);
      expect(handleChange).toHaveBeenCalledWith('profile');
    });
  });

  // Disabled State Tests
  describe('Disabled State', () => {
    test('renders disabled tab', () => {
      const itemsWithDisabled = [
        { label: 'Home', value: 'home' },
        { label: 'Disabled', value: 'disabled', disabled: true },
      ];
      const { container } = render(<M3Tabbar items={itemsWithDisabled} />);
      const disabledTab = container.querySelector('.m3-tabbar__tab--disabled');
      expect(disabledTab).toBeInTheDocument();
    });

    test('does not call onChange when disabled tab is clicked', () => {
      const handleChange = jest.fn();
      const itemsWithDisabled = [
        { label: 'Home', value: 'home' },
        { label: 'Disabled', value: 'disabled', disabled: true },
      ];
      render(<M3Tabbar items={itemsWithDisabled} onChange={handleChange} />);
      const disabledTab = screen.getByText('Disabled');
      fireEvent.click(disabledTab);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // Keyboard Navigation Tests
  describe('Keyboard Navigation', () => {
    test('navigates to next tab with ArrowRight', async () => {
      const handleChange = jest.fn();
      render(<M3Tabbar items={mockItems} onChange={handleChange} />);
      const homeTab = screen.getByText('Home');
      homeTab.focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(handleChange).toHaveBeenCalledWith('profile');
    });

    test('navigates to previous tab with ArrowLeft', async () => {
      const handleChange = jest.fn();
      render(
        <M3Tabbar items={mockItems} defaultValue="profile" onChange={handleChange} />
      );
      const profileTab = screen.getByText('Profile');
      profileTab.focus();
      await userEvent.keyboard('{ArrowLeft}');
      expect(handleChange).toHaveBeenCalledWith('home');
    });

    test('navigates to first tab with Home key', async () => {
      const handleChange = jest.fn();
      render(
        <M3Tabbar items={mockItems} defaultValue="settings" onChange={handleChange} />
      );
      const settingsTab = screen.getByText('Settings');
      settingsTab.focus();
      await userEvent.keyboard('{Home}');
      expect(handleChange).toHaveBeenCalledWith('home');
    });

    test('navigates to last tab with End key', async () => {
      const handleChange = jest.fn();
      render(<M3Tabbar items={mockItems} onChange={handleChange} />);
      const homeTab = screen.getByText('Home');
      homeTab.focus();
      await userEvent.keyboard('{End}');
      expect(handleChange).toHaveBeenCalledWith('settings');
    });
  });

  // Color Variants Tests
  describe('Color Variants', () => {
    const colors = ['primary', 'secondary', 'tertiary', 'error'] as const;

    colors.forEach((color) => {
      test(`applies ${color} color class`, () => {
        const { container } = render(
          <M3Tabbar items={mockItems} color={color} />
        );
        const tabbar = container.querySelector(`.m3-tabbar--${color}`);
        expect(tabbar).toBeInTheDocument();
      });
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has role="tablist"', () => {
      const { container } = render(<M3Tabbar items={mockItems} />);
      const tablist = container.querySelector('[role="tablist"]');
      expect(tablist).toBeInTheDocument();
    });

    test('tabs have role="tab"', () => {
      const { container } = render(<M3Tabbar items={mockItems} />);
      const tabs = container.querySelectorAll('[role="tab"]');
      expect(tabs.length).toBe(3);
    });

    test('active tab has aria-selected="true"', () => {
      render(<M3Tabbar items={mockItems} defaultValue="profile" />);
      const profileTab = screen.getByText('Profile');
      expect(profileTab).toHaveAttribute('aria-selected', 'true');
    });

    test('inactive tabs have aria-selected="false"', () => {
      render(<M3Tabbar items={mockItems} defaultValue="profile" />);
      const homeTab = screen.getByText('Home');
      expect(homeTab).toHaveAttribute('aria-selected', 'false');
    });
  });
});
