/**
 * ELECTRIC ALCHEMIST: BUTTON COMPONENTS SECTION
 *
 * Documentation component showcasing button variants and states.
 */

import React from 'react';
import { Settings, Loader2, Download } from 'lucide-react';
import { Button } from '@/components';
import { Card } from '@/components';

interface ComponentDemoProps {
  title: string;
  children: React.ReactNode;
}

function ComponentDemo({ title, children }: ComponentDemoProps) {
  return (
    <div className="mb-8">
      <h3 className="text-hero text-lg font-semibold text-on-surface mb-4">{title}</h3>
      {children}
    </div>
  );
}

interface ComponentSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function ComponentSection({ title, description, children }: ComponentSectionProps) {
  return (
    <Card className="p-8">
      <h2 className="text-hero text-2xl font-bold text-on-surface mb-2">{title}</h2>
      <p className="text-human text-base text-on-surface-variant mb-8">{description}</p>
      {children}
    </Card>
  );
}

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
          <Button variant="tertiary">Expressive Button</Button>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Button Sizes">
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Button States">
        <div className="flex flex-wrap gap-4">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
          <Button disabled>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            With Icon
          </Button>
        </div>
      </ComponentDemo>
    </ComponentSection>
  );
}

export default ButtonComponentsSection;

