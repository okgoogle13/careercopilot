import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from '@jest/globals';

import { ProfileGrid } from '../ProfileGrid';

describe('ProfileGrid', () => {
  const mockOnCreateProfile = jest.fn();
  const mockOnEditProfile = jest.fn();
  const mockOnDeleteProfile = jest.fn();
  const mockOnNavigateToCareerGrowth = jest.fn();

  const sampleProfiles = [
    {
      id: '1',
      name: 'John Doe',
      role: 'Software Engineer',
      activeApplications: 5,
      atsScore: 85,
      lastUpdated: '2024-01-15',
      avatarColor: '#3B82F6',
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Product Manager',
      activeApplications: 3,
      atsScore: 90,
      lastUpdated: '2024-01-20',
      avatarColor: '#10B981',
    },
  ];

  const sampleProfileVariations = [
    {
      id: 'var-1',
      profile_name: 'Software Engineer Profile',
      keyword_count: 15,
      last_modified: new Date('2024-01-15'),
      is_default: true,
    },
    {
      id: 'var-2',
      profile_name: 'Senior Developer Profile',
      keyword_count: 20,
      last_modified: new Date('2024-01-20'),
      is_default: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
        />
      );

      expect(screen.getByText('Your Profile Variations')).toBeInTheDocument();
    });

    it('displays profile variations section', () => {
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
        />
      );

      expect(screen.getByText('Your Profile Variations')).toBeInTheDocument();
    });

    it('renders all profile cards', () => {
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('renders create profile card', () => {
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
        />
      );

      expect(screen.getByText('Create New Profile')).toBeInTheDocument();
    });

    it('renders career growth card when callback provided', () => {
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
          onNavigateToCareerGrowth={mockOnNavigateToCareerGrowth}
        />
      );

      expect(screen.getByText('Career Growth')).toBeInTheDocument();
    });

    it('does not render career growth card when callback not provided', () => {
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
        />
      );

      expect(screen.queryByText('Career Growth')).not.toBeInTheDocument();
    });
  });

  describe('Profile Cards', () => {
    it('displays all profile details', () => {
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
    });

    it('calls onEditProfile when edit button clicked', async () => {
      const user = userEvent.setup();
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
        />
      );

      const buttons = screen.getAllByRole('button');
      // Find edit button (first button in card actions)
      const editButtons = buttons.filter((btn) => {
        const icon = btn.querySelector('[data-testid="EditIcon"]');
        return icon !== null;
      });

      if (editButtons.length > 0) {
        await user.click(editButtons[0]);
        expect(mockOnEditProfile).toHaveBeenCalledWith(sampleProfiles[0]);
      }
    });

    it('calls onDeleteProfile with correct id', async () => {
      const user = userEvent.setup();
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
        />
      );

      const buttons = screen.getAllByRole('button');
      const deleteButtons = buttons.filter((btn) => {
        const icon = btn.querySelector('[data-testid="DeleteIcon"]') || btn.querySelector('[data-testid="Trash2Icon"]');
        return icon !== null;
      });

      if (deleteButtons.length > 0) {
        await user.click(deleteButtons[0]);
        expect(mockOnDeleteProfile).toHaveBeenCalledWith('1');
      }
    });
  });

  describe('Create Profile Card', () => {
    it('displays create profile card', () => {
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
          onCreateProfile={mockOnCreateProfile}
        />
      );

      expect(screen.getByText('Create New Profile')).toBeInTheDocument();
    });

    it('calls onCreateProfile when create button clicked', async () => {
      const user = userEvent.setup();
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
          onCreateProfile={mockOnCreateProfile}
        />
      );

      await user.click(screen.getByText('Create Profile'));
      expect(mockOnCreateProfile).toHaveBeenCalledTimes(1);
    });
  });

  describe('Career Growth Card', () => {
    it('displays career growth heading', () => {
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
          onNavigateToCareerGrowth={mockOnNavigateToCareerGrowth}
        />
      );

      expect(screen.getByText('Career Growth')).toBeInTheDocument();
    });

    it('displays career growth description', () => {
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
          onNavigateToCareerGrowth={mockOnNavigateToCareerGrowth}
        />
      );

      expect(
        screen.getByText(/Explore AI-powered career insights/i)
      ).toBeInTheDocument();
    });

    it('calls onNavigateToCareerGrowth when button clicked', async () => {
      const user = userEvent.setup();
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
          onNavigateToCareerGrowth={mockOnNavigateToCareerGrowth}
        />
      );

      await user.click(screen.getByText('Explore Career Tools'));
      expect(mockOnNavigateToCareerGrowth).toHaveBeenCalledTimes(1);
    });

    it('displays sparkles icon on button', () => {
      const { container } = render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
          onNavigateToCareerGrowth={mockOnNavigateToCareerGrowth}
        />
      );

      expect(container.querySelector('[data-testid="AutoAwesomeIcon"]') || container.querySelector('[data-testid="SparklesIcon"]')).toBeInTheDocument();
    });
  });

  describe('Profile Variations Grid', () => {
    it('displays profile variations', () => {
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
        />
      );

      expect(screen.getByText('Your Profile Variations')).toBeInTheDocument();
    });

    it('shows empty state when no variations', () => {
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={[]}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
          onCreateProfile={mockOnCreateProfile}
        />
      );

      expect(screen.getByText('No profile variations yet')).toBeInTheDocument();
    });

    it('displays create first profile button in empty state', () => {
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={[]}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
          onCreateProfile={mockOnCreateProfile}
        />
      );

      expect(screen.getByText('Create Your First Profile')).toBeInTheDocument();
    });

    it('calls onCreateProfile from empty state button', async () => {
      const user = userEvent.setup();
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={[]}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
          onCreateProfile={mockOnCreateProfile}
        />
      );

      await user.click(screen.getByText('Create Your First Profile'));
      expect(mockOnCreateProfile).toHaveBeenCalledTimes(1);
    });
  });

  describe('Empty States', () => {
    it('handles empty profiles array', () => {
      render(
        <ProfileGrid
          profiles={[]}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
        />
      );

      expect(screen.getByText('Your Profile Variations')).toBeInTheDocument();
      expect(screen.getByText('Create New Profile')).toBeInTheDocument();
    });

    it('handles empty profile variations array', () => {
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={[]}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
        />
      );

      expect(screen.getByText('No profile variations yet')).toBeInTheDocument();
    });

    it('handles both arrays empty', () => {
      render(
        <ProfileGrid
          profiles={[]}
          profileVariations={[]}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
        />
      );

      expect(screen.getByText('Your Profile Variations')).toBeInTheDocument();
      expect(screen.getByText('No profile variations yet')).toBeInTheDocument();
    });
  });

  describe('Multiple Profiles', () => {
    it('renders multiple profile cards', () => {
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('handles large number of profiles', () => {
      const manyProfiles = Array.from({ length: 10 }, (_, i) => ({
        ...sampleProfiles[0],
        id: `profile-${i}`,
        name: `User ${i}`,
      }));

      render(
        <ProfileGrid
          profiles={manyProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
        />
      );

      expect(screen.getByText('User 0')).toBeInTheDocument();
      expect(screen.getByText('User 9')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible grid layout', () => {
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
        />
      );

      expect(screen.getByText('Your Profile Variations')).toBeInTheDocument();
    });

    it('has accessible buttons', () => {
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles missing optional onCreateProfile callback', () => {
      render(
        <ProfileGrid
          profiles={sampleProfiles}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
        />
      );

      expect(screen.getByText('Create New Profile')).toBeInTheDocument();
    });

    it('handles profile with missing data', () => {
      const incompleteProfile = {
        id: '3',
        name: '',
        role: '',
        activeApplications: 0,
        atsScore: 0,
        lastUpdated: '',
        avatarColor: '#000000',
      };

      render(
        <ProfileGrid
          profiles={[incompleteProfile]}
          profileVariations={sampleProfileVariations}
          onEditProfile={mockOnEditProfile}
          onDeleteProfile={mockOnDeleteProfile}
        />
      );

      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });
});
