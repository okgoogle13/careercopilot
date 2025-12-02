import type { Meta, StoryObj } from '@storybook/react';
import { M3ProfileCard } from './M3ProfileCard';

const meta: Meta<typeof M3ProfileCard> = {
  title: 'M3/Cards/ProfileCard',
  component: M3ProfileCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'filled', 'outlined'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3ProfileCard>;

const ButtonStyle = {
  padding: '8px 24px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 500,
  backgroundColor: '#1976d2',
  color: 'white',
};

export const Basic: Story = {
  args: {
    avatar: 'https://i.pravatar.cc/150?img=1',
    name: 'John Doe',
    title: 'Software Engineer',
    bio: 'Passionate about building great products and solving complex problems.',
    actions: <button style={ButtonStyle}>Follow</button>,
  },
};

export const WithStats: Story = {
  args: {
    avatar: 'https://i.pravatar.cc/150?img=2',
    name: 'Jane Smith',
    title: 'Product Designer',
    bio: 'Creating beautiful and intuitive user experiences.',
    stats: [
      { label: 'Followers', value: '1.2K' },
      { label: 'Following', value: 567 },
      { label: 'Posts', value: 89 },
    ],
    actions: (
      <>
        <button style={ButtonStyle}>Follow</button>
        <button style={{ ...ButtonStyle, backgroundColor: '#666' }}>Message</button>
      </>
    ),
  },
};

export const WithCover: Story = {
  args: {
    coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=200&fit=crop',
    avatar: 'https://i.pravatar.cc/150?img=3',
    name: 'Alice Johnson',
    title: 'Marketing Manager',
    bio: 'Helping brands tell their stories and connect with audiences.',
    stats: [
      { label: 'Campaigns', value: 24 },
      { label: 'Reach', value: '50K' },
    ],
    actions: <button style={ButtonStyle}>Connect</button>,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      <M3ProfileCard
        variant="elevated"
        avatar="https://i.pravatar.cc/150?img=4"
        name="Elevated Card"
        title="UI/UX Designer"
        bio="This card has elevation and shadow."
        actions={<button style={ButtonStyle}>Follow</button>}
      />
      <M3ProfileCard
        variant="filled"
        avatar="https://i.pravatar.cc/150?img=5"
        name="Filled Card"
        title="Frontend Developer"
        bio="This card has a filled background."
        actions={<button style={ButtonStyle}>Follow</button>}
      />
      <M3ProfileCard
        variant="outlined"
        avatar="https://i.pravatar.cc/150?img=6"
        name="Outlined Card"
        title="Backend Engineer"
        bio="This card has an outline border."
        actions={<button style={ButtonStyle}>Follow</button>}
      />
    </div>
  ),
};

export const ClickableProfile: Story = {
  args: {
    avatar: 'https://i.pravatar.cc/150?img=7',
    name: 'Bob Wilson',
    title: 'Data Scientist',
    bio: 'Turning data into actionable insights.',
    clickable: true,
    onCardClick: () => alert('Profile clicked!'),
    actions: (
      <button style={ButtonStyle} onClick={(e) => e.stopPropagation()}>
        View Profile
      </button>
    ),
  },
};

export const TeamMember: Story = {
  render: () => (
    <M3ProfileCard
      variant="elevated"
      avatar="https://i.pravatar.cc/150?img=8"
      name="Sarah Chen"
      title="Team Lead • Engineering"
      bio="Leading a talented team of engineers building the future of web applications."
      stats={[
        { label: 'Projects', value: 12 },
        { label: 'Team Size', value: 8 },
      ]}
      actions={
        <>
          <button style={ButtonStyle}>Send Email</button>
          <button style={{ ...ButtonStyle, backgroundColor: '#666' }}>Schedule Meeting</button>
        </>
      }
    />
  ),
};

export const SocialProfile: Story = {
  render: () => (
    <M3ProfileCard
      variant="filled"
      coverImage="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=200&fit=crop"
      avatar="https://i.pravatar.cc/150?img=9"
      name="Mike Rodriguez"
      title="@mikerodriguez • Content Creator"
      bio="Sharing my journey in tech and photography. Building in public 🚀"
      stats={[
        { label: 'Followers', value: '12.5K' },
        { label: 'Following', value: '1.2K' },
        { label: 'Posts', value: 234 },
      ]}
      actions={
        <>
          <button style={ButtonStyle}>Follow</button>
          <button style={{ ...ButtonStyle, backgroundColor: 'transparent', color: '#1976d2', border: '1px solid #1976d2' }}>
            Message
          </button>
        </>
      }
    />
  ),
};

export const Consultant: Story = {
  render: () => (
    <M3ProfileCard
      variant="outlined"
      avatar="https://i.pravatar.cc/150?img=10"
      name="Dr. Emily Wang"
      title="Business Consultant"
      bio="15+ years helping companies scale and optimize their operations."
    >
      <div style={{ marginTop: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{ padding: '4px 12px', backgroundColor: '#e0e0e0', borderRadius: '16px', fontSize: '12px' }}>
            Strategy
          </span>
          <span style={{ padding: '4px 12px', backgroundColor: '#e0e0e0', borderRadius: '16px', fontSize: '12px' }}>
            Operations
          </span>
          <span style={{ padding: '4px 12px', backgroundColor: '#e0e0e0', borderRadius: '16px', fontSize: '12px' }}>
            Growth
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ ...ButtonStyle, flex: 1 }}>Book Consultation</button>
        </div>
      </div>
    </M3ProfileCard>
  ),
};

export const Mentor: Story = {
  render: () => (
    <M3ProfileCard
      variant="elevated"
      avatar="https://i.pravatar.cc/150?img=11"
      name="David Martinez"
      title="Senior Engineering Mentor"
      bio="Helping junior developers grow their careers. Available for 1-on-1 mentorship."
      stats={[
        { label: 'Mentees', value: 45 },
        { label: 'Sessions', value: 230 },
        { label: 'Rating', value: '4.9' },
      ]}
      actions={
        <>
          <button style={ButtonStyle}>Request Mentorship</button>
          <button style={{ ...ButtonStyle, backgroundColor: '#666' }}>View Calendar</button>
        </>
      }
    />
  ),
};

export const WithBadges: Story = {
  render: () => (
    <M3ProfileCard
      variant="elevated"
      coverImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=200&fit=crop"
      avatar="https://i.pravatar.cc/150?img=12"
      name="Lisa Anderson"
      title="Cloud Architect"
    >
      <p style={{ margin: '0 0 12px 0', color: '#666' }}>
        Certified AWS Solutions Architect building scalable cloud infrastructure.
      </p>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ padding: '4px 12px', backgroundColor: '#1976d2', color: 'white', borderRadius: '16px', fontSize: '12px', fontWeight: 500 }}>
          ⭐ Top Contributor
        </div>
        <div style={{ padding: '4px 12px', backgroundColor: '#4caf50', color: 'white', borderRadius: '16px', fontSize: '12px', fontWeight: 500 }}>
          ✓ Verified
        </div>
      </div>
      <button style={{ ...ButtonStyle, width: '100%' }}>View Certifications</button>
    </M3ProfileCard>
  ),
};

export const MinimalProfile: Story = {
  args: {
    avatar: 'https://i.pravatar.cc/150?img=13',
    name: 'Chris Taylor',
    title: 'Freelance Designer',
  },
};

export const GridLayout: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <M3ProfileCard
          key={num}
          variant="elevated"
          avatar={`https://i.pravatar.cc/150?img=${num + 20}`}
          name={`User ${num}`}
          title="Software Developer"
          bio="Building amazing web applications."
          stats={[
            { label: 'Posts', value: Math.floor(Math.random() * 100) },
            { label: 'Followers', value: Math.floor(Math.random() * 1000) },
          ]}
          actions={<button style={{ ...ButtonStyle, fontSize: '14px', padding: '6px 16px' }}>Follow</button>}
        />
      ))}
    </div>
  ),
};
