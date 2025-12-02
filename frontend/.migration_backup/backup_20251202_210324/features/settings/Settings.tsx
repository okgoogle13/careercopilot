/**
 * ELECTRIC ALCHEMIST: SETTINGS FEATURE
 *
 * Settings page with form controls and design system tokens.
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button/Button';
import { Separator } from '@/components/ui/Separator';
import { PageHeader } from '@/components/ui/PageHeader';

export function Settings() {
  const [settings, setSettings] = useState({
    email: '',
    notifications: true,
    theme: 'dark',
    language: 'en',
  });

  const handleSave = () => {
    // Save settings logic
    console.log('Settings saved:', settings);
  };

  return (
    <div className="min-h-screen bg-surface">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
        onBack={() => window.history.back()}
      />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Account Settings */}
        <Card className="p-6">
          <h2 className="text-hero text-xl font-semibold text-on-surface mb-4">
            Account Settings
          </h2>
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
            />
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6">
          <h2 className="text-hero text-xl font-semibold text-on-surface mb-4">
            Preferences
          </h2>
          <div className="space-y-4">
            <Select
              label="Theme"
              options={[
                { label: 'Dark', value: 'dark' },
                { label: 'Light', value: 'light' },
                { label: 'System', value: 'system' },
              ]}
              value={settings.theme}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, theme: e.target.value }))
              }
            />
            <Select
              label="Language"
              options={[
                { label: 'English', value: 'en' },
                { label: 'Spanish', value: 'es' },
                { label: 'French', value: 'fr' },
              ]}
              value={settings.language}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, language: e.target.value }))
              }
            />
            <Checkbox
              label="Enable email notifications"
              checked={settings.notifications}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, notifications: e.target.checked }))
              }
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}

export default Settings;

