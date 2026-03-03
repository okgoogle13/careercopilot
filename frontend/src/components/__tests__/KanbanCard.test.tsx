import { fireEvent, render, screen } from '@testing-library/react';
import { KanbanCard } from '../KanbanCard';
import React from 'react';

describe('KanbanCard', () => {
  const createProps = () => ({
    id: 'K-001',
    title: 'Archive Audit',
    description: 'Perform a deep audit of the archives.',
    status: 'In Progress',
    priority: 'high' as const,
    onDragStart: jest.fn(),
    onSelect: jest.fn(),
    dueDate: '2026-03-10'
  });

  it('renders task details correctly', () => {
    const props = createProps();

    render(<KanbanCard {...props} />);
    expect(screen.getByText('Archive Audit')).toBeDefined();
    expect(screen.getByText(/Perform a deep audit/)).toBeDefined();
    expect(screen.getByText('ID: K-001')).toBeDefined();
    expect(screen.getByText('high')).toBeDefined();
    expect(screen.getByText('Due: 2026-03-10')).toBeDefined();
  });

  it('triggers the click callback', () => {
    const props = createProps();

    render(<KanbanCard {...props} />);

    const card = screen.getByRole('listitem', { name: /Kanban Task: Archive Audit/i });
    fireEvent.click(card);

    expect(props.onSelect).toHaveBeenCalledTimes(1);
    expect(props.onDragStart).not.toHaveBeenCalled();
  });
});
