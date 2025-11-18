import { Card, CardContent, CardHeader, CardActions, Typography, Box } from '@mui/material';
import { Box } from '@mui/material';
import React from 'react';

import { ComponentSection } from './ComponentDemo';

export function UsageGuidelinesSection() {
  return (
    <ComponentSection
      title="Usage Guidelines"
      description="Best practices and guidelines for using components effectively"
    >
      <Card variant="elevation">
        <CardContent sx={{
      pt: 6
    }}>
          <div sx={{
      [theme.breakpoints.up('sm')]: {},
      gap: 6
    }}>
            <div>
              <h4 sx={{
      mb: 3,
      fontWeight: 500
    }}>Color System</h4>
              <div sx={{}}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                  <div sx={{
      borderRadius: "0.25rem"
    }}></div>
                  <span sx={{
      typography: "body1"
    }}>Primary - Actions & Branding</span>
                </div>
                <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                  <div sx={{
      borderRadius: "0.25rem"
    }}></div>
                  <span sx={{
      typography: "body1"
    }}>Destructive - Errors & Warnings</span>
                </div>
                <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                  <div sx={{
      borderRadius: "0.25rem"
    }}></div>
                  <span sx={{
      typography: "body1"
    }}>Muted - Secondary Information</span>
                </div>
              </div>
            </div>
            <div>
              <h4 sx={{
      mb: 3,
      fontWeight: 500
    }}>Animation Guidelines</h4>
              <div sx={{}}>
                <div sx={{
      typography: "body1",}}>
                  • Duration: 200-300ms for micro-interactions
                </div>
                <div sx={{
      typography: "body1",}}>
                  • Easing: Spring animations for natural feel
                </div>
                <div sx={{
      typography: "body1",}}>
                  • Stagger delays: 50-100ms between items
                </div>
                <div sx={{
      typography: "body1",}}>
                  • Reduce motion for accessibility preferences
                </div>
              </div>
            </div>
            <div>
              <h4 sx={{
      mb: 3,
      fontWeight: 500
    }}>Spacing System</h4>
              <div sx={{}}>
                <div sx={{
      typography: "body1",}}>• Border radius: 0.75rem</div>
                <div sx={{
      typography: "body1",}}>• Consistent padding scales</div>
                <div sx={{
      typography: "body1",}}>• Logical gap spacing</div>
                <div sx={{
      typography: "body1",}}>• Responsive breakpoints</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ComponentSection>
  );
}
