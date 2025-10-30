import React from 'react';
import { ArrowLeft, User, Bell, Shield, Palette, Download, Trash2, Edit3 } from 'lucide-react';
import { Button } from './ui/button';
import { M3Button } from './ui/m3-button';
import { M3Card, M3CardHeader, M3CardTitle, M3CardDescription, M3CardContent } from './ui/m3-card';
import { M3Input } from './ui/m3-input';
import { M3Select, M3SelectOption } from './ui/m3-select';
import { M3Checkbox } from './ui/m3-checkbox';

interface M3SettingsExampleProps {
  onBack?: () => void;
}

export function M3SettingsExample({ onBack }: M3SettingsExampleProps) {
  const [selectedProfile, setSelectedProfile] = React.useState('profile-1');
  const [userName, setUserName] = React.useState('Sarah Johnson');
  const [userEmail, setUserEmail] = React.useState('sarah.johnson@example.com');
  const [selectedTheme, setSelectedTheme] = React.useState('dark');
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: false,
    marketing: true,
    security: true,
  });

  const profileOptions: M3SelectOption[] = [
    {
      value: 'profile-1',
      label: 'Software Engineer Profile',
      icon: <div className="w-3 h-3 bg-blue-500 rounded-full" />,
    },
    {
      value: 'profile-2',
      label: 'Product Manager Profile',
      icon: <div className="w-3 h-3 bg-green-500 rounded-full" />,
    },
    {
      value: 'profile-3',
      label: 'UX Designer Profile',
      icon: <div className="w-3 h-3 bg-purple-500 rounded-full" />,
    },
  ];

  const themeOptions: M3SelectOption[] = [
    {
      value: 'light',
      label: 'Light Theme',
      icon: <div className="w-3 h-3 bg-yellow-400 rounded-full" />,
    },
    {
      value: 'dark',
      label: 'Dark Theme',
      icon: <div className="w-3 h-3 bg-gray-800 rounded-full" />,
    },
    {
      value: 'auto',
      label: 'System Default',
      icon: <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-gray-800 rounded-full" />,
    },
  ];

  const settingsOptions = [
    {
      id: 'account',
      title: 'Account Settings',
      description: 'Manage your personal information and account preferences',
      icon: <User className="w-6 h-6" />,
      selected: true,
    },
    {
      id: 'notifications',
      title: 'Notification Preferences',
      description: 'Configure how and when you receive notifications',
      icon: <Bell className="w-6 h-6" />,
      selected: false,
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Control your privacy settings and security options',
      icon: <Shield className="w-6 h-6" />,
      selected: false,
    },
    {
      id: 'appearance',
      title: 'Theme & Appearance',
      description: 'Customize the look and feel of your workspace',
      icon: <Palette className="w-6 h-6" />,
      selected: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--md-sys-color-background)] text-[var(--md-sys-color-on-background)]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-semibold text-[var(--md-sys-color-on-background)]">
              Settings Example
            </h1>
            <p className="text-[var(--md-sys-color-on-surface-variant)] mt-2">
              Example implementation showing Material 3 cards in different states
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Options Grid */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-medium mb-6 text-[var(--md-sys-color-on-surface)]">
              Settings Categories
            </h2>
            <div className="grid gap-4">
              {settingsOptions.map((option) => (
                <M3Card
                  key={option.id}
                  variant={option.selected ? 'selected' : 'interactive'}
                  className="cursor-pointer"
                >
                  <M3CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`
                        flex items-center justify-center w-10 h-10 rounded-xl
                        ${
                          option.selected
                            ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)]'
                            : 'bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)]'
                        }
                      `}
                      >
                        {option.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`
                          font-medium text-sm
                          ${
                            option.selected
                              ? 'text-[var(--md-sys-color-on-primary-container)]'
                              : 'text-[var(--md-sys-color-on-surface)]'
                          }
                        `}
                        >
                          {option.title}
                        </h3>
                        <p
                          className={`
                          text-xs mt-1 leading-4
                          ${
                            option.selected
                              ? 'text-[var(--md-sys-color-on-primary-container)]'
                              : 'text-[var(--md-sys-color-on-surface-variant)]'
                          }
                        `}
                        >
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </M3CardContent>
                </M3Card>
              ))}
            </div>
          </div>

          {/* Main Settings Panel */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-medium mb-6 text-[var(--md-sys-color-on-surface)]">
              Account Settings
            </h2>

            <div className="space-y-6">
              {/* Personal Information */}
              <M3Card variant="default">
                <M3CardHeader>
                  <M3CardTitle>Personal Information</M3CardTitle>
                  <M3CardDescription>
                    Update your personal details and contact information
                  </M3CardDescription>
                </M3CardHeader>
                <M3CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <M3Input
                      label="Full Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      leadingIcon={<User className="w-4 h-4" />}
                    />
                    <M3Input
                      label="Email Address"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      trailingIcon={<Edit3 className="w-4 h-4" />}
                    />
                  </div>

                  <M3Select
                    label="Active Profile"
                    options={profileOptions}
                    value={selectedProfile}
                    onValueChange={setSelectedProfile}
                    helperText="Choose which profile to use for job applications"
                  />

                  <div className="flex gap-3 pt-4">
                    <M3Button variant="filled" icon={<Download className="w-4 h-4" />}>
                      Save Changes
                    </M3Button>
                    <M3Button variant="outlined">Cancel</M3Button>
                  </div>
                </M3CardContent>
              </M3Card>

              {/* Notification Preferences */}
              <M3Card variant="default">
                <M3CardHeader>
                  <M3CardTitle>Notification Preferences</M3CardTitle>
                  <M3CardDescription>
                    Configure how you want to receive updates and alerts
                  </M3CardDescription>
                </M3CardHeader>
                <M3CardContent className="space-y-4">
                  <M3Checkbox
                    label="Email notifications"
                    checked={notifications.email}
                    onChange={(e) =>
                      setNotifications((prev) => ({
                        ...prev,
                        email: e.target.checked,
                      }))
                    }
                    helperText="Receive updates about job matches and application status"
                  />

                  <M3Checkbox
                    label="Push notifications"
                    checked={notifications.push}
                    onChange={(e) =>
                      setNotifications((prev) => ({
                        ...prev,
                        push: e.target.checked,
                      }))
                    }
                    helperText="Get instant notifications on your device"
                  />

                  <M3Checkbox
                    label="Marketing communications"
                    checked={notifications.marketing}
                    onChange={(e) =>
                      setNotifications((prev) => ({
                        ...prev,
                        marketing: e.target.checked,
                      }))
                    }
                    helperText="Receive product updates and feature announcements"
                  />

                  <M3Checkbox
                    label="Security alerts"
                    checked={notifications.security}
                    onChange={(e) =>
                      setNotifications((prev) => ({
                        ...prev,
                        security: e.target.checked,
                      }))
                    }
                    helperText="Important security and account alerts (recommended)"
                  />
                </M3CardContent>
              </M3Card>

              {/* Appearance Settings */}
              <M3Card variant="default">
                <M3CardHeader>
                  <M3CardTitle>Appearance</M3CardTitle>
                  <M3CardDescription>Customize the theme and visual preferences</M3CardDescription>
                </M3CardHeader>
                <M3CardContent className="space-y-6">
                  <M3Select
                    label="Theme Preference"
                    options={themeOptions}
                    value={selectedTheme}
                    onValueChange={setSelectedTheme}
                    helperText="Choose your preferred color theme"
                  />

                  <div className="flex gap-3 pt-4">
                    <M3Button variant="tonal">Apply Theme</M3Button>
                    <M3Button variant="text">Reset to Default</M3Button>
                  </div>
                </M3CardContent>
              </M3Card>

              {/* Danger Zone */}
              <M3Card variant="default" className="border-[var(--md-sys-color-error)] border-2">
                <M3CardHeader>
                  <M3CardTitle className="text-[var(--md-sys-color-error)]">
                    Danger Zone
                  </M3CardTitle>
                  <M3CardDescription>
                    Irreversible actions that will permanently affect your account
                  </M3CardDescription>
                </M3CardHeader>
                <M3CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-[var(--md-sys-color-error-container)] rounded-xl">
                      <h4 className="font-medium text-[var(--md-sys-color-on-error-container)] mb-2">
                        Delete Account
                      </h4>
                      <p className="text-sm text-[var(--md-sys-color-on-error-container)] mb-4">
                        Permanently delete your account and all associated data. This action cannot
                        be undone.
                      </p>
                      <M3Button
                        variant="filled"
                        className="bg-[var(--md-sys-color-error)] hover:bg-[var(--md-sys-color-error)]"
                        icon={<Trash2 className="w-4 h-4" />}
                      >
                        Delete Account
                      </M3Button>
                    </div>
                  </div>
                </M3CardContent>
              </M3Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
