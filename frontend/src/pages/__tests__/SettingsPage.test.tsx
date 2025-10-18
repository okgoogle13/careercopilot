import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsPage } from '../SettingsPage';

describe('SettingsPage', () => {
  const mockOnSave = jest.fn();
  const mockOnExport = jest.fn();
  const mockOnImport = jest.fn();

  beforeEach(() => {
    mockOnSave.mockClear();
    mockOnExport.mockClear();
    mockOnImport.mockClear();
  });

  it('renders the settings heading and description', () => {
    render(<SettingsPage />);

    expect(screen.getByRole('heading', { name: /^Settings$/i })).toBeInTheDocument();
    expect(screen.getByText(/Manage your account, preferences, and privacy settings/i)).toBeInTheDocument();
  });

  it('displays all settings tabs', () => {
    render(<SettingsPage />);

    expect(screen.getByRole('tab', { name: /Profile/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Preferences/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Notifications/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Privacy & Security/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Data & Storage/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Help & Support/i })).toBeInTheDocument();
  });

  describe('Profile Tab', () => {
    it('displays profile information fields', () => {
      render(<SettingsPage />);

      expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Website/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Bio/i)).toBeInTheDocument();
    });

    it('shows default profile values', () => {
      render(<SettingsPage />);

      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
    });

    it('displays profile photo section with upload button', () => {
      render(<SettingsPage />);

      expect(screen.getByText(/Profile Photo/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Upload Photo/i })).toBeInTheDocument();
    });
  });

  describe('Preferences Tab', () => {
    it('switches to preferences tab when clicked', async () => {
      const user = userEvent.setup();
      render(<SettingsPage />);

      const preferencesTab = screen.getByRole('tab', { name: /Preferences/i });
      await user.click(preferencesTab);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Application Preferences/i })).toBeInTheDocument();
      });
    });

    it('displays theme, language, and timezone selectors', async () => {
      const user = userEvent.setup();
      render(<SettingsPage />);

      const preferencesTab = screen.getByRole('tab', { name: /Preferences/i });
      await user.click(preferencesTab);

      await waitFor(() => {
        expect(screen.getByLabelText(/Theme/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Language/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Timezone/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Date Format/i)).toBeInTheDocument();
      });
    });

    it('displays interface options switches', async () => {
      const user = userEvent.setup();
      render(<SettingsPage />);

      const preferencesTab = screen.getByRole('tab', { name: /Preferences/i });
      await user.click(preferencesTab);

      await waitFor(() => {
        expect(screen.getByText(/Auto-save/i)).toBeInTheDocument();
        expect(screen.getByText(/Compact Mode/i)).toBeInTheDocument();
        expect(screen.getByText(/Animations/i)).toBeInTheDocument();
      });
    });
  });

  describe('Notifications Tab', () => {
    it('switches to notifications tab when clicked', async () => {
      const user = userEvent.setup();
      render(<SettingsPage />);

      const notificationsTab = screen.getByRole('tab', { name: /Notifications/i });
      await user.click(notificationsTab);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Notification Preferences/i })).toBeInTheDocument();
      });
    });

    it('displays all notification options', async () => {
      const user = userEvent.setup();
      render(<SettingsPage />);

      const notificationsTab = screen.getByRole('tab', { name: /Notifications/i });
      await user.click(notificationsTab);

      await waitFor(() => {
        expect(screen.getByText(/Email Notifications/i)).toBeInTheDocument();
        expect(screen.getByText(/Push Notifications/i)).toBeInTheDocument();
        expect(screen.getByText(/SMS Notifications/i)).toBeInTheDocument();
        expect(screen.getByText(/Job Alerts/i)).toBeInTheDocument();
        expect(screen.getByText(/Analysis Complete/i)).toBeInTheDocument();
        expect(screen.getByText(/Weekly Digest/i)).toBeInTheDocument();
        expect(screen.getByText(/Security Alerts/i)).toBeInTheDocument();
      });
    });
  });

  describe('Privacy & Security Tab', () => {
    it('switches to privacy & security tab when clicked', async () => {
      const user = userEvent.setup();
      render(<SettingsPage />);

      const privacyTab = screen.getByRole('tab', { name: /Privacy & Security/i });
      await user.click(privacyTab);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Privacy & Security/i })).toBeInTheDocument();
      });
    });

    it('displays account security options', async () => {
      const user = userEvent.setup();
      render(<SettingsPage />);

      const privacyTab = screen.getByRole('tab', { name: /Privacy & Security/i });
      await user.click(privacyTab);

      await waitFor(() => {
        expect(screen.getByText(/Change Password/i)).toBeInTheDocument();
        expect(screen.getByText(/Two-Factor Authentication/i)).toBeInTheDocument();
        expect(screen.getByText(/Active Sessions/i)).toBeInTheDocument();
      });
    });

    it('displays privacy settings with profile visibility options', async () => {
      const user = userEvent.setup();
      render(<SettingsPage />);

      const privacyTab = screen.getByRole('tab', { name: /Privacy & Security/i });
      await user.click(privacyTab);

      await waitFor(() => {
        expect(screen.getByText(/Profile Visibility/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Public/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Private/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contacts Only/i)).toBeInTheDocument();
      });
    });
  });

  describe('Data & Storage Tab', () => {
    it('switches to data & storage tab when clicked', async () => {
      const user = userEvent.setup();
      render(<SettingsPage />);

      const dataTab = screen.getByRole('tab', { name: /Data & Storage/i });
      await user.click(dataTab);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Data & Storage/i })).toBeInTheDocument();
      });
    });

    it('displays storage usage information', async () => {
      const user = userEvent.setup();
      render(<SettingsPage />);

      const dataTab = screen.getByRole('tab', { name: /Data & Storage/i });
      await user.click(dataTab);

      await waitFor(() => {
        expect(screen.getByText(/Storage Usage/i)).toBeInTheDocument();
        expect(screen.getByText(/Used: 2.3 GB of 10 GB/i)).toBeInTheDocument();
      });
    });

    it('displays data management buttons', async () => {
      const user = userEvent.setup();
      render(<SettingsPage />);

      const dataTab = screen.getByRole('tab', { name: /Data & Storage/i });
      await user.click(dataTab);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Export Data/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Import Data/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create Backup/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Clear Cache/i })).toBeInTheDocument();
      });
    });

    it('displays danger zone with delete account option', async () => {
      const user = userEvent.setup();
      render(<SettingsPage />);

      const dataTab = screen.getByRole('tab', { name: /Data & Storage/i });
      await user.click(dataTab);

      await waitFor(() => {
        expect(screen.getByText(/Danger Zone/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Delete Account/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Reset All Settings/i })).toBeInTheDocument();
      });
    });
  });

  describe('Help & Support Tab', () => {
    it('switches to help & support tab when clicked', async () => {
      const user = userEvent.setup();
      render(<SettingsPage />);

      const helpTab = screen.getByRole('tab', { name: /Help & Support/i });
      await user.click(helpTab);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Help & Support/i })).toBeInTheDocument();
      });
    });

    it('displays help options', async () => {
      const user = userEvent.setup();
      render(<SettingsPage />);

      const helpTab = screen.getByRole('tab', { name: /Help & Support/i });
      await user.click(helpTab);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /View Documentation/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Contact Support/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Report Bug/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Feature Request/i })).toBeInTheDocument();
      });
    });

    it('displays about information', async () => {
      const user = userEvent.setup();
      render(<SettingsPage />);

      const helpTab = screen.getByRole('tab', { name: /Help & Support/i });
      await user.click(helpTab);

      await waitFor(() => {
        expect(screen.getByText(/Version/i)).toBeInTheDocument();
        expect(screen.getByText(/2.1.0/i)).toBeInTheDocument();
        expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument();
        expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('shows unsaved changes alert when settings are modified', async () => {
      const user = userEvent.setup();
      render(<SettingsPage />);

      const firstNameInput = screen.getByLabelText(/First Name/i);
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Jane');

      await waitFor(() => {
        expect(screen.getByText(/You have unsaved changes/i)).toBeInTheDocument();
      });
    });

    it('calls onSave when save changes button is clicked', async () => {
      const user = userEvent.setup();
      render(<SettingsPage onSave={mockOnSave} />);

      // Modify a setting
      const firstNameInput = screen.getByLabelText(/First Name/i);
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Jane');

      // Wait for unsaved changes alert
      await waitFor(() => {
        expect(screen.getByText(/You have unsaved changes/i)).toBeInTheDocument();
      });

      // Click save from the alert or bottom save button
      const saveButtons = screen.getAllByRole('button', { name: /Save Changes/i });
      await user.click(saveButtons[0]);

      expect(mockOnSave).toHaveBeenCalledTimes(1);
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          profile: expect.objectContaining({
            firstName: 'Jane',
          }),
        })
      );
    });

    it('opens export data dialog when export button is clicked', async () => {
      const user = userEvent.setup();
      render(<SettingsPage />);

      const dataTab = screen.getByRole('tab', { name: /Data & Storage/i });
      await user.click(dataTab);

      await waitFor(() => {
        const exportButton = screen.getByRole('button', { name: /Export Data/i });
        user.click(exportButton);
      });

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Export Your Data/i })).toBeInTheDocument();
      });
    });

    it('opens delete account dialog when delete account button is clicked', async () => {
      const user = userEvent.setup();
      render(<SettingsPage />);

      const dataTab = screen.getByRole('tab', { name: /Data & Storage/i });
      await user.click(dataTab);

      await waitFor(async () => {
        const deleteButton = screen.getByRole('button', { name: /Delete Account/i });
        await user.click(deleteButton);
      });

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Delete Account/i })).toBeInTheDocument();
        expect(screen.getByText(/All your data will be permanently deleted/i)).toBeInTheDocument();
      });
    });
  });
});
