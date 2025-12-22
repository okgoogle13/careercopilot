/**
 * ELECTRIC ALCHEMIST: LAYOUT COMPONENTS SECTION
 *
 * Documentation section showcasing layout components.
 */

import React from 'react';
import { Label } from '@/components/electric/Label';
import { Separator } from '@/components/electric';
import { Skeleton } from '@/components/electric';
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
            <div className="mt-2">
              <div>
                <p className="text-human text-base text-on-surface">Content above</p>
                <Separator className="my-4" />
                <p className="text-human text-base text-on-surface">Content below</p>
              </div>
            </div>
          </div>
          <div>
            <Label>Loading Skeletons</Label>
            <div className="mt-2">
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                  <Skeleton variant="text" width={250} height={20} className="mb-2" />
                  <Skeleton variant="text" width={200} height={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ComponentDemo>
    </ComponentSection>
  );
}

export default LayoutComponentsSection;

