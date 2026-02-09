import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KanbanCard } from '../KanbanCard';
import React from 'react';

describe('KanbanCard', () => {
  const props = {
    id: 'K-001',
    title: 'Archive Audit',
    description: 'Perform a deep audit of the archives.',
    status: 'In Progress',
    priority: 'high' as const
  };

  it('renders task details correctly', () => {
    render(<KanbanCard {...props} />);
    expect(screen.getByText('Archive Audit')).toBeDefined();
    expect(screen.getByText(/Perform a deep audit/)).toBeDefined();
    expect(screen.getByText('ID: K-001')).toBeDefined();
    expect(screen.getByText('high')).toBeDefined();
  });
});
