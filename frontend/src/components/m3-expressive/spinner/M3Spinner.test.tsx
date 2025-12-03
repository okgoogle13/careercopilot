import React from 'react';
import { render, screen } from '@testing-library/react';
import { M3Spinner } from './M3Spinner';

describe('M3Spinner Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders with default props', () => {
      render(<M3Spinner>Content</M3Spinner>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Spinner>Test</M3Spinner>);
      const element = container.querySelector('.m3-spinner');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Spinner className="custom-class">Test</M3Spinner>
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
