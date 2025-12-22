/**
 * ELECTRIC ALCHEMIST: DISPLAY COMPONENTS SECTION
 *
 * Documentation section showcasing display components.
 */

import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/electric';
import { Badge } from '@/components/electric';
import { Label } from '@/components/electric/Label';
import { Progress } from '@/components/electric';
import { ATSScoreCircle } from '@/components/electric';
import { ComponentDemo, ComponentSection } from './ComponentDemo';

export function DisplayComponentsSection() {
  return (
    <ComponentSection
      title="Display Components"
      description="Components for displaying information, status, and visual elements"
    >
      <ComponentDemo title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Progress & Score Circles">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Progress Indicators</Label>
            <div className="mt-2 space-y-4">
              <Progress value={25} showLabel />
              <Progress value={50} showLabel />
              <Progress value={75} showLabel />
              <Progress value={100} showLabel />
            </div>
          </div>
          <div>
            <Label>ATS Score Circles</Label>
            <div className="mt-2 flex items-center gap-4">
              <ATSScoreCircle score={85} size="small" showLabel />
              <ATSScoreCircle score={72} size="medium" showLabel />
              <ATSScoreCircle score={45} size="large" showLabel />
            </div>
          </div>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Alerts">
        <div className="space-y-4">
          <Alert severity="success" title="Success">
            <AlertDescription>Operation completed successfully.</AlertDescription>
          </Alert>
          <Alert severity="error" title="Error">
            <AlertDescription>Something went wrong. Please try again.</AlertDescription>
          </Alert>
          <Alert severity="warning" title="Warning">
            <AlertDescription>Please review your input before proceeding.</AlertDescription>
          </Alert>
          <Alert severity="info" title="Info">
            <AlertDescription>Here's some helpful information.</AlertDescription>
          </Alert>
        </div>
      </ComponentDemo>
    </ComponentSection>
  );
}

export default DisplayComponentsSection;

