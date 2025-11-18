import type { Meta, StoryObj } from '@storybook/react';
import { M3Tooltip } from './M3Tooltip';

const meta: Meta<typeof M3Tooltip> = {
  title: 'M3/Utility/Tooltip',
  component: M3Tooltip,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Tooltip>;

const ButtonStyle = {
  padding: '10px 20px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 500,
  backgroundColor: '#1976d2',
  color: 'white',
};

export const Top: Story = {
  args: {
    title: 'This is a tooltip',
    placement: 'top',
    children: <button style={ButtonStyle}>Hover me (Top)</button>,
  },
};

export const Bottom: Story = {
  args: {
    title: 'This is a tooltip',
    placement: 'bottom',
    children: <button style={ButtonStyle}>Hover me (Bottom)</button>,
  },
};

export const Left: Story = {
  args: {
    title: 'This is a tooltip',
    placement: 'left',
    children: <button style={ButtonStyle}>Hover me (Left)</button>,
  },
};

export const Right: Story = {
  args: {
    title: 'This is a tooltip',
    placement: 'right',
    children: <button style={ButtonStyle}>Hover me (Right)</button>,
  },
};

export const AllPlacements: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '48px',
        padding: '48px',
        justifyItems: 'center',
      }}
    >
      <M3Tooltip title="Top placement" placement="top">
        <button style={ButtonStyle}>Top</button>
      </M3Tooltip>
      <M3Tooltip title="Bottom placement" placement="bottom">
        <button style={ButtonStyle}>Bottom</button>
      </M3Tooltip>
      <M3Tooltip title="Left placement" placement="left">
        <button style={ButtonStyle}>Left</button>
      </M3Tooltip>
      <M3Tooltip title="Right placement" placement="right">
        <button style={ButtonStyle}>Right</button>
      </M3Tooltip>
    </div>
  ),
};

export const LongText: Story = {
  args: {
    title: 'This is a longer tooltip text that demonstrates how the tooltip handles multiple lines of content',
    placement: 'top',
    children: <button style={ButtonStyle}>Long tooltip</button>,
  },
};

export const WithIcon: Story = {
  render: () => (
    <div style={{ padding: '48px' }}>
      <M3Tooltip title="Delete item" placement="top">
        <button
          style={{
            ...ButtonStyle,
            width: '40px',
            height: '40px',
            padding: '8px',
            borderRadius: '50%',
            backgroundColor: '#d32f2f',
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
      </M3Tooltip>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    title: 'This tooltip is disabled',
    disabled: true,
    children: <button style={ButtonStyle}>Disabled tooltip</button>,
  },
};

export const CustomDelay: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', padding: '48px' }}>
      <M3Tooltip title="No delay" enterDelay={0}>
        <button style={ButtonStyle}>No delay</button>
      </M3Tooltip>
      <M3Tooltip title="500ms delay" enterDelay={500}>
        <button style={ButtonStyle}>500ms delay</button>
      </M3Tooltip>
      <M3Tooltip title="1000ms delay" enterDelay={1000}>
        <button style={ButtonStyle}>1000ms delay</button>
      </M3Tooltip>
    </div>
  ),
};

export const Toolbar: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', padding: '48px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <M3Tooltip title="Bold">
        <button style={{ ...ButtonStyle, width: '40px', height: '40px', padding: '8px', backgroundColor: '#666' }}>
          <strong>B</strong>
        </button>
      </M3Tooltip>
      <M3Tooltip title="Italic">
        <button style={{ ...ButtonStyle, width: '40px', height: '40px', padding: '8px', backgroundColor: '#666' }}>
          <em>I</em>
        </button>
      </M3Tooltip>
      <M3Tooltip title="Underline">
        <button style={{ ...ButtonStyle, width: '40px', height: '40px', padding: '8px', backgroundColor: '#666' }}>
          <u>U</u>
        </button>
      </M3Tooltip>
      <div style={{ width: '1px', backgroundColor: '#ccc', margin: '0 4px' }} />
      <M3Tooltip title="Align Left">
        <button style={{ ...ButtonStyle, width: '40px', height: '40px', padding: '8px', backgroundColor: '#666' }}>
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
            <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" />
          </svg>
        </button>
      </M3Tooltip>
      <M3Tooltip title="Align Center">
        <button style={{ ...ButtonStyle, width: '40px', height: '40px', padding: '8px', backgroundColor: '#666' }}>
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
            <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" />
          </svg>
        </button>
      </M3Tooltip>
      <M3Tooltip title="Align Right">
        <button style={{ ...ButtonStyle, width: '40px', height: '40px', padding: '8px', backgroundColor: '#666' }}>
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
            <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" />
          </svg>
        </button>
      </M3Tooltip>
    </div>
  ),
};

export const OnTextInput: Story = {
  render: () => (
    <div style={{ padding: '48px' }}>
      <M3Tooltip title="Enter your email address" placement="top">
        <input
          type="email"
          placeholder="Email"
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            width: '300px',
          }}
        />
      </M3Tooltip>
    </div>
  ),
};

export const InlineElements: Story = {
  render: () => (
    <div style={{ padding: '48px', maxWidth: '600px' }}>
      <p>
        This is a paragraph with{' '}
        <M3Tooltip title="This is a tooltip on inline text" placement="top">
          <span style={{ textDecoration: 'underline', cursor: 'help' }}>tooltips on inline elements</span>
        </M3Tooltip>
        {' '}that can provide additional context or information when you hover over them.
      </p>
    </div>
  ),
};

export const AccessibilityDemo: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '48px' }}>
      <p>These buttons have tooltips that are accessible via keyboard focus:</p>
      <div style={{ display: 'flex', gap: '16px' }}>
        <M3Tooltip title="Press Enter to submit">
          <button style={ButtonStyle}>Submit</button>
        </M3Tooltip>
        <M3Tooltip title="Press Enter to cancel">
          <button style={ButtonStyle}>Cancel</button>
        </M3Tooltip>
        <M3Tooltip title="Press Enter to save">
          <button style={ButtonStyle}>Save</button>
        </M3Tooltip>
      </div>
      <p style={{ fontSize: '14px', color: '#666' }}>
        Try tabbing through these buttons - tooltips will appear on focus
      </p>
    </div>
  ),
};
