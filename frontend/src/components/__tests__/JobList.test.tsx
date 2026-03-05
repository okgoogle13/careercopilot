import { fireEvent, render, screen } from '@testing-library/react';
import { JobList } from '../JobList';
import React from 'react';

describe('JobList', () => {
  const jobs = [
    {
      id: '1',
      title: 'Lead Engineer',
      location: 'Melbourne',
      salary: '$160k',
      tags: ['React', 'Solidarity'],
    },
    { id: '2', title: 'Auditor', location: 'Sydney', salary: '$140k', tags: ['Compliance'] },
  ];

  it('renders the list of jobs', () => {
    render(
      <JobList
        jobs={jobs}
        onJobSelect={jest.fn()}
      />
    );
    expect(screen.getByText('Lead Engineer')).toBeDefined();
    expect(screen.getByText('Auditor')).toBeDefined();
    expect(screen.getByText('Melbourne')).toBeDefined();
    expect(screen.getByText('Sydney')).toBeDefined();
  });

  it('shows empty state when no jobs are provided', () => {
    render(
      <JobList
        jobs={[]}
        onJobSelect={jest.fn()}
      />
    );
    expect(screen.getByText(/NO OPPORTUNITIES FOUND/i)).toBeDefined();
  });

  it('calls onJobSelect with the clicked job id', () => {
    const onJobSelect = jest.fn();

    render(
      <JobList
        jobs={jobs}
        onJobSelect={onJobSelect}
      />
    );

    fireEvent.click(screen.getByLabelText('Job: Lead Engineer at Melbourne'));

    expect(onJobSelect).toHaveBeenCalledWith('1');
  });

  it('renders three skeleton cards while loading', () => {
    const { container } = render(
      <JobList
        jobs={[]}
        onJobSelect={jest.fn()}
        isLoading={true}
      />
    );

    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(3);
    expect(screen.queryByText(/NO OPPORTUNITIES FOUND/i)).not.toBeInTheDocument();
  });
});
