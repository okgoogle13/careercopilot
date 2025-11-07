import {
  ArrowLeft,
  Notifications as Bell,
  Description as FileText,
  Pause,
  PlayArrow as Play,
  RotateLeft as RotateCcw,
  Settings,
  Shield,
  AutoAwesome as Sparkles,
  Star,
  MyLocation as Target,
  TrendingUp,
  Person as User,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import { Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { useState } from 'react';

import { Label } from '../../ui/label';

import {
  AnimatedButton,
  AnimatedDropdown,
  AnimatedModal,
  AnimatedNotification,
  AnimatedProgress,
  AnimatedStatsCard,
  AnimatedTabs,
  ExpandableCard,
  LoadingAnimations,
  StaggeredList,
} from './AnimatedComponents';

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
  const [selectedOption, setSelectedOption] = useState('');

  const addNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
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
    { id: 'overview', label: 'Overview', icon: <Star sx={{
      "w-4": true,
      "h-4": true
    }} /> },
    { id: 'details', label: 'Details', icon: <FileText sx={{
      "w-4": true,
      "h-4": true
    }} /> },
    { id: 'settings', label: 'Settings', icon: <Settings sx={{
      "w-4": true,
      "h-4": true
    }} /> },
  ];

  const dropdownItems = [
    { label: 'Profile', value: 'profile', icon: <User sx={{
      "w-4": true,
      "h-4": true
    }} /> },
    { label: 'Settings', value: 'settings', icon: <Settings sx={{
      "w-4": true,
      "h-4": true
    }} /> },
    { label: 'Notifications', value: 'notifications', icon: <Bell sx={{
      "w-4": true,
      "h-4": true
    }} /> },
    { label: 'Security', value: 'security', icon: <Shield sx={{
      "w-4": true,
      "h-4": true
    }} /> },
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
      icon: <User sx={{
      "w-6": true,
      "h-6": true,
      "text-primary": true
    }} />,
    },
    {
      title: 'Revenue',
      value: '$89,432',
      change: '+23.1%',
      trend: 'up' as const,
      icon: <TrendingUp sx={{
      "w-6": true,
      "h-6": true,
      "text-primary": true
    }} />,
    },
    {
      title: 'Conversions',
      value: '2,847',
      change: '-5.4%',
      trend: 'down' as const,
      icon: <Target sx={{
      "w-6": true,
      "h-6": true,
      "text-primary": true
    }} />,
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
      change: '0.0%',
      trend: 'neutral' as const,
      icon: <Star sx={{
      "w-6": true,
      "h-6": true,
      "text-primary": true
    }} />,
    },
  ];

  return (
    <div sx={{
      minHeight: "100vh",
      "bg-background": true,
      p: 6
    }}>
      <div sx={{
      "max-w-7xl": true,
      "mx-auto": true
    }}>
        {/* Header */}
        <div sx={{
      mb: 8
    }}>
          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      mb: 4
    }}>
            <Button variant="text" size="small" onClick={onBack} sx={{
      gap: 2
    }}>
              <ArrowLeft sx={{
      "w-4": true,
      "h-4": true
    }} />
              Back to Component Library
            </Button>
          </div>
          <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
            <div>
              <h1 sx={{
      mb: 2,
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <Sparkles sx={{
      "w-6": true,
      "h-6": true,
      "text-primary": true
    }} />
                Animated Components Showcase
              </h1>
              <p sx={{
      "text-muted-foreground": true
    }}>
                Interactive demonstrations of animated UI components with smooth transitions and
                micro-interactions
              </p>
            </div>
            <div sx={{
      display: "flex",
      gap: 2
    }}>
              <Button variant="outlined" onClick={resetAnimations} sx={{
      gap: 2
    }}>
                <RotateCcw sx={{
      "w-4": true,
      "h-4": true
    }} />
                Reset All
              </Button>
              <Button onClick={simulateProgress} disabled={isPlaying} sx={{
      gap: 2
    }}>
                {isPlaying ? (
                  <>
                    <Pause sx={{
      "w-4": true,
      "h-4": true
    }} />
                    Running...
                  </>
                ) : (
                  <>
                    <Play sx={{
      "w-4": true,
      "h-4": true
    }} />
                    Demo All
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div sx={{
      "space-y-12": true
    }}>
          {/* Animated Statistics Cards */}
          <section>
            <h2 sx={{
      mb: 6
    }}>Animated Statistics Cards</h2>
            <div
              sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      [theme.breakpoints.up('md')]: { "grid-cols-4": true },
      gap: 6
    }}
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
            <h2 sx={{
      mb: 6
    }}>Interactive Overlays</h2>
            <div sx={{
      "grid": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      gap: 6
    }}>
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
                    <div sx={{
      mt: 4,
      p: 3,
      "bg-muted": true,
      borderRadius: 0.5rem
    }}>
                      <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>
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
                      <Button variant="outlined" sx={{
      gap: 2
    }}>
                        Select Option
                        <Sparkles sx={{
      "w-4": true,
      "h-4": true
    }} />
                      </Button>
                    }
                    items={dropdownItems}
                    onSelect={setSelectedOption}
                  />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Tabs Demo */}
          <section>
            <h2 sx={{
      mb: 6
    }}>Animated Tabs</h2>
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
                  <div sx={{
      p: 4,
      "bg-muted": true,
      borderRadius: 0.5rem
    }}>
                    {activeTab === 'overview' && (
                      <div>
                        <h3 sx={{
      fontWeight: 500,
      mb: 2
    }}>Overview Content</h3>
                        <p sx={{
      "text-muted-foreground": true
    }}>
                          This is the overview tab content with smooth transitions.
                        </p>
                      </div>
                    )}
                    {activeTab === 'details' && (
                      <div>
                        <h3 sx={{
      fontWeight: 500,
      mb: 2
    }}>Details Content</h3>
                        <p sx={{
      "text-muted-foreground": true
    }}>
                          Detailed information appears here with animated transitions.
                        </p>
                      </div>
                    )}
                    {activeTab === 'settings' && (
                      <div>
                        <h3 sx={{
      fontWeight: 500,
      mb: 2
    }}>Settings Content</h3>
                        <p sx={{
      "text-muted-foreground": true
    }}>
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
            <h2 sx={{
      mb: 6
    }}>Progress & Loading Animations</h2>
            <div sx={{
      "grid": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      gap: 6
    }}>
              <Card>
                <CardHeader
                  title={<Typography variant="h3">Animated Progress</Typography>}
                  subheader={
                    <Typography variant="body2" color="text.secondary">
                      Smooth progress bar with spring animations
                    </Typography>
                  }
                ></CardHeader>
                <CardContent sx={{
      "space-y-4": true
    }}>
                  <AnimatedProgress value={progress} />
                  <div sx={{
      display: "flex",
      gap: 2
    }}>
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
            <h2 sx={{
      mb: 6
    }}>Animated Buttons</h2>
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
                <div sx={{
      "grid": true,
      "grid-cols-2": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-4": true },
      gap: 4
    }}>
                  <div sx={{
      "space-y-2": true
    }}>
                    <Label>Scale Animation</Label>
                    <AnimatedButton animation="scale">Hover Me</AnimatedButton>
                  </div>
                  <div sx={{
      "space-y-2": true
    }}>
                    <Label>Lift Animation</Label>
                    <AnimatedButton animation="lift" variant="outlined">
                      Lift Effect
                    </AnimatedButton>
                  </div>
                  <div sx={{
      "space-y-2": true
    }}>
                    <Label>Glow Animation</Label>
                    <AnimatedButton animation="glow">Glow Effect</AnimatedButton>
                  </div>
                  <div sx={{
      "space-y-2": true
    }}>
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
            <h2 sx={{
      mb: 6
    }}>Expandable Content</h2>
            <div sx={{
      "space-y-4": true
    }} key={`expandable-${animationKey}`}>
              <ExpandableCard
                title="Project Management"
                preview="Click to expand and see project details"
                icon={<FileText sx={{
      "w-5": true,
      "h-5": true,
      "text-primary": true
    }} />}
              >
                <div sx={{
      "space-y-4": true
    }}>
                  <p>
                    This expandable card demonstrates smooth height animations and content
                    transitions.
                  </p>
                  <div sx={{
      "grid": true,
      "grid-cols-2": true,
      gap: 4
    }}>
                    <div>
                      <Label>Progress</Label>
                      <AnimatedProgress value={75} />
                    </div>
                    <div>
                      <Label>Team Size</Label>
                      <p sx={{
      typography: h6,
      fontWeight: 500
    }}>8 members</p>
                    </div>
                  </div>
                </div>
              </ExpandableCard>

              <ExpandableCard
                title="Performance Metrics"
                preview="View detailed performance analytics"
                icon={<TrendingUp sx={{
      "w-5": true,
      "h-5": true,
      "text-primary": true
    }} />}
              >
                <div sx={{
      "space-y-4": true
    }}>
                  <p>
                    Analytics and performance data with animated charts and progress indicators.
                  </p>
                  <div sx={{
      "grid": true,
      "grid-cols-3": true,
      gap: 4
    }}>
                    <div sx={{
      textAlign: "center"
    }}>
                      <p sx={{
      typography: h4,
      fontWeight: 700,
      color: "green.500"
    }}>94%</p>
                      <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Uptime</p>
                    </div>
                    <div sx={{
      textAlign: "center"
    }}>
                      <p sx={{
      typography: h4,
      fontWeight: 700,
      color: "blue.500"
    }}>1.2s</p>
                      <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Load Time</p>
                    </div>
                    <div sx={{
      textAlign: "center"
    }}>
                      <p sx={{
      typography: h4,
      fontWeight: 700,
      color: "purple.500"
    }}>99.1%</p>
                      <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Success Rate</p>
                    </div>
                  </div>
                </div>
              </ExpandableCard>
            </div>
          </section>

          {/* Staggered List */}
          <section>
            <h2 sx={{
      mb: 6
    }}>Staggered List Animation</h2>
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
                  sx={{
      "space-y-3": true
    }}
                  renderItem={(item, _index) => (
                    <div sx={{
      p: 4,
      "bg-muted": true,
      borderRadius: 0.5rem
    }}>
                      <h4 sx={{
      fontWeight: 500
    }}>{item.title}</h4>
                      <p sx={{
      typography: body1,
      "text-muted-foreground": true,
      mt: 1
    }}>{item.description}</p>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </section>

          {/* Notification Demo */}
          <section>
            <h2 sx={{
      mb: 6
    }}>Animated Notifications</h2>
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
                <div sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2
    }}>
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
            <h2 sx={{
      mb: 6
    }}>Implementation Guidelines</h2>
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
                <div sx={{
      "grid": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      gap: 6
    }}>
                  <div>
                    <h4 sx={{
      fontWeight: 500,
      mb: 3,
      color: "green.600"
    }}>✓ Best Practices</h4>
                    <ul sx={{
      "space-y-2": true,
      typography: body1,
      "text-muted-foreground": true
    }}>
                      <li>• Use spring animations for natural movement</li>
                      <li>• Keep durations between 200-500ms for UI interactions</li>
                      <li>• Respect users' reduced motion preferences</li>
                      <li>• Use staggered animations for list items</li>
                      <li>• Provide visual feedback for user actions</li>
                      <li>• Optimize animations for 60fps performance</li>
                    </ul>
                  </div>
                  <div>
                    <h4 sx={{
      fontWeight: 500,
      mb: 3,
      color: "red.600"
    }}>✗ Common Pitfalls</h4>
                    <ul sx={{
      "space-y-2": true,
      typography: body1,
      "text-muted-foreground": true
    }}>
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
        <div sx={{
      "fixed": true,
      "top-4": true,
      "right-4": true,
      "z-50": true,
      "space-y-2": true
    }}>
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
