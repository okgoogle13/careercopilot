import type { Meta, StoryObj } from '@storybook/react';
import { M3ActionCard } from './M3ActionCard';

const meta: Meta<typeof M3ActionCard> = {
  title: 'M3/Cards/ActionCard',
  component: M3ActionCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'filled', 'outlined'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3ActionCard>;

const ButtonStyle = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 500,
  backgroundColor: '#1976d2',
  color: 'white',
};

export const Basic: Story = {
  args: {
    title: 'Card Title',
    description: 'This is a basic action card with a title and description.',
    actions: (
      <>
        <button style={ButtonStyle}>Action 1</button>
        <button style={{ ...ButtonStyle, backgroundColor: '#666' }}>Action 2</button>
      </>
    ),
  },
};

export const WithMedia: Story = {
  args: {
    title: 'Beautiful Landscape',
    subtitle: 'Nature Photography',
    description: 'A stunning view of mountains during sunset.',
    media: (
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
        alt="Landscape"
        style={{ height: '200px', objectFit: 'cover' }}
      />
    ),
    actions: (
      <>
        <button style={ButtonStyle}>View</button>
        <button style={{ ...ButtonStyle, backgroundColor: '#666' }}>Share</button>
      </>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      <M3ActionCard
        variant="elevated"
        title="Elevated Card"
        description="This card has elevation and shadow."
        actions={<button style={ButtonStyle}>Action</button>}
      />
      <M3ActionCard
        variant="filled"
        title="Filled Card"
        description="This card has a filled background."
        actions={<button style={ButtonStyle}>Action</button>}
      />
      <M3ActionCard
        variant="outlined"
        title="Outlined Card"
        description="This card has an outline border."
        actions={<button style={ButtonStyle}>Action</button>}
      />
    </div>
  ),
};

export const Clickable: Story = {
  args: {
    title: 'Clickable Card',
    description: 'Click anywhere on this card to trigger an action.',
    clickable: true,
    onCardClick: () => alert('Card clicked!'),
    actions: (
      <button style={ButtonStyle} onClick={(e) => e.stopPropagation()}>
        Button Action
      </button>
    ),
  },
};

export const ArticleCard: Story = {
  render: () => (
    <M3ActionCard
      variant="elevated"
      media={
        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop"
          alt="Article"
          style={{ height: '200px', objectFit: 'cover' }}
        />
      }
      title="Getting Started with React"
      subtitle="Web Development • 5 min read"
      description="Learn the fundamentals of React and build your first component. This comprehensive guide covers everything you need to know."
      actions={
        <>
          <button style={ButtonStyle}>Read More</button>
          <button style={{ ...ButtonStyle, backgroundColor: 'transparent', color: '#1976d2', border: '1px solid #1976d2' }}>
            Save
          </button>
        </>
      }
    />
  ),
};

export const ProductCard: Story = {
  render: () => (
    <M3ActionCard
      variant="outlined"
      media={
        <img
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=250&fit=crop"
          alt="Product"
          style={{ height: '250px', objectFit: 'cover' }}
        />
      }
      title="Premium Headphones"
      subtitle="$299.99"
      description="High-quality wireless headphones with active noise cancellation and 30-hour battery life."
      actions={
        <>
          <button style={ButtonStyle}>Add to Cart</button>
          <button style={{ ...ButtonStyle, backgroundColor: '#666' }}>Details</button>
        </>
      }
    />
  ),
};

export const EventCard: Story = {
  render: () => (
    <M3ActionCard
      variant="filled"
      title="Tech Conference 2024"
      subtitle="March 15-17, 2024 • San Francisco, CA"
      description="Join us for three days of inspiring talks, workshops, and networking with industry leaders."
      actions={
        <>
          <button style={ButtonStyle}>Register Now</button>
          <button style={{ ...ButtonStyle, backgroundColor: 'transparent', color: '#1976d2', border: '1px solid #1976d2' }}>
            Learn More
          </button>
        </>
      }
    />
  ),
};

export const NotificationCard: Story = {
  render: () => (
    <M3ActionCard
      variant="elevated"
      title="New Message"
      subtitle="2 minutes ago"
      description="You have a new message from Sarah. Click to view the conversation."
      actions={
        <>
          <button style={ButtonStyle}>View Message</button>
          <button style={{ ...ButtonStyle, backgroundColor: '#666' }}>Mark as Read</button>
        </>
      }
    />
  ),
};

export const CustomContent: Story = {
  render: () => (
    <M3ActionCard
      variant="elevated"
      title="User Statistics"
      subtitle="Monthly Report"
    >
      <div style={{ padding: '16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span>Total Users:</span>
          <strong>1,234</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span>Active Users:</span>
          <strong>987</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Growth:</span>
          <strong style={{ color: '#4caf50' }}>+12.5%</strong>
        </div>
      </div>
    </M3ActionCard>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <M3ActionCard
        variant="elevated"
        title="Terms and Conditions"
        subtitle="Last updated: January 2024"
        description="Please read these terms and conditions carefully before using our service. By accessing or using the service, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service."
        actions={
          <>
            <button style={ButtonStyle}>Accept</button>
            <button style={{ ...ButtonStyle, backgroundColor: '#d32f2f' }}>Decline</button>
          </>
        }
      />
    </div>
  ),
};

export const MinimalCard: Story = {
  args: {
    title: 'Simple Card',
    description: 'Just a title and description, no actions.',
  },
};

export const ActionsOnly: Story = {
  render: () => (
    <M3ActionCard
      variant="elevated"
      actions={
        <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'space-between', padding: '8px' }}>
          <button style={ButtonStyle}>Option 1</button>
          <button style={ButtonStyle}>Option 2</button>
          <button style={ButtonStyle}>Option 3</button>
        </div>
      }
    >
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Choose an Option</h3>
        <p style={{ margin: 0, color: '#666' }}>Select one of the actions below</p>
      </div>
    </M3ActionCard>
  ),
};

export const GridLayout: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <M3ActionCard
          key={num}
          variant="elevated"
          title={`Card ${num}`}
          description="This is a sample card in a grid layout."
          actions={<button style={ButtonStyle}>Action</button>}
        />
      ))}
    </div>
  ),
};
