import type { Meta, StoryObj } from '@storybook/react';
import { Box, Card } from '@mui/material';
import {
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  SkeletonButton,
  LoadingProfileCard,
  LoadingCard,
  LoadingDashboard,
} from '../components/ui/SkeletonLoaders';

/**
 * SkeletonLoaders - Collection of skeleton loader components with shimmer animation
 *
 * 8 skeleton components for representing loading states:
 * - Skeleton (base component with variants)
 * - SkeletonText (text lines)
 * - SkeletonCircle (avatars)
 * - SkeletonButton (buttons)
 * - LoadingProfileCard (complete profile layout)
 * - LoadingCard (generic card layout)
 * - LoadingDashboard (multiple cards)
 */
const meta = {
  title: 'Components/SkeletonLoaders',
  component: Skeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Skeleton loader components with shimmer animation for representing loading states. All components use CSS keyframe animations for optimal performance.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Base skeleton component - Text variant
 */
export const TextVariant: Story = {
  render: () => (
    <Box>
      <Skeleton variant="text" width={200} />
    </Box>
  ),
};

/**
 * Base skeleton component - Circular variant
 */
export const CircularVariant: Story = {
  render: () => (
    <Box>
      <Skeleton variant="circular" width={40} height={40} />
    </Box>
  ),
};

/**
 * Base skeleton component - Rectangular variant
 */
export const RectangularVariant: Story = {
  render: () => (
    <Box>
      <Skeleton variant="rectangular" width={300} height={200} />
    </Box>
  ),
};

/**
 * Base skeleton component - Rounded variant
 */
export const RoundedVariant: Story = {
  render: () => (
    <Box>
      <Skeleton variant="rounded" width={300} height={100} />
    </Box>
  ),
};

/**
 * All skeleton variants side by side
 */
export const AllVariants: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>Text</Box>
        <Skeleton variant="text" width={200} />
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>Circular</Box>
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>Rectangular</Box>
        <Skeleton variant="rectangular" width={300} height={100} />
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>Rounded</Box>
        <Skeleton variant="rounded" width={300} height={100} />
      </Box>
    </Box>
  ),
};

/**
 * Wave vs Pulse animation
 */
export const AnimationTypes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>Wave (Shimmer)</Box>
        <Skeleton variant="rectangular" width={300} height={100} animation="wave" />
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>Pulse</Box>
        <Skeleton variant="rectangular" width={300} height={100} animation="pulse" />
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>None</Box>
        <Skeleton variant="rectangular" width={300} height={100} animation="none" />
      </Box>
    </Box>
  ),
};

/**
 * SkeletonText with multiple lines
 */
export const TextLines: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>1 Line</Box>
        <SkeletonText lines={1} width="full" />
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>3 Lines</Box>
        <SkeletonText lines={3} width="full" />
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>5 Lines</Box>
        <SkeletonText lines={5} width="full" />
      </Box>
    </Box>
  ),
};

/**
 * SkeletonText with different widths
 */
export const TextWidths: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>Full Width</Box>
        <SkeletonText lines={2} width="full" />
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>Medium Width</Box>
        <SkeletonText lines={2} width="medium" />
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>Short Width</Box>
        <SkeletonText lines={2} width="short" />
      </Box>
    </Box>
  ),
};

/**
 * SkeletonCircle in different sizes
 */
export const CircleSizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <Box sx={{ textAlign: 'center' }}>
        <SkeletonCircle size={32} />
        <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>Small (32px)</Box>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <SkeletonCircle size={40} />
        <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>Default (40px)</Box>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <SkeletonCircle size={56} />
        <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>Large (56px)</Box>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <SkeletonCircle size={72} />
        <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>XLarge (72px)</Box>
      </Box>
    </Box>
  ),
};

/**
 * SkeletonButton in different sizes
 */
export const ButtonSizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>Small</Box>
        <SkeletonButton width={80} height={32} />
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>Medium</Box>
        <SkeletonButton width={100} height={36} />
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>Large</Box>
        <SkeletonButton width={120} height={40} />
      </Box>
    </Box>
  ),
};

/**
 * Complete profile card loading state
 */
export const ProfileCard: Story = {
  render: () => <LoadingProfileCard />,
};

/**
 * Generic card loading state
 */
export const GenericCard: Story = {
  render: () => <LoadingCard />,
};

/**
 * Dashboard with multiple loading cards
 */
export const Dashboard: Story = {
  render: () => <LoadingDashboard count={3} />,
};

/**
 * Dashboard with more cards
 */
export const LargeDashboard: Story = {
  render: () => <LoadingDashboard count={6} />,
};

/**
 * Custom profile layout
 */
export const CustomProfileLayout: Story = {
  render: () => (
    <Card sx={{ p: 3, maxWidth: 400 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <SkeletonCircle size={56} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={16} />
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Skeleton variant="text" width={40} height={24} />
          <Skeleton variant="text" width={60} height={14} />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Skeleton variant="text" width={40} height={24} />
          <Skeleton variant="text" width={60} height={14} />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Skeleton variant="text" width={40} height={24} />
          <Skeleton variant="text" width={60} height={14} />
        </Box>
      </Box>

      {/* Bio */}
      <SkeletonText lines={3} width="full" />
    </Card>
  ),
};

/**
 * Custom article card layout
 */
export const ArticleCard: Story = {
  render: () => (
    <Card sx={{ maxWidth: 400 }}>
      {/* Image */}
      <Skeleton variant="rectangular" width="100%" height={200} animation="wave" />

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="90%" height={24} />
        <Skeleton variant="text" width="70%" height={24} />
        <Box sx={{ mt: 2 }}>
          <SkeletonText lines={3} width="full" />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <SkeletonCircle size={32} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="50%" height={14} />
            <Skeleton variant="text" width="30%" height={12} />
          </Box>
        </Box>
      </Box>
    </Card>
  ),
};

/**
 * Custom list item layout
 */
export const ListItems: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <SkeletonCircle size={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={18} />
            <Skeleton variant="text" width="40%" height={14} />
          </Box>
          <SkeletonButton width={80} height={32} />
        </Box>
      ))}
    </Box>
  ),
};

/**
 * Custom table row skeletons
 */
export const TableRows: Story = {
  render: () => (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 100px',
          gap: 2,
          p: 2,
          bgcolor: 'action.hover',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="60%" />
      </Box>

      {/* Rows */}
      {Array.from({ length: 5 }).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 100px',
            gap: 2,
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            '&:last-child': { borderBottom: 0 },
          }}
        >
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="60%" />
          <SkeletonButton width={80} height={28} />
        </Box>
      ))}
    </Box>
  ),
};

/**
 * Form input skeletons
 */
export const FormInputs: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 400 }}>
      <Box>
        <Skeleton variant="text" width="30%" height={20} />
        <Skeleton variant="rounded" width="100%" height={48} />
      </Box>
      <Box>
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="rounded" width="100%" height={48} />
      </Box>
      <Box>
        <Skeleton variant="text" width="35%" height={20} />
        <Skeleton variant="rounded" width="100%" height={120} />
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <SkeletonButton width={100} height={40} />
        <SkeletonButton width={100} height={40} />
      </Box>
    </Box>
  ),
};

/**
 * Chat message skeletons
 */
export const ChatMessages: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
      {/* User message */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box sx={{ maxWidth: '70%' }}>
          <Skeleton variant="rounded" width={250} height={60} />
        </Box>
      </Box>

      {/* Other user message */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <SkeletonCircle size={32} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="rounded" width={200} height={60} />
        </Box>
      </Box>

      {/* User message */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box sx={{ maxWidth: '70%' }}>
          <Skeleton variant="rounded" width={180} height={40} />
        </Box>
      </Box>

      {/* Other user message */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <SkeletonCircle size={32} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="rounded" width={220} height={80} />
        </Box>
      </Box>
    </Box>
  ),
};

/**
 * Product grid skeletons
 */
export const ProductGrid: Story = {
  render: () => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 2,
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Box sx={{ p: 2 }}>
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="60%" height={16} />
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="text" width="40%" height={24} />
            </Box>
            <Box sx={{ mt: 2 }}>
              <SkeletonButton width="100%" height={36} />
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  ),
};

/**
 * Navigation menu skeleton
 */
export const NavigationMenu: Story = {
  render: () => (
    <Box
      sx={{
        width: 250,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        p: 2,
      }}
    >
      {/* Logo */}
      <Skeleton variant="rectangular" width="80%" height={32} sx={{ mb: 3 }} />

      {/* Menu items */}
      {Array.from({ length: 6 }).map((_, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width="70%" height={18} />
        </Box>
      ))}
    </Box>
  ),
};

/**
 * All pre-built components together
 */
export const AllComponents: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Box sx={{ mb: 2, fontSize: '1rem', fontWeight: 600 }}>LoadingProfileCard</Box>
        <LoadingProfileCard />
      </Box>

      <Box>
        <Box sx={{ mb: 2, fontSize: '1rem', fontWeight: 600 }}>LoadingCard</Box>
        <LoadingCard />
      </Box>

      <Box>
        <Box sx={{ mb: 2, fontSize: '1rem', fontWeight: 600 }}>LoadingDashboard (3 cards)</Box>
        <LoadingDashboard count={3} />
      </Box>
    </Box>
  ),
};
