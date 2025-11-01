import React from 'react';
import { Box } from '@mui/material';

import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';

import { ComponentSection, ComponentDemo } from './ComponentDemo';

export function LayoutComponentsSection() {
  return (
    <ComponentSection
      title="Layout Components"
      description="Structural components for organizing content and creating layouts"
    >
      <ComponentDemo title="Separators & Skeletons">
        <div sx={{
      "space-y-6": true
    }}>
          <div>
            <Label>Separators</Label>
            <div sx={{
      "space-y-3": true,
      mt: 2
    }}>
              <div>
                <p>Content above</p>
                <Separator sx={{
      my: 4
    }} />
                <p>Content below</p>
              </div>
            </div>
          </div>
          <div>
            <Label>Loading Skeletons</Label>
            <div sx={{
      "space-y-3": true,
      mt: 2
    }}>
              <div sx={{
      display: "flex",
      alignItems: "center",
      "space-x-4": true
    }}>
                <Skeleton sx={{
      "h-12": true,
      "w-12": true,
      borderRadius: 9999px
    }} />
                <div sx={{
      "space-y-2": true
    }}>
                  <Skeleton sx={{
      "h-4": true,
      w: "250px"
    }} />
                  <Skeleton sx={{
      "h-4": true,
      w: "200px"
    }} />
                </div>
              </div>
              <Skeleton sx={{
      "h-4": true,
      width: "100%"
    }} />
              <Skeleton sx={{
      "h-4": true,
      width: "75%"
    }} />
            </div>
          </div>
        </div>
      </ComponentDemo>
    </ComponentSection>
  );
}
