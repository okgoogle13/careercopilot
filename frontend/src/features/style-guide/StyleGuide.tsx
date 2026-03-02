import { Button } from '@careercopilot/ui';
import { Cpu, Gem, Leaf, Shapes } from 'lucide-react';
import { useState } from 'react';
import { KeywordTag } from '../../components/shared/KeywordTag';
import { PageHeader } from '../../components/shared/PageHeader';

export function StyleGuide() {
  const [activeTab, setActiveTab] = useState('shapes');

  // Noise overlay for texture (Anti-Slop: No flat surfaces)
  const noiseOverlay = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`;

  return (
    <div
      className="p-6 md:p-12 max-w-7xl mx-auto min-h-screen"
      style={{ backgroundImage: noiseOverlay }}
    >
      {/* Act 1: Header (Immediate) */}
      <div className="animate-in slide-in-from-top-4 fade-in duration-700 ease-spring-decelerate">
        <PageHeader
          title="Living Style Guide"
<<<<<<< HEAD
          description="The source of truth for the  aesthetic"
=======
          description="The source of truth for the KeralaRage KrSolidarity aesthetic"
>>>>>>> restoration-KR-Rage-Figma-v2.0
          highlightedWord="Style Guide"
        />
      </div>

      {/* Act 2: Shapes Section (Stagger: 100ms) */}
      <section className="mb-16 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100 ease-spring-decelerate fill-mode-both">
        <h2 className="text-display-small font-black uppercase mb-8 flex items-center gap-3">
          <Shapes className="w-8 h-8 text-primary animate-pulse-slow" />
          M3 Expressive Shape System
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Card: The Leaf */}
          <div
            className="p-8 bg-surface-container rounded-leaf border border-outline-variant shadow-elevation-1 relative overflow-hidden group
                        transition-all duration-300 ease-spring hover:shadow-elevation-3 hover:-translate-y-1 hover:scale-[1.01]"
          >
            <div className="absolute top-4 right-4 bg-primary-container p-2 rounded-pebble group-hover:rotate-12 transition-transform duration-500 ease-spring">
              <Leaf className="w-5 h-5 text-on-primary-container" />
            </div>
            <h3 className="text-headline-small font-bold mb-2">The Leaf</h3>
            <code className="text-xs bg-surface-dim px-2 py-1 rounded-md font-mono text-tertiary">
              .rounded-leaf
            </code>
            <p className="mt-4 text-on-surface-variant">
<<<<<<< HEAD
              Organic, growing asymmetry. Used for content containers, cards, and sections that feel
=======
              [DEPRECATED_STYLE], growing asymmetry. Used for content containers, cards, and sections that feel
>>>>>>> restoration-KR-Rage-Figma-v2.0
              "alive."
              <br />
              <span className="text-xs opacity-70 font-mono">Radius: 32px 12px 32px 12px</span>
            </p>
          </div>

          {/* Card: The Tech-Edge */}
          <div
            className="p-8 bg-surface-container rounded-tech border border-outline-variant shadow-elevation-1 relative overflow-hidden group
                        transition-all duration-300 ease-spring hover:shadow-elevation-3 hover:-translate-y-1 hover:scale-[1.01]"
          >
            <div className="absolute top-4 right-4 bg-secondary-container p-2 rounded-sm group-hover:-rotate-12 transition-transform duration-500 ease-spring">
              <Cpu className="w-5 h-5 text-on-secondary-container" />
            </div>
            <h3 className="text-headline-small font-bold mb-2">The Tech-Edge</h3>
            <code className="text-xs bg-surface-dim px-2 py-1 rounded-md font-mono text-secondary">
              .rounded-tech
            </code>
            <p className="mt-4 text-on-surface-variant">
<<<<<<< HEAD
              Digital precision with a slight organic touch. Used for data-heavy panes, settings,
=======
              Digital precision with a slight [DEPRECATED_STYLE] touch. Used for data-heavy panes, settings,
>>>>>>> restoration-KR-Rage-Figma-v2.0
              and tools.
              <br />
              <span className="text-xs opacity-70 font-mono">Radius: 24px 4px 24px 20px</span>
            </p>
          </div>

          {/* Card: The Pebble (Interactive Elements) */}
          <div
            className="p-8 bg-surface-container rounded-pebble border border-outline-variant shadow-elevation-1
                        transition-all duration-300 ease-spring hover:shadow-elevation-2"
          >
            <h3 className="text-headline-small font-bold mb-6">The Pebble</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button
                className="rounded-pebble bg-primary text-on-primary px-6 py-6 h-auto text-lg
                                transition-transform active:scale-95 hover:scale-105 ease-spring"
              >
                Spring Button
              </Button>
              <Button
                variant="outlined"
                className="rounded-pebble px-6 py-6 h-auto text-lg border-primary text-primary hover:bg-primary-container
                                transition-transform active:scale-95 hover:scale-105 ease-spring"
              >
                Secondary
              </Button>
              <KeywordTag
                keyword="Tag Item"
                className="rounded-pebble hover:rotate-3 transition-transform ease-spring"
              />
              <div
                className="px-4 py-2 bg-tertiary-container text-on-tertiary-container rounded-pebble text-sm font-bold uppercase tracking-wider
                                transition-transform transform hover:scale-110 ease-spring cursor-default"
              >
                Badge
              </div>
            </div>
            <p className="mt-6 text-on-surface-variant">
              Friendly, soft asymmetry. Used for interactive elements where touch physics is
              implied.
              <br />
              <code className="text-xs bg-surface-dim px-2 py-1 rounded-md font-mono text-tertiary mt-2 inline-block">
                .rounded-pebble
              </code>
            </p>
          </div>

          {/* Card: The Gem */}
          <div
            className="p-12 bg-atmospheric-vibrant text-on-surface rounded-gem shadow-elevation-3 relative overflow-hidden group
                        transition-transform duration-500 ease-spring hover:scale-[1.02]"
          >
            <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md p-3 rounded-pebble animate-float">
              <Gem className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-display-medium font-black mb-2">The Gem</h3>
            <code className="text-xs bg-black/20 px-2 py-1 rounded-md font-mono text-white/80">
              .rounded-gem
            </code>
            <p className="mt-4 text-lg font-medium max-w-md">
              High-contrast faceting. Used for Hero sections, featured highlights, and "Wow"
              moments.
            </p>
          </div>
        </div>
      </section>

      {/* Act 3: Colors (Stagger: 200ms) - Now using Shapes! */}
      <section className="mb-16 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200 ease-spring-decelerate fill-mode-both">
        <h2 className="text-display-small font-black uppercase mb-8">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2 group cursor-pointer">
            <div className="h-24 rounded-leaf bg-primary shadow-sm group-hover:scale-110 transition-transform ease-spring" />
            <p className="font-bold">Primary</p>
            <p className="text-xs font-mono opacity-60">Leaf Shape</p>
          </div>
          <div className="space-y-2 group cursor-pointer">
            <div className="h-24 rounded-tech bg-secondary shadow-sm group-hover:scale-110 transition-transform ease-spring delay-75" />
            <p className="font-bold">Secondary</p>
            <p className="text-xs font-mono opacity-60">Tech Shape</p>
          </div>
          <div className="space-y-2 group cursor-pointer">
            <div className="h-24 rounded-pebble bg-tertiary shadow-sm group-hover:scale-110 transition-transform ease-spring delay-100" />
            <p className="font-bold">Tertiary</p>
            <p className="text-xs font-mono opacity-60">Pebble Shape</p>
          </div>
          <div className="space-y-2 group cursor-pointer">
            <div className="h-24 rounded-gem bg-error shadow-sm group-hover:scale-110 transition-transform ease-spring delay-150" />
            <p className="font-bold">Error</p>
            <p className="text-xs font-mono opacity-60">Gem Shape</p>
          </div>
        </div>
      </section>

      {/* Act 4: Typography (Stagger: 300ms) */}
      <section className="mb-16 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300 ease-spring-decelerate fill-mode-both">
        <h2 className="text-display-small font-black uppercase mb-8">Typography Expression</h2>
        <div className="bg-surface-container p-8 rounded-leaf border border-outline-variant space-y-8">
          <div className="group">
            <p className="text-label-small uppercase tracking-widest text-on-surface-variant mb-2">
              Display Large (Weight 900)
            </p>
            <h1 className="text-display-large font-black transition-all duration-300 group-hover:tracking-wider cursor-default">
<<<<<<< HEAD
              
=======
              KeralaRage KrSolidarity
>>>>>>> restoration-KR-Rage-Figma-v2.0
            </h1>
          </div>
          <div className="group">
            <p className="text-label-small uppercase tracking-widest text-on-surface-variant mb-2">
              Headline Medium
            </p>
            <h2 className="text-headline-medium font-bold">
              The quick brown fox jumps over the lazy dog
            </h2>
          </div>
          <div className="group">
            <p className="text-label-small uppercase tracking-widest text-on-surface-variant mb-2">
              Contrast Demo
            </p>
            <div className="flex items-baseline gap-4">
              <span className="text-display-medium font-thin opacity-50">Thin (100)</span>
              <span className="text-display-medium font-black">Black (900)</span>
            </div>
          </div>
          <div>
            <p className="text-label-small uppercase tracking-widest text-on-surface-variant mb-2">
              Body Large
            </p>
            <p className="text-body-large">
              Design is not just what it looks like and feels like. Design is how it works. We
              prioritize <span className="text-primary font-bold">clarity</span>,{' '}
              <span className="text-secondary font-bold">energy</span>, and{' '}
              <span className="text-tertiary font-bold">expression</span>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
