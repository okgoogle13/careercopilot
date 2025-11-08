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
        <div sx={{}}>
          <div>
            <Label>Separators</Label>
            <div sx={{
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
      mt: 2
    }}>
              <div sx={{
      display: "flex",
      alignItems: "center",}}>
                <Skeleton sx={{
      borderRadius: "9999px"
    }} />
                <div sx={{}}>
                  <Skeleton sx={{
      w: "250px"
    }} />
                  <Skeleton sx={{
      w: "200px"
    }} />
                </div>
              </div>
              <Skeleton sx={{
      width: "100%"
    }} />
              <Skeleton sx={{
      width: "75%"
    }} />
            </div>
          </div>
        </div>
      </ComponentDemo>
    </ComponentSection>
  );
}
