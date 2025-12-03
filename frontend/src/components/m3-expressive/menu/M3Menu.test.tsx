import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { M3Menu } from './M3Menu';

describe('M3Menu Component', () => {
  const mockItems = [
    { label: 'Edit', value: 'edit' },
    { label: 'Delete', value: 'delete', divider: true },
  ];

  const renderMenu = (props = {}) => {
    return render(
      <M3Menu 
        trigger={<button>Open Menu</button>} 
        items={mockItems}
        {...props}
      />
    );
  };

  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders trigger button', () => {
      renderMenu();
      expect(screen.getByText('Open Menu')).toBeInTheDocument();
    });

    test('opens menu when trigger is clicked', () => {
      renderMenu();
      const trigger = screen.getByText('Open Menu');
      fireEvent.click(trigger);
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = renderMenu();
      const element = container.querySelector('.m3-menu');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = renderMenu({ className: 'custom-class' });
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    test('calls onSelect when menu item is clicked', () => {
      const onSelect = jest.fn();
      renderMenu({ onSelect });
      
      const trigger = screen.getByText('Open Menu');
      fireEvent.click(trigger);
      
      const editItem = screen.getByText('Edit');
      fireEvent.click(editItem);
      
      expect(onSelect).toHaveBeenCalledWith('edit');
    });

    test('closes menu after selection when closeOnSelect is true', () => {
      renderMenu({ closeOnSelect: true });
      
      const trigger = screen.getByText('Open Menu');
      fireEvent.click(trigger);
      
      const editItem = screen.getByText('Edit');
      fireEvent.click(editItem);
      
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });
  });
});
