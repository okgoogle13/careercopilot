import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

(jest as any).unstable_mockModule('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const { KanbanCard } = (await import('../KanbanCard')) as any;

describe('KanbanCard', () => {
  const createProps = () => ({
    id: 'K-001',
    title: 'Archive Audit',
    description: 'Perform a deep audit of the archives.',
    status: 'In Progress',
    priority: 'high' as const,
    onDragStart: jest.fn(),
    onSelect: jest.fn(),
    dueDate: '2026-03-10',
  });

  it('renders task details correctly', () => {
    const props = createProps();

    render(<KanbanCard {...props} />);
    expect(screen.getByText('Archive Audit')).toBeDefined();
    expect(screen.getByText(/Perform a deep audit/)).toBeDefined();
    expect(screen.getByText('In Progress')).toBeDefined();
    expect(screen.getByText('2026-03-10')).toBeDefined();
  });

  it('triggers the click callback', () => {
    const props = createProps();

    render(<KanbanCard {...props} />);

    const card = document.querySelector('[draggable]') as HTMLElement;
    fireEvent.click(card);

    expect(props.onSelect).toHaveBeenCalledTimes(1);
  });
});
