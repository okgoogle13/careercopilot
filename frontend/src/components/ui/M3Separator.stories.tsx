import type { Meta, StoryObj } from '@storybook/react';
import { M3Separator } from './M3Separator';

const meta: Meta<typeof M3Separator> = {
  title: 'M3/Layout/Separator',
  component: M3Separator,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof M3Separator>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <div>Content above</div>
      <M3Separator />
      <div>Content below</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', height: '100px' }}>
      <span>Left content</span>
      <M3Separator orientation="vertical" />
      <span>Right content</span>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <div>Section 1</div>
      <M3Separator>OR</M3Separator>
      <div>Section 2</div>
    </div>
  ),
};
