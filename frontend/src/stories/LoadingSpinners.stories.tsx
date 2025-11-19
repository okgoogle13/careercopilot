import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import {
  RotatingSpinner,
  PulsingDot,
  BouncingDots,
  GradientSpinner,
  MorphingLoader,
  LoadingSpinners,
} from '../components/ui/LoadingSpinners';

/**
 * LoadingSpinners - Collection of 5 animated loading spinner components
 *
 * All spinners use framer-motion for smooth, performant animations.
 * Each spinner has a unique animation style suitable for different UI contexts.
 */
const meta = {
  title: 'Components/LoadingSpinners',
  component: LoadingSpinners,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Collection of 5 animated loading spinner components with different visual styles. All use GPU-accelerated animations for 60fps performance.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoadingSpinners>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * All 5 spinner variants displayed together
 */
export const AllSpinners: Story = {
  render: () => <LoadingSpinners />,
};

/**
 * RotatingSpinner - Single circle with partial border that rotates continuously
 */
export const Rotating: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <RotatingSpinner />
      <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Default Size (24px)</Box>
    </Box>
  ),
};

/**
 * RotatingSpinner in different sizes
 */
export const RotatingSizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <RotatingSpinner size={16} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Small (16px)</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <RotatingSpinner size={24} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Medium (24px)</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <RotatingSpinner size={32} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Large (32px)</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <RotatingSpinner size={48} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>XLarge (48px)</Box>
      </Box>
    </Box>
  ),
};

/**
 * RotatingSpinner in different colors
 */
export const RotatingColors: Story = {
  render: () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <RotatingSpinner color="#a855f7" />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Purple</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <RotatingSpinner color="#10b981" />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Green</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <RotatingSpinner color="#f59e0b" />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Orange</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <RotatingSpinner color="#ef4444" />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Red</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <RotatingSpinner color="#3b82f6" />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Blue</Box>
      </Box>
    </Box>
  ),
};

/**
 * PulsingDot - Single filled circle with scale animation
 */
export const Pulsing: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <PulsingDot />
      <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Default Size (12px)</Box>
    </Box>
  ),
};

/**
 * PulsingDot in different sizes
 */
export const PulsingSizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <PulsingDot size={8} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Small (8px)</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <PulsingDot size={12} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Medium (12px)</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <PulsingDot size={16} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Large (16px)</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <PulsingDot size={24} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>XLarge (24px)</Box>
      </Box>
    </Box>
  ),
};

/**
 * BouncingDots - Three circles bouncing with staggered delays
 */
export const Bouncing: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <BouncingDots />
      <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Default Size (8px dots)</Box>
    </Box>
  ),
};

/**
 * BouncingDots in different sizes
 */
export const BouncingSizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <BouncingDots size={6} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Small (6px)</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <BouncingDots size={8} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Medium (8px)</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <BouncingDots size={12} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Large (12px)</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <BouncingDots size={16} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>XLarge (16px)</Box>
      </Box>
    </Box>
  ),
};

/**
 * BouncingDots in different colors
 */
export const BouncingColors: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <BouncingDots color="#a855f7" />
      <BouncingDots color="#10b981" />
      <BouncingDots color="#f59e0b" />
      <BouncingDots color="#ef4444" />
    </Box>
  ),
};

/**
 * GradientSpinner - Circular border with conic gradient that rotates
 */
export const Gradient: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <GradientSpinner />
      <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Default Size (32px)</Box>
    </Box>
  ),
};

/**
 * GradientSpinner in different sizes
 */
export const GradientSizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <GradientSpinner size={24} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Small (24px)</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <GradientSpinner size={32} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Medium (32px)</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <GradientSpinner size={48} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Large (48px)</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <GradientSpinner size={64} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>XLarge (64px)</Box>
      </Box>
    </Box>
  ),
};

/**
 * GradientSpinner in different colors
 */
export const GradientColors: Story = {
  render: () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <GradientSpinner color="#a855f7" />
      <GradientSpinner color="#10b981" />
      <GradientSpinner color="#f59e0b" />
      <GradientSpinner color="#ef4444" />
      <GradientSpinner color="#3b82f6" />
    </Box>
  ),
};

/**
 * MorphingLoader - Shape-shifting square/circle with morphing border-radius
 */
export const Morphing: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <MorphingLoader />
      <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Default Size (24px)</Box>
    </Box>
  ),
};

/**
 * MorphingLoader in different sizes
 */
export const MorphingSizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <MorphingLoader size={16} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Small (16px)</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <MorphingLoader size={24} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Medium (24px)</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <MorphingLoader size={32} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Large (32px)</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <MorphingLoader size={48} />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>XLarge (48px)</Box>
      </Box>
    </Box>
  ),
};

/**
 * MorphingLoader in different colors
 */
export const MorphingColors: Story = {
  render: () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <MorphingLoader color="#a855f7" />
      <MorphingLoader color="#10b981" />
      <MorphingLoader color="#f59e0b" />
      <MorphingLoader color="#ef4444" />
      <MorphingLoader color="#3b82f6" />
    </Box>
  ),
};

/**
 * All spinners in a compact layout
 */
export const CompactShowcase: Story = {
  render: () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <RotatingSpinner size={20} />
      <PulsingDot size={10} />
      <BouncingDots size={6} />
      <GradientSpinner size={20} />
      <MorphingLoader size={20} />
    </Box>
  ),
};

/**
 * Spinners in loading cards
 */
export const InCards: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box
        sx={{
          p: 3,
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          minWidth: 120,
        }}
      >
        <RotatingSpinner />
        <Box sx={{ fontSize: '0.875rem' }}>Loading...</Box>
      </Box>
      <Box
        sx={{
          p: 3,
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          minWidth: 120,
        }}
      >
        <BouncingDots />
        <Box sx={{ fontSize: '0.875rem' }}>Processing...</Box>
      </Box>
      <Box
        sx={{
          p: 3,
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          minWidth: 120,
        }}
      >
        <GradientSpinner />
        <Box sx={{ fontSize: '0.875rem' }}>Uploading...</Box>
      </Box>
    </Box>
  ),
};

/**
 * Inline spinners next to text
 */
export const InlineWithText: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <RotatingSpinner size={16} />
        <Box>Loading your profile...</Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <PulsingDot size={10} />
        <Box>Syncing data...</Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <BouncingDots size={6} />
        <Box>Processing request...</Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <MorphingLoader size={16} />
        <Box>Uploading files...</Box>
      </Box>
    </Box>
  ),
};

/**
 * Dark background showcase
 */
export const OnDarkBackground: Story = {
  render: () => (
    <Box
      sx={{
        bgcolor: '#1e293b',
        p: 4,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <RotatingSpinner color="#fff" />
      <PulsingDot color="#fff" />
      <BouncingDots color="#fff" />
      <GradientSpinner color="#fff" />
      <MorphingLoader color="#fff" />
    </Box>
  ),
};

/**
 * Use case: Button loading states
 */
export const InButtons: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box
        sx={{
          px: 3,
          py: 1.5,
          bgcolor: '#a855f7',
          color: 'white',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <RotatingSpinner size={16} color="#fff" />
        <Box>Loading...</Box>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 1.5,
          bgcolor: '#10b981',
          color: 'white',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <BouncingDots size={6} color="#fff" />
        <Box>Processing...</Box>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 1.5,
          bgcolor: '#3b82f6',
          color: 'white',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <MorphingLoader size={16} color="#fff" />
        <Box>Uploading...</Box>
      </Box>
    </Box>
  ),
};
