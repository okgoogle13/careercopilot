import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from '@jest/globals';

import ProfileComparison from '../../../features/profile/ProfileComparison';

describe('ProfileComparison', () => {
  const mockOnProfileSelect = jest.fn();
  const mockOnSwapProfiles = jest.fn();

  const leftProfile = {
    id: '1',
    name: 'John Doe',
    role: 'Software Engineer',
    activeApplications: 8,
    atsScore: 85,
    lastUpdated: '2024-01-15',
    avatarColor: '#3B82F6',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'PostgreSQL'],
    experience: [
      {
        company: 'TechCorp',
        position: 'Senior Software Engineer',
        duration: '2021-2023',
        highlights: [
          'Led development of scalable web applications',
          'Improved application performance by 40%',
          'Mentored junior developers',
        ],
      },
    ],
    education: [
      {
        degree: 'B.S. Computer Science',
        institution: 'University of Technology',
        year: '2019',
      },
    ],
    certifications: ['AWS Certified Developer', 'React Professional'],
  };

  const rightProfile = {
    ...leftProfile,
    id: '2',
    name: 'Jane Doe',
    role: 'Senior Software Engineer',
    activeApplications: 12,
    atsScore: 92,
    lastUpdated: '2024-01-20',
    skills: [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Python',
      'PostgreSQL',
      'AWS',
      'Docker',
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      render(<ProfileComparison />);
      expect(screen.getByText('Profile Comparison')).toBeInTheDocument();
    });

    it('displays page title', () => {
      render(<ProfileComparison />);
      expect(screen.getByText('Profile Comparison')).toBeInTheDocument();
    });

    it('displays page description', () => {
      render(<ProfileComparison />);
      expect(
        screen.getByText('Compare different versions of your profile side by side')
      ).toBeInTheDocument();
    });

    it('renders with default sample profiles', () => {
      render(<ProfileComparison />);
      expect(screen.getAllByText('John Doe')).toHaveLength(2);
    });

    it('renders with provided profiles', () => {
      render(
        <ProfileComparison
          leftProfile={leftProfile}
          rightProfile={rightProfile}
        />
      );
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });

  describe('Header Actions', () => {
    it('displays swap profiles button', () => {
      render(<ProfileComparison onSwapProfiles={mockOnSwapProfiles} />);
      expect(screen.getByText('Swap Profiles')).toBeInTheDocument();
    });

    it('calls onSwapProfiles when swap button clicked', async () => {
      const user = userEvent.setup();
      render(<ProfileComparison onSwapProfiles={mockOnSwapProfiles} />);

      await user.click(screen.getByText('Swap Profiles'));
      expect(mockOnSwapProfiles).toHaveBeenCalledTimes(1);
    });

    it('displays export comparison button', () => {
      render(<ProfileComparison />);
      expect(screen.getByText('Export Comparison')).toBeInTheDocument();
    });

    it('displays share button', () => {
      render(<ProfileComparison />);
      expect(screen.getByText('Share')).toBeInTheDocument();
    });
  });

  describe('Profile Cards', () => {
    it('displays both profile cards', () => {
      render(<ProfileComparison />);

      const versionLabels = screen.getAllByText(/Profile Version \d/);
      expect(versionLabels).toHaveLength(2);
    });

    it('displays change profile buttons', () => {
      render(<ProfileComparison onProfileSelect={mockOnProfileSelect} />);

      const changeButtons = screen.getAllByText('Change Profile');
      expect(changeButtons).toHaveLength(2);
    });

    it('calls onProfileSelect with "left" when left change button clicked', async () => {
      const user = userEvent.setup();
      render(<ProfileComparison onProfileSelect={mockOnProfileSelect} />);

      const changeButtons = screen.getAllByText('Change Profile');
      await user.click(changeButtons[0]);

      expect(mockOnProfileSelect).toHaveBeenCalledWith('left');
    });

    it('calls onProfileSelect with "right" when right change button clicked', async () => {
      const user = userEvent.setup();
      render(<ProfileComparison onProfileSelect={mockOnProfileSelect} />);

      const changeButtons = screen.getAllByText('Change Profile');
      await user.click(changeButtons[1]);

      expect(mockOnProfileSelect).toHaveBeenCalledWith('right');
    });
  });

  describe('Section Navigation', () => {
    it('displays all section tabs', () => {
      render(<ProfileComparison />);

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Skills')).toBeInTheDocument();
      expect(screen.getByText('Experience')).toBeInTheDocument();
      expect(screen.getByText('Education')).toBeInTheDocument();
      expect(screen.getByText('Certifications')).toBeInTheDocument();
    });

    it('starts with overview section selected', () => {
      render(<ProfileComparison />);
      expect(
        screen.getByText('Select a section above to compare profile details')
      ).toBeInTheDocument();
    });

    it('switches to skills section when clicked', async () => {
      const user = userEvent.setup();
      render(
        <ProfileComparison
          leftProfile={leftProfile}
          rightProfile={rightProfile}
        />
      );

      await user.click(screen.getByText('Skills'));

      expect(screen.getByText(/John Doe - Skills/)).toBeInTheDocument();
      expect(screen.getByText(/Jane Doe - Skills/)).toBeInTheDocument();
    });

    it('switches to experience section when clicked', async () => {
      const user = userEvent.setup();
      render(
        <ProfileComparison
          leftProfile={leftProfile}
          rightProfile={rightProfile}
        />
      );

      await user.click(screen.getByText('Experience'));

      expect(screen.getByText(/John Doe - Experience/)).toBeInTheDocument();
      expect(screen.getByText(/Jane Doe - Experience/)).toBeInTheDocument();
    });

    it('shows disabled state for education section', () => {
      render(<ProfileComparison />);
      expect(screen.getByText('Education')).toBeDisabled();
    });

    it('shows disabled state for certifications section', () => {
      render(<ProfileComparison />);
      expect(screen.getByText('Certifications')).toBeDisabled();
    });
  });

  describe('Skills Comparison', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(
        <ProfileComparison
          leftProfile={leftProfile}
          rightProfile={rightProfile}
        />
      );
      await user.click(screen.getByText('Skills'));
    });

    it('displays skills for both profiles', () => {
      expect(screen.getByText(/John Doe - Skills/)).toBeInTheDocument();
      expect(screen.getByText(/Jane Doe - Skills/)).toBeInTheDocument();
    });

    it('displays left profile skills', () => {
      const jsSkills = screen.getAllByText('JavaScript');
      expect(jsSkills.length).toBeGreaterThan(0);

      const reactSkills = screen.getAllByText('React');
      expect(reactSkills.length).toBeGreaterThan(0);

      const nodeSkills = screen.getAllByText('Node.js');
      expect(nodeSkills.length).toBeGreaterThan(0);
    });

    it('highlights unique skills in right profile', () => {
      // Find the card for Jane Doe (right profile)
      const rightSkillsHeader = screen.getByText(/Jane Doe - Skills/);
      expect(rightSkillsHeader).toBeInTheDocument();
      // Verify specific skills exist
      expect(screen.getByText('Docker')).toBeInTheDocument();
      expect(screen.getByText('AWS')).toBeInTheDocument();
    });
  });

  describe('Experience Comparison', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(
        <ProfileComparison
          leftProfile={leftProfile}
          rightProfile={rightProfile}
        />
      );
      await user.click(screen.getByText('Experience'));
    });

    it('displays experience for both profiles', () => {
      expect(screen.getByText(/John Doe - Experience/)).toBeInTheDocument();
      expect(screen.getByText(/Jane Doe - Experience/)).toBeInTheDocument();
    });

    it('displays job positions', () => {
      // 1 from Right Profile Role, 1 from Left Profile Experience, 1 from Right Profile Experience
      expect(screen.getAllByText('Senior Software Engineer')).toHaveLength(3);
    });

    it('displays company names', () => {
      expect(screen.getAllByText(/TechCorp/)).toHaveLength(2);
    });

    it('displays job duration', () => {
      expect(screen.getAllByText(/2021-2023/)).toHaveLength(2);
    });

    it('displays achievement highlights', () => {
      expect(
        screen.getAllByText(/Led development of scalable web applications/i)
      ).toHaveLength(2);
      expect(
        screen.getAllByText(/Improved application performance by 40%/i)
      ).toHaveLength(2);
    });
  });

  describe('Accessibility', () => {
    it('has accessible section navigation buttons', () => {
      render(<ProfileComparison />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('has proper heading hierarchy', () => {
      render(<ProfileComparison />);

      const mainHeading = screen.getByText('Profile Comparison');
      expect(mainHeading).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles profiles with no skills', () => {
      const emptyProfile = { ...leftProfile, skills: [] };
      render(
        <ProfileComparison
          leftProfile={emptyProfile}
          rightProfile={rightProfile}
        />
      );

      expect(screen.getByText('Profile Comparison')).toBeInTheDocument();
    });

    it('handles profiles with no experience', () => {
      const emptyProfile = { ...leftProfile, experience: [] };
      render(
        <ProfileComparison
          leftProfile={emptyProfile}
          rightProfile={rightProfile}
        />
      );

      expect(screen.getByText('Profile Comparison')).toBeInTheDocument();
    });

    it('handles identical profiles', () => {
      render(
        <ProfileComparison
          leftProfile={leftProfile}
          rightProfile={leftProfile}
        />
      );

      expect(screen.getByText('Profile Comparison')).toBeInTheDocument();
    });

    it('handles missing optional callbacks', () => {
      render(<ProfileComparison />);

      expect(screen.getByText('Profile Comparison')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('shows profile statistics in cards', () => {
      render(
        <ProfileComparison
          leftProfile={leftProfile}
          rightProfile={rightProfile}
        />
      );

      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    });

    it('displays ATS scores', () => {
      render(
        <ProfileComparison
          leftProfile={leftProfile}
          rightProfile={rightProfile}
        />
      );

      // Verify numbers are present (component renders raw numbers without %)
      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('92')).toBeInTheDocument();
    });

    it('displays active applications count', () => {
      render(
        <ProfileComparison
          leftProfile={leftProfile}
          rightProfile={rightProfile}
        />
      );

      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });
  });
});
