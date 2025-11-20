import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import React from 'react';

import { AnimatedButton } from '../AnimatedButton';

describe('AnimatedButton', () => {
  describe('Rendering', () => {
    it('renders with children', () => {
      render(<AnimatedButton>Click Me</AnimatedButton>);
      expect(screen.getByRole('button')).toHaveTextContent('Click Me');
    });

    it('renders with default animation (scale)', () => {
      render(<AnimatedButton>Button</AnimatedButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders all MUI Button variants', () => {
      const { rerender } = render(<AnimatedButton variant="contained">Contained</AnimatedButton>);
      expect(screen.getByRole('button')).toHaveClass('MuiButton-contained');

      rerender(<AnimatedButton variant="outlined">Outlined</AnimatedButton>);
      expect(screen.getByRole('button')).toHaveClass('MuiButton-outlined');

      rerender(<AnimatedButton variant="text">Text</AnimatedButton>);
      expect(screen.getByRole('button')).toHaveClass('MuiButton-text');
    });
  });

  describe('Animation Variants', () => {
    it('renders scale animation variant', () => {
      render(<AnimatedButton animation="scale">Scale</AnimatedButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders lift animation variant', () => {
      render(<AnimatedButton animation="lift">Lift</AnimatedButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders glow animation variant', () => {
      render(<AnimatedButton animation="glow">Glow</AnimatedButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders shimmer animation variant', () => {
      render(<AnimatedButton animation="shimmer">Shimmer</AnimatedButton>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();

      // Shimmer variant should have nested motion.div
      const buttonContent = button.querySelector('span');
      expect(buttonContent).toBeInTheDocument();
    });
  });

  describe('Click Handler', () => {
    it('calls onClick handler when clicked', () => {
      const handleClick = jest.fn();
      render(<AnimatedButton onClick={handleClick}>Click</AnimatedButton>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(
        <AnimatedButton onClick={handleClick} disabled>
          Click
        </AnimatedButton>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('renders as disabled when disabled prop is true', () => {
      render(<AnimatedButton disabled>Disabled</AnimatedButton>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('is enabled by default', () => {
      render(<AnimatedButton>Enabled</AnimatedButton>);
      expect(screen.getByRole('button')).toBeEnabled();
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(<AnimatedButton className="custom-class">Button</AnimatedButton>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('forwards additional MUI Button props', () => {
      render(
        <AnimatedButton size="large" color="primary">
          Button
        </AnimatedButton>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('MuiButton-sizeLarge');
    });

    it('applies custom sx prop', () => {
      render(<AnimatedButton sx={{ color: 'red' }}>Button</AnimatedButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains button role', () => {
      render(<AnimatedButton>Accessible</AnimatedButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('supports aria-label', () => {
      render(<AnimatedButton aria-label="Custom label">Button</AnimatedButton>);
      expect(screen.getByRole('button')).toHaveAccessibleName('Custom label');
    });

    it('is keyboard accessible', () => {
      const handleClick = jest.fn();
      render(<AnimatedButton onClick={handleClick}>Button</AnimatedButton>);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();

      // Simulate Enter key press
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      fireEvent.keyUp(button, { key: 'Enter', code: 'Enter' });
    });
  });
});
