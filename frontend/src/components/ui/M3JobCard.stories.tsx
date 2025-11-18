import type { Meta, StoryObj } from '@storybook/react';
import { M3JobCard } from './M3JobCard';

const meta: Meta<typeof M3JobCard> = {
  title: 'M3/Cards/JobCard',
  component: M3JobCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'filled', 'outlined'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3JobCard>;

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
    logo: 'https://logo.clearbit.com/google.com',
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    jobType: 'Full-time',
    salary: '$150k - $200k',
    description: 'Join our team building innovative products that impact billions of users worldwide.',
    tags: ['React', 'TypeScript', 'Node.js'],
    postedDate: '2 days ago',
    actions: <button style={ButtonStyle}>Apply Now</button>,
  },
};

export const Featured: Story = {
  args: {
    logo: 'https://logo.clearbit.com/microsoft.com',
    title: 'Principal Engineer',
    company: 'Microsoft',
    location: 'Seattle, WA',
    jobType: 'Full-time',
    salary: '$180k - $250k',
    description: 'Lead the development of next-generation cloud infrastructure.',
    tags: ['Azure', 'Kubernetes', 'Go'],
    postedDate: '1 day ago',
    featured: true,
    actions: (
      <>
        <button style={ButtonStyle}>Quick Apply</button>
        <button style={{ ...ButtonStyle, backgroundColor: '#666' }}>Save</button>
      </>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
      <M3JobCard
        variant="elevated"
        logo="https://logo.clearbit.com/netflix.com"
        title="Frontend Developer"
        company="Netflix"
        location="Los Gatos, CA"
        jobType="Full-time"
        tags={['React', 'JavaScript']}
        actions={<button style={ButtonStyle}>Apply</button>}
      />
      <M3JobCard
        variant="filled"
        logo="https://logo.clearbit.com/stripe.com"
        title="Backend Engineer"
        company="Stripe"
        location: Remote"
        jobType="Full-time"
        tags={['Python', 'PostgreSQL']}
        actions={<button style={ButtonStyle}>Apply</button>}
      />
      <M3JobCard
        variant="outlined"
        logo="https://logo.clearbit.com/airbnb.com"
        title="Product Designer"
        company="Airbnb"
        location="San Francisco, CA"
        jobType="Full-time"
        tags={['Figma', 'UX']}
        actions={<button style={ButtonStyle}>Apply</button>}
      />
    </div>
  ),
};

export const RemoteJob: Story = {
  render: () => (
    <M3JobCard
      variant="elevated"
      logo="https://logo.clearbit.com/github.com"
      title="Developer Advocate"
      company="GitHub"
      location="Remote"
      jobType="Full-time"
      salary="$120k - $160k"
      description="Help developers succeed by creating content, speaking at events, and building relationships with the community."
      tags={['Developer Relations', 'Public Speaking', 'Content Creation']}
      postedDate="5 days ago"
      actions={
        <>
          <button style={ButtonStyle}>Apply Now</button>
          <button style={{ ...ButtonStyle, backgroundColor: 'transparent', color: '#1976d2', border: '1px solid #1976d2' }}>
            Learn More
          </button>
        </>
      }
    />
  ),
};

export const ClickableJob: Story = {
  args: {
    logo: 'https://logo.clearbit.com/spotify.com',
    title: 'Mobile Engineer',
    company: 'Spotify',
    location: 'Stockholm, Sweden',
    jobType: 'Full-time',
    salary: '€80k - €120k',
    description: 'Build features that millions of users love in our mobile apps.',
    tags: ['iOS', 'Swift', 'Kotlin'],
    postedDate: '3 days ago',
    clickable: true,
    onCardClick: () => alert('Job clicked!'),
    actions: (
      <button style={ButtonStyle} onClick={(e) => e.stopPropagation()}>
        View Details
      </button>
    ),
  },
};

export const StartupJob: Story = {
  render: () => (
    <M3JobCard
      variant="filled"
      logo="https://logo.clearbit.com/notion.so"
      title="Full Stack Engineer"
      company="Notion"
      location="San Francisco, CA"
      jobType="Full-time"
      salary="$140k - $190k + equity"
      description="Join a fast-growing startup building the future of work. Work on challenging problems with a talented team."
      tags={['React', 'Node.js', 'PostgreSQL', 'TypeScript']}
      postedDate="1 week ago"
      featured={true}
      actions={
        <>
          <button style={ButtonStyle}>Apply Now</button>
          <button style={{ ...ButtonStyle, backgroundColor: '#666' }}>Save for Later</button>
        </>
      }
    />
  ),
};

export const InternshipOpening: Story = {
  render: () => (
    <M3JobCard
      variant="outlined"
      logo="https://logo.clearbit.com/meta.com"
      title="Software Engineering Intern"
      company="Meta"
      location="Menlo Park, CA"
      jobType="Internship"
      salary="$8k/month"
      description="12-week summer internship working on real projects that impact millions of users."
      tags={['Python', 'React', 'Machine Learning']}
      postedDate="2 weeks ago"
      actions={<button style={ButtonStyle}>Apply</button>}
    />
  ),
};

export const ContractRole: Story = {
  render: () => (
    <M3JobCard
      variant="elevated"
      logo="https://logo.clearbit.com/shopify.com"
      title="Senior React Developer"
      company="Shopify"
      location="Remote (US/Canada)"
      jobType="Contract (6 months)"
      salary="$90/hour"
      description="Help build merchant-facing features for our e-commerce platform."
      tags={['React', 'GraphQL', 'Ruby on Rails']}
      postedDate="4 days ago"
      actions={
        <>
          <button style={ButtonStyle}>Submit Proposal</button>
          <button style={{ ...ButtonStyle, backgroundColor: '#666' }}>More Info</button>
        </>
      }
    />
  ),
};

export const NoDescription: Story = {
  args: {
    logo: 'https://logo.clearbit.com/uber.com',
    title: 'Data Scientist',
    company: 'Uber',
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    salary: '$130k - $180k',
    tags: ['Python', 'TensorFlow', 'SQL'],
    postedDate: '1 day ago',
    actions: <button style={ButtonStyle}>Apply</button>,
  },
};

export const MinimalInfo: Story = {
  args: {
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'New York, NY',
    actions: <button style={ButtonStyle}>Apply</button>,
  },
};

export const ManyTags: Story = {
  render: () => (
    <M3JobCard
      variant="elevated"
      logo="https://logo.clearbit.com/amazon.com"
      title="Cloud Solutions Architect"
      company="Amazon Web Services"
      location="Seattle, WA"
      jobType="Full-time"
      salary="$150k - $220k"
      description="Design and implement cloud solutions for enterprise customers."
      tags={[
        'AWS',
        'Docker',
        'Kubernetes',
        'Terraform',
        'Python',
        'Go',
        'CloudFormation',
        'Lambda',
        'EC2',
        'S3',
      ]}
      postedDate="3 days ago"
      actions={<button style={ButtonStyle}>Apply Now</button>}
    />
  ),
};

export const JobList: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px' }}>
      {[
        {
          logo: 'https://logo.clearbit.com/tesla.com',
          title: 'Embedded Software Engineer',
          company: 'Tesla',
          location: 'Fremont, CA',
          jobType: 'Full-time',
          salary: '$140k - $200k',
          tags: ['C++', 'Embedded', 'Automotive'],
        },
        {
          logo: 'https://logo.clearbit.com/apple.com',
          title: 'iOS Engineer',
          company: 'Apple',
          location: 'Cupertino, CA',
          jobType: 'Full-time',
          salary: '$160k - $220k',
          tags: ['Swift', 'SwiftUI', 'UIKit'],
          featured: true,
        },
        {
          logo: 'https://logo.clearbit.com/salesforce.com',
          title: 'DevOps Engineer',
          company: 'Salesforce',
          location: 'Remote',
          jobType: 'Full-time',
          salary: '$130k - $180k',
          tags: ['CI/CD', 'Jenkins', 'AWS'],
        },
      ].map((job, index) => (
        <M3JobCard
          key={index}
          variant="elevated"
          logo={job.logo}
          title={job.title}
          company={job.company}
          location={job.location}
          jobType={job.jobType}
          salary={job.salary}
          tags={job.tags}
          featured={job.featured}
          postedDate={`${index + 1} day${index !== 0 ? 's' : ''} ago`}
          actions={
            <>
              <button style={{ ...ButtonStyle, fontSize: '14px', padding: '6px 16px' }}>Apply</button>
              <button
                style={{
                  ...ButtonStyle,
                  fontSize: '14px',
                  padding: '6px 16px',
                  backgroundColor: 'transparent',
                  color: '#1976d2',
                  border: '1px solid #1976d2',
                }}
              >
                Save
              </button>
            </>
          }
        />
      ))}
    </div>
  ),
};

export const GridLayout: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <M3JobCard
          key={num}
          variant="elevated"
          title={`Software Engineer ${num}`}
          company={`Company ${num}`}
          location="Remote"
          jobType="Full-time"
          salary="Competitive"
          tags={['React', 'TypeScript']}
          postedDate={`${num} day${num !== 1 ? 's' : ''} ago`}
          actions={<button style={{ ...ButtonStyle, fontSize: '14px', padding: '6px 16px' }}>Apply</button>}
        />
      ))}
    </div>
  ),
};
