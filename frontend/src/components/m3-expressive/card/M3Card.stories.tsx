import type { Meta, StoryObj } from '@storybook/react';
import { M3Card } from './M3Card';

/**
 * M3 Expressive Card Component
 *
 * Surface container with elevation support. Use for displaying content
 * in a contained surface with optional elevation and clickable behavior.
 */
const meta: Meta<typeof M3Card> = {
  component: M3Card,
  title: 'M3 Expressive/Card',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    elevation: {
      control: 'select',
      options: ['level0', 'level1', 'level2', 'level3', 'level4', 'level5'],
      description: 'Elevation level (0-5)',
    },
    clickable: {
      control: 'boolean',
      description: 'If true, card is clickable with hover elevation increase',
    },
    children: {
      control: 'text',
      description: 'Card content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Card (level0 elevation)
 */
export const Default: Story = {
  args: {
    children: 'Card content goes here',
  },
};

/**
 * All Elevation Levels
 */
export const ElevationLevels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <M3Card elevation="level0">Level 0 (no elevation)</M3Card>
      <M3Card elevation="level1">Level 1</M3Card>
      <M3Card elevation="level2">Level 2</M3Card>
      <M3Card elevation="level3">Level 3</M3Card>
      <M3Card elevation="level4">Level 4</M3Card>
      <M3Card elevation="level5">Level 5</M3Card>
    </div>
  ),
};

/**
 * Clickable Card
 */
export const Clickable: Story = {
  args: {
    clickable: true,
    elevation: 'level1',
    children: 'Clickable card with hover elevation',
    onClick: () => alert('Card clicked!'),
  },
};

/**
 * Card with Rich Content
 */
export const RichContent: Story = {
  args: {
    elevation: 'level2',
    children: (
      <div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>
          Card Title
        </h3>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--md-sys-color-neutral-40)' }}>
          This is a card with rich content including a title and description text.
        </p>
      </div>
    ),
  },
};

/**
 * Clickable Card with Different Elevations
 */
export const ClickableElevations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <M3Card clickable elevation="level0" onClick={() => alert('Clicked!')}>
        Clickable Level 0 (hover → Level 1)
      </M3Card>
      <M3Card clickable elevation="level1" onClick={() => alert('Clicked!')}>
        Clickable Level 1 (hover → Level 2)
      </M3Card>
      <M3Card clickable elevation="level2" onClick={() => alert('Clicked!')}>
        Clickable Level 2 (hover → Level 3)
      </M3Card>
    </div>
  ),
};
