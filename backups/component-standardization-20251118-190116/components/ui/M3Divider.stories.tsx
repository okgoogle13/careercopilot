import type { Meta, StoryObj } from '@storybook/react';
import { M3Divider } from './M3Divider';

const meta: Meta<typeof M3Divider> = {
  title: 'M3/Layout/Divider',
  component: M3Divider,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['fullWidth', 'inset', 'middle'],
    },
    textAlign: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Divider>;

export const Horizontal: Story = {
  render: () => (
    <div>
      <p>Content above divider</p>
      <M3Divider />
      <p>Content below divider</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', height: '100px' }}>
      <span>Left content</span>
      <M3Divider orientation="vertical" flexItem />
      <span>Right content</span>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div>
      <p>Content above divider</p>
      <M3Divider>OR</M3Divider>
      <p>Content below divider</p>
    </div>
  ),
};

export const TextAlignment: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p>Text aligned left</p>
        <M3Divider textAlign="left">Left</M3Divider>
        <p>Content below</p>
      </div>
      <div>
        <p>Text aligned center (default)</p>
        <M3Divider textAlign="center">Center</M3Divider>
        <p>Content below</p>
      </div>
      <div>
        <p>Text aligned right</p>
        <M3Divider textAlign="right">Right</M3Divider>
        <p>Content below</p>
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3>Full Width (default)</h3>
        <p>Content above</p>
        <M3Divider variant="fullWidth" />
        <p>Content below</p>
      </div>
      <div>
        <h3>Inset</h3>
        <p>Content above</p>
        <M3Divider variant="inset" />
        <p>Content below</p>
      </div>
      <div>
        <h3>Middle</h3>
        <p>Content above</p>
        <M3Divider variant="middle" />
        <p>Content below</p>
      </div>
    </div>
  ),
};

export const InList: Story = {
  render: () => (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ padding: '16px' }}>
        <h4 style={{ margin: 0 }}>Item 1</h4>
        <p style={{ margin: '4px 0 0' }}>Description for item 1</p>
      </div>
      <M3Divider />
      <div style={{ padding: '16px' }}>
        <h4 style={{ margin: 0 }}>Item 2</h4>
        <p style={{ margin: '4px 0 0' }}>Description for item 2</p>
      </div>
      <M3Divider />
      <div style={{ padding: '16px' }}>
        <h4 style={{ margin: 0 }}>Item 3</h4>
        <p style={{ margin: '4px 0 0' }}>Description for item 3</p>
      </div>
    </div>
  ),
};

export const InToolbar: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        gap: '8px',
      }}
    >
      <button style={{ padding: '8px 16px' }}>Button 1</button>
      <M3Divider orientation="vertical" flexItem />
      <button style={{ padding: '8px 16px' }}>Button 2</button>
      <M3Divider orientation="vertical" flexItem />
      <button style={{ padding: '8px 16px' }}>Button 3</button>
    </div>
  ),
};
