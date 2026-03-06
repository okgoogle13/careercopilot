import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock lucide-react first
(jest as any).unstable_mockModule('lucide-react', () => ({
  Search: () => <div data-testid="search-icon" />,
  MapPin: () => <div data-testid="map-pin-icon" />,
  Briefcase: () => <div data-testid="briefcase-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  Building: () => <div data-testid="building-icon" />,
  Globe: () => <div data-testid="globe-icon" />,
  Save: () => <div data-testid="save-icon" />,
  Share2: () => <div data-testid="share2-icon" />,
  Loader2: () => <div data-testid="loader2-icon" />,
}));

// Mock components
(jest as any).unstable_mockModule('@/components/shared/JobCard', () => ({
  JobCard: ({ title, onApply }: any) => (
    <div data-testid="job-card">
      <h3>{title}</h3>
      <button onClick={onApply}>Apply</button>
    </div>
  ),
}));

(jest as any).unstable_mockModule('@/components/ui/Lens', () => ({
  Lens: ({ value, onChange, placeholder, className }: any) => (
    <input
      data-testid="lens-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  ),
}));

(jest as any).unstable_mockModule('@/components/ui/Pebble', () => ({
  Pebble: ({ children, onClick, disabled }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid="pebble-button"
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

    const input = screen.getByTestId('lens-input');
    fireEvent.change(input, { target: { value: 'Senior' } });

    const jobCards = screen.getAllByTestId('job-card');
    expect(jobCards.length).toBe(1);
    expect(screen.getByText('Senior Frontend Developer')).toBeInTheDocument();
  });

  it('shows no jobs found message for non-matching query', () => {
    render(<JobSearch />);

    const input = screen.getByTestId('lens-input');
    fireEvent.change(input, { target: { value: 'Zookeeper' } });

    expect(screen.getByText('No jobs found')).toBeInTheDocument();
    expect(screen.queryAllByTestId('job-card').length).toBe(0);
  });

  it('clears search when "Clear Search" is clicked', () => {
    render(<JobSearch />);

    const input = screen.getByTestId('lens-input');
    fireEvent.change(input, { target: { value: 'Zookeeper' } });

    const clearButton = screen.getByText('Clear Search');
    fireEvent.click(clearButton);

    expect(screen.queryByText('No jobs found')).not.toBeInTheDocument();
  });
});
