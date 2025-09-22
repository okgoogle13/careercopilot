import React from 'react';
import { ComponentSection, ComponentDemo } from './ComponentDemo';
import { Settings, Loader2, Download } from 'lucide-react';
import { Button, IconButton } from '@mui/material';

export function ButtonComponentsSection() {
  return (
    <ComponentSection
      title="Button Components"
      description="Various button styles and states for different actions and contexts"
    >
      <ComponentDemo title="Button Variants">
        <div className="flex flex-wrap gap-4">
          <Button variant="elevation">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outlined">Outline Button</Button>
          <Button variant="text">Ghost Button</Button>
          <Button variant="outlined">Destructive Button</Button>
          <Button variant="link">Link Button</Button>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Button Sizes">
        <div className="flex flex-wrap items-center gap-4">
          <Button size="small">Small</Button>
          <Button size="default">Default</Button>
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
