import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/test-utils';
import { CareerIntelligence } from '@/features/career-intelligence/CareerIntelligence';

describe('CareerIntelligence', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with skill gap analysis', () => {
    render(<CareerIntelligence onBack={mockOnBack} />);
    
    expect(screen.getByText('Career Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Identified Skill Gaps')).toBeInTheDocument();
    expect(screen.getByText('Python Programming')).toBeInTheDocument();
    expect(screen.getByText('Data Analysis')).toBeInTheDocument();
    expect(screen.getByText('Project Management')).toBeInTheDocument();
  });

  it('calls onBack when clicking the back button', () => {
    render(<CareerIntelligence onBack={mockOnBack} />);
    
    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('displays skill details when clicking on a skill', async () => {
    render(<CareerIntelligence onBack={mockOnBack} />);
    
    const skillButton = screen.getByText('Python Programming');
    fireEvent.click(skillButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Essential for data analysis roles/i)).toBeInTheDocument();
    });
  });

  it('generates learning path when clicking generate button', async () => {
    render(<CareerIntelligence onBack={mockOnBack} />);
    
    const generateButton = screen.getByRole('button', { name: /Generate Learning Path/i });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText('AI-Generated Learning Path')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});