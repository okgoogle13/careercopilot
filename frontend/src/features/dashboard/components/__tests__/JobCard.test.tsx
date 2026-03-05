import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { JobCard } from '../JobCard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style }: any) => (
      <div
        className={className}
        style={style}
      >
        {children}
      </div>
    ),
    button: ({ children, onClick, className }: any) => (
      <button
        onClick={onClick}
        className={className}
      >
        {children}
      </button>
    ),
  },
}));

describe('JobCard', () => {
  const onApply = jest.fn();
  const defaultProps = {
    id: '1',
    jobTitle: 'Senior React Developer',
    company: 'Tech Corp',
    matchScore: 85,
    status: 'applied' as const,
    onApply,
  };

  it('renders job details correctly', () => {
    render(<JobCard {...defaultProps} />);
    expect(screen.getByText('Senior React Developer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('applied')).toBeInTheDocument();
  });

  it('displays the apply button when status is applied and onApply is provided', () => {
    render(<JobCard {...defaultProps} />);
    const button = screen.getByText('View Application');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onApply).toHaveBeenCalled();
  });

  it('hides apply button for other statuses', () => {
    render(
      <JobCard
        {...defaultProps}
        status="interview"
      />
    );
    expect(screen.queryByText('View Application')).not.toBeInTheDocument();
  });

  it('applies correct match score colors', () => {
    const { rerender } = render(
      <JobCard
        {...defaultProps}
        matchScore={90}
      />
    );
    expect(screen.getByText('90%')).toHaveClass('bg-sage');

    rerender(
      <JobCard
        {...defaultProps}
        matchScore={70}
      />
    );
    expect(screen.getByText('70%')).toHaveClass('bg-ink');

    rerender(
      <JobCard
        {...defaultProps}
        matchScore={50}
      />
    );
    expect(screen.getByText('50%')).toHaveClass('bg-terracotta');
  });

  it('applies correct status pill colors', () => {
    const { rerender } = render(
      <JobCard
        {...defaultProps}
        status="offer"
      />
    );
    expect(screen.getByText('offer')).toHaveClass('bg-sage');

    rerender(
      <JobCard
        {...defaultProps}
        status="interview"
      />
    );
    expect(screen.getByText('interview')).toHaveClass('bg-ink');

    rerender(
      <JobCard
        {...defaultProps}
        status="rejected"
      />
    );
    expect(screen.getByText('rejected')).toHaveClass('bg-terracotta');
  });

  it('renders the deadline when provided', () => {
    const deadline = new Date('2026-03-20');
    render(
      <JobCard
        {...defaultProps}
        deadline={deadline}
      />
    );
    expect(screen.getByText(`Due: ${deadline.toLocaleDateString()}`)).toBeInTheDocument();
  });
});
