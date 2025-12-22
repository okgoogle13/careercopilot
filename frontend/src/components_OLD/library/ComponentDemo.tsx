/**
 * ELECTRIC ALCHEMIST: COMPONENT DEMO
 *
 * Reusable demo wrapper components for showcasing components.
 */

import React from 'react';
import { Card } from '@/components';
import { cn } from '@/lib/utils';

export const ComponentSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <section className="mb-8">
    <div className="mb-6">
      <h2 className="text-hero text-2xl font-bold text-on-surface mb-2">{title}</h2>
      <p className="text-human text-base text-on-surface-variant">{description}</p>
    </div>
    <div className="space-y-6">{children}</div>
  </section>
);

export const ComponentDemo = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="p-6">
    <h3 className="text-hero text-lg font-semibold text-on-surface mb-4">{title}</h3>
    <div>{children}</div>
  </Card>
);

export default ComponentDemo;

