import React from 'react';
import { render, screen } from '@testing-library/react';
import { M3Badge } from './M3Badge';

describe('M3Badge Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders with default props', () => {
      render(<M3Badge>Content</M3Badge>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Badge>Test</M3Badge>);
      const element = container.querySelector('.m3-badge');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Badge className="custom-class">Test</M3Badge>
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
