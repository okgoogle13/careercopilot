import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../../test-utils';
import { CareerGrowthHub } from './CareerGrowthHub';
import { TabContext } from '@mui/lab';
import React from 'react';

describe('CareerGrowthHub', () => {
  const mockOnNavigate = jest.fn();
  const mockOnBack = jest.fn();

  const defaultProps = {
    onNavigate: mockOnNavigate,
    onBack: mockOnBack,
    userGoals: [],
    userSkills: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithTabContext = (ui: React.ReactElement, value: string) => {
    return render(
      <TabContext.Provider value={value}>
        {ui}
      </TabContext.Provider>
    );
  };

  it('renders the component with all main sections', async () => {
    render(<CareerGrowthHub {...defaultProps} />);
    
    expect(screen.getByText('Career Growth Hub')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back to Dashboard/i })).toBeInTheDocument();
    
    const aiToolsTab = screen.getByRole('tab', { name: /AI Tools/i });
    fireEvent.click(aiToolsTab);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /AI Job Matching/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Career Intelligence/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Interview Preparation/i })).toBeInTheDocument();
    });
  });

  it('navigates between tabs correctly', async () => {
    let value = 'overview';
    const { rerender } = renderWithTabContext(<CareerGrowthHub {...defaultProps} />, value);
    
    const goalsTab = screen.getByRole('tab', { name: /Goals/i });
    fireEvent.click(goalsTab);
    value = 'goals';
    rerender(
      <TabContext.Provider value={value}>
        <CareerGrowthHub {...defaultProps} />
      </TabContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('tabs-content-goals')).toBeVisible();
    });

    const skillsTab = screen.getByRole('tab', { name: /Skills/i });
    fireEvent.click(skillsTab);
    value = 'skills';
    rerender(
      <TabContext.Provider value={value}>
        <CareerGrowthHub {...defaultProps} />
      </TabContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('tabs-content-skills')).toBeVisible();
    });
  });

  it('calls onNavigate with correct feature when feature cards are clicked', async () => {
    let value = 'ai-tools';
    const { rerender } = renderWithTabContext(<CareerGrowthHub {...defaultProps} />, value);
    
    const aiToolsTab = screen.getByRole('tab', { name: /AI Tools/i });
    fireEvent.click(aiToolsTab);
    rerender(
      <TabContext.Provider value={value}>
        <CareerGrowthHub {...defaultProps} />
      </TabContext.Provider>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByRole('heading', { name: /AI Job Matching/i }));
    });
    expect(mockOnNavigate).toHaveBeenCalledWith('job-matching');
    
    await waitFor(() => {
      fireEvent.click(screen.getByRole('heading', { name: /Career Intelligence/i }));
    });
    expect(mockOnNavigate).toHaveBeenCalledWith('career-intelligence');
    
    await waitFor(() => {
      fireEvent.click(screen.getByRole('heading', { name: /Interview Preparation/i }));
    });
    expect(mockOnNavigate).toHaveBeenCalledWith('interview-prep');
  });

  it('calls onBack when back button is clicked', () => {
    render(<CareerGrowthHub {...defaultProps} />);
    
    const backButton = screen.getByRole('button', { name: /Back to Dashboard/i });
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('displays the correct number of goals and skills when provided', () => {
    const props = {
      ...defaultProps,
      userGoals: [
        { id: '1', title: 'Goal 1', description: '...', category: 'skill' as const, progress: 50, targetDate: '2025-12-31', status: 'active', milestones: [] },
      ],
      userSkills: [
        { id: '1', name: 'Skill 1', category: 'technical' as const, currentLevel: 2, targetLevel: 4, demandScore: 80, trending: true, resources: [] },
        { id: '2', name: 'Skill 2', category: 'soft' as const, currentLevel: 3, targetLevel: 5, demandScore: 60, trending: false, resources: [] },
      ],
    };
    render(<CareerGrowthHub {...props} />);
    
    const goalsTab = screen.getByRole('tab', { name: /Goals/i });
    expect(goalsTab.textContent).toBe('Goals (1)');
    
    const skillsTab = screen.getByRole('tab', { name: /Skills/i });
    expect(skillsTab.textContent).toBe('Skills (2)');
  });

  it('displays a message when there are no goals or skills', () => {
    render(<CareerGrowthHub {...defaultProps} />);
    
    const goalsTab = screen.getByRole('tab', { name: /Goals/i });
    expect(goalsTab.textContent).toBe('Goals (0)');
    
    const skillsTab = screen.getByRole('tab', { name: /Skills/i });
    expect(skillsTab.textContent).toBe('Skills (0)');
  });
});