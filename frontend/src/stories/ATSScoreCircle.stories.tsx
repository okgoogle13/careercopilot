import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import React from 'react';

import { ATSScoreCircle } from '../components/ui/ATSScoreCircle';

const meta = {
  title: 'Components/Animated/ATSScoreCircle',
  component: ATSScoreCircle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Animated circular progress indicator for displaying ATS (Applicant Tracking System) scores. Features color-coded thresholds, multiple size variants, and optional glow effects.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    score: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'ATS score value (0-100)',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant of the circle',
    },
    showLabel: {
      control: 'boolean',
      description: 'Whether to show "ATS Score" label',
    },
  },
} satisfies Meta<typeof ATSScoreCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    score: 85,
    size: 'medium',
    showLabel: false,
  },
};

export const WithLabel: Story = {
  args: {
    score: 92,
    size: 'medium',
    showLabel: true,
  },
};

export const Excellent: Story = {
  args: {
    score: 95,
    size: 'large',
    showLabel: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scores ≥ 80 display in green, indicating excellent ATS compatibility.',
      },
    },
  },
};

export const Good: Story = {
  args: {
    score: 70,
    size: 'large',
    showLabel: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scores between 60-79 display in yellow/orange, indicating good compatibility.',
      },
    },
  },
};

export const NeedsImprovement: Story = {
  args: {
    score: 45,
    size: 'large',
    showLabel: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scores < 60 display in red, indicating the resume needs improvement.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    score: 88,
    size: 'small',
    showLabel: false,
  },
};

export const Medium: Story = {
  args: {
    score: 76,
    size: 'medium',
    showLabel: false,
  },
};

export const Large: Story = {
  args: {
    score: 92,
    size: 'large',
    showLabel: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size includes a glow effect layer for enhanced visual impact.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <Box sx={{ textAlign: 'center' }}>
        <ATSScoreCircle score={85} size="small" />
        <Box sx={{ mt: 2, fontSize: '0.875rem', color: 'text.secondary' }}>Small</Box>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <ATSScoreCircle score={85} size="medium" />
        <Box sx={{ mt: 2, fontSize: '0.875rem', color: 'text.secondary' }}>Medium</Box>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <ATSScoreCircle score={85} size="large" showLabel />
        <Box sx={{ mt: 2, fontSize: '0.875rem', color: 'text.secondary' }}>Large</Box>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all three size variants.',
      },
    },
  },
};

export const ColorThresholds: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <Box sx={{ textAlign: 'center' }}>
        <ATSScoreCircle score={95} size="medium" showLabel />
        <Box sx={{ mt: 2, fontSize: '0.875rem', fontWeight: 600, color: '#10b981' }}>
          Excellent (≥80)
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <ATSScoreCircle score={70} size="medium" showLabel />
        <Box sx={{ mt: 2, fontSize: '0.875rem', fontWeight: 600, color: '#f59e0b' }}>
          Good (60-79)
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <ATSScoreCircle score={45} size="medium" showLabel />
        <Box sx={{ mt: 2, fontSize: '0.875rem', fontWeight: 600, color: '#ef4444' }}>
          Needs Work (&lt;60)
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Color-coded thresholds provide instant visual feedback on ATS compatibility.',
      },
    },
  },
};
