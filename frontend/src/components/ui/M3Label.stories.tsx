import type { Meta, StoryObj } from '@storybook/react';
import { M3Label } from './M3Label';

const meta: Meta<typeof M3Label> = {
  title: 'M3/Forms/Label',
  component: M3Label,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof M3Label>;

export const Basic: Story = {
  args: {
    htmlFor: 'input-1',
    children: 'Email Address',
  },
};

export const Required: Story = {
  args: {
    htmlFor: 'input-2',
    required: true,
    children: 'Password',
  },
};

export const Disabled: Story = {
  args: {
    htmlFor: 'input-3',
    disabled: true,
    children: 'Disabled Field',
  },
};

export const WithInput: Story = {
  render: () => (
    <div>
      <M3Label htmlFor="email" required>Email Address</M3Label>
      <input id="email" type="email" style={{ display: 'block', marginTop: '8px', padding: '8px', width: '300px' }} />
    </div>
  ),
};
