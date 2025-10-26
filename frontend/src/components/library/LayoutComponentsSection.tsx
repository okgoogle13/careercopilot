import React from 'react';

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
        <div className="space-y-6">
          <div>
            <Label>Separators</Label>
            <div className="space-y-3 mt-2">
              <div>
                <p>Content above</p>
                <Separator className="my-4" />
                <p>Content below</p>
              </div>
            </div>
          </div>
          <div>
            <Label>Loading Skeletons</Label>
            <div className="space-y-3 mt-2">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </ComponentDemo>
    </ComponentSection>
  );
}
