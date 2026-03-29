import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock lucide-react — Proxy covers any icon the component imports
(jest as any).unstable_mockModule('lucide-react', () => {
  const cache = new Map<string, any>();
  return new Proxy(
    {},
    {
      get: (_t, prop) => {
        if (typeof prop !== 'string') return undefined;
        if (!cache.has(prop)) {
          const Icon = ({ className }: any) =>
            React.createElement('div', { 'data-testid': `${prop.toLowerCase()}-icon`, className });
          cache.set(prop, Icon);
        }
        return cache.get(prop);
      },
    }
  );
});

// Mock components
(jest as any).unstable_mockModule('@/components/shared/JobCard', () => ({
  JobCard: ({ title, onApply }: any) => (
    <div data-testid="job-card">
      <h3>{title}</h3>
      <button onClick={onApply}>Apply</button>
    </div>
  ),
}));

(jest as any).unstable_mockModule('@/components/ui/ScaffoldInput', () => ({
  ScaffoldInput: ({ value, onChange, placeholder, className }: any) => (
    <input
      data-testid="scaffold-input-mock"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  ),
}));

(jest as any).unstable_mockModule('@/components/ui/Strike', () => ({
  Strike: ({ children, onClick, disabled }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid="strike-button-mock"
    >
      {children}
    </button>
  ),
}));

const { JobSearch } = await import('../JobSearch');

describe('JobSearch', () => {
  it('renders correctly with mock jobs', () => {
    render(<JobSearch />);

    expect(screen.getByText(/Find Your Next/i)).toBeInTheDocument();

    // Check initial job cards
    const jobCards = screen.getAllByTestId('job-card');
    expect(jobCards.length).toBe(4);
  });

  it('filters job listings based on search query', () => {
    render(<JobSearch />);

    const input = screen.getByTestId('scaffold-input-mock');
    fireEvent.change(input, { target: { value: 'Senior' } });

    const jobCards = screen.getAllByTestId('job-card');
    expect(jobCards.length).toBe(1);
    expect(screen.getByText('Senior Frontend Developer')).toBeInTheDocument();
  });

  it('shows no jobs found message for non-matching query', () => {
    render(<JobSearch />);

    const input = screen.getByTestId('scaffold-input-mock');
    fireEvent.change(input, { target: { value: 'Zookeeper' } });

    expect(screen.getByText('No jobs found')).toBeInTheDocument();
    expect(screen.queryAllByTestId('job-card').length).toBe(0);
  });

  it('clears search when "Clear Search" is clicked', () => {
    render(<JobSearch />);

    const input = screen.getByTestId('scaffold-input-mock');
    fireEvent.change(input, { target: { value: 'Zookeeper' } });

    const clearButton = screen.getByText('Clear Search');
    fireEvent.click(clearButton);

    expect(screen.queryByText('No jobs found')).not.toBeInTheDocument();
  });
});
