import type { Meta, StoryObj } from '@storybook/react';
import { M3Container } from './M3Container';

const meta: Meta<typeof M3Container> = {
  title: 'M3/Layout/Container',
  component: M3Container,
  tags: ['autodocs'],
  argTypes: {
    maxWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', false],
    },
    disableGutters: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Container>;

const DemoContent = () => (
  <div style={{ backgroundColor: '#e0e0e0', padding: '16px', textAlign: 'center' }}>
    Container Content
  </div>
);

export const Default: Story = {
  render: () => (
    <M3Container>
      <DemoContent />
    </M3Container>
  ),
};

export const MaxWidthVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h3 style={{ marginBottom: '8px' }}>Small (sm)</h3>
        <M3Container maxWidth="sm">
          <DemoContent />
        </M3Container>
      </div>
      <div>
        <h3 style={{ marginBottom: '8px' }}>Medium (md)</h3>
        <M3Container maxWidth="md">
          <DemoContent />
        </M3Container>
      </div>
      <div>
        <h3 style={{ marginBottom: '8px' }}>Large (lg) - Default</h3>
        <M3Container maxWidth="lg">
          <DemoContent />
        </M3Container>
      </div>
      <div>
        <h3 style={{ marginBottom: '8px' }}>Extra Large (xl)</h3>
        <M3Container maxWidth="xl">
          <DemoContent />
        </M3Container>
      </div>
      <div>
        <h3 style={{ marginBottom: '8px' }}>2X Large (2xl)</h3>
        <M3Container maxWidth="2xl">
          <DemoContent />
        </M3Container>
      </div>
      <div>
        <h3 style={{ marginBottom: '8px' }}>No Max Width (false)</h3>
        <M3Container maxWidth={false}>
          <DemoContent />
        </M3Container>
      </div>
    </div>
  ),
};

export const WithGutters: Story = {
  render: () => (
    <div style={{ border: '2px solid red' }}>
      <M3Container>
        <div style={{ backgroundColor: '#e0e0e0', padding: '16px' }}>
          Container with gutters (default padding on sides)
        </div>
      </M3Container>
    </div>
  ),
};

export const NoGutters: Story = {
  render: () => (
    <div style={{ border: '2px solid red' }}>
      <M3Container disableGutters>
        <div style={{ backgroundColor: '#e0e0e0', padding: '16px' }}>
          Container without gutters (no padding on sides)
        </div>
      </M3Container>
    </div>
  ),
};

export const TypicalPage: Story = {
  render: () => (
    <M3Container maxWidth="lg">
      <div style={{ padding: '24px 0' }}>
        <h1>Page Title</h1>
        <p>
          This is a typical page layout using M3Container. The content is centered and has a max-width
          constraint for optimal reading width.
        </p>
        <div style={{ marginTop: '24px', display: 'grid', gap: '16px' }}>
          <div style={{ backgroundColor: '#f0f0f0', padding: '16px', borderRadius: '8px' }}>
            Section 1
          </div>
          <div style={{ backgroundColor: '#f0f0f0', padding: '16px', borderRadius: '8px' }}>
            Section 2
          </div>
          <div style={{ backgroundColor: '#f0f0f0', padding: '16px', borderRadius: '8px' }}>
            Section 3
          </div>
        </div>
      </div>
    </M3Container>
  ),
};

export const NestedContainers: Story = {
  render: () => (
    <M3Container maxWidth="xl">
      <div style={{ backgroundColor: '#e3f2fd', padding: '16px' }}>
        <h2>Outer Container (xl)</h2>
        <M3Container maxWidth="md">
          <div style={{ backgroundColor: '#fff3e0', padding: '16px' }}>
            <h3>Inner Container (md)</h3>
            <p>Nested containers can be used for progressive content narrowing</p>
          </div>
        </M3Container>
      </div>
    </M3Container>
  ),
};
