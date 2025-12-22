import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { M3Chip } from './M3Chip';

describe('M3Chip Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders with label prop', () => {
      render(<M3Chip label="React" />);
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Chip label="Test" />);
      const element = container.querySelector('.m3-chip');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Chip label="Test" className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    test('renders filled variant by default', () => {
      const { container } = render(<M3Chip label="Filled" />);
      const element = container.querySelector('.m3-chip');
      expect(element).toHaveClass('m3-chip--filled');
    });

    test('renders outlined variant', () => {
      const { container } = render(
        <M3Chip label="Outlined" variant="outlined" />
      );
      const element = container.querySelector('.m3-chip');
      expect(element).toHaveClass('m3-chip--outlined');
    });
  });

  describe('Interactions', () => {
    test('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<M3Chip label="Clickable" onClick={handleClick} />);
      
      const chip = screen.getByText('Clickable');
      fireEvent.click(chip);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('calls onDelete when delete button is clicked', () => {
      const handleDelete = jest.fn();
      render(<M3Chip label="Removable" onDelete={handleDelete} removable />);
      
      const deleteButton = screen.getByRole('button', { name: /remove/i });
      fireEvent.click(deleteButton);
      
      expect(handleDelete).toHaveBeenCalledTimes(1);
    });
  });
});
