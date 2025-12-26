import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from '@jest/globals';

import { ProfileEditor } from '../../../features/profile/ProfileEditor';

describe('ProfileEditor', () => {
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);
      expect(screen.getByText(/Profile Strength/i)).toBeInTheDocument();
    });

    it('displays user name in header', () => {
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);
      expect(screen.getByText('Nishant Dougall')).toBeInTheDocument();
    });

    it('displays professional title', () => {
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);
      expect(screen.getByText('Community Support Worker')).toBeInTheDocument();
    });

    it('displays location with icon', () => {
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);
      expect(screen.getByText('Vancouver, BC')).toBeInTheDocument();
    });

    it('shows profile strength indicator', () => {
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);
      expect(screen.getByText('Profile Strength')).toBeInTheDocument();
      expect(screen.getByText(/% Complete/i)).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('renders all tab options', () => {
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);
      expect(screen.getByText('Basic Info')).toBeInTheDocument();
      expect(screen.getByText('Experience')).toBeInTheDocument();
      expect(screen.getByText('Skills')).toBeInTheDocument();
      expect(screen.getByText('Social & Links')).toBeInTheDocument();
      expect(screen.getByText('Privacy')).toBeInTheDocument();
    });

    it('switches to skills tab when clicked', async () => {
      const user = userEvent.setup();
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);

      await user.click(screen.getByText('Skills'));
      expect(screen.getByText('Skills & Expertise')).toBeInTheDocument();
    });

    it('switches to social tab when clicked', async () => {
      const user = userEvent.setup();
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);

      await user.click(screen.getByText('Social & Links'));
      expect(screen.getByText('Social Links & Online Presence')).toBeInTheDocument();
    });

    it('switches to settings tab when clicked', async () => {
      const user = userEvent.setup();
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);

      await user.click(screen.getByText('Privacy'));
      expect(screen.getByText('Privacy & Preferences')).toBeInTheDocument();
    });
  });

  describe('Basic Info Form', () => {
    it('allows editing full name', async () => {
      const user = userEvent.setup();
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);

      const nameInput = screen.getByPlaceholderText('Enter full name');
      await user.clear(nameInput);
      await user.type(nameInput, 'John Smith');

      expect(nameInput).toHaveValue('John Smith');
    });

    it('allows editing professional title', async () => {
      const user = userEvent.setup();
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);

      const titleInput = screen.getByPlaceholderText('e.g., Senior Developer');
      await user.clear(titleInput);
      await user.type(titleInput, 'Senior Engineer');

      expect(titleInput).toHaveValue('Senior Engineer');
    });

    it('allows editing email', async () => {
      const user = userEvent.setup();
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);

      const emailInput = screen.getByPlaceholderText('professional@email.com');
      await user.clear(emailInput);
      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('allows editing phone number', async () => {
      const user = userEvent.setup();
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);

      const phoneInput = screen.getByPlaceholderText('+1 (555) 123-4567');
      await user.clear(phoneInput);
      await user.type(phoneInput, '+1 234 567 8900');

      expect(phoneInput).toHaveValue('+1 234 567 8900');
    });

    it('allows editing location', async () => {
      const user = userEvent.setup();
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);

      const locationInput = screen.getByPlaceholderText('City, State/Province, Country');
      await user.clear(locationInput);
      await user.type(locationInput, 'Toronto, ON');

      expect(locationInput).toHaveValue('Toronto, ON');
    });
  });

  describe('Professional Summary', () => {
    it('shows AI generate button', () => {
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);
      expect(screen.getByText('AI Generate')).toBeInTheDocument();
    });

    it('generates summary when AI button clicked', async () => {
      const user = userEvent.setup();
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);

      const generateButton = screen.getByText('AI Generate');
      await user.click(generateButton);

      expect(screen.getByText('Generating AI summary...')).toBeInTheDocument();

      await waitFor(() => {
        const textarea = screen.getByPlaceholderText(/Write a compelling professional summary/i);
        expect(textarea).toHaveValue(expect.stringContaining('Dedicated and compassionate'));
      }, { timeout: 3000 });
    });

    it('allows manual summary editing', async () => {
      const user = userEvent.setup();
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);

      const textarea = screen.getByPlaceholderText(/Write a compelling professional summary/i);
      await user.type(textarea, 'My professional summary');

      expect(textarea).toHaveValue('My professional summary');
    });

    it('shows character count', async () => {
      const user = userEvent.setup();
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);

      const textarea = screen.getByPlaceholderText(/Write a compelling professional summary/i);
      await user.type(textarea, 'Test');

      expect(screen.getByText(/4\/300 characters/i)).toBeInTheDocument();
    });
  });

  describe('Skills Management', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);
      await user.click(screen.getByText('Skills'));
    });

    it('displays existing skills', () => {
      expect(screen.getByText('Crisis Intervention')).toBeInTheDocument();
      expect(screen.getByText('Case Management')).toBeInTheDocument();
      expect(screen.getByText('Active Listening')).toBeInTheDocument();
    });

    it('allows adding new skill with Enter key', async () => {
      const user = userEvent.setup();

      const skillInput = screen.getByPlaceholderText(/Add a skill/i);
      await user.type(skillInput, 'Project Management{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Project Management')).toBeInTheDocument();
      });
    });

    it('allows adding new skill with button click', async () => {
      const user = userEvent.setup();

      const skillInput = screen.getByPlaceholderText(/Add a skill/i);
      await user.type(skillInput, 'Leadership');

      const addButtons = screen.getAllByRole('button');
      const addButton = addButtons.find(btn => btn.querySelector('[data-testid="AddIcon"]'));
      if (addButton) {
        await user.click(addButton);
      }

      await waitFor(() => {
        expect(screen.getByText('Leadership')).toBeInTheDocument();
      });
    });

    it('clears input after adding skill', async () => {
      const user = userEvent.setup();

      const skillInput = screen.getByPlaceholderText(/Add a skill/i);
      await user.type(skillInput, 'New Skill{Enter}');

      await waitFor(() => {
        expect(skillInput).toHaveValue('');
      });
    });

    it('removes skill when close button clicked', async () => {
      const user = userEvent.setup();

      expect(screen.getByText('Crisis Intervention')).toBeInTheDocument();

      // Find and click the first remove button
      const closeButtons = screen.getAllByRole('button');
      const firstCloseButton = closeButtons.find(btn =>
        btn.querySelector('[data-testid="CloseIcon"]')
      );

      if (firstCloseButton) {
        await user.click(firstCloseButton);
        await waitFor(() => {
          expect(screen.queryByText('Crisis Intervention')).not.toBeInTheDocument();
        });
      }
    });

    it('shows skill categories', () => {
      expect(screen.getByText(/INDUSTRY Skills/i)).toBeInTheDocument();
      expect(screen.getByText(/SOFT Skills/i)).toBeInTheDocument();
    });

    it('displays skill proficiency levels', () => {
      expect(screen.getByText('Level 9/10')).toBeInTheDocument();
      expect(screen.getByText('Level 8/10')).toBeInTheDocument();
    });

    it('shows AI skill suggestions', () => {
      expect(screen.getByText('AI Skill Suggestions')).toBeInTheDocument();
      expect(screen.getByText('Team Leadership')).toBeInTheDocument();
      expect(screen.getByText('Data Analysis')).toBeInTheDocument();
    });

    it('adds suggested skill when clicked', async () => {
      const user = userEvent.setup();

      const suggestion = screen.getByText('Team Leadership');
      await user.click(suggestion.closest('button')!);

      const skillInput = screen.getByPlaceholderText(/Add a skill/i);
      expect(skillInput).toHaveValue('Team Leadership');
    });
  });

  describe('Social Links', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);
      await user.click(screen.getByText('Social & Links'));
    });

    it('displays existing social links', () => {
      const linkedInInput = screen.getByPlaceholderText(/Your linkedin profile URL/i);
      expect(linkedInInput).toHaveValue('https://linkedin.com/in/nishant-dougall');
    });

    it('allows editing social link URL', async () => {
      const user = userEvent.setup();

      const linkedInInput = screen.getByPlaceholderText(/Your linkedin profile URL/i);
      await user.clear(linkedInInput);
      await user.type(linkedInInput, 'https://linkedin.com/in/newprofile');

      expect(linkedInInput).toHaveValue('https://linkedin.com/in/newprofile');
    });

    it('shows verified badge for verified links', () => {
      expect(screen.getByTitle('Verified profile')).toBeInTheDocument();
    });

    it('allows adding new social link', async () => {
      const user = userEvent.setup();

      const addButton = screen.getByText('Add Social Link');
      await user.click(addButton);

      // Should add a new input field
      const inputs = screen.getAllByPlaceholderText(/Your .* profile URL/i);
      expect(inputs.length).toBeGreaterThan(2);
    });
  });

  describe('Privacy Settings', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);
      await user.click(screen.getByText('Privacy'));
    });

    it('displays privacy settings section', () => {
      expect(screen.getByText('Privacy & Preferences')).toBeInTheDocument();
    });

    it('shows profile visibility dropdown', () => {
      expect(screen.getByText('Profile Visibility')).toBeInTheDocument();
    });

    it('shows work preferences toggles', () => {
      expect(screen.getByText('Open to Opportunities')).toBeInTheDocument();
      expect(screen.getByText('Show Location')).toBeInTheDocument();
    });

    it('displays toggle descriptions', () => {
      expect(screen.getByText("Let recruiters know you're available")).toBeInTheDocument();
      expect(screen.getByText('Display your location publicly')).toBeInTheDocument();
    });
  });

  describe('Navigation Buttons', () => {
    it('renders back button', () => {
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('calls onBack when back button clicked', async () => {
      const user = userEvent.setup();
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);

      await user.click(screen.getByText('Back'));
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('renders save and continue button', () => {
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);
      expect(screen.getByText('Save Profile & Continue')).toBeInTheDocument();
    });

    it('calls onNext when save button clicked', async () => {
      const user = userEvent.setup();
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);

      await user.click(screen.getByText('Save Profile & Continue'));
      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });

    it('renders preview button', () => {
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);
      expect(screen.getByText('Preview')).toBeInTheDocument();
    });

    it('shows auto-save indicator', () => {
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);
      expect(screen.getByText(/Auto-saved 2 minutes ago/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible tab navigation', () => {
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);

      const tabs = screen.getAllByRole('button');
      expect(tabs.length).toBeGreaterThan(0);
    });

    it('has accessible form inputs with labels', () => {
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);

      expect(screen.getByText('Full Name *')).toBeInTheDocument();
      expect(screen.getByText('Email *')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty skill input submission', async () => {
      const user = userEvent.setup();
      render(<ProfileEditor onNext={mockOnNext} onBack={mockOnBack} />);

      await user.click(screen.getByText('Skills'));

      const skillInput = screen.getByPlaceholderText(/Add a skill/i);
      await user.type(skillInput, '   {Enter}');

      // Should not add empty skill
      expect(skillInput).toHaveValue('');
    });

    it('handles undefined initialData prop', () => {
      render(
        <ProfileEditor
          onNext={mockOnNext}
          onBack={mockOnBack}
          initialData={undefined}
        />
      );

      expect(screen.getByText('Profile Strength')).toBeInTheDocument();
    });
  });
});
