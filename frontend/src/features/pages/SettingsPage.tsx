/**
 * ELECTRIC ALCHEMIST: SETTINGS PAGE
 *
 * Settings page using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { Container, Card, Button, Tabs } from '@/components/ui';
import { Input, Textarea, Switch } from '@/components/ui';

export function SettingsPage() {
  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      content: (
        <Card variant="default" className="p-6">
          <h2 className="text-hero text-xl font-semibold mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <Input label="First Name" placeholder="John" />
            <Input label="Last Name" placeholder="Doe" />
            <Input label="Email" type="email" placeholder="john@example.com" />
            <Textarea label="Bio" placeholder="Tell us about yourself..." />
          </div>
          <Button variant="default" className="mt-6">
            Save Changes
          </Button>
        </Card>
      ),
    },
    {
      id: 'preferences',
      label: 'Preferences',
      content: (
        <Card variant="default" className="p-6">
          <h2 className="text-hero text-xl font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-human text-base">Dark Mode</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-human text-base">Email Notifications</span>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      content: (
        <Card variant="default" className="p-6">
          <h2 className="text-hero text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-human text-base">Application Updates</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-human text-base">Job Matches</span>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
      ),
    },
    {
      id: 'security',
      label: 'Security',
      content: (
        <Card variant="default" className="p-6">
          <h2 className="text-hero text-xl font-semibold mb-4">Security</h2>
          <div className="space-y-4">
            <Input label="Current Password" type="password" />
            <Input label="New Password" type="password" />
            <Input label="Confirm New Password" type="password" />
            <Button variant="default">Update Password</Button>
          </div>
        </Card>
      ),
    },
  ];

  return (
    <Container size="lg">
      <div className="py-8">
        <h1 className="text-hero text-3xl font-semibold mb-6">Settings</h1>
        <Tabs tabs={tabs} defaultTab="profile" />
      </div>
    </Container>
  );
}

export default SettingsPage;

