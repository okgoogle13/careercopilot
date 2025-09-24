import React from 'react';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Label } from '../ui/label';
import { ComponentSection, ComponentDemo } from './ComponentDemo';
import { Info, Warning as AlertTriangle } from '@mui/icons-material';

export function DisplayComponentsSection() {
  return (
    <ComponentSection
      title="Display Components"
      description="Components for displaying information, status, and visual elements"
    >
      <ComponentDemo title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge variant="elevation">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outlined">Destructive</Badge>
          <Badge variant="outlined">Outline</Badge>
          <Badge className="bg-green-500">Custom Green</Badge>
          <Badge className="bg-primary">Primary</Badge>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Progress & Avatars">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Progress Indicators</Label>
              <div className="space-y-3 mt-2">
                <div>
                  <Progress value={33} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-1">33% Complete</p>
                </div>
                <div>
                  <Progress value={66} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-1">66% Complete</p>
                </div>
                <div>
                  <Progress value={100} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-1">100% Complete</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Label>Avatars</Label>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>ND</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">CD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Alerts">
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              This is an informational alert with additional details.
            </AlertDescription>
          </Alert>
          <Alert variant="outlined">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Something went wrong. Please try again later.</AlertDescription>
          </Alert>
        </div>
      </ComponentDemo>
    </ComponentSection>
  );
}
