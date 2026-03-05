import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { JobList, type JobOpportunity } from '../index';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className, ...props }: any) => (
      <div
        onClick={onClick}
        className={className}
        data-testid="motion-div"
        {...props}
      >
        {children}
      </div>
    ),
  },
}));

const mockJobs: JobOpportunity[] = [
  {
    id: '1',
    title: 'Software Engineer',
    location: 'Remote',
    salary: '$120k - $150k',
    tags: ['React', 'TypeScript', 'Node.js'],
  },
  {
    id: '2',
    title: 'Product Manager',
    location: 'New York, NY',
    salary: '$130k - $160k',
    tags: ['Agile', 'Roadmapping'],
  },
];

describe('JobList', () => {
  const onJobSelect = jest.fn();

  beforeEach(() => {
    onJobSelect.mockClear();
  });

  it('renders the header correctly', () => {
    render(
      <JobList
        jobs={[]}
        onJobSelect={onJobSelect}
      />
    );
    expect(screen.getByText('THE LOOKOUT')).toBeInTheDocument();
  });

  it('renders a list of jobs when not loading', () => {
    render(
      <JobList
        jobs={mockJobs}
        onJobSelect={onJobSelect}
      />
    );

    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
    expect(screen.getByText('$120k - $150k')).toBeInTheDocument();
    expect(screen.getByText('Remote')).toBeInTheDocument();
  });

  it('calls onJobSelect when a job item is clicked', () => {
    render(
      <JobList
        jobs={mockJobs}
        onJobSelect={onJobSelect}
      />
    );

    const jobItem = screen.getByLabelText('Job: Software Engineer at Remote');
    fireEvent.click(jobItem);

    expect(onJobSelect).toHaveBeenCalledWith('1');
  });

  it('renders skeleton loaders when isLoading is true', () => {
    const { container } = render(
      <JobList
        jobs={[]}
        onJobSelect={onJobSelect}
        isLoading={true}
      />
    );
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons).toHaveLength(3);
  });

  it('renders empty state message when there are no jobs and not loading', () => {
    render(
      <JobList
        jobs={[]}
        onJobSelect={onJobSelect}
      />
    );
    expect(screen.getByText('NO OPPORTUNITIES FOUND IN THIS SECTOR')).toBeInTheDocument();
  });

  it('renders tags correctly for each job', () => {
    render(
      <JobList
        jobs={mockJobs}
        onJobSelect={onJobSelect}
      />
    );
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Agile')).toBeInTheDocument();
  });
});
