import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import { AnimatedProgress } from '../components/ui/AnimatedProgress';
import { useEffect, useState } from 'react';

/**
 * AnimatedProgress - Animated progress bar with spring physics
 *
 * Features:
 * - Smooth spring animation for natural motion
 * - Multiple color variants (default, success, warning, error)
 * - Optional percentage display
 * - Optional label text
 * - Configurable max value
 * - Can disable animation for instant updates
 */
const meta = {
  title: 'Components/AnimatedProgress',
  component: AnimatedProgress,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Animated progress bar component with spring physics and multiple color variants. Follows Material Design 3 Expressive motion principles.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress value (0-100 by default)',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum value (default: 100)',
    },
    showPercentage: {
      control: 'boolean',
      description: 'Show percentage text above the bar',
    },
    animated: {
      control: 'boolean',
      description: 'Enable spring animation (default: true)',
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: 'Visual variant affecting the color',
    },
    label: {
      control: 'text',
      description: 'Optional label above the progress bar',
    },
  },
} satisfies Meta<typeof AnimatedProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default progress bar with 75% completion
 */
export const Default: Story = {
  args: {
    value: 75,
    showPercentage: true,
    animated: true,
    variant: 'default',
  },
};

/**
 * All four color variants side by side
 */
export const AllVariants: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
      <AnimatedProgress value={75} variant="default" label="Default" />
      <AnimatedProgress value={85} variant="success" label="Success" />
      <AnimatedProgress value={65} variant="warning" label="Warning" />
      <AnimatedProgress value={45} variant="error" label="Error" />
    </Box>
  ),
};

/**
 * Progress bars with different completion levels
 */
export const DifferentLevels: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
      <AnimatedProgress value={25} variant="error" label="Low Progress" />
      <AnimatedProgress value={50} variant="warning" label="Medium Progress" />
      <AnimatedProgress value={75} variant="success" label="High Progress" />
      <AnimatedProgress value={100} variant="success" label="Complete" />
    </Box>
  ),
};

/**
 * Progress with label but no percentage display
 */
export const WithLabelNoPercentage: Story = {
  args: {
    value: 60,
    label: 'Upload Progress',
    showPercentage: false,
    variant: 'default',
  },
};

/**
 * Progress without label, only percentage
 */
export const NoLabel: Story = {
  args: {
    value: 80,
    showPercentage: true,
    variant: 'success',
  },
};

/**
 * Minimal progress bar (no label, no percentage)
 */
export const Minimal: Story = {
  args: {
    value: 70,
    showPercentage: false,
    variant: 'default',
  },
};

/**
 * Custom max value (150 out of 200)
 */
export const CustomMaxValue: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
      <AnimatedProgress value={150} max={200} label="150 / 200 Items Processed" variant="default" />
      <AnimatedProgress value={75} max={150} label="75 / 150 MB Uploaded" variant="success" />
      <AnimatedProgress value={30} max={50} label="30 / 50 Tasks Complete" variant="warning" />
    </Box>
  ),
};

/**
 * Progress without animation (instant updates)
 */
export const NoAnimation: Story = {
  args: {
    value: 65,
    label: 'Instant Update (No Animation)',
    animated: false,
    variant: 'default',
  },
};

/**
 * Comparison: Animated vs Non-Animated
 */
export const AnimatedVsInstant: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
      <AnimatedProgress value={75} label="With Animation (Spring Physics)" animated={true} />
      <AnimatedProgress value={75} label="Without Animation (Instant)" animated={false} />
    </Box>
  ),
};

/**
 * Interactive controlled progress with auto-increment
 */
export const ControlledProgress: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0; // Reset to 0 when complete
          return prev + 5;
        });
      }, 500);

      return () => clearInterval(timer);
    }, []);

    return (
      <Box sx={{ width: '100%' }}>
        <AnimatedProgress
          value={progress}
          label="Auto-Incrementing Progress"
          variant={progress < 40 ? 'error' : progress < 70 ? 'warning' : 'success'}
          showPercentage={true}
        />
      </Box>
    );
  },
};

/**
 * Multiple progress bars with different speeds
 */
export const MultipleProgressBars: Story = {
  render: () => {
    const [progress1, setProgress1] = useState(0);
    const [progress2, setProgress2] = useState(0);
    const [progress3, setProgress3] = useState(0);

    useEffect(() => {
      // Fast progress
      const timer1 = setInterval(() => {
        setProgress1((prev) => (prev >= 100 ? 0 : prev + 10));
      }, 300);

      // Medium progress
      const timer2 = setInterval(() => {
        setProgress2((prev) => (prev >= 100 ? 0 : prev + 5));
      }, 400);

      // Slow progress
      const timer3 = setInterval(() => {
        setProgress3((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 500);

      return () => {
        clearInterval(timer1);
        clearInterval(timer2);
        clearInterval(timer3);
      };
    }, []);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
        <AnimatedProgress value={progress1} label="Fast Upload" variant="success" />
        <AnimatedProgress value={progress2} label="Medium Processing" variant="warning" />
        <AnimatedProgress value={progress3} label="Slow Download" variant="default" />
      </Box>
    );
  },
};

/**
 * Small progress bar in compact layout
 */
export const CompactSize: Story = {
  render: () => (
    <Box sx={{ width: '200px' }}>
      <AnimatedProgress value={60} showPercentage={false} variant="success" />
    </Box>
  ),
};

/**
 * Full-width progress in card
 */
export const InCard: Story = {
  render: () => (
    <Box
      sx={{
        p: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ mb: 2, fontSize: '1.25rem', fontWeight: 600 }}>Profile Completion</Box>
      <Box sx={{ mb: 3, fontSize: '0.875rem', color: 'text.secondary' }}>
        Complete your profile to unlock more features
      </Box>
      <AnimatedProgress value={70} label="7 out of 10 fields completed" variant="success" />
    </Box>
  ),
};

/**
 * Edge case: Zero progress
 */
export const ZeroProgress: Story = {
  args: {
    value: 0,
    label: 'Not Started',
    variant: 'default',
  },
};

/**
 * Edge case: Full progress
 */
export const FullProgress: Story = {
  args: {
    value: 100,
    label: 'Complete',
    variant: 'success',
  },
};

/**
 * Edge case: Over maximum (should clamp to 100%)
 */
export const OverMaximum: Story = {
  args: {
    value: 150,
    max: 100,
    label: 'Clamped to Maximum (value=150, max=100)',
    variant: 'success',
  },
};

/**
 * Edge case: Negative value (should clamp to 0%)
 */
export const NegativeValue: Story = {
  args: {
    value: -20,
    label: 'Clamped to Minimum (value=-20)',
    variant: 'error',
  },
};
