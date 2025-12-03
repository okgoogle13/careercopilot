import type { Meta, StoryObj } from '@storybook/react';
import { M3Accordion } from './M3Accordion';

/**
 * M3 Expressive Accordion Component
 *
 * Collapsible content sections. Use for FAQs, settings, or organizing related content.
 */
const meta: Meta<typeof M3Accordion> = {
  component: M3Accordion,
  title: 'M3 Expressive/Accordion',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    singleOpen: {
      control: 'boolean',
      description: 'If true, only one item can be open at a time',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Accordion (Multiple Open)
 */
export const Default: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <M3Accordion>
        <M3Accordion.Item header="What is Material Design 3?">
          Material Design 3 is the latest version of Google's design system, featuring expressive
          design tokens and improved accessibility.
        </M3Accordion.Item>
        <M3Accordion.Item header="How do I use M3 components?">
          Import the components from the m3-expressive directory and use them with M3 design tokens.
        </M3Accordion.Item>
        <M3Accordion.Item header="Are M3 components accessible?">
          Yes, all M3 components follow WCAG 2.1 AA guidelines and include proper ARIA attributes.
        </M3Accordion.Item>
      </M3Accordion>
    </div>
  ),
};

/**
 * Single Open Mode
 */
export const SingleOpen: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <M3Accordion singleOpen>
        <M3Accordion.Item header="Section 1">Content for section 1</M3Accordion.Item>
        <M3Accordion.Item header="Section 2">Content for section 2</M3Accordion.Item>
        <M3Accordion.Item header="Section 3">Content for section 3</M3Accordion.Item>
      </M3Accordion>
    </div>
  ),
};

/**
 * Accordion without Icons
 */
export const NoIcons: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <M3Accordion>
        <M3Accordion.Item header="Item without Icon" showIcon={false}>
          This accordion item does not show an expand/collapse icon.
        </M3Accordion.Item>
        <M3Accordion.Item header="Another Item" showIcon={false}>
          Another item without an icon.
        </M3Accordion.Item>
      </M3Accordion>
    </div>
  ),
};
