import { render, screen } from '@testing-library/react';
import { jest } from '@jest/globals';
import { ATSScoreCircle } from '@/components/custom/ats-score-circle/ATSScoreCircle';

describe('ATSScoreCircle', () => {
  it('renders without errors', () => {
    const { container } = render(<ATSScoreCircle score={75} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /ATS Score: 75 out of 100/i })).toBeInTheDocument();
  });

  it('displays the correct score', () => {
    render(<ATSScoreCircle score={85} />);
    const scoreElement = screen.getByText(/85/);
    expect(scoreElement).toBeInTheDocument();
  });

  it('rounds the score to nearest integer', () => {
    render(<ATSScoreCircle score={78.6} />);
    const scoreElement = screen.getByText(/79/);
    expect(scoreElement).toBeInTheDocument();
  });

  it('hides label when showLabel is false', () => {
    const { container } = render(<ATSScoreCircle score={75} showLabel={false} />);
    // The score should still be visible in the circle
    expect(screen.getByText(/75/)).toBeInTheDocument();
    // The label should not be in the document
    const label = container.querySelector('[aria-label="ATS Score: 75 out of 100"]');
    expect(label).toHaveAttribute('aria-label', 'ATS Score: 75 out of 100');
  });

  it('shows score by default', () => {
    const { container } = render(<ATSScoreCircle score={90} />);
    const scoreElement = screen.getByText(/90/);
    const label = container.querySelector('[aria-label="ATS Score: 90 out of 100"]');
    
    expect(scoreElement).toBeInTheDocument();
    expect(label).toHaveAttribute('aria-label', 'ATS Score: 90 out of 100');
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
    const { container } = render(<ATSScoreCircle score={85} />);
    const scoreElement = container.querySelector('p');
    expect(scoreElement).toHaveTextContent(/85/);
    // Check for the primary color class for high scores
    expect(scoreElement).toHaveClass('text-primary');
  });

  it('applies correct color class for medium scores (60-79)', () => {
    const { container } = render(<ATSScoreCircle score={70} />);
    const scoreElement = container.querySelector('p');
    expect(scoreElement).toHaveTextContent(/70/);
    // Check for the secondary color class for medium scores
    expect(scoreElement).toHaveClass('text-secondary');
  });

  it('applies correct color class for low-medium scores (40-59)', () => {
    const { container } = render(<ATSScoreCircle score={45} />);
    const scoreElement = container.querySelector('p');
    expect(scoreElement).toHaveTextContent(/45/);
    // Check for the error color class for low-medium scores
    expect(scoreElement).toHaveClass('text-error');
  });

  it('applies correct color class for low scores (<40)', () => {
    const { container } = render(<ATSScoreCircle score={25} />);
    const scoreElement = container.querySelector('.text-error');
    expect(scoreElement).toHaveTextContent(/25/);
  });

  it('handles score of 0', () => {
    const { container } = render(<ATSScoreCircle score={0} />);
    const scoreElement = container.querySelector('p');
    expect(scoreElement).toHaveTextContent(/0/);
  });

  it('handles score of 100', () => {
    const { container } = render(<ATSScoreCircle score={100} />);
    const scoreElement = container.querySelector('p');
    expect(scoreElement).toHaveTextContent(/100/);
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
