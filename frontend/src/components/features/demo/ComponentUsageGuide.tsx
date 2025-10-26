import {
  ArrowLeft,
  Code,
  Palette,
  ViewModule as Layout,
  FlashOn as Zap,
  CheckCircle,
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="text" size="small" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Component Library
            </Button>
          </div>
          <h1 className="mb-2">Component Usage Guide</h1>
          <p className="text-muted-foreground">
            Learn how to effectively use Career Copilot's design system components
          </p>
        </div>

        <div className="space-y-8">
          {/* Getting Started */}
          <Card variant="elevation">
            <CardHeader
              subheader={
                <Typography variant="body2" color="text.secondary">
                  How to implement and use the component library in your applications
                </Typography>
              }
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <CardTitle>Getting Started</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">1. Import Components</h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <code className="text-sm">
                      {`import { Card, Button, Badge } from "./components/ui/[component]";`}
                    </code>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">2. Use Variants</h4>
                  <p className="text-muted-foreground text-sm">
                    Most components include multiple variants for different use cases. Always
                    specify the appropriate variant for your context.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">3. Follow Composition Patterns</h4>
                  <p className="text-muted-foreground text-sm">
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
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                <CardTitle>Design Principles</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Consistency</h4>
                      <p className="text-muted-foreground text-sm">
                        Use the same component variants for similar interactions across the
                        application
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Accessibility</h4>
                      <p className="text-muted-foreground text-sm">
                        All components include proper ARIA labels, keyboard navigation, and color
                        contrast
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Responsiveness</h4>
                      <p className="text-muted-foreground text-sm">
                        Components adapt to different screen sizes and device capabilities
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Performance</h4>
                      <p className="text-muted-foreground text-sm">
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
              <div className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-primary" />
                <CardTitle>Component Categories</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">1. Card Components</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        Default Cards
                      </Badge>
                      <p className="text-muted-foreground">
                        Use for static information display, statistics, and non-interactive content
                        sections.
                      </p>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        Interactive Cards
                      </Badge>
                      <p className="text-muted-foreground">
                        Use for clickable content, navigation elements, and user-selectable options.
                      </p>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        Selected Cards
                      </Badge>
                      <p className="text-muted-foreground">
                        Use to indicate active selections, current choices, or featured content.
                      </p>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        State Cards
                      </Badge>
                      <p className="text-muted-foreground">
                        Use Loading and Error variants for data fetching states and error handling.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">2. Form Components</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        Input Controls
                      </Badge>
                      <p className="text-muted-foreground">
                        Text inputs, textareas, and select dropdowns for data collection.
                      </p>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        Selection Controls
                      </Badge>
                      <p className="text-muted-foreground">
                        Checkboxes, radio buttons, and switches for user choices.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">3. Feedback Components</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        Alerts & Notifications
                      </Badge>
                      <p className="text-muted-foreground">
                        Use alerts for important messages and status updates.
                      </p>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        Progress Indicators
                      </Badge>
                      <p className="text-muted-foreground">
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
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                <CardTitle>Implementation Example</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
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
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-green-600">✓ Do</h4>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• Use interactive cards for clickable content with hover states</li>
                    <li>• Apply selected variant to indicate current active selections</li>
                    <li>• Show loading states for operations taking longer than 200ms</li>
                    <li>• Provide retry functionality in error states</li>
                    <li>• Maintain consistent spacing using the design system tokens</li>
                    <li>• Use semantic HTML elements for better accessibility</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-red-600">✗ Don't</h4>
                  <ul className="space-y-1 text-muted-foreground text-sm">
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
