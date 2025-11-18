import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { M3Popover } from './M3Popover';

const meta: Meta<typeof M3Popover> = {
  title: 'M3/Utility/Popover',
  component: M3Popover,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Popover>;

const ButtonStyle = {
  padding: '10px 20px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 500,
  backgroundColor: '#1976d2',
  color: 'white',
};

export const BasicPopover: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    return (
      <div style={{ padding: '100px' }}>
        <button
          style={ButtonStyle}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Open Popover
        </button>
        <M3Popover
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          placement="bottom"
        >
          <div style={{ padding: '16px', minWidth: '200px' }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Popover Title</h4>
            <p style={{ margin: 0 }}>This is the popover content.</p>
          </div>
        </M3Popover>
      </div>
    );
  },
};

export const AllPlacements: Story = {
  render: () => {
    const [anchorTop, setAnchorTop] = useState<HTMLElement | null>(null);
    const [anchorBottom, setAnchorBottom] = useState<HTMLElement | null>(null);
    const [anchorLeft, setAnchorLeft] = useState<HTMLElement | null>(null);
    const [anchorRight, setAnchorRight] = useState<HTMLElement | null>(null);

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '100px',
          padding: '100px',
        }}
      >
        <div>
          <button style={ButtonStyle} onClick={(e) => setAnchorTop(e.currentTarget)}>
            Top
          </button>
          <M3Popover
            open={Boolean(anchorTop)}
            anchorEl={anchorTop}
            onClose={() => setAnchorTop(null)}
            placement="top"
          >
            <div style={{ padding: '16px' }}>Top placement</div>
          </M3Popover>
        </div>

        <div>
          <button style={ButtonStyle} onClick={(e) => setAnchorBottom(e.currentTarget)}>
            Bottom
          </button>
          <M3Popover
            open={Boolean(anchorBottom)}
            anchorEl={anchorBottom}
            onClose={() => setAnchorBottom(null)}
            placement="bottom"
          >
            <div style={{ padding: '16px' }}>Bottom placement</div>
          </M3Popover>
        </div>

        <div>
          <button style={ButtonStyle} onClick={(e) => setAnchorLeft(e.currentTarget)}>
            Left
          </button>
          <M3Popover
            open={Boolean(anchorLeft)}
            anchorEl={anchorLeft}
            onClose={() => setAnchorLeft(null)}
            placement="left"
          >
            <div style={{ padding: '16px' }}>Left placement</div>
          </M3Popover>
        </div>

        <div>
          <button style={ButtonStyle} onClick={(e) => setAnchorRight(e.currentTarget)}>
            Right
          </button>
          <M3Popover
            open={Boolean(anchorRight)}
            anchorEl={anchorRight}
            onClose={() => setAnchorRight(null)}
            placement="right"
          >
            <div style={{ padding: '16px' }}>Right placement</div>
          </M3Popover>
        </div>
      </div>
    );
  },
};

export const MenuPopover: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    return (
      <div style={{ padding: '100px' }}>
        <button
          style={ButtonStyle}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Open Menu
        </button>
        <M3Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
        >
          <div style={{ minWidth: '200px' }}>
            <div
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              onClick={() => setAnchorEl(null)}
            >
              Profile
            </div>
            <div
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              onClick={() => setAnchorEl(null)}
            >
              Settings
            </div>
            <div style={{ height: '1px', backgroundColor: '#e0e0e0', margin: '4px 0' }} />
            <div
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                color: '#d32f2f',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ffebee')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              onClick={() => setAnchorEl(null)}
            >
              Logout
            </div>
          </div>
        </M3Popover>
      </div>
    );
  },
};

export const UserCardPopover: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    return (
      <div style={{ padding: '100px' }}>
        <button
          style={ButtonStyle}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          View Profile
        </button>
        <M3Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
        >
          <div style={{ padding: '24px', maxWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}
              >
                JD
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>John Doe</div>
                <div style={{ fontSize: '14px', color: '#666' }}>john.doe@example.com</div>
              </div>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>
              Software Engineer with 5 years of experience in web development.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ ...ButtonStyle, flex: 1 }}>Follow</button>
              <button style={{ ...ButtonStyle, flex: 1, backgroundColor: '#666' }}>Message</button>
            </div>
          </div>
        </M3Popover>
      </div>
    );
  },
};

export const FormPopover: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    return (
      <div style={{ padding: '100px' }}>
        <button
          style={ButtonStyle}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Add Comment
        </button>
        <M3Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
        >
          <div style={{ padding: '16px', width: '400px' }}>
            <h4 style={{ margin: '0 0 12px 0' }}>Add a Comment</h4>
            <textarea
              placeholder="Write your comment here..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
              <button
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                }}
                onClick={() => setAnchorEl(null)}
              >
                Cancel
              </button>
              <button style={{ padding: '8px 16px', ...ButtonStyle }} onClick={() => setAnchorEl(null)}>
                Submit
              </button>
            </div>
          </div>
        </M3Popover>
      </div>
    );
  },
};

export const ColorPickerPopover: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [selectedColor, setSelectedColor] = useState('#1976d2');

    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
      '#009688', '#4caf50', '#8bc34a', '#cddc39',
      '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
    ];

    return (
      <div style={{ padding: '100px' }}>
        <button
          style={{ ...ButtonStyle, backgroundColor: selectedColor }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Select Color
        </button>
        <M3Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
        >
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {colors.map((color) => (
                <div
                  key={color}
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: color,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: color === selectedColor ? '3px solid #000' : 'none',
                  }}
                  onClick={() => {
                    setSelectedColor(color);
                    setAnchorEl(null);
                  }}
                />
              ))}
            </div>
          </div>
        </M3Popover>
      </div>
    );
  },
};

export const NestedPopover: Story = {
  render: () => {
    const [mainAnchor, setMainAnchor] = useState<HTMLElement | null>(null);
    const [nestedAnchor, setNestedAnchor] = useState<HTMLElement | null>(null);

    return (
      <div style={{ padding: '100px' }}>
        <button
          style={ButtonStyle}
          onClick={(e) => setMainAnchor(e.currentTarget)}
        >
          Open Main Menu
        </button>
        <M3Popover
          open={Boolean(mainAnchor)}
          anchorEl={mainAnchor}
          onClose={() => setMainAnchor(null)}
        >
          <div style={{ minWidth: '200px' }}>
            <div
              style={{ padding: '12px 16px', cursor: 'pointer' }}
              onClick={(e) => setNestedAnchor(e.currentTarget)}
            >
              More Options →
            </div>
            <div
              style={{ padding: '12px 16px', cursor: 'pointer' }}
              onClick={() => setMainAnchor(null)}
            >
              Close
            </div>
          </div>
        </M3Popover>
        <M3Popover
          open={Boolean(nestedAnchor)}
          anchorEl={nestedAnchor}
          onClose={() => setNestedAnchor(null)}
          placement="right"
        >
          <div style={{ padding: '16px', minWidth: '150px' }}>
            <div>Nested Option 1</div>
            <div>Nested Option 2</div>
            <div>Nested Option 3</div>
          </div>
        </M3Popover>
      </div>
    );
  },
};
