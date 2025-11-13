import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CareerGrowthHub } from './CareerGrowthHub';
import { vi } from 'vitest';

describe('CareerGrowthHub', () => {
  const mockOnNavigate = vi.fn();
  const mockOnBack = vi.fn();

  const defaultProps = {
    onNavigate: mockOnNavigate,
    onBack: mockOnBack,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with all sections', () => {
    render(<CareerGrowthHub {...defaultProps} />);
    
    // Check main sections
    expect(screen.getByText('Career Growth Hub')).toBeInTheDocument();
    expect(screen.getByText('AI Job Matching')).toBeInTheDocument();
    expect(screen.getByText('Career Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Interview Preparation')).toBeInTheDocument();
    
    // Check tabs
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Goals (3)')).toBeInTheDocument();
    expect(screen.getByText('Skills (3)')).toBeInTheDocument();
    expect(screen.getByText('AI Tools')).toBeInTheDocument();
  });

  it('navigates between tabs', () => {
    render(<CareerGrowthHub {...defaultProps} />);
    
    // Click on Goals tab
    fireEvent.click(screen.getByText('Goals (3)'));
    expect(screen.getByText('Add New Goal')).toBeInTheDocument();
    
    // Click on Skills tab
    fireEvent.click(screen.getByText('Skills (3)'));
    expect(screen.getByText('Add New Skill')).toBeInTheDocument();
    
    // Click on AI Tools tab
    fireEvent.click(screen.getByText('AI Tools'));
    expect(screen.getByText('AI Job Matching')).toBeInTheDocument();
  });

  it('navigates to AI tools when clicking on feature cards', () => {
    render(<CareerGrowthHub {...defaultProps} />);
    
    // Click on AI Job Matching card
    fireEvent.click(screen.getByText('AI Job Matching'));
    expect(mockOnNavigate).toHaveBeenCalledWith('job-matching');
    
    // Click on Career Intelligence card
    fireEvent.click(screen.getByText('Career Intelligence'));
    expect(mockOnNavigate).toHaveBeenCalledWith('career-intelligence');
    
    // Click on Interview Preparation card
    fireEvent.click(screen.getByText('Interview Preparation'));
    expect(mockOnNavigate).toHaveBeenCalledWith('interview-prep');
  });

  it('calls onBack when clicking the back button', () => {
    render(<CareerGrowthHub {...defaultProps} />);
    
    const backButton = screen.getByRole('button', { name: /back to dashboard/i });
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('displays the correct number of active goals and skills', () => {
    render(<CareerGrowthHub {...defaultProps} />);
    
    // Check active goals count
    expect(screen.getByText('3')).toBeInTheDocument(); // Active goals
    expect(screen.getByText('3')).toBeInTheDocument(); // Skills tracking
  });

  it('shows the add goal form when clicking add goal button', async () => {
    render(<CareerGrowthHub {...defaultProps} />);
    
    // Click on Goals tab
    fireEvent.click(screen.getByText('Goals (3)'));
    
    // Click on Add Goal button
    const addButton = screen.getByRole('button', { name: /add goal/i });
    fireEvent.click(addButton);
    
    // Check if the form is displayed
    await waitFor(() => {
      expect(screen.getByLabelText(/goal title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    });
  });
});
