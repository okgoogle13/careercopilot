import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CareerGrowthHub } from './CareerGrowthHub';
import { MemoryRouter } from 'react-router-dom';

const mockOnNavigate = jest.fn();
const mockOnBack = jest.fn();

const renderComponent = (props = {}) => {
  return render(
    <MemoryRouter>
      <CareerGrowthHub
        goals={[]}
        skills={[]}
        onNavigate={mockOnNavigate}
        onBack={mockOnBack}
        {...props}
      />
    </MemoryRouter>
  );
};

describe('CareerGrowthHub', () => {
  it('renders the component with all main sections', async () => {
    renderComponent();
    expect(screen.getByText('Career Growth Hub')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Overview/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Goals/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Skills/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /AI Tools/i })).toBeInTheDocument();

    const aiToolsTab = screen.getByRole('tab', { name: /AI Tools/i });
    fireEvent.click(aiToolsTab);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /AI Job Matching/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Career Intelligence/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Interview Preparation/i })).toBeInTheDocument();
    });
  });

  it('navigates between tabs correctly', () => {
    renderComponent();

    const goalsTab = screen.getByRole('tab', { name: /Goals/i });
    fireEvent.click(goalsTab);
    expect(screen.getByTestId('tabs-content-goals')).toBeVisible();

    const skillsTab = screen.getByRole('tab', { name: /Skills/i });
    fireEvent.click(skillsTab);
    expect(screen.getByTestId('tabs-content-skills')).toBeVisible();
  });

  it('calls onNavigate with correct feature when feature cards are clicked', async () => {
    renderComponent();
    const aiToolsTab = screen.getByRole('tab', { name: /AI Tools/i });
    fireEvent.click(aiToolsTab);

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
    renderComponent();
    fireEvent.click(screen.getByText('Back to Dashboard'));
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('displays the correct number of goals and skills when provided', () => {
    const goals = [{ id: '1', title: 'Master React Advanced Patterns', description: 'Deep dive into advanced React patterns and state management', category: 'skill', progress: 65, targetDate: '2025-03-01', status: 'active', milestones: [] }];
    const skills = [{ id: '1', name: 'React.js', category: 'technical', currentLevel: 8, targetLevel: 10, demandScore: 95, trending: true, resources: [] }];
    renderComponent({ goals, skills });
    const goalsTab = screen.getByRole('tab', { name: /Goals/i });
    fireEvent.click(goalsTab);
    expect(screen.getByText('Master React Advanced Patterns')).toBeInTheDocument();

    const skillsTab = screen.getByRole('tab', { name: /Skills/i });
    fireEvent.click(skillsTab);
    expect(screen.getByText('React.js')).toBeInTheDocument();
  });

  it('displays a message when there are no goals or skills', () => {
    renderComponent({ goals: [], skills: [] });
    const goalsTab = screen.getByRole('tab', { name: /Goals/i });
    fireEvent.click(goalsTab);
    expect(screen.getByText('No goals set yet.')).toBeInTheDocument();

    const skillsTab = screen.getByRole('tab', { name: /Skills/i });
    fireEvent.click(skillsTab);
    expect(screen.getByText('No skills to display.')).toBeInTheDocument();
  });
});