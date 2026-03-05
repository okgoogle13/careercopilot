import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';
import { Label } from '@careercopilot/ui';

const meta: Meta<typeof Switch> = {
  title: 'Components/UI/Switch',
  component: Switch,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

export const SettingsGroup: Story = {
  render: () => (
    <div className="space-y-4 w-[300px] p-4 border rounded-xl bg-card">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Email Notifications</Label>
          <p className="text-[0.7rem] text-muted-foreground">Receive daily summaries.</p>
        </div>
        <Switch defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Public Profile</Label>
          <p className="text-[0.7rem] text-muted-foreground">Make your career visible.</p>
        </div>
        <Switch />
      </div>
    </div>
  ),
};
