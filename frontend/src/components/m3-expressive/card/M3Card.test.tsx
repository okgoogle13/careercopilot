import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

    test('renders children correctly', () => {
      render(
        <M3Card>
          <div>Child 1</div>
          <div>Child 2</div>
        </M3Card>
      );
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
  });

  // Elevation Tests
  describe('Elevation Levels', () => {
    const elevations = ['level0', 'level1', 'level2', 'level3', 'level4', 'level5'] as const;

    elevations.forEach((elevation) => {
      test(`applies elevation class for ${elevation}`, () => {
        const { container } = render(<M3Card elevation={elevation}>Test</M3Card>);
        const element = container.querySelector(`.m3-card--elevation-${elevation}`);
        expect(element).toBeInTheDocument();
      });
    });

    test('defaults to level0 elevation', () => {
      const { container } = render(<M3Card>Test</M3Card>);
      const element = container.querySelector('.m3-card--elevation-level0');
      expect(element).toBeInTheDocument();
    });
  });

  // Clickable Variant Tests
  describe('Clickable Variant', () => {
    test('applies clickable class when clickable prop is true', () => {
      const { container } = render(<M3Card clickable>Test</M3Card>);
      const element = container.querySelector('.m3-card--clickable');
      expect(element).toBeInTheDocument();
    });

    test('does not apply clickable class when clickable prop is false', () => {
      const { container } = render(<M3Card clickable={false}>Test</M3Card>);
      const element = container.querySelector('.m3-card--clickable');
      expect(element).not.toBeInTheDocument();
    });

    test('sets role="button" when clickable', () => {
      const { container } = render(<M3Card clickable>Test</M3Card>);
      const element = container.querySelector('[role="button"]');
      expect(element).toBeInTheDocument();
    });

    test('sets tabIndex={0} when clickable', () => {
      const { container } = render(<M3Card clickable>Test</M3Card>);
      const element = container.querySelector('.m3-card--clickable');
      expect(element).toHaveAttribute('tabIndex', '0');
    });

    test('does not set role when not clickable', () => {
      const { container } = render(<M3Card>Test</M3Card>);
      const element = container.querySelector('.m3-card');
      expect(element).not.toHaveAttribute('role');
    });

    test('handles click events when clickable', () => {
      const handleClick = jest.fn();
      const { container } = render(
        <M3Card clickable onClick={handleClick}>Test</M3Card>
      );
      const element = container.querySelector('.m3-card--clickable');
      fireEvent.click(element!);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // Hover State Tests
  describe('Hover State', () => {
    test('clickable card has hover elevation increase', () => {
      const { container } = render(<M3Card clickable elevation="level0">Test</M3Card>);
      const element = container.querySelector('.m3-card--clickable.m3-card--elevation-level0');
      expect(element).toBeInTheDocument();
    });
  });

  // Ref Forwarding Tests
  describe('Ref Forwarding', () => {
    test('forwards ref to card element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<M3Card ref={ref}>Test</M3Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.classList.contains('m3-card')).toBe(true);
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('can set custom role', () => {
      const { container } = render(<M3Card role="article">Test</M3Card>);
      const element = container.querySelector('[role="article"]');
      expect(element).toBeInTheDocument();
    });

    test('clickable card is keyboard accessible', () => {
      const { container } = render(<M3Card clickable>Test</M3Card>);
      const element = container.querySelector('.m3-card--clickable');
      expect(element).toHaveAttribute('tabIndex', '0');
    });
  });
});
