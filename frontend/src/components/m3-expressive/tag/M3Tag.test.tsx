import React from 'react';
import { render, screen } from '@testing-library/react';
import { M3Tag } from './M3Tag';

describe('M3Tag Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders with default props', () => {
      render(<M3Tag>Content</M3Tag>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Tag>Test</M3Tag>);
      const element = container.querySelector('.m3-tag');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Tag className="custom-class">Test</M3Tag>
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
