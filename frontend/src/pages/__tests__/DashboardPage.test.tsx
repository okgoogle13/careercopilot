import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardPage } from '../DashboardPage';

describe('DashboardPage', () => {
  const mockOnCreateDocument = jest.fn();
  const mockOnEditProfile = jest.fn();

  beforeEach(() => {
    mockOnCreateDocument.mockClear();
    mockOnEditProfile.mockClear();
  });

  describe('Empty State', () => {
    it('renders empty state when isEmpty is true', () => {
      render(<DashboardPage isEmpty={true} onCreateDocument={mockOnCreateDocument} />);

      expect(screen.getByRole('heading', { name: /Welcome to CareerCopilot/i })).toBeInTheDocument();
      expect(screen.getByText(/Create your first AI-powered resume/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create Your First Document/i })).toBeInTheDocument();
    });

    it('calls onCreateDocument when create button is clicked in empty state', async () => {
      const user = userEvent.setup();
      render(<DashboardPage isEmpty={true} onCreateDocument={mockOnCreateDocument} />);

      const createButton = screen.getByRole('button', { name: /Create Your First Document/i });
      await user.click(createButton);

      expect(mockOnCreateDocument).toHaveBeenCalledTimes(1);
    });

    it('displays supported document types in empty state', () => {
      render(<DashboardPage isEmpty={true} />);

      expect(screen.getByText(/AI Resume/i)).toBeInTheDocument();
      expect(screen.getByText(/Cover Letter/i)).toBeInTheDocument();
      expect(screen.getByText(/Selection Criteria/i)).toBeInTheDocument();
    });
  });

  describe('Dashboard with Content', () => {
    it('renders the dashboard heading and main content', () => {
      render(<DashboardPage />);

      expect(screen.getByRole('heading', { name: /^Dashboard$/i })).toBeInTheDocument();
      expect(screen.getByText(/Manage your profiles and track your job application progress/i)).toBeInTheDocument();
    });

    it('displays statistics cards with correct data', () => {
      render(<DashboardPage />);

      // Active Profiles stat
      expect(screen.getByText(/^3$/)).toBeInTheDocument();
      expect(screen.getByText(/Active Profiles/i)).toBeInTheDocument();

      // Applications stat
      expect(screen.getByText(/^8$/)).toBeInTheDocument();
      expect(screen.getByText(/^Applications$/i)).toBeInTheDocument();

      // ATS Score stat
      expect(screen.getByText(/85%/)).toBeInTheDocument();
      expect(screen.getByText(/Avg ATS Score/i)).toBeInTheDocument();

      // Response Rate stat
      expect(screen.getByText(/12%/)).toBeInTheDocument();
      expect(screen.getByText(/Response Rate/i)).toBeInTheDocument();
    });

    it('displays profile cards with correct information', () => {
      render(<DashboardPage />);

      expect(screen.getByText(/Senior Software Developer/i)).toBeInTheDocument();
      expect(screen.getByText(/Product Manager/i)).toBeInTheDocument();
      expect(screen.getByText(/UX Designer/i)).toBeInTheDocument();
      expect(screen.getByText(/Technology/i)).toBeInTheDocument();
      expect(screen.getByText(/Product/i)).toBeInTheDocument();
      expect(screen.getByText(/Design/i)).toBeInTheDocument();
    });

    it('displays recent activity section', () => {
      render(<DashboardPage />);

      expect(screen.getByRole('heading', { name: /Recent Activity/i })).toBeInTheDocument();
      expect(screen.getByText(/Resume updated/i)).toBeInTheDocument();
      expect(screen.getByText(/Application submitted/i)).toBeInTheDocument();
      expect(screen.getByText(/ATS analysis/i)).toBeInTheDocument();
    });

    it('displays quick actions section', () => {
      render(<DashboardPage />);

      expect(screen.getByRole('heading', { name: /Quick Actions/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create New Document/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Run ATS Analysis/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Find Job Opportunities/i })).toBeInTheDocument();
    });

    it('calls onCreateDocument when create document button is clicked', async () => {
      const user = userEvent.setup();
      render(<DashboardPage onCreateDocument={mockOnCreateDocument} />);

      const createButtons = screen.getAllByRole('button', { name: /Create Document/i });
      await user.click(createButtons[0]);

      expect(mockOnCreateDocument).toHaveBeenCalledTimes(1);
    });

    it('displays Your Profiles section with View Analytics button', () => {
      render(<DashboardPage />);

      expect(screen.getByRole('heading', { name: /Your Profiles/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /View Analytics/i })).toBeInTheDocument();
    });

    it('displays ATS scores for each profile', () => {
      render(<DashboardPage />);

      // Check for multiple instances of "ATS Score" text
      const atsScoreElements = screen.getAllByText(/ATS Score/i);
      expect(atsScoreElements.length).toBeGreaterThan(0);

      // Check for specific score percentages
      expect(screen.getByText(/85%/)).toBeInTheDocument();
      expect(screen.getByText(/92%/)).toBeInTheDocument();
      expect(screen.getByText(/78%/)).toBeInTheDocument();
    });
  });
});
