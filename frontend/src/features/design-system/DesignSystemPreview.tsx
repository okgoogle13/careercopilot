import React from 'react';
import { Button } from '@/components';
import { Card } from '@/components/electric';
import { motion } from 'framer-motion';

export const DesignSystemPreview = () => {
  return (
    <div className="min-h-screen bg-surface text-on-surface p-8 space-y-12">
      {/* HEADER SECTION: Testing Nabla & Hero Fonts */}
      <header className="space-y-4">
        <h1 className="text-6xl text-hologram">Electric Alchemist</h1>
        <p className="text-hero text-3xl text-primary">System v4.2 // Visual Audit</p>
        <div className="h-1 w-24 bg-tertiary rounded-full" />
      </header>

      {/* TYPOGRAPHY MATRIX CHECK */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl text-data text-outline">01. Poly-Body Matrix</h2>
          <div className="space-y-2 border-l-2 border-outline-variant pl-4">
            <p className="text-human text-lg">
              <span className="text-tertiary">Tier 3 (Human):</span> The quick brown fox jumps over the lazy dog. 
              (Roboto Serif, GRAD -25)
            </p>
            <p className="text-data text-lg text-secondary">
              TIER 4 (DATA): SYSTEM_READY // OPSZ:8 // CONNECTED
            </p>
          </div>
        </div>

        {/* BUTTONS CHECK */}
        <div className="space-y-4">
          <h2 className="text-xl text-data text-outline">02. Atomic Interactivity</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="default">Initialize Core</Button>
            <Button variant="secondary">Upload Data</Button>
            <Button variant="ghost">View Logs</Button>
            <Button variant="outline">System Settings</Button>
          </div>
        </div>
      </section>

      {/* BENTO GRID & PHYSICS CHECK */}
      <section className="space-y-6">
        <h2 className="text-xl text-data text-outline">03. Solid State Physics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Standard */}
          <Card>
            <h3 className="text-hero text-2xl mb-2">Static Node</h3>
            <p className="text-human text-on-surface/80">
              Standard bento card with noise overlay and radial grid background. 
              Passive state.
            </p>
          </Card>

          {/* Card 2: Interactive */}
          <Card variant="interactive" className="border-primary/50">
            <h3 className="text-hero text-2xl mb-2 text-primary">Tactile Node</h3>
            <p className="text-human text-on-surface/80">
              Hover over this card. It should physically press IN (scale 0.98), 
              not lift up.
            </p>
            <div className="mt-4">
              <span className="text-data text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                INTERACTIVE
              </span>
            </div>
          </Card>

          {/* Card 3: Pop-Out */}
          <Card 
            variant="interactive" 
            popOutGraphic={
              <div className="w-16 h-16 bg-gradient-to-br from-tertiary to-seed-shadow rounded-xl flex items-center justify-center text-3xl">
                ⚡️
              </div>
            }
          >
            <h3 className="text-hero text-2xl mb-2">Pop-Out Node</h3>
            <p className="text-human text-on-surface/80">
              The graphic above should float, rotate, and scale up when you hover 
              over the card body.
            </p>
          </Card>

        </div>
      </section>

      {/* ADDITIONAL TESTS */}
      <section className="space-y-6">
        <h2 className="text-xl text-data text-outline">04. Comprehensive Typography</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="interactive">
            <div className="space-y-4">
              <h3 className="text-hologram text-4xl">⚡ Hologram</h3>
              <p className="text-human">
                Expressive tier for logos, success states, and magical numbers. Uses Nabla color font.
              </p>
            </div>
          </Card>
          
          <Card variant="interactive">
            <div className="space-y-4">
              <h3 className="text-hero text-4xl">Hero Display</h3>
              <p className="text-human">
                Architectural tier for page headers and major titles. Uses Roboto Flex with tall caps.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* PHYSICS DEMO */}
      <section className="space-y-6">
        <h2 className="text-xl text-data text-outline">05. Physics Verification</h2>
        <Card variant="interactive">
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
              All elements should scale to 0.98 on hover and 0.95 on tap (press IN, not lift UP).
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
};
