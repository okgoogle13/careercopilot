import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardPage } from '../DashboardPage';

// Mock AuthContext to avoid import.meta issues in axiosConfig
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User' },
    isAuthenticated: true,
  }),
}));

// Mock framer-motion to avoid animation issues in jsdom
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

describe('DashboardPage', () => {
  const mockOnCreateProfile = jest.fn();
  const mockOnViewAnalytics = jest.fn();
  const mockOnNavigateToOpportunities = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Empty State', () => {
    it('renders empty state when isEmpty is true', () => {
      render(
        <DashboardPage
          isEmpty={true}
          onCreateProfile={mockOnCreateProfile}
        />
      );

      expect(screen.getByText(/Ready to Launch Your Career\?/i)).toBeInTheDocument();
      // "Create Your First Document" button
      const createButtons = screen.getAllByRole('button', { name: /Create Your First Document/i });
      expect(createButtons.length).toBeGreaterThan(0);
    });

    it('calls onCreateProfile when create button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <DashboardPage
          isEmpty={true}
          onCreateProfile={mockOnCreateProfile}
        />
      );

      const createButton = screen.getAllByRole('button', { name: /Create Your First Document/i })[0];
      await user.click(createButton);

      expect(mockOnCreateProfile).toHaveBeenCalledTimes(1);
    });
  });

  describe('Dashboard with Content', () => {
    it('renders the welcome banner and stats', () => {
      render(
        <DashboardPage
          onCreateProfile={mockOnCreateProfile}
          onViewAnalytics={mockOnViewAnalytics}
          onNavigateToOpportunities={mockOnNavigateToOpportunities}
        />
      );

      // Welcome Banner (checking for uppercase name logic in component)
      // Component logic: userName.toUpperCase() -> "TEST USER"
      expect(screen.getByText(/GOOD MORNING/i)).toBeInTheDocument();
      expect(screen.getByText(/TEST/i)).toBeInTheDocument();

      // Stats
      // 8 + 5 = 13 active applications
      expect(screen.getByText('13')).toBeInTheDocument();
      expect(screen.getAllByText(/Active Applications/i).length).toBeGreaterThan(0);

      // Other stats
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getAllByText(/Offers Received/i).length).toBeGreaterThan(0);

      expect(screen.getByText('45')).toBeInTheDocument();
      expect(screen.getAllByText(/Connections/i).length).toBeGreaterThan(0);
    });

    it('displays quick actions', () => {
      render(
        <DashboardPage
          onCreateProfile={mockOnCreateProfile}
          onViewAnalytics={mockOnViewAnalytics}
          onNavigateToOpportunities={mockOnNavigateToOpportunities}
        />
      );

      expect(screen.getByRole('button', { name: /Create New Document/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /View Analytics/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /BROWSE JOBS/i })).toBeInTheDocument();
    });

    it('displays application profiles as Job Cards', () => {
      render(<DashboardPage />);

      // Profiles mock data: "Nishant Dougall" (role: "Community Support Worker")
      // "Senior Developer" (role: "React & TypeScript")
      expect(screen.getByText(/Nishant Dougall/i)).toBeInTheDocument();
      expect(screen.getByText(/Community Support Worker/i)).toBeInTheDocument();

      expect(screen.getByText(/Senior Developer/i)).toBeInTheDocument();
      expect(screen.getByText(/React & TypeScript/i)).toBeInTheDocument();

      // Check for "Create New Profile" brick
      expect(screen.getByText(/Create New Profile/i)).toBeInTheDocument();
    });
  });
});
