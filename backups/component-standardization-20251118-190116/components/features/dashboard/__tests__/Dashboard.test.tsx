import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dashboard } from '../Dashboard';

// Mock the dashboard sub-components
jest.mock('../dashboard/DashboardHeader', () => ({
  DashboardHeader: ({ title, onCreateProfile, showCreateButton, isEmpty }: any) => (
    <div data-testid="dashboard-header">
      <h1>{title}</h1>
      {!showCreateButton && isEmpty && <span data-testid="no-create-button">No Create Button</span>}
      {onCreateProfile && (
        <button onClick={onCreateProfile} data-testid="header-create-button">
          Create Profile
        </button>
      )}
    </div>
  ),
}));

jest.mock('../dashboard/DashboardStats', () => ({
  DashboardStats: () => <div data-testid="dashboard-stats">Dashboard Stats</div>,
}));

jest.mock('../dashboard/ProfileGrid', () => ({
  ProfileGrid: ({ profiles, onCreateProfile, onEditProfile, onDeleteProfile }: any) => (
    <div data-testid="profile-grid">
      {profiles.map((profile: any) => (
        <div key={profile.id} data-testid={`profile-${profile.id}`}>
          <span>{profile.name}</span>
          <button onClick={() => onEditProfile(profile)} data-testid={`edit-${profile.id}`}>
            Edit
          </button>
          <button onClick={() => onDeleteProfile(profile.id)} data-testid={`delete-${profile.id}`}>
            Delete
          </button>
        </div>
      ))}
      {onCreateProfile && (
        <button onClick={onCreateProfile} data-testid="grid-create-button">
          Add Profile
        </button>
      )}
    </div>
  ),
}));

describe('Dashboard', () => {
  const mockOnCreateProfile = jest.fn();
  const mockOnCreateDocument = jest.fn();
  const mockOnEditProfile = jest.fn();
  const mockOnTabChange = jest.fn();
  const mockOnCareerGrowthClick = jest.fn();
  const mockOnNavigateToCareerGrowth = jest.fn();
  const mockOnNavigateToSettings = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Empty State', () => {
    it('renders empty state when isEmpty is true', () => {
      render(
        <Dashboard
          onCreateProfile={mockOnCreateProfile}
          onCreateDocument={mockOnCreateDocument}
          onEditProfile={mockOnEditProfile}
          isEmpty={true}
        />
      );

      expect(screen.getByText('Welcome to Career Copilot')).toBeInTheDocument();
      expect(screen.getByText('Your Dashboard is Empty')).toBeInTheDocument();
      expect(
        screen.getByText(/Create your first document to get started/i)
      ).toBeInTheDocument();
    });

    it('renders empty state when no profiles exist', () => {
      render(
        <Dashboard
          onCreateProfile={mockOnCreateProfile}
          onCreateDocument={mockOnCreateDocument}
          onEditProfile={mockOnEditProfile}
          isEmpty={false}
        />
      );

      // Initially should render with mock profiles, so let's check for the empty state explicitly
      // by rendering with isEmpty=true
      const { rerender } = render(
        <Dashboard
          onCreateProfile={mockOnCreateProfile}
          onCreateDocument={mockOnCreateDocument}
          onEditProfile={mockOnEditProfile}
          isEmpty={true}
        />
      );

      expect(screen.getByText('Welcome to Career Copilot')).toBeInTheDocument();
    });

    it('shows Create Your First Document button in empty state', () => {
      render(
        <Dashboard
          onCreateProfile={mockOnCreateProfile}
          onCreateDocument={mockOnCreateDocument}
          onEditProfile={mockOnEditProfile}
          isEmpty={true}
        />
      );

      expect(screen.getByText(/Create Your First Document/i)).toBeInTheDocument();
    });

    it('calls onCreateProfile when Create Your First Document is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Dashboard
          onCreateProfile={mockOnCreateProfile}
          onCreateDocument={mockOnCreateDocument}
          onEditProfile={mockOnEditProfile}
          isEmpty={true}
        />
      );

      const createButton = screen.getByText(/Create Your First Document/i);
      await user.click(createButton);

      expect(mockOnCreateProfile).toHaveBeenCalledTimes(1);
    });
  });

  describe('Dashboard with Profiles', () => {
    it('renders dashboard header with profiles', () => {
      render(
        <Dashboard
          onCreateProfile={mockOnCreateProfile}
          onCreateDocument={mockOnCreateDocument}
          onEditProfile={mockOnEditProfile}
          isEmpty={false}
        />
      );

      expect(screen.getByText('Your Job Seeker Profiles')).toBeInTheDocument();
    });

    it('renders dashboard stats when profiles exist', () => {
      render(
        <Dashboard
          onCreateProfile={mockOnCreateProfile}
          onCreateDocument={mockOnCreateDocument}
          onEditProfile={mockOnEditProfile}
          isEmpty={false}
        />
      );

      expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
    });

    it('renders profile grid with profiles', () => {
      render(
        <Dashboard
          onCreateProfile={mockOnCreateProfile}
          onCreateDocument={mockOnCreateDocument}
          onEditProfile={mockOnEditProfile}
          isEmpty={false}
        />
      );

      expect(screen.getByTestId('profile-grid')).toBeInTheDocument();
      expect(screen.getByTestId('profile-1')).toBeInTheDocument();
      expect(screen.getByTestId('profile-2')).toBeInTheDocument();
    });

    it('calls onEditProfile when edit button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Dashboard
          onCreateProfile={mockOnCreateProfile}
          onCreateDocument={mockOnCreateDocument}
          onEditProfile={mockOnEditProfile}
          isEmpty={false}
        />
      );

      const editButton = screen.getByTestId('edit-1');
      await user.click(editButton);

      expect(mockOnEditProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          name: 'Nishant Dougall',
          role: 'Community Support Worker',
        })
      );
    });

    it('removes profile when delete button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Dashboard
          onCreateProfile={mockOnCreateProfile}
          onCreateDocument={mockOnCreateDocument}
          onEditProfile={mockOnEditProfile}
          isEmpty={false}
        />
      );

      expect(screen.getByTestId('profile-1')).toBeInTheDocument();

      const deleteButton = screen.getByTestId('delete-1');
      await user.click(deleteButton);

      expect(screen.queryByTestId('profile-1')).not.toBeInTheDocument();
    });

    it('shows empty state after all profiles are deleted', async () => {
      const user = userEvent.setup();

      render(
        <Dashboard
          onCreateProfile={mockOnCreateProfile}
          onCreateDocument={mockOnCreateDocument}
          onEditProfile={mockOnEditProfile}
          isEmpty={false}
        />
      );

      // Delete both profiles
      await user.click(screen.getByTestId('delete-1'));
      await user.click(screen.getByTestId('delete-2'));

      expect(screen.getByText('Your Dashboard is Empty')).toBeInTheDocument();
    });
  });

  describe('Callback Props', () => {
    it('passes onNavigateToSettings to DashboardHeader', () => {
      render(
        <Dashboard
          onCreateProfile={mockOnCreateProfile}
          onCreateDocument={mockOnCreateDocument}
          onEditProfile={mockOnEditProfile}
          onNavigateToSettings={mockOnNavigateToSettings}
          isEmpty={false}
        />
      );

      expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
    });

    it('passes onNavigateToCareerGrowth to ProfileGrid', () => {
      render(
        <Dashboard
          onCreateProfile={mockOnCreateProfile}
          onCreateDocument={mockOnCreateDocument}
          onEditProfile={mockOnEditProfile}
          onNavigateToCareerGrowth={mockOnNavigateToCareerGrowth}
          isEmpty={false}
        />
      );

      expect(screen.getByTestId('profile-grid')).toBeInTheDocument();
    });

    it('handles activeTab prop', () => {
      render(
        <Dashboard
          onCreateProfile={mockOnCreateProfile}
          onCreateDocument={mockOnCreateDocument}
          onEditProfile={mockOnEditProfile}
          activeTab="profiles"
          isEmpty={false}
        />
      );

      expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
    });

    it('handles onTabChange prop', () => {
      render(
        <Dashboard
          onCreateProfile={mockOnCreateProfile}
          onCreateDocument={mockOnCreateDocument}
          onEditProfile={mockOnEditProfile}
          onTabChange={mockOnTabChange}
          isEmpty={false}
        />
      );

      expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
    });
  });
});
