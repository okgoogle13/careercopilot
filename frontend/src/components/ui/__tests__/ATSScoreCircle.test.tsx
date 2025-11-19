import { render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import React from 'react';

import { ATSScoreCircle } from '../ATSScoreCircle';

describe('ATSScoreCircle', () => {
  describe('Rendering', () => {
    it('renders with score and default props', () => {
      render(<ATSScoreCircle score={85} />);

      // Check ARIA label
      const element = screen.getByRole('img');
      expect(element).toHaveAttribute('aria-label', 'ATS Score: 85 out of 100');
    });

    it('displays score percentage for small and medium sizes', () => {
      const { rerender } = render(<ATSScoreCircle score={75} size="small" />);
      expect(screen.getByText('75%')).toBeInTheDocument();

      rerender(<ATSScoreCircle score={75} size="medium" />);
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('displays score percentage separately for large size', () => {
      render(<ATSScoreCircle score={90} size="large" />);
      expect(screen.getByText('90%')).toBeInTheDocument();
    });

    it('shows label when showLabel prop is true', () => {
      render(<ATSScoreCircle score={85} showLabel />);
      expect(screen.getByText('ATS Score')).toBeInTheDocument();
    });

    it('hides label when showLabel prop is false', () => {
      render(<ATSScoreCircle score={85} showLabel={false} />);
      expect(screen.queryByText('ATS Score')).not.toBeInTheDocument();
    });
  });

  describe('Score Color Thresholds', () => {
    it('uses green color for score >= 80', () => {
      const { container } = render(<ATSScoreCircle score={85} />);
      const svg = container.querySelector('svg');
      const circles = svg?.querySelectorAll('circle');

      // Progress circle should have green stroke
      const progressCircle = circles?.[circles.length - 1];
      expect(progressCircle).toHaveAttribute('stroke', '#10b981');
    });

    it('uses yellow color for score 60-79', () => {
      const { container } = render(<ATSScoreCircle score={70} />);
      const svg = container.querySelector('svg');
      const circles = svg?.querySelectorAll('circle');

      const progressCircle = circles?.[circles.length - 1];
      expect(progressCircle).toHaveAttribute('stroke', '#f59e0b');
    });

    it('uses red color for score < 60', () => {
      const { container } = render(<ATSScoreCircle score={45} />);
      const svg = container.querySelector('svg');
      const circles = svg?.querySelectorAll('circle');

      const progressCircle = circles?.[circles.length - 1];
      expect(progressCircle).toHaveAttribute('stroke', '#ef4444');
    });
  });

  describe('Size Variants', () => {
    it('renders small size correctly', () => {
      const { container } = render(<ATSScoreCircle score={75} size="small" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '80');
      expect(svg).toHaveAttribute('height', '80');
    });

    it('renders medium size correctly (default)', () => {
      const { container } = render(<ATSScoreCircle score={75} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '120');
      expect(svg).toHaveAttribute('height', '120');
    });

    it('renders large size correctly', () => {
      const { container } = render(<ATSScoreCircle score={75} size="large" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '192');
      expect(svg).toHaveAttribute('height', '192');
    });

    it('renders glow effect only for large size', () => {
      const { container, rerender } = render(<ATSScoreCircle score={85} size="large" />);
      let svg = container.querySelector('svg');
      let circles = svg?.querySelectorAll('circle');

      // Large size should have 3 circles (background + glow + progress)
      expect(circles?.length).toBe(3);

      rerender(<ATSScoreCircle score={85} size="medium" />);
      svg = container.querySelector('svg');
      circles = svg?.querySelectorAll('circle');

      // Medium size should have 2 circles (background + progress, no glow)
      expect(circles?.length).toBe(2);
    });
  });

  describe('Score Clamping', () => {
    it('clamps score above 100 to 100', () => {
      render(<ATSScoreCircle score={150} />);

      const element = screen.getByRole('img');
      expect(element).toHaveAttribute('aria-label', 'ATS Score: 100 out of 100');
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('clamps score below 0 to 0', () => {
      render(<ATSScoreCircle score={-10} />);

      const element = screen.getByRole('img');
      expect(element).toHaveAttribute('aria-label', 'ATS Score: 0 out of 100');
      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA role', () => {
      render(<ATSScoreCircle score={75} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('has descriptive ARIA label', () => {
      render(<ATSScoreCircle score={88} />);
      const element = screen.getByRole('img');
      expect(element).toHaveAttribute('aria-label', 'ATS Score: 88 out of 100');
    });
  });

  describe('Custom className', () => {
    it('applies custom className', () => {
      const { container } = render(<ATSScoreCircle score={75} className="custom-class" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });
  });
});
