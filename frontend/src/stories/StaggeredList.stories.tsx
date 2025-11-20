import type { Meta, StoryObj } from '@storybook/react';
import { Box, Card, Typography, Avatar } from '@mui/material';
import { StaggeredList, StaggeredGrid } from '../components/ui/StaggeredList';

/**
 * StaggeredList - Renders lists with sequential entrance animations
 *
 * Uses framer-motion's variants API for parent-child animation orchestration.
 * Supports multiple directions (up, down, left, right) and configurable delays.
 */
const meta = {
  title: 'Components/StaggeredList',
  component: StaggeredList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Generic list component that animates items sequentially on mount. Each item slides in with a configurable delay, creating a staggered entrance effect.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StaggeredList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for stories
const tasks = [
  { id: 1, title: 'Complete project proposal', status: 'In Progress', priority: 'High' },
  { id: 2, title: 'Review code changes', status: 'Pending', priority: 'Medium' },
  { id: 3, title: 'Update documentation', status: 'Complete', priority: 'Low' },
  { id: 4, title: 'Fix critical bugs', status: 'In Progress', priority: 'High' },
  { id: 5, title: 'Deploy to staging', status: 'Pending', priority: 'Medium' },
];

const users = [
  { id: 1, name: 'Alice Johnson', role: 'Product Manager', avatar: 'AJ' },
  { id: 2, name: 'Bob Smith', role: 'Software Engineer', avatar: 'BS' },
  { id: 3, name: 'Carol White', role: 'UX Designer', avatar: 'CW' },
  { id: 4, name: 'David Lee', role: 'DevOps Engineer', avatar: 'DL' },
  { id: 5, name: 'Emma Davis', role: 'QA Specialist', avatar: 'ED' },
];

const notifications = [
  { id: 1, text: 'Your profile has been updated successfully', time: '2 minutes ago' },
  { id: 2, text: 'New comment on your post', time: '15 minutes ago' },
  { id: 3, text: 'Alice Johnson sent you a message', time: '1 hour ago' },
  { id: 4, text: 'Your report is ready for download', time: '3 hours ago' },
];

/**
 * Default list with cards sliding from left
 */
export const Default: Story = {
  render: () => (
    <StaggeredList
      items={tasks}
      renderItem={(task) => (
        <Card sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {task.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Status: {task.status}
              </Typography>
            </Box>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                bgcolor:
                  task.priority === 'High'
                    ? '#fef2f2'
                    : task.priority === 'Medium'
                      ? '#fef3c7'
                      : '#f0fdf4',
                color:
                  task.priority === 'High'
                    ? '#dc2626'
                    : task.priority === 'Medium'
                      ? '#d97706'
                      : '#16a34a',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {task.priority}
            </Box>
          </Box>
        </Card>
      )}
    />
  ),
};

/**
 * List animating from the right
 */
export const FromRight: Story = {
  render: () => (
    <StaggeredList
      items={tasks}
      direction="right"
      renderItem={(task) => (
        <Card sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1">{task.title}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {task.status}
          </Typography>
        </Card>
      )}
    />
  ),
};

/**
 * List animating from the top (up direction)
 */
export const FromTop: Story = {
  render: () => (
    <StaggeredList
      items={notifications}
      direction="up"
      renderItem={(notification) => (
        <Card sx={{ p: 2, mb: 2 }}>
          <Typography variant="body1">{notification.text}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {notification.time}
          </Typography>
        </Card>
      )}
    />
  ),
};

/**
 * List animating from the bottom (down direction)
 */
export const FromBottom: Story = {
  render: () => (
    <StaggeredList
      items={notifications}
      direction="down"
      renderItem={(notification) => (
        <Card sx={{ p: 2, mb: 2 }}>
          <Typography variant="body1">{notification.text}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {notification.time}
          </Typography>
        </Card>
      )}
    />
  ),
};

/**
 * Fast stagger delay (50ms per item)
 */
export const FastStagger: Story = {
  render: () => (
    <StaggeredList
      items={tasks}
      staggerDelay={0.05}
      renderItem={(task) => (
        <Card sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1">{task.title}</Typography>
        </Card>
      )}
    />
  ),
};

/**
 * Slow stagger delay (300ms per item)
 */
export const SlowStagger: Story = {
  render: () => (
    <StaggeredList
      items={tasks.slice(0, 3)}
      staggerDelay={0.3}
      renderItem={(task) => (
        <Card sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1">{task.title}</Typography>
        </Card>
      )}
    />
  ),
};

/**
 * User profile cards with avatars
 */
export const UserCards: Story = {
  render: () => (
    <StaggeredList
      items={users}
      renderItem={(user) => (
        <Card sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#a855f7' }}>{user.avatar}</Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user.role}
              </Typography>
            </Box>
          </Box>
        </Card>
      )}
    />
  ),
};

/**
 * Simple text list
 */
export const SimpleTextList: Story = {
  render: () => (
    <StaggeredList
      items={['First item', 'Second item', 'Third item', 'Fourth item', 'Fifth item']}
      renderItem={(text) => (
        <Box sx={{ p: 2, mb: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography>{text}</Typography>
        </Box>
      )}
    />
  ),
};

/**
 * Grid layout with 3 columns
 */
export const GridLayout: Story = {
  render: () => (
    <StaggeredGrid
      items={users}
      columns={3}
      gap={2}
      renderItem={(user) => (
        <Card sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: '#a855f7', width: 48, height: 48 }}>{user.avatar}</Avatar>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, textAlign: 'center' }}>
              {user.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              {user.role}
            </Typography>
          </Box>
        </Card>
      )}
    />
  ),
};

/**
 * Grid layout with 4 columns
 */
export const GridFourColumns: Story = {
  render: () => (
    <StaggeredGrid
      items={[...users, ...users.slice(0, 3)]} // 8 items total
      columns={4}
      gap={2}
      renderItem={(user) => (
        <Card sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: '#10b981' }}>{user.avatar}</Avatar>
            <Typography variant="caption" sx={{ textAlign: 'center' }}>
              {user.name}
            </Typography>
          </Box>
        </Card>
      )}
    />
  ),
};

/**
 * Grid with compact items
 */
export const CompactGrid: Story = {
  render: () => (
    <StaggeredGrid
      items={Array.from({ length: 12 }, (_, i) => i + 1)}
      columns={6}
      gap={1}
      staggerDelay={0.05}
      renderItem={(num) => (
        <Box
          sx={{
            p: 2,
            bgcolor: '#a855f7',
            color: 'white',
            borderRadius: 1,
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          {num}
        </Box>
      )}
    />
  ),
};

/**
 * Grid animating from different directions
 */
export const GridDirections: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          From Left
        </Typography>
        <StaggeredGrid
          items={Array.from({ length: 6 }, (_, i) => i + 1)}
          columns={3}
          gap={2}
          direction="left"
          renderItem={(num) => (
            <Box sx={{ p: 3, bgcolor: '#f3f4f6', borderRadius: 1, textAlign: 'center' }}>
              Item {num}
            </Box>
          )}
        />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          From Top
        </Typography>
        <StaggeredGrid
          items={Array.from({ length: 6 }, (_, i) => i + 1)}
          columns={3}
          gap={2}
          direction="up"
          renderItem={(num) => (
            <Box sx={{ p: 3, bgcolor: '#f3f4f6', borderRadius: 1, textAlign: 'center' }}>
              Item {num}
            </Box>
          )}
        />
      </Box>
    </Box>
  ),
};

/**
 * Notification list with status indicators
 */
export const NotificationList: Story = {
  render: () => (
    <StaggeredList
      items={notifications}
      direction="down"
      renderItem={(notification) => (
        <Box
          sx={{
            p: 2,
            mb: 1,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            display: 'flex',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#10b981',
              mt: 0.5,
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2">{notification.text}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {notification.time}
            </Typography>
          </Box>
        </Box>
      )}
    />
  ),
};

/**
 * Feature cards with icons
 */
export const FeatureCards: Story = {
  render: () => (
    <StaggeredGrid
      items={[
        { title: 'Fast', desc: 'Lightning quick performance', emoji: '⚡' },
        { title: 'Secure', desc: 'Enterprise-grade security', emoji: '🔒' },
        { title: 'Reliable', desc: '99.9% uptime guarantee', emoji: '✅' },
        { title: 'Scalable', desc: 'Grows with your needs', emoji: '📈' },
        { title: 'Modern', desc: 'Latest tech stack', emoji: '🚀' },
        { title: 'Support', desc: '24/7 customer support', emoji: '💬' },
      ]}
      columns={3}
      gap={3}
      renderItem={(feature) => (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Box sx={{ fontSize: '3rem', mb: 2 }}>{feature.emoji}</Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {feature.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {feature.desc}
          </Typography>
        </Card>
      )}
    />
  ),
};

/**
 * Dashboard stats cards
 */
export const StatsCards: Story = {
  render: () => (
    <StaggeredGrid
      items={[
        { label: 'Total Users', value: '2,543', change: '+12%', positive: true },
        { label: 'Revenue', value: '$45.2K', change: '+8%', positive: true },
        { label: 'Active Projects', value: '18', change: '-3%', positive: false },
        { label: 'Completion Rate', value: '94%', change: '+5%', positive: true },
      ]}
      columns={4}
      gap={2}
      renderItem={(stat) => (
        <Card sx={{ p: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
            {stat.label}
          </Typography>
          <Typography variant="h4" sx={{ my: 1, fontWeight: 700 }}>
            {stat.value}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: stat.positive ? '#10b981' : '#ef4444', fontWeight: 600 }}
          >
            {stat.change}
          </Typography>
        </Card>
      )}
    />
  ),
};

/**
 * Empty state (no items)
 */
export const EmptyList: Story = {
  render: () => (
    <StaggeredList
      items={[]}
      renderItem={(item) => (
        <Card sx={{ p: 2 }}>
          <Typography>{item}</Typography>
        </Card>
      )}
    />
  ),
};

/**
 * Single item (no stagger effect visible)
 */
export const SingleItem: Story = {
  render: () => (
    <StaggeredList
      items={[tasks[0]]}
      renderItem={(task) => (
        <Card sx={{ p: 2 }}>
          <Typography variant="subtitle1">{task.title}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {task.status}
          </Typography>
        </Card>
      )}
    />
  ),
};
