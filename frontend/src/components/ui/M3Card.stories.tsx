import type { Meta, StoryObj } from '@storybook/react';
import {
  M3Card,
  M3CardHeader,
  M3CardTitle,
  M3CardDescription,
  M3CardContent,
  M3CardActions,
} from './M3Card';
import { M3Button } from './M3Button';

const meta: Meta<typeof M3Card> = {
  title: 'M3/Surfaces/Card',
  component: M3Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'elevated', 'outlined'],
      description: 'The visual variant of the card',
    },
    interactive: {
      control: 'boolean',
      description: 'Whether the card responds to hover/interaction',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the card is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Card>;

// Primary Story
export const Primary: Story = {
  render: (args) => (
    <M3Card {...args}>
      <M3CardHeader>
        <M3CardTitle>Card Title</M3CardTitle>
        <M3CardDescription>Supporting text goes here</M3CardDescription>
      </M3CardHeader>
      <M3CardContent>
        <p>Card content area. This is where the main content of the card lives.</p>
      </M3CardContent>
      <M3CardActions>
        <M3Button variant="text">Cancel</M3Button>
        <M3Button variant="filled">Confirm</M3Button>
      </M3CardActions>
    </M3Card>
  ),
  args: {
    variant: 'elevated',
  },
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      <M3Card variant="filled">
        <M3CardHeader>
          <M3CardTitle>Filled Card</M3CardTitle>
          <M3CardDescription>Surface container color</M3CardDescription>
        </M3CardHeader>
        <M3CardContent>Content goes here</M3CardContent>
      </M3Card>

      <M3Card variant="elevated">
        <M3CardHeader>
          <M3CardTitle>Elevated Card</M3CardTitle>
          <M3CardDescription>With shadow elevation</M3CardDescription>
        </M3CardHeader>
        <M3CardContent>Content goes here</M3CardContent>
      </M3Card>

      <M3Card variant="outlined">
        <M3CardHeader>
          <M3CardTitle>Outlined Card</M3CardTitle>
          <M3CardDescription>With border outline</M3CardDescription>
        </M3CardHeader>
        <M3CardContent>Content goes here</M3CardContent>
      </M3Card>
    </div>
  ),
};

// Interactive Cards
export const Interactive: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      <M3Card variant="elevated" interactive onClick={() => alert('Card 1 clicked!')}>
        <M3CardHeader>
          <M3CardTitle>Interactive Card</M3CardTitle>
          <M3CardDescription>Click me!</M3CardDescription>
        </M3CardHeader>
        <M3CardContent>This card responds to hover and click events.</M3CardContent>
      </M3Card>

      <M3Card variant="outlined" interactive onClick={() => alert('Card 2 clicked!')}>
        <M3CardHeader>
          <M3CardTitle>Outlined Interactive</M3CardTitle>
          <M3CardDescription>Also clickable</M3CardDescription>
        </M3CardHeader>
        <M3CardContent>Outlined variant with hover effects.</M3CardContent>
      </M3Card>
    </div>
  ),
};

// With Actions
export const WithActions: Story = {
  render: () => (
    <M3Card variant="elevated" style={{ maxWidth: '400px' }}>
      <M3CardHeader>
        <M3CardTitle>Action Card</M3CardTitle>
        <M3CardDescription>Card with multiple actions</M3CardDescription>
      </M3CardHeader>
      <M3CardContent>
        <p>This card demonstrates the actions footer with multiple buttons.</p>
      </M3CardContent>
      <M3CardActions>
        <M3Button variant="text">Learn More</M3Button>
        <M3Button variant="tonal">Share</M3Button>
        <M3Button variant="filled">Apply</M3Button>
      </M3CardActions>
    </M3Card>
  ),
};

// Content Only
export const ContentOnly: Story = {
  render: () => (
    <M3Card variant="elevated" style={{ maxWidth: '400px' }}>
      <M3CardContent>
        <p>Simple card with only content, no header or actions.</p>
        <p>Perfect for displaying basic information.</p>
      </M3CardContent>
    </M3Card>
  ),
};

// Complex Card
export const ComplexCard: Story = {
  render: () => (
    <M3Card variant="elevated" style={{ maxWidth: '500px' }}>
      <M3CardHeader>
        <div>
          <M3CardTitle>Software Engineer</M3CardTitle>
          <M3CardDescription>Google • Mountain View, CA</M3CardDescription>
        </div>
      </M3CardHeader>
      <M3CardContent>
        <p><strong>Requirements:</strong></p>
        <ul>
          <li>5+ years of experience in software development</li>
          <li>Proficiency in TypeScript and React</li>
          <li>Experience with Material Design systems</li>
        </ul>
        <p><strong>Salary:</strong> $150,000 - $200,000</p>
      </M3CardContent>
      <M3CardActions>
        <M3Button variant="text">Save</M3Button>
        <M3Button variant="outlined">Learn More</M3Button>
        <M3Button variant="filled" color="primary">Apply Now</M3Button>
      </M3CardActions>
    </M3Card>
  ),
};

// Disabled State
export const Disabled: Story = {
  render: () => (
    <M3Card variant="elevated" disabled style={{ maxWidth: '400px' }}>
      <M3CardHeader>
        <M3CardTitle>Disabled Card</M3CardTitle>
        <M3CardDescription>This card is disabled</M3CardDescription>
      </M3CardHeader>
      <M3CardContent>
        Disabled cards have reduced opacity and no pointer events.
      </M3CardContent>
    </M3Card>
  ),
};

// Grid Layout
export const GridLayout: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <M3Card key={i} variant="elevated" interactive>
          <M3CardHeader>
            <M3CardTitle>Card {i}</M3CardTitle>
            <M3CardDescription>Card #{i} description</M3CardDescription>
          </M3CardHeader>
          <M3CardContent>
            Content for card number {i}.
          </M3CardContent>
          <M3CardActions>
            <M3Button variant="text" size="small">View</M3Button>
          </M3CardActions>
        </M3Card>
      ))}
    </div>
  ),
};

// Playground
export const Playground: Story = {
  args: {
    variant: 'elevated',
    interactive: false,
    disabled: false,
  },
  render: (args) => (
    <M3Card {...args} style={{ maxWidth: '400px' }}>
      <M3CardHeader>
        <M3CardTitle>Customizable Card</M3CardTitle>
        <M3CardDescription>Adjust the controls to customize</M3CardDescription>
      </M3CardHeader>
      <M3CardContent>
        <p>Use the controls panel to experiment with different variants and states.</p>
      </M3CardContent>
      <M3CardActions>
        <M3Button variant="text">Action 1</M3Button>
        <M3Button variant="filled">Action 2</M3Button>
      </M3CardActions>
    </M3Card>
  ),
};
