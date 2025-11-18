import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../test-utils';
import { FilterPanel } from './FilterPanel';

describe('FilterPanel', () => {
  const mockOnFiltersChange = jest.fn();
  const mockOnReset = jest.fn();

  const defaultProps = {
    onFiltersChange: mockOnFiltersChange,
    onReset: mockOnReset,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the filter panel with all filter sections', () => {
    render(<FilterPanel {...defaultProps} />);
    
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search for jobs, skills, or companies...')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Job Type')).toBeInTheDocument();
    expect(screen.getByText('Experience Level')).toBeInTheDocument();
    expect(screen.getByText('Salary Range')).toBeInTheDocument();
  });

  it('updates search query when typing', () => {
    render(<FilterPanel {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search for jobs, skills, or companies...');
    fireEvent.change(searchInput, { target: { value: 'frontend' } });
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
      searchQuery: 'frontend',
    }));
  });

  it('toggles job type filters', () => {
    render(<FilterPanel {...defaultProps} />);
    
    const fullTimeCheckbox = screen.getByLabelText('Full-time');
    fireEvent.click(fullTimeCheckbox);
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
      jobType: ['Full-time'],
    }));
  });

  it('updates salary range using slider', () => {
    render(<FilterPanel {...defaultProps} />);
    
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: 100000 } });
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith(expect.objectContaining({
      salaryRange: [100000, 200000],
    }));
  });

  it('resets all filters when clicking clear button', () => {
    render(<FilterPanel {...defaultProps} />);
    
    const clearButton = screen.getByRole('button', { name: /Clear all filters/i });
    fireEvent.click(clearButton);
    
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('does not render filter details when collapsed', () => {
    render(<FilterPanel {...defaultProps} isCollapsed={true} />);

    expect(screen.getByText(/filters active/i)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Search for jobs, skills, or companies...')).not.toBeInTheDocument();
  });
});