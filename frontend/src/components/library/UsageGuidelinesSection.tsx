import { Card, CardContent, CardHeader, CardActions, Typography, Box } from '@mui/material';
import React from 'react';

import { ComponentSection } from './ComponentDemo';

export function UsageGuidelinesSection() {
  return (
    <ComponentSection
      title="Usage Guidelines"
      description="Best practices and guidelines for using components effectively"
    >
      <Card variant="elevation">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="mb-3 font-medium">Color System</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded"></div>
                  <span className="text-sm">Primary - Actions & Branding</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-destructive rounded"></div>
                  <span className="text-sm">Destructive - Errors & Warnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-muted rounded"></div>
                  <span className="text-sm">Muted - Secondary Information</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-3 font-medium">Animation Guidelines</h4>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  • Duration: 200-300ms for micro-interactions
                </div>
                <div className="text-sm text-muted-foreground">
                  • Easing: Spring animations for natural feel
                </div>
                <div className="text-sm text-muted-foreground">
                  • Stagger delays: 50-100ms between items
                </div>
                <div className="text-sm text-muted-foreground">
                  • Reduce motion for accessibility preferences
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-3 font-medium">Spacing System</h4>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">• Border radius: 0.75rem</div>
                <div className="text-sm text-muted-foreground">• Consistent padding scales</div>
                <div className="text-sm text-muted-foreground">• Logical gap spacing</div>
                <div className="text-sm text-muted-foreground">• Responsive breakpoints</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ComponentSection>
  );
}
