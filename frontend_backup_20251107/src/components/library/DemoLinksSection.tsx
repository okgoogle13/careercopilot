import { AutoAwesome as Sparkles, PlayArrow as Play } from '@mui/icons-material';
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

import { ComponentSection } from './ComponentDemo';

interface DemoLinksSectionProps {
  onNavigateToAnimated?: () => void;
}

export function DemoLinksSection({ onNavigateToAnimated }: DemoLinksSectionProps) {
  return (
    <ComponentSection
      title="Interactive Demos"
      description="Explore advanced component functionality with interactive demonstrations."
    >
      <div sx={{
      "grid": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      gap: 4
    }}>
        <Card variant="elevation">
          <CardContent sx={{
      p: 6
    }}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
              <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4
    }}>
                <div sx={{
      p: 3,
      "bg-primary/10": true,
      borderRadius: 0.5rem
    }}>
                  <Sparkles sx={{
      "w-6": true,
      "h-6": true,
      "text-primary": true
    }} />
                </div>
                <div>
                  <h3 sx={{
      fontWeight: 500,
      mb: 1
    }}>Animated Components</h3>
                  <p sx={{
      "text-muted-foreground": true
    }}>
                    Explore smooth animations and micro-interactions
                  </p>
                </div>
              </div>
              <Button onClick={onNavigateToAnimated}>Explore</Button>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevation">
          <CardContent sx={{
      p: 6
    }}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
              <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4
    }}>
                <div sx={{
      p: 3,
      "bg-primary/10": true,
      borderRadius: 0.5rem
    }}>
                  <Play sx={{
      "w-6": true,
      "h-6": true,
      "text-primary": true
    }} />
                </div>
                <div>
                  <h3 sx={{
      fontWeight: 500,
      mb: 1
    }}>State Management Demo</h3>
                  <p sx={{
      "text-muted-foreground": true
    }}>
                    Simulate loading states and error scenarios
                  </p>
                </div>
              </div>
              <Button>Launch Demo</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ComponentSection>
  );
}
