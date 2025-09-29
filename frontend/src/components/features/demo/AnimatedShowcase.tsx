import React, { useState } from 'react';
import { Label } from '../../ui/label';
import {
  ArrowLeft,
  AutoAwesome as Sparkles,
  PlayArrow as Play,
  Pause,
  RotateLeft as RotateCcw,
} from '@mui/icons-material';
import {
  AnimatedModal,
  AnimatedDropdown,
  AnimatedTabs,
  AnimatedProgress,
  AnimatedNotification,
  AnimatedButton,
  ExpandableCard,
  StaggeredList,
  LoadingAnimations,
  AnimatedStatsCard,
} from './AnimatedComponents';
import {
  Star,
  Person as User,
  Description as FileText,
  MyLocation as Target,
  TrendingUp,
  Settings,
  Notifications as Bell,
  Shield,
} from '@mui/icons-material';
import {
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
} from '@mui/material';

interface AnimatedShowcaseProps {
  onBack: () => void;
}

export function AnimatedShowcase({ onBack }: AnimatedShowcaseProps) {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [progress, setProgress] = useState(0);
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: 'success' | 'error' | 'info' | 'warning';
      message: string;
    }>
  >([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const addNotification = (type: 'success' | 'error' | 'info' | 'warning', mes_age: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const simulateProgress = () => {
    setProgress(0);
    setIsPlaying(true);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPlaying(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const resetAnimations = () => {
    setAnimationKey((prev) => prev + 1);
    setProgress(0);
    setIsPlaying(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Star className="w-4 h-4" /> },
    { id: 'details', label: 'Details', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const dropdownItems = [
    { label: 'Profile', value: 'profile', icon: <User className="w-4 h-4" /> },
    { label: 'Settings', value: 'settings', icon: <Settings className="w-4 h-4" /> },
    { label: 'Notifications', value: 'notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'Security', value: 'security', icon: <Shield className="w-4 h-4" /> },
  ];

  const listItems = [
    { title: 'Project Alpha', description: 'High priority task with multiple stakeholders' },
    { title: 'Design Review', description: 'Weekly design system review meeting' },
    { title: 'User Research', description: 'Conduct user interviews for new features' },
    { title: 'Performance Optimization', description: 'Improve loading times and user experience' },
    { title: 'Documentation Update', description: 'Update component library documentation' },
  ];

  const statsData = [
    {
      title: 'Total Users',
      value: '12,345',
      change: '+12.5%',
      trend: 'up' as const,
      icon: <User className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Revenue',
      value: '$89,432',
      change: '+23.1%',
      trend: 'up' as const,
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Conversions',
      value: '2,847',
      change: '-5.4%',
      trend: 'down' as const,
      icon: <Target className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
      change: '0.0%',
      trend: 'neutral' as const,
      icon: <Star className="w-6 h-6 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="text" size="small" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Component Library
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Animated Components Showcase
              </h1>
              <p className="text-muted-foreground">
                Interactive demonstrations of animated UI components with smooth transitions and
                micro-interactions
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outlined" onClick={resetAnimations} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset All
              </Button>
              <Button onClick={simulateProgress} disabled={isPlaying} className="gap-2">
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Demo All
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Animated Statistics Cards */}
          <section>
            <h2 className="mb-6">Animated Statistics Cards</h2>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              key={`stats-${animationKey}`}
            >
              {statsData.map((stat, index) => (
                <AnimatedStatsCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  trend={stat.trend}
                  icon={stat.icon}
                />
              ))}
            </div>
          </section>

          {/* Modal & Dropdown Demos */}
          <section>
            <h2 className="mb-6">Interactive Overlays</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader
                  title={<Typography variant="h3">Animated Modal</Typography>}
                  subheader={
                    <Typography variant="body2" color="text.secondary">
                      Modal with smooth entrance and exit animations
                    </Typography>
                  }
                ></CardHeader>
                <CardContent>
                  <Button onClick={() => setShowModal(true)}>Open Modal</Button>
                  <AnimatedModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title="Animated Modal Example"
                  >
                    <p>This modal demonstrates smooth spring animations for a natural feel.</p>
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Features: Spring animations, backdrop blur, scale and opacity transitions
                      </p>
                    </div>
                  </AnimatedModal>
                </CardContent>
              </Card>

              <Card>
                <CardHeader
                  title={<Typography variant="h3">Animated Dropdown</Typography>}
                  subheader={
                    <Typography variant="body2" color="text.secondary">
                      Dropdown with staggered item animations
                    </Typography>
                  }
                ></CardHeader>
                <CardContent>
                  <AnimatedDropdown
                    trigger={
                      <Button variant="outlined" className="gap-2">
                        Select Option
                        <Sparkles className="w-4 h-4" />
                      </Button>
                    }
                    items={dropdownItems}
                    onSelect={(value) => addNotification('info', `Selected: ${value}`)}
                  />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Tabs Demo */}
          <section>
            <h2 className="mb-6">Animated Tabs</h2>
            <Card>
              <CardHeader
                title={<Typography variant="h3">Sliding Tab Indicator</Typography>}
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    Tabs with smooth sliding indicator animation
                  </Typography>
                }
              ></CardHeader>
              <CardContent>
                <AnimatedTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
                  <div className="p-4 bg-muted rounded-lg">
                    {activeTab === 'overview' && (
                      <div>
                        <h3 className="font-medium mb-2">Overview Content</h3>
                        <p className="text-muted-foreground">
                          This is the overview tab content with smooth transitions.
                        </p>
                      </div>
                    )}
                    {activeTab === 'details' && (
                      <div>
                        <h3 className="font-medium mb-2">Details Content</h3>
                        <p className="text-muted-foreground">
                          Detailed information appears here with animated transitions.
                        </p>
                      </div>
                    )}
                    {activeTab === 'settings' && (
                      <div>
                        <h3 className="font-medium mb-2">Settings Content</h3>
                        <p className="text-muted-foreground">
                          Configuration options are shown in this animated panel.
                        </p>
                      </div>
                    )}
                  </div>
                </AnimatedTabs>
              </CardContent>
            </Card>
          </section>

          {/* Progress & Loading */}
          <section>
            <h2 className="mb-6">Progress & Loading Animations</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader
                  title={<Typography variant="h3">Animated Progress</Typography>}
                  subheader={
                    <Typography variant="body2" color="text.secondary">
                      Smooth progress bar with spring animations
                    </Typography>
                  }
                ></CardHeader>
                <CardContent className="space-y-4">
                  <AnimatedProgress value={progress} />
                  <div className="flex gap-2">
                    <Button size="small" onClick={simulateProgress} disabled={isPlaying}>
                      Start Progress
                    </Button>
                    <Button size="small" variant="outlined" onClick={() => setProgress(0)}>
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader
                  title={<Typography variant="h3">Loading Animations</Typography>}
                  subheader={
                    <Typography variant="body2" color="text.secondary">
                      Various animated loading indicators
                    </Typography>
                  }
                ></CardHeader>
                <CardContent>
                  <LoadingAnimations />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Button Animations */}
          <section>
            <h2 className="mb-6">Animated Buttons</h2>
            <Card>
              <CardHeader
                title={<Typography variant="h3">Button Interaction Animations</Typography>}
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    Different animation styles for button interactions
                  </Typography>
                }
              ></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Scale Animation</Label>
                    <AnimatedButton animation="scale">Hover Me</AnimatedButton>
                  </div>
                  <div className="space-y-2">
                    <Label>Lift Animation</Label>
                    <AnimatedButton animation="lift" variant="outlined">
                      Lift Effect
                    </AnimatedButton>
                  </div>
                  <div className="space-y-2">
                    <Label>Glow Animation</Label>
                    <AnimatedButton animation="glow">Glow Effect</AnimatedButton>
                  </div>
                  <div className="space-y-2">
                    <Label>Shimmer Animation</Label>
                    <AnimatedButton animation="shimmer" variant="outlined">
                      Shimmer
                    </AnimatedButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Expandable Cards */}
          <section>
            <h2 className="mb-6">Expandable Content</h2>
            <div className="space-y-4" key={`expandable-${animationKey}`}>
              <ExpandableCard
                title="Project Management"
                preview="Click to expand and see project details"
                icon={<FileText className="w-5 h-5 text-primary" />}
              >
                <div className="space-y-4">
                  <p>
                    This expandable card demonstrates smooth height animations and content
                    transitions.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Progress</Label>
                      <AnimatedProgress value={75} />
                    </div>
                    <div>
                      <Label>Team Size</Label>
                      <p className="text-lg font-medium">8 members</p>
                    </div>
                  </div>
                </div>
              </ExpandableCard>

              <ExpandableCard
                title="Performance Metrics"
                preview="View detailed performance analytics"
                icon={<TrendingUp className="w-5 h-5 text-primary" />}
              >
                <div className="space-y-4">
                  <p>
                    Analytics and performance data with animated charts and progress indicators.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-500">94%</p>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-500">1.2s</p>
                      <p className="text-sm text-muted-foreground">Load Time</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-500">99.1%</p>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                    </div>
                  </div>
                </div>
              </ExpandableCard>
            </div>
          </section>

          {/* Staggered List */}
          <section>
            <h2 className="mb-6">Staggered List Animation</h2>
            <Card>
              <CardHeader
                title={<Typography variant="h3">Task List</Typography>}
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    List items with staggered entrance animations
                  </Typography>
                }
              ></CardHeader>
              <CardContent>
                <StaggeredList
                  key={`list-${animationKey}`}
                  items={listItems}
                  className="space-y-3"
                  renderItem={(item, _index) => (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </section>

          {/* Notification Demo */}
          <section>
            <h2 className="mb-6">Animated Notifications</h2>
            <Card>
              <CardHeader
                title={<Typography variant="h3">Toast Notifications</Typography>}
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    Notifications with smooth entrance and exit animations
                  </Typography>
                }
              ></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="small"
                    onClick={() =>
                      addNotification('success', 'Success! Operation completed successfully.')
                    }
                  >
                    Success Toast
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => addNotification('error', 'Error! Something went wrong.')}
                  >
                    Error Toast
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      addNotification('info', 'Info: Here is some helpful information.')
                    }
                  >
                    Info Toast
                  </Button>
                  <Button
                    size="small"
                    onClick={() =>
                      addNotification('warning', 'Warning: Please review your settings.')
                    }
                  >
                    Warning Toast
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Implementation Guidelines */}
          <section>
            <h2 className="mb-6">Implementation Guidelines</h2>
            <Card>
              <CardHeader
                title={<Typography variant="h3">Animation Best Practices</Typography>}
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    Guidelines for implementing smooth and performant animations
                  </Typography>
                }
              ></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">✓ Best Practices</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Use spring animations for natural movement</li>
                      <li>• Keep durations between 200-500ms for UI interactions</li>
                      <li>• Respect users' reduced motion preferences</li>
                      <li>• Use staggered animations for list items</li>
                      <li>• Provide visual feedback for user actions</li>
                      <li>• Optimize animations for 60fps performance</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-red-600">✗ Common Pitfalls</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Overusing animations - less is more</li>
                      <li>• Making animations too slow (&gt;500ms)</li>
                      <li>• Ignoring accessibility preferences</li>
                      <li>• Using complex animations on low-end devices</li>
                      <li>• Animating layout-triggering properties</li>
                      <li>• Not providing fallbacks for motion-sensitive users</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Notification Container */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <AnimatedNotification
              key={notification.id}
              type={notification.type}
              message={notification.message}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
