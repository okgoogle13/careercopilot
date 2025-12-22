/**
 * ELECTRIC ALCHEMIST: DESIGN SYSTEM PREVIEW
 *
 * Comprehensive visual audit component showcasing:
 * - All four typography tiers (Hologram, Hero, Human, Data)
 * - Button variants with tactile press physics
 * - Card variants (default, interactive, pop-out)
 * - AppShell layout with sidebar
 */

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components';
import { Card } from '@/components';
import { X } from 'lucide-react';

/**
 * Demo Sidebar Component
 * Simple navigation sidebar for the AppShell
 */
const DemoSidebar = () => (
  <nav className="space-y-2">
    <div className="px-4 py-2 text-data text-xs text-outline uppercase tracking-wider">
      Navigation
    </div>
    <a href="#typography" className="block px-4 py-2 text-human text-on-surface hover:bg-surface-container-high rounded-md transition-colors">
      Typography
    </a>
    <a href="#components" className="block px-4 py-2 text-human text-on-surface hover:bg-surface-container-high rounded-md transition-colors">
      Components
    </a>
    <a href="#physics" className="block px-4 py-2 text-human text-on-surface hover:bg-surface-container-high rounded-md transition-colors">
      Physics
    </a>
  </nav>
);

/**
 * Design System Preview Component
 *
 * Visual audit showcasing all Electric Alchemist design system elements
 */
export const DesignSystemPreview = () => {
  return (
    <AppShell sidebarContent={<DemoSidebar />}>
      <div className="space-y-12 p-8">
        {/* HEADER SECTION: Testing Nabla & Hero Fonts */}
        <header className="space-y-4">
          <h1 className="text-6xl text-hologram text-primary">Electric Alchemist</h1>
          <p className="text-hero text-3xl">System v4.4 // Visual Audit</p>
          <div className="h-1 w-24 bg-tertiary rounded-full" />
        </header>

        {/* TYPOGRAPHY MATRIX CHECK */}
        <section className="space-y-4 border-l-2 border-outline pl-4">
          <h2 className="text-xl text-data text-outline">01. Poly-Body Matrix Tiers</h2>
          <p className="text-human text-lg">
            <span className="text-tertiary">Tier 3 (Human):</span> The quick brown fox jumps over
            the lazy dog. (Roboto Serif, GRAD -25)
          </p>
          <p className="text-data text-lg text-secondary-container">
            TIER 4 (DATA): SYSTEM_READY // OPSZ:8 // CONNECTED
          </p>
          <p className="text-hero text-xl">
            Tier 2 (Hero): Architectural Titles (Roboto Flex, YTUC 760)
          </p>
        </section>

        {/* BENTO GRID & PHYSICS CHECK */}
        <section className="space-y-6">
          <h2 className="text-xl text-data text-outline">02. Solid State Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Static */}
            <Card variant="default">
              <h3 className="text-hero text-2xl mb-2">Static Node</h3>
              <p className="text-human text-on-surface-variant">
                Default Card with noise/grid texture.
              </p>
            </Card>

            {/* Card 2: Interactive with Tactile Press */}
            <Card interactive={true} className="border-primary/50">
              <h3 className="text-hero text-2xl mb-2 text-primary">Tactile Press</h3>
              <p className="text-human text-on-surface-variant">
                This card should physically press IN (scale 0.98) on hover.
              </p>
            </Card>

            {/* Card 3: Pop-Out Graphic */}
            <Card
              interactive={true}
              popOutGraphic={
                <div className="w-16 h-16 bg-gradient-to-br from-tertiary to-seed-shadow rounded-xl flex items-center justify-center text-3xl text-on-surface">
                  <X size={24} />
                </div>
              }
            >
              <h3 className="text-hero text-2xl mb-2">Pop-Out Lift</h3>
              <p className="text-human text-on-surface-variant">
                The graphic should float up and rotate on hover.
              </p>
            </Card>
          </div>
        </section>

        {/* BUTTONS CHECK */}
        <section className="space-y-4">
          <h2 className="text-xl text-data text-outline">03. Atomic Interactivity</h2>
          <div className="flex flex-wrap gap-4 items-center pt-8">
            <Button variant="default">Primary Core</Button>
            <Button variant="secondary">Tertiary Data</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">View Logs</Button>
            <Button variant="tertiary">Expressive</Button>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="default" size="sm">Small</Button>
            <Button variant="default" size="md">Medium</Button>
            <Button variant="default" size="lg">Large</Button>
          </div>
        </section>

        {/* COMPREHENSIVE TYPOGRAPHY DEMO */}
        <section className="space-y-6">
          <h2 className="text-xl text-data text-outline">04. Comprehensive Typography</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card interactive={true}>
              <div className="space-y-4">
                <h3 className="text-hologram text-4xl">⚡ Hologram</h3>
                <p className="text-human">
                  Expressive tier for logos, success states, and magical numbers. Uses Nabla color
                  font.
                </p>
              </div>
            </Card>

            <Card interactive={true}>
              <div className="space-y-4">
                <h3 className="text-hero text-4xl">Hero Display</h3>
                <p className="text-human">
                  Architectural tier for page headers and major titles. Uses Roboto Flex with tall
                  caps.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* PHYSICS DEMO */}
        <section className="space-y-6">
          <h2 className="text-xl text-data text-outline">05. Physics Verification</h2>
          <Card interactive={true}>
            <div className="space-y-6">
              <p className="text-human">
                Test the tactile press physics on all interactive elements:
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="default" size="sm">Small Press</Button>
                <Button variant="default">Default Press</Button>
                <Button variant="default" size="lg">Large Press</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <p className="text-data text-xs">
                All elements should scale to 0.98 on hover and 0.95 on tap (press IN, not lift
                UP).
              </p>
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  );
};

export default DesignSystemPreview;

