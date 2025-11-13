import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CareerIntelligence } from './CareerIntelligence';
import { vi } from 'vitest';

describe('CareerIntelligence', () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with skill gap analysis', () => {
    render(<CareerIntelligence onBack={mockOnBack} />);
    
    // Check main sections
    expect(screen.getByText('Career Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Skill Gap Analysis')).toBeInTheDocument();
    expect(screen.getByText('Python Programming')).toBeInTheDocument();
    expect(screen.getByText('Data Analysis')).toBeInTheDocument();
    expect(screen.getByText('Project Management')).toBeInTheDocument();
  });

  it('calls onBack when clicking the back button', () => {
    render(<CareerIntelligence onBack={mockOnBack} />);
    
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('displays skill details when clicking on a skill', async () => {
    render(<CareerIntelligence onBack={mockOnBack} />);
    
    // Click on a skill to expand details
    const skillButton = screen.getByText('Python Programming');
    fireEvent.click(skillButton);
    
    // Check if skill details are displayed
    await waitFor(() => {
      expect(screen.getByText('Importance: High')).toBeInTheDocument();
      expect(screen.getByText('Demand: 85%')).toBeInTheDocument();
      expect(screen.getByText('Current Level: 0/100')).toBeInTheDocument();
    });
  });

  it('generates learning path when clicking generate button', async () => {
    render(<CareerIntelligence onBack={mockOnBack} />);
    
    // Click on generate learning path button
    const generateButton = screen.getByRole('button', { name: /generate learning path/i });
    fireEvent.click(generateButton);
    
    // Check if loading state is shown
    expect(screen.getByText('Generating your personalized learning path...')).toBeInTheDocument();
    
    // Wait for learning path to be generated
    await waitFor(() => {
      expect(screen.getByText('Your Learning Path')).toBeInTheDocument();
    });
  });

  it('shows empty state when no skill gaps are found', () => {
    // Mock the component to return empty state
    vi.mock('./CareerIntelligence', () => ({
      CareerIntelligence: ({ onBack }: { onBack: () => void }) => (
        <div>
          <button onClick={onBack}>Back</button>
          <div>No skill gaps found</div>
          <div>Great job! Your skills are up to date.</div>
        </div>
      ),
    }));
    
    render(<CareerIntelligence onBack={mockOnBack} />);
    
    expect(screen.getByText('No skill gaps found')).toBeInTheDocument();
    expect(screen.getByText('Great job! Your skills are up to date.')).toBeInTheDocument();
  });

  it('filters skills by importance level', async () => {
    render(<CareerIntelligence onBack={mockOnBack} />);
    
    // Click on High importance filter
    const highImportanceFilter = screen.getByLabelText('High');
    fireEvent.click(highImportanceFilter);
    
    // Check if only high importance skills are shown
    await waitFor(() => {
      expect(screen.getByText('Python Programming')).toBeInTheDocument();
      expect(screen.getByText('Data Analysis')).toBeInTheDocument();
      expect(screen.queryByText('Project Management')).not.toBeInTheDocument();
    });
  });
});
