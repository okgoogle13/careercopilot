import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import React from 'react';

import { AnimatedButton } from '../components/ui/AnimatedButton';

const meta = {
  title: 'Components/Animated/AnimatedButton',
  component: AnimatedButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Material-UI Button component enhanced with framer-motion animations. Provides 4 animation styles: scale, lift, glow, and shimmer.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    animation: {
      control: 'select',
      options: ['scale', 'lift', 'glow', 'shimmer'],
      description: 'Animation style',
    },
    variant: {
      control: 'select',
      options: ['contained', 'outlined', 'text'],
      description: 'MUI Button variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
} satisfies Meta<typeof AnimatedButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Click Me',
    animation: 'scale',
    variant: 'contained',
    disabled: false,
  },
};

export const ScaleAnimation: Story = {
  args: {
    children: 'Scale Animation',
    animation: 'scale',
    variant: 'contained',
  },
  parameters: {
    docs: {
      description: {
        story: 'Scales up on hover (1.05x) and down on tap (0.95x) with spring physics.',
      },
    },
  },
};

export const LiftAnimation: Story = {
  args: {
    children: 'Lift Animation',
    animation: 'lift',
    variant: 'contained',
  },
  parameters: {
    docs: {
      description: {
        story: 'Raises the button slightly on hover with shadow increase.',
      },
    },
  },
};

export const GlowAnimation: Story = {
  args: {
    children: 'Glow Animation',
    animation: 'glow',
    variant: 'contained',
  },
  parameters: {
    docs: {
      description: {
        story: 'Adds a purple glow effect around the button on hover.',
      },
    },
  },
};

export const ShimmerAnimation: Story = {
  args: {
    children: 'Shimmer Animation',
    animation: 'shimmer',
    variant: 'outlined',
  },
  parameters: {
    docs: {
      description: {
        story: 'Gradient overlay slides across the button on hover.',
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Send Message',
    animation: 'scale',
    variant: 'contained',
    endIcon: <SendIcon />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Animated buttons work seamlessly with MUI icons.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    animation: 'scale',
    variant: 'contained',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Animations are automatically disabled when the button is disabled.',
      },
    },
  },
};

export const AllAnimations: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <AnimatedButton animation="scale" variant="contained">
          Scale
        </AnimatedButton>
        <AnimatedButton animation="lift" variant="contained">
          Lift
        </AnimatedButton>
        <AnimatedButton animation="glow" variant="contained">
          Glow
        </AnimatedButton>
        <AnimatedButton animation="shimmer" variant="outlined">
          Shimmer
        </AnimatedButton>
      </Box>
      <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
        Hover over each button to see the animation
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all four animation styles.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <AnimatedButton animation="scale" variant="contained">
          Contained
        </AnimatedButton>
        <AnimatedButton animation="scale" variant="outlined">
          Outlined
        </AnimatedButton>
        <AnimatedButton animation="scale" variant="text">
          Text
        </AnimatedButton>
      </Box>
      <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
        All MUI Button variants are supported
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'AnimatedButton supports all Material-UI button variants.',
      },
    },
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <AnimatedButton animation="scale" size="small">
        Small
      </AnimatedButton>
      <AnimatedButton animation="scale" size="medium">
        Medium
      </AnimatedButton>
      <AnimatedButton animation="scale" size="large">
        Large
      </AnimatedButton>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All MUI button sizes work with animations.',
      },
    },
  },
};
