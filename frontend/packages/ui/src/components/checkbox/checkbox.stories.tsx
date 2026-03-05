import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';
import { Label } from '@careercopilot/ui';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

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
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const FormList: Story = {
  render: () => (
    <div className="grid gap-1.5 leading-none">
      <div className="flex items-start space-x-2">
        <Checkbox
          id="emails"
          defaultChecked
        />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="emails">Email Notifications</Label>
          <p className="text-sm text-muted-foreground">
            You can change your email preference in the settings.
          </p>
        </div>
      </div>
    </div>
  ),
};
