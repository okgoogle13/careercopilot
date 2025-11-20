import { render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import React from 'react';

import { AnimatedProgress } from '../AnimatedProgress';

describe('AnimatedProgress', () => {
  describe('Rendering', () => {
    it('renders progress bar with value', () => {
      render(<AnimatedProgress value={50} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('displays percentage by default', () => {
      render(<AnimatedProgress value={75} />);
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('hides percentage when showPercentage is false', () => {
      render(<AnimatedProgress value={75} showPercentage={false} />);
      expect(screen.queryByText('75%')).not.toBeInTheDocument();
    });

    it('displays label when provided', () => {
      render(<AnimatedProgress value={50} label="Upload Progress" />);
      expect(screen.getByText('Upload Progress')).toBeInTheDocument();
    });
  });

  describe('ARIA Attributes', () => {
    it('has proper progressbar role', () => {
      render(<AnimatedProgress value={60} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('sets aria-valuenow correctly', () => {
      render(<AnimatedProgress value={45} />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow', '45');
    });

    it('sets aria-valuemin to 0', () => {
      render(<AnimatedProgress value={50} />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    });

    it('sets aria-valuemax to max prop or 100', () => {
      const { rerender } = render(<AnimatedProgress value={50} />);
      let progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuemax', '100');

      rerender(<AnimatedProgress value={50} max={200} />);
      progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuemax', '200');
    });

    it('sets aria-label with label prop or default', () => {
      const { rerender } = render(<AnimatedProgress value={50} label="Custom Progress" />);
      let progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-label', 'Custom Progress');

      rerender(<AnimatedProgress value={75} />);
      progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-label', 'Progress: 75%');
    });
  });

  describe('Percentage Calculation', () => {
    it('calculates percentage correctly with default max', () => {
      render(<AnimatedProgress value={25} />);
      expect(screen.getByText('25%')).toBeInTheDocument();
    });

    it('calculates percentage correctly with custom max', () => {
      render(<AnimatedProgress value={50} max={200} />);
      expect(screen.getByText('25%')).toBeInTheDocument(); // 50/200 = 25%
    });

    it('handles value at 0', () => {
      render(<AnimatedProgress value={0} />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('handles value at max', () => {
      render(<AnimatedProgress value={100} />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('Value Clamping', () => {
    it('clamps value above max to 100%', () => {
      render(<AnimatedProgress value={150} max={100} />);
      expect(screen.getByText('100%')).toBeInTheDocument();

      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow', '100');
    });

    it('clamps value below 0 to 0%', () => {
      render(<AnimatedProgress value={-10} />);
      expect(screen.getByText('0%')).toBeInTheDocument();

      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow', '0');
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<AnimatedProgress value={50} variant="default" />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders success variant', () => {
      render(<AnimatedProgress value={50} variant="success" />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders warning variant', () => {
      render(<AnimatedProgress value={50} variant="warning" />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders error variant', () => {
      render(<AnimatedProgress value={50} variant="error" />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Animation', () => {
    it('is animated by default', () => {
      render(<AnimatedProgress value={50} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('can disable animation', () => {
      render(<AnimatedProgress value={50} animated={false} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = render(<AnimatedProgress value={50} className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
