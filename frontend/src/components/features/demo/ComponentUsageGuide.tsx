import {
  ArrowLeft,
  Code,
  Palette,
  ViewModule as Layout,
  FlashOn as Zap,
  CheckCircle,
} from '@mui/icons-material';
import { Box } from '@mui/material';
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
import React from 'react';

import { Badge } from '../../ui/badge';
import { CardTitle } from '../../ui/card';
import { Separator } from '../../ui/separator';

interface ComponentUsageGuideProps {
  onBack: () => void;
}

export function ComponentUsageGuide({ onBack }: ComponentUsageGuideProps) {
  const codeExample = `
// Example: Using Card Components
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

function ProfileCard({ profile, isSelected, onClick }) {
  return (
    <Card
      variant={isSelected ? "selected" : "interactive"}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{profile.name}</CardTitle>
        <CardDescription>{profile.role}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Card content */}
      </CardContent>
    </Card>
  );
}
  `.trim();

  return (
    <div sx={{
      minHeight: "100vh",
      "bg-background": true,
      p: 6
    }}>
      <div sx={{
      "max-w-4xl": true,
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
          <h1 sx={{
      mb: 2
    }}>Component Usage Guide</h1>
          <p sx={{
      "text-muted-foreground": true
    }}>
            Learn how to effectively use Career Copilot's design system components
          </p>
        </div>

        <div sx={{
      "space-y-8": true
    }}>
          {/* Getting Started */}
          <Card variant="elevation">
            <CardHeader
              subheader={
                <Typography variant="body2" color="text.secondary">
                  How to implement and use the component library in your applications
                </Typography>
              }
            >
              <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <Zap sx={{
      "w-5": true,
      "h-5": true,
      "text-primary": true
    }} />
                <CardTitle>Getting Started</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div sx={{
      "space-y-4": true
    }}>
                <div>
                  <h4 sx={{
      fontWeight: 500,
      mb: 2
    }}>1. Import Components</h4>
                  <div sx={{
      "bg-muted": true,
      p: 3,
      borderRadius: 0.5rem
    }}>
                    <code sx={{
      typography: body1
    }}>
                      {`import { Card, Button, Badge } from "./components/ui/[component]";`}
                    </code>
                  </div>
                </div>
                <div>
                  <h4 sx={{
      fontWeight: 500,
      mb: 2
    }}>2. Use Variants</h4>
                  <p sx={{
      "text-muted-foreground": true,
      typography: body1
    }}>
                    Most components include multiple variants for different use cases. Always
                    specify the appropriate variant for your context.
                  </p>
                </div>
                <div>
                  <h4 sx={{
      fontWeight: 500,
      mb: 2
    }}>3. Follow Composition Patterns</h4>
                  <p sx={{
      "text-muted-foreground": true,
      typography: body1
    }}>
                    Use compound components (like Card + CardHeader + CardContent) to maintain
                    consistent structure and styling.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Design Principles */}
          <Card variant="elevation">
            <CardHeader
              subheader={
                <Typography variant="body2" color="text.secondary">
                  Core principles that guide the Career Copilot design system
                </Typography>
              }
            >
              <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <Palette sx={{
      "w-5": true,
      "h-5": true,
      "text-primary": true
    }} />
                <CardTitle>Design Principles</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div sx={{
      "grid": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      gap: 6
    }}>
                <div sx={{
      "space-y-4": true
    }}>
                  <div sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 3
    }}>
                    <CheckCircle sx={{
      "w-5": true,
      "h-5": true,
      color: "green.500",
      mt: 0.5
    }} />
                    <div>
                      <h4 sx={{
      fontWeight: 500
    }}>Consistency</h4>
                      <p sx={{
      "text-muted-foreground": true,
      typography: body1
    }}>
                        Use the same component variants for similar interactions across the
                        application
                      </p>
                    </div>
                  </div>
                  <div sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 3
    }}>
                    <CheckCircle sx={{
      "w-5": true,
      "h-5": true,
      color: "green.500",
      mt: 0.5
    }} />
                    <div>
                      <h4 sx={{
      fontWeight: 500
    }}>Accessibility</h4>
                      <p sx={{
      "text-muted-foreground": true,
      typography: body1
    }}>
                        All components include proper ARIA labels, keyboard navigation, and color
                        contrast
                      </p>
                    </div>
                  </div>
                </div>
                <div sx={{
      "space-y-4": true
    }}>
                  <div sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 3
    }}>
                    <CheckCircle sx={{
      "w-5": true,
      "h-5": true,
      color: "green.500",
      mt: 0.5
    }} />
                    <div>
                      <h4 sx={{
      fontWeight: 500
    }}>Responsiveness</h4>
                      <p sx={{
      "text-muted-foreground": true,
      typography: body1
    }}>
                        Components adapt to different screen sizes and device capabilities
                      </p>
                    </div>
                  </div>
                  <div sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 3
    }}>
                    <CheckCircle sx={{
      "w-5": true,
      "h-5": true,
      color: "green.500",
      mt: 0.5
    }} />
                    <div>
                      <h4 sx={{
      fontWeight: 500
    }}>Performance</h4>
                      <p sx={{
      "text-muted-foreground": true,
      typography: body1
    }}>
                        Lightweight components with minimal DOM overhead and efficient rendering
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Component Categories */}
          <Card variant="elevation">
            <CardHeader
              subheader={
                <Typography variant="body2" color="text.secondary">
                  Understanding when and how to use different component types
                </Typography>
              }
            >
              <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <Layout sx={{
      "w-5": true,
      "h-5": true,
      "text-primary": true
    }} />
                <CardTitle>Component Categories</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div sx={{
      "space-y-6": true
    }}>
                <div>
                  <h4 sx={{
      fontWeight: 500,
      mb: 3
    }}>1. Card Components</h4>
                  <div sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      gap: 4,
      typography: body1
    }}>
                    <div>
                      <Badge variant="secondary" sx={{
      mb: 2
    }}>
                        Default Cards
                      </Badge>
                      <p sx={{
      "text-muted-foreground": true
    }}>
                        Use for static information display, statistics, and non-interactive content
                        sections.
                      </p>
                    </div>
                    <div>
                      <Badge variant="secondary" sx={{
      mb: 2
    }}>
                        Interactive Cards
                      </Badge>
                      <p sx={{
      "text-muted-foreground": true
    }}>
                        Use for clickable content, navigation elements, and user-selectable options.
                      </p>
                    </div>
                    <div>
                      <Badge variant="secondary" sx={{
      mb: 2
    }}>
                        Selected Cards
                      </Badge>
                      <p sx={{
      "text-muted-foreground": true
    }}>
                        Use to indicate active selections, current choices, or featured content.
                      </p>
                    </div>
                    <div>
                      <Badge variant="secondary" sx={{
      mb: 2
    }}>
                        State Cards
                      </Badge>
                      <p sx={{
      "text-muted-foreground": true
    }}>
                        Use Loading and Error variants for data fetching states and error handling.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 sx={{
      fontWeight: 500,
      mb: 3
    }}>2. Form Components</h4>
                  <div sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      gap: 4,
      typography: body1
    }}>
                    <div>
                      <Badge variant="secondary" sx={{
      mb: 2
    }}>
                        Input Controls
                      </Badge>
                      <p sx={{
      "text-muted-foreground": true
    }}>
                        Text inputs, textareas, and select dropdowns for data collection.
                      </p>
                    </div>
                    <div>
                      <Badge variant="secondary" sx={{
      mb: 2
    }}>
                        Selection Controls
                      </Badge>
                      <p sx={{
      "text-muted-foreground": true
    }}>
                        Checkboxes, radio buttons, and switches for user choices.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 sx={{
      fontWeight: 500,
      mb: 3
    }}>3. Feedback Components</h4>
                  <div sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      gap: 4,
      typography: body1
    }}>
                    <div>
                      <Badge variant="secondary" sx={{
      mb: 2
    }}>
                        Alerts & Notifications
                      </Badge>
                      <p sx={{
      "text-muted-foreground": true
    }}>
                        Use alerts for important messages and status updates.
                      </p>
                    </div>
                    <div>
                      <Badge variant="secondary" sx={{
      mb: 2
    }}>
                        Progress Indicators
                      </Badge>
                      <p sx={{
      "text-muted-foreground": true
    }}>
                        Progress bars and loading states for long-running operations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Example */}
          <Card variant="elevation">
            <CardHeader
              subheader={
                <Typography variant="body2" color="text.secondary">
                  A practical example of using card components with proper variant selection
                </Typography>
              }
            >
              <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <Code sx={{
      "w-5": true,
      "h-5": true,
      "text-primary": true
    }} />
                <CardTitle>Implementation Example</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div sx={{
      "bg-muted": true,
      p: 4,
      borderRadius: 0.5rem,
      "overflow-x-auto": true
    }}>
                <pre sx={{
      typography: body1
    }}>
                  <code>{codeExample}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card variant="elevation">
            <CardHeader
              title={<Typography variant="h3">Best Practices & Guidelines</Typography>}
            ></CardHeader>
            <CardContent>
              <div sx={{
      "space-y-4": true
    }}>
                <div>
                  <h4 sx={{
      fontWeight: 500,
      mb: 2,
      color: "green.600"
    }}>✓ Do</h4>
                  <ul sx={{
      "space-y-1": true,
      "text-muted-foreground": true,
      typography: body1
    }}>
                    <li>• Use interactive cards for clickable content with hover states</li>
                    <li>• Apply selected variant to indicate current active selections</li>
                    <li>• Show loading states for operations taking longer than 200ms</li>
                    <li>• Provide retry functionality in error states</li>
                    <li>• Maintain consistent spacing using the design system tokens</li>
                    <li>• Use semantic HTML elements for better accessibility</li>
                  </ul>
                </div>
                <div>
                  <h4 sx={{
      fontWeight: 500,
      mb: 2,
      color: "red.600"
    }}>✗ Don't</h4>
                  <ul sx={{
      "space-y-1": true,
      "text-muted-foreground": true,
      typography: body1
    }}>
                    <li>• Mix different card variants without clear purpose</li>
                    <li>• Override component styles without considering the design system</li>
                    <li>• Use interactive cards for purely decorative content</li>
                    <li>• Ignore loading and error states in data-driven interfaces</li>
                    <li>• Create custom components when existing ones fulfill the need</li>
                    <li>• Skip proper component composition patterns</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
