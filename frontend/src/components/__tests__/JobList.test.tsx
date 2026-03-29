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

  it('renders nothing when no jobs are provided', () => {
    const { container } = render(
      <JobList
        jobs={[]}
        onJobSelect={jest.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('calls onJobSelect with the clicked job id', () => {
    const onJobSelect = jest.fn();

    render(
      <JobList
        jobs={jobs}
        onJobSelect={onJobSelect}
      />
    );

    fireEvent.click(screen.getByText('Lead Engineer').closest('li')!);

    expect(onJobSelect).toHaveBeenCalledWith('1');
  });

  it('shows loading text while loading', () => {
    render(
      <JobList
        jobs={[]}
        onJobSelect={jest.fn()}
        isLoading={true}
      />
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
