import { Settings, AutorenewRounded as Loader2, Download } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import React from 'react';

import { ComponentSection, ComponentDemo } from './ComponentDemo';

export function ButtonComponentsSection() {
  return (
    <ComponentSection
      title="Button Components"
      description="Various button styles and states for different actions and contexts"
    >
      <ComponentDemo title="Button Variants">
        <div className="flex flex-wrap gap-4">
          <Button variant="contained">Primary Button</Button>
          <Button variant="contained" color="secondary">
            Secondary Button
          </Button>
          <Button variant="outlined">Outline Button</Button>
          <Button variant="text">Ghost Button</Button>
          <Button variant="outlined" color="error">
            Destructive Button
          </Button>
          <Button variant="text">Link Button</Button>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Button Sizes">
        <div className="flex flex-wrap items-center gap-4">
          <Button size="small">Small</Button>
          <Button size="medium">Default</Button>
          <Button size="large">Large</Button>
          <Button size="small">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Button States">
        <div className="flex flex-wrap gap-4">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
          <Button>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            With Icon
          </Button>
        </div>
      </ComponentDemo>
    </ComponentSection>
  );
}
