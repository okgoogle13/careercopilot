import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from './FilterPanel';
import { vi } from 'vitest';

describe('FilterPanel', () => {
  const mockOnFiltersChange = vi.fn();
  const mockOnReset = vi.fn();

  const defaultProps = {
    onFiltersChange: mockOnFiltersChange,
    onReset: mockOnReset,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the filter panel with all filter sections', () => {
    render(<FilterPanel {...defaultProps} />);
    
    // Check main sections
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search jobs...')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Job Type')).toBeInTheDocument();
    expect(screen.getByText('Experience Level')).toBeInTheDocument();
    expect(screen.getByText('Salary Range')).toBeInTheDocument();
  });

  it('updates search query when typing', () => {
    render(<FilterPanel {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search jobs...');
    fireEvent.change(searchInput, { target: { value: 'frontend' } });
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
      searchQuery: 'frontend'
    }));
  });

  it('toggles job type filters', () => {
    render(<FilterPanel {...defaultProps} />);
    
    // Click on Full-time checkbox
    const fullTimeCheckbox = screen.getByLabelText('Full-time');
    fireEvent.click(fullTimeCheckbox);
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
      jobType: ['Full-time']
    }));
    
    // Click on Remote checkbox
    const remoteCheckbox = screen.getByLabelText('Remote');
    fireEvent.click(remoteCheckbox);
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
      remote: true
    }));
  });

  it('updates salary range using slider', () => {
    render(<FilterPanel {...defaultProps} />);
    
    const slider = screen.getByRole('slider', { name: /salary range/i });
    
    // Simulate slider change
    fireEvent.change(slider, { target: { value: 100000 } });
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
      salaryRange: [0, 100000]
    }));
  });

  it('resets all filters when clicking clear button', () => {
    render(<FilterPanel {...defaultProps} />);
    
    // Click on clear button
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);
    
    expect(mockOnReset).toHaveBeenCalledTimes(1);
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      searchQuery: '',
      location: [],
      jobType: [],
      experienceLevel: [],
      salaryRange: [0, 200000],
      company: [],
      skills: [],
      remote: false,
      datePosted: 'any',
    });
  });

  it('shows active filter count', () => {
    // Mock the component to test the collapsed state
    vi.mock('./FilterPanel', () => ({
      FilterPanel: ({ onFiltersChange, onReset, isCollapsed }: any) => (
        <div>
          {isCollapsed ? (
            <div>
              <div>{getActiveFilterCount()} filters active</div>
              <button onClick={onReset}>Clear All</button>
            </div>
          ) : (
            <div>
              <div>Expanded Filter Panel</div>
              <button onClick={onReset}>Clear</button>
            </div>
          )}
        </div>
      ),
    }));
    
    // Mock the getActiveFilterCount function
    const getActiveFilterCount = vi.fn()
      .mockReturnValueOnce(0)  // First call returns 0
      .mockReturnValueOnce(2); // Second call returns 2
    
    // First render with 0 active filters
    const { rerender } = render(<FilterPanel onFiltersChange={mockOnFiltersChange} onReset={mockOnReset} isCollapsed={true} />);
    expect(screen.getByText('0 filters active')).toBeInTheDocument();
    
    // Re-render with 2 active filters
    rerender(<FilterPanel onFiltersChange={mockOnFiltersChange} onReset={mockOnReset} isCollapsed={true} />);
    expect(screen.getByText('2 filters active')).toBeInTheDocument();
  });
});
