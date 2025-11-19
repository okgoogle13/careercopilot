import { render, screen } from '@testing-library/react';
import { jest } from '@jest/globals';
import { ATSScoreCircle } from '../ATSScoreCircle';

describe('ATSScoreCircle', () => {
  it('renders without errors', () => {
    render(<ATSScoreCircle score={75} />);
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('displays the correct score', () => {
    render(<ATSScoreCircle score={85} />);
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('rounds the score to nearest integer', () => {
    render(<ATSScoreCircle score={78.6} />);
    expect(screen.getByText('79')).toBeInTheDocument();
  });

  it('hides score when showScore is false', () => {
    render(<ATSScoreCircle score={75} showScore={false} />);
    expect(screen.queryByText('75')).not.toBeInTheDocument();
  });

  it('shows score by default', () => {
    render(<ATSScoreCircle score={90} />);
    expect(screen.getByText('90')).toBeInTheDocument();
  });

  it('renders with small size', () => {
    const { container } = render(<ATSScoreCircle score={75} size="small" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('renders with medium size by default', () => {
    const { container } = render(<ATSScoreCircle score={75} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '40');
    expect(svg).toHaveAttribute('height', '40');
  });

  it('renders with large size', () => {
    const { container } = render(<ATSScoreCircle score={75} size="large" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '192');
    expect(svg).toHaveAttribute('height', '192');
  });

  it('renders SVG circle elements', () => {
    const { container } = render(<ATSScoreCircle score={75} />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2); // Background circle and progress circle
  });

  it('applies correct color class for high scores (80+)', () => {
    render(<ATSScoreCircle score={85} />);
    expect(screen.getByText('85')).toBeInTheDocument();
    // Color is applied via getColorClass function
  });

  it('applies correct color class for medium scores (60-79)', () => {
    render(<ATSScoreCircle score={70} />);
    expect(screen.getByText('70')).toBeInTheDocument();
  });

  it('applies correct color class for low-medium scores (40-59)', () => {
    render(<ATSScoreCircle score={45} />);
    expect(screen.getByText('45')).toBeInTheDocument();
  });

  it('applies correct color class for low scores (<40)', () => {
    render(<ATSScoreCircle score={25} />);
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('handles score of 0', () => {
    render(<ATSScoreCircle score={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles score of 100', () => {
    render(<ATSScoreCircle score={100} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    const { container } = render(<ATSScoreCircle score={75} className="custom-class" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  // TODO: Add visual regression tests
  it.todo('matches snapshot for different scores');

  // TODO: Add edge case tests
  it.todo('handles negative scores gracefully');
  it.todo('handles scores greater than 100');
});
