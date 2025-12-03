import { render, screen } from '@testing-library/react';
import { jest } from '@jest/globals';
import { ATSScoreCircle } from '@/components/custom/ats-score-circle/ATSScoreCircle';

describe('ATSScoreCircle (Library)', () => {
  it('renders without errors', () => {
    render(<ATSScoreCircle score={85} />);
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('displays the score', () => {
    render(<ATSScoreCircle score={92} />);
    expect(screen.getByText('92%')).toBeInTheDocument();
  });

  it('renders SVG circles', () => {
    const { container } = render(<ATSScoreCircle score={75} />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBeGreaterThanOrEqual(2);
  });

  it('hides score when showLabel is false', () => {
    render(<ATSScoreCircle score={80} showLabel={false} />);
    // Score is still shown, only label is hidden
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.queryByText('ATS Score')).not.toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { container: small } = render(<ATSScoreCircle score={75} size="small" />);
    const { container: large } = render(<ATSScoreCircle score={75} size="large" />);

    const smallSvg = small.querySelector('svg');
    const largeSvg = large.querySelector('svg');

    expect(smallSvg?.getAttribute('width')).toBe('80');
    expect(largeSvg?.getAttribute('width')).toBe('192');
  });

  // TODO: Add color tests
  it.todo('applies correct color for different score ranges');

  // TODO: Add edge case tests
  it.todo('handles score of 0');
  it.todo('handles score of 100');
});
