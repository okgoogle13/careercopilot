import type { Meta, StoryObj } from '@storybook/react';
import { M3Grid } from './M3Grid';

const meta: Meta<typeof M3Grid> = {
  title: 'M3/Layout/Grid',
  component: M3Grid,
  tags: ['autodocs'],
  argTypes: {
    container: {
      control: 'boolean',
    },
    item: {
      control: 'boolean',
    },
    spacing: {
      control: 'select',
      options: [1, 2, 3, 4, 6, 8],
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Grid>;

export const BasicGrid: Story = {
  render: () => (
    <M3Grid container spacing={2}>
      <M3Grid item xs={12} md={6}>
        <div style={{ padding: '16px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>
          xs=12 md=6
        </div>
      </M3Grid>
      <M3Grid item xs={12} md={6}>
        <div style={{ padding: '16px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>
          xs=12 md=6
        </div>
      </M3Grid>
    </M3Grid>
  ),
};

export const ThreeColumns: Story = {
  render: () => (
    <M3Grid container spacing={3}>
      <M3Grid item xs={12} sm={4}>
        <div style={{ padding: '16px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>
          xs=12 sm=4
        </div>
      </M3Grid>
      <M3Grid item xs={12} sm={4}>
        <div style={{ padding: '16px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>
          xs=12 sm=4
        </div>
      </M3Grid>
      <M3Grid item xs={12} sm={4}>
        <div style={{ padding: '16px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>
          xs=12 sm=4
        </div>
      </M3Grid>
    </M3Grid>
  ),
};

export const ResponsiveGrid: Story = {
  render: () => (
    <M3Grid container spacing={4}>
      <M3Grid item xs={12} sm={6} md={4} lg={3}>
        <div style={{ padding: '16px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>
          xs=12 sm=6 md=4 lg=3
        </div>
      </M3Grid>
      <M3Grid item xs={12} sm={6} md={4} lg={3}>
        <div style={{ padding: '16px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>
          xs=12 sm=6 md=4 lg=3
        </div>
      </M3Grid>
      <M3Grid item xs={12} sm={6} md={4} lg={3}>
        <div style={{ padding: '16px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>
          xs=12 sm=6 md=4 lg=3
        </div>
      </M3Grid>
      <M3Grid item xs={12} sm={6} md={4} lg={3}>
        <div style={{ padding: '16px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>
          xs=12 sm=6 md=4 lg=3
        </div>
      </M3Grid>
    </M3Grid>
  ),
};

export const NestedGrid: Story = {
  render: () => (
    <M3Grid container spacing={2}>
      <M3Grid item xs={12} md={8}>
        <div style={{ padding: '16px', backgroundColor: '#e0e0e0' }}>
          <p style={{ marginBottom: '8px' }}>Main Content (xs=12 md=8)</p>
          <M3Grid container spacing={1}>
            <M3Grid item xs={6}>
              <div style={{ padding: '8px', backgroundColor: '#c0c0c0', textAlign: 'center' }}>
                Nested xs=6
              </div>
            </M3Grid>
            <M3Grid item xs={6}>
              <div style={{ padding: '8px', backgroundColor: '#c0c0c0', textAlign: 'center' }}>
                Nested xs=6
              </div>
            </M3Grid>
          </M3Grid>
        </div>
      </M3Grid>
      <M3Grid item xs={12} md={4}>
        <div style={{ padding: '16px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>
          Sidebar (xs=12 md=4)
        </div>
      </M3Grid>
    </M3Grid>
  ),
};

export const VariableSpacing: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '8px' }}>Spacing: 1</h3>
        <M3Grid container spacing={1}>
          <M3Grid item xs={4}>
            <div style={{ padding: '8px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>1</div>
          </M3Grid>
          <M3Grid item xs={4}>
            <div style={{ padding: '8px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>2</div>
          </M3Grid>
          <M3Grid item xs={4}>
            <div style={{ padding: '8px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>3</div>
          </M3Grid>
        </M3Grid>
      </div>
      <div>
        <h3 style={{ marginBottom: '8px' }}>Spacing: 4</h3>
        <M3Grid container spacing={4}>
          <M3Grid item xs={4}>
            <div style={{ padding: '8px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>1</div>
          </M3Grid>
          <M3Grid item xs={4}>
            <div style={{ padding: '8px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>2</div>
          </M3Grid>
          <M3Grid item xs={4}>
            <div style={{ padding: '8px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>3</div>
          </M3Grid>
        </M3Grid>
      </div>
      <div>
        <h3 style={{ marginBottom: '8px' }}>Spacing: 8</h3>
        <M3Grid container spacing={8}>
          <M3Grid item xs={4}>
            <div style={{ padding: '8px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>1</div>
          </M3Grid>
          <M3Grid item xs={4}>
            <div style={{ padding: '8px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>2</div>
          </M3Grid>
          <M3Grid item xs={4}>
            <div style={{ padding: '8px', backgroundColor: '#e0e0e0', textAlign: 'center' }}>3</div>
          </M3Grid>
        </M3Grid>
      </div>
    </div>
  ),
};
