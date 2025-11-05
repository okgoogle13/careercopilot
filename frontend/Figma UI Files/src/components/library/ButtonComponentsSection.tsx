import React from 'react';
import { Button } from '../ui/button';
import { ComponentSection, ComponentDemo } from './ComponentDemo';
import { Settings, Loader2, Download } from 'lucide-react';

export function ButtonComponentsSection() {
  return (
    <ComponentSection
      title="Button Components"
      description="Various button styles and states for different actions and contexts"
    >
      <ComponentDemo title="Button Variants">
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="link">Link Button</Button>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Button Sizes">
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
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
