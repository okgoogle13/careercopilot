/**
 * ELECTRIC ALCHEMIST: SETTINGS VIEW
 *
 * Settings view using Electric Alchemist Design System v4.4.
 */

import React, { useState } from 'react';
import { ArrowLeft, User, Bell } from 'lucide-react';
import { Container, Card, Button, Input, Switch } from '@/components/ui';

export interface SettingsViewProps {
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    fullName: 'Nishant Dougall',
    email: 'nishant.dougall@email.com',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });

  return (
    <Container size="md">
      <div className="py-8">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-hero text-3xl font-semibold mb-2">Settings</h1>
          <p className="text-human text-base text-on-surface-variant">
            Manage your account preferences and data
          </p>
        </div>

        <Card variant="default" className="p-6 mb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-primary-container/20">
              <User className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-hero text-lg font-semibold">Profile</h2>
          </div>
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </Card>

        <Card variant="default" className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-secondary-container/20">
              <Bell className="h-5 w-5 text-secondary" />
            </div>
            <h2 className="text-hero text-lg font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-human text-base">Email Notifications</span>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, email: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-human text-base">Push Notifications</span>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, push: checked })
                }
              />
            </div>
          </div>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button variant="default">Save Changes</Button>
        </div>
      </div>
    </Container>
  );
};

export default SettingsView;

