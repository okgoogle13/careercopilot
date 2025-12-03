import React from 'react';
import { render, screen } from '@testing-library/react';
import { M3Stepper } from './M3Stepper';

describe('M3Stepper Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders with default props', () => {
      render(<M3Stepper>Content</M3Stepper>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Stepper>Test</M3Stepper>);
      const element = container.querySelector('.m3-stepper');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Stepper className="custom-class">Test</M3Stepper>
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });
  });

  // TODO: Add variant tests
  // TODO: Add color tests
  // TODO: Add event handler tests
  // TODO: Add ref forwarding tests
  // TODO: Add accessibility tests
});
