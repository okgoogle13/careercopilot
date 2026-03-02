import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JobList } from '../JobList';
import React from 'react';

describe('JobList', () => {
  const jobs = [
    { id: '1', title: 'Lead Engineer', location: 'Melbourne', salary: '$160k', tags: ['React', 'Solidarity'] },
    { id: '2', title: 'Auditor', location: 'Sydney', salary: '$140k', tags: ['Compliance'] }
  ];

  it('renders the list of jobs', () => {
    render(<JobList jobs={jobs} onJobSelect={vi.fn()} />);
    expect(screen.getByText('Lead Engineer')).toBeDefined();
    expect(screen.getByText('Auditor')).toBeDefined();
    expect(screen.getByText('Melbourne')).toBeDefined();
    expect(screen.getByText('Sydney')).toBeDefined();
  });

  it('shows empty state when no jobs are provided', () => {
    render(<JobList jobs={[]} onJobSelect={vi.fn()} />);
    expect(screen.getByText(/NO OPPORTUNITIES FOUND/i)).toBeDefined();
  });
});
