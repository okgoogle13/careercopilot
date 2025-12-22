/**
 * ELECTRIC ALCHEMIST: SETTINGS PAGE
 *
 * Settings page using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { Container, Card, Button, Tabs } from '@/components';
import { Input, Textarea, Switch } from '@/components';

export function SettingsPage() {
  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      content: (
        <Card variant="default" className="p-6">
          <h2 className="text-hero text-xl font-semibold mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-human text-sm font-medium text-on-surface">First Name</label>
              <Input placeholder="John" />
            </div>
            <div className="space-y-2">
              <label className="text-human text-sm font-medium text-on-surface">Last Name</label>
              <Input placeholder="Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-human text-sm font-medium text-on-surface">Email</label>
              <Input type="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-human text-sm font-medium text-on-surface">Bio</label>
              <Textarea placeholder="Tell us about yourself..." />
            </div>
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
            <div className="space-y-2">
              <label className="text-human text-sm font-medium text-on-surface">Current Password</label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-human text-sm font-medium text-on-surface">New Password</label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-human text-sm font-medium text-on-surface">Confirm New Password</label>
              <Input type="password" />
            </div>
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

