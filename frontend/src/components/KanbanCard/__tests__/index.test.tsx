import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// Mock framer-motion
(jest as any).unstable_mockModule('framer-motion', () => ({
  motion: {
    div: ({
      children,
      onClick,
      onDragStart,
      className,
      role,
      'aria-label': ariaLabel,
      ...props
    }: any) => (
      <div
        onClick={onClick}
        onDragStart={onDragStart}
        className={className}
        role={role}
        aria-label={ariaLabel}
        data-testid="motion-div"
        {...props}
      >
        {children}
      </div>
    ),
  },
}));

const { KanbanCard } = await import('../index');

describe('KanbanCard', () => {
  const onSelect = jest.fn();
  const onDragStart = jest.fn();

  const defaultProps = {
    id: 'TSK-001',
    title: 'Prototype Interface',
    description: 'Design the high-fidelity dashboard for the Kerala Solidarity system.',
    status: 'In Progress',
    priority: 'high' as const,
    dueDate: '2026-03-24',
    onSelect,
    onDragStart,
  };

  it('renders correctly with all props', () => {
    render(<KanbanCard {...defaultProps} />);

    expect(screen.getByText('ID: TSK-001')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Prototype Interface')).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('Due: 2026-03-24')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    render(<KanbanCard {...defaultProps} />);
    fireEvent.click(screen.getByTestId('motion-div'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('applies correct priority colors', () => {
    const { rerender } = render(
      <KanbanCard
        {...defaultProps}
        priority="high"
      />
    );
    expect(screen.getByText('high')).toHaveClass('text-solidarity-red');

    rerender(
      <KanbanCard
        {...defaultProps}
        priority="medium"
      />
    );
    expect(screen.getByText('medium')).toHaveClass('text-ink-gold');

    rerender(
      <KanbanCard
        {...defaultProps}
        priority="low"
      />
    );
    expect(screen.getByText('low')).toHaveClass('text-smoke-green');
  });

  it('does not render due date if not provided', () => {
    render(
      <KanbanCard
        {...defaultProps}
        dueDate={undefined}
      />
    );
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<KanbanCard {...defaultProps} />);
    const card = screen.getByRole('listitem');
    expect(card).toHaveAttribute('aria-label', 'Kanban Task: Prototype Interface');
  });
});
