import React from 'react';
import { render, screen } from '@testing-library/react';
import { M3Card } from './M3Card';

describe('M3Card Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders with default props', () => {
      render(<M3Card>Content</M3Card>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Card>Test</M3Card>);
      const element = container.querySelector('.m3-card');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Card className="custom-class">Test</M3Card>
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
