import React from 'react';
import { ComponentSection } from './ComponentDemo';
import { Sparkles, Play } from 'lucide-react';
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

interface DemoLinksSectionProps {
  onNavigateToAnimated?: () => void;
}

export function DemoLinksSection({ onNavigateToAnimated }: DemoLinksSectionProps) {
  return (
    <ComponentSection
      title="Interactive Demos"
      description="Explore advanced component functionality with interactive demonstrations."
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Card variant="interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Animated Components</h3>
                  <p className="text-muted-foreground">
                    Explore smooth animations and micro-interactions
                  </p>
                </div>
              </div>
              <Button onClick={onNavigateToAnimated}>Explore</Button>
            </div>
          </CardContent>
        </Card>

        <Card variant="interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Play className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">State Management Demo</h3>
                  <p className="text-muted-foreground">
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
