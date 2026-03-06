import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayeredHero } from '../../components/kerala-rage/LayeredHero';
import { loadHeroRegistry } from '../../design/hero/heroRegistry';
import { composeHero } from '../../lib/composeHero';
import type { CompositionResult } from '../../lib/composeHero';
import { Stone, Pebble, StatusBadge } from '@/components/ui';
import {
  Box,
  Code,
  Layers,
  Layout,
  Maximize2,
  RefreshCw,
  Smartphone,
  Monitor,
  AlertTriangle,
} from 'lucide-react';
import type { SolidarityManifest, Typography } from '../../design/hero/heroTypes';

const DesignSidekick: React.FC = () => {
  const [registry, setRegistry] = useState<any>(null);
  const [manifest, setManifest] = useState<SolidarityManifest | null>(null);
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);
  const [compositionResult, setCompositionResult] = useState<CompositionResult | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    async function init() {
      try {
        const [regData, manifestData] = await Promise.all([
          loadHeroRegistry(),
          fetch('/assets/kerala-rage-kr-solidarity-manifest.json').then((r) => r.json()),
        ]);

        setRegistry(regData);
        setManifest(manifestData);

        if (regData.compositions && regData.compositions.length > 0) {
          const firstHero = regData.compositions[0] as any;
          setSelectedHeroId(firstHero.id || firstHero.composition_id || firstHero.hero_id);
        }
      } catch (err) {
        console.error('Failed to initialize sidekick:', err);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (registry && manifest && selectedHeroId) {
      const result = composeHero(manifest, registry, selectedHeroId);

      // Normalize typography for rendering
      if (result.valid) {
        const typo = result.typography as any;
        if (!typo.headline && typo.message) {
          typo.headline = typo.message;
        }
        if (!typo.supporting && typo.secondary_text?.text) {
          typo.supporting = typo.secondary_text.text;
        }
      }

      setCompositionResult(result);
    }
  }, [selectedHeroId, registry, manifest]);

  if (!registry || !manifest || !selectedHeroId) {
    return (
      <div className="min-h-screen bg-asphalt-black flex items-center justify-center text-paper-white font-bloom">
        <RefreshCw className="animate-spin mr-3" /> INITIALIZING HERO ENGINE...
      </div>
    );
  }

  const selectedHero = registry.compositions.find(
    (c: any) => (c.id || c.composition_id || c.hero_id) === selectedHeroId
  );

  return (
    <div className="flex h-screen bg-asphalt-black overflow-hidden font-body">
      {/* Sidebar: Composition Selector */}
      <aside className="w-80 border-r border-concrete-grey/10 bg-asphalt-black overflow-y-auto z-20">
        <div className="p-6 border-b border-concrete-grey/10">
          <h2 className="text-paper-white font-bloom text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
            <Layout className="w-5 h-5 text-ink-gold" /> Sidekick
          </h2>
          <p className="text-[10px] font-annotation text-concrete-grey uppercase tracking-widest mt-1">
            v3.1 Hero Orchestrator
          </p>
        </div>

        <nav className="p-4 space-y-2">
          {registry.compositions.map((hero: any, index: number) => {
            const id = hero.id || hero.composition_id || hero.hero_id || `hero-${index}`;
            return (
              <button
                key={id}
                onClick={() => setSelectedHeroId(id)}
                className={`w-full text-left p-4 rounded-stone transition-all border ${
                  selectedHeroId === id
                    ? 'bg-ink-gold/10 border-ink-gold/30'
                    : 'bg-transparent border-transparent hover:bg-concrete-grey/5'
                }`}
              >
                <div className="text-paper-white font-bold text-sm">
                  {hero.name || hero.theme || 'Untitled Composition'}
                </div>
                <div className="text-[10px] text-concrete-grey font-mono mt-1 uppercase">{id}</div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 relative flex flex-col bg-asphalt-black-darkest">
        {/* Toolbar */}
        <header className="h-16 border-b border-concrete-grey/10 flex items-center justify-between px-6 bg-asphalt-black z-10">
          <div className="flex items-center gap-6">
            <div className="flex bg-black/40 rounded-sentry p-1 border border-concrete-grey/10">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-1.5 rounded-sentry transition-colors ${viewMode === 'desktop' ? 'bg-ink-gold text-asphalt-black' : 'text-concrete-grey'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-1.5 rounded-sentry transition-colors ${viewMode === 'mobile' ? 'bg-ink-gold text-asphalt-black' : 'text-concrete-grey'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowOverlay(!showOverlay)}
              className={`flex items-center gap-2 text-xs font-annotation uppercase tracking-wider ${showOverlay ? 'text-ink-gold' : 'text-concrete-grey'}`}
            >
              <Box className="w-4 h-4" /> Negative Space {showOverlay ? '[ON]' : '[OFF]'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge
              label="Live Preview"
              variant="info"
              className="bg-ink-gold/10 text-ink-gold border-ink-gold/20"
            />
          </div>
        </header>

        {/* Hero Stage or Error State */}
        <div
          className={`flex-1 relative overflow-hidden transition-all duration-500 mx-auto w-full ${viewMode === 'mobile' ? 'max-w-[390px] border-x border-concrete-grey/20 my-8 rounded-[40px] shadow-2xl overflow-hidden' : ''}`}
        >
          {compositionResult?.valid ? (
            <LayeredHero
              layers={compositionResult.resolvedLayers}
              typography={compositionResult.typography as Typography}
              animation={compositionResult.animation || (selectedHero as any).animation}
              zIndexMap={compositionResult.zIndexMap}
              className="h-full"
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-black/40 p-12 text-center">
              <AlertTriangle className="w-16 h-16 text-ink-gold mb-6" />
              <h3 className="text-paper-white font-bloom text-2xl uppercase font-black mb-4">
                Composition Fault
              </h3>
              <p className="text-concrete-grey font-mono text-sm max-w-md">
                {compositionResult?.error || 'Unknown rendering error'}
              </p>
            </div>
          )}

          {/* Negative Space Overlay */}
          {showOverlay && (
            <div className="absolute inset-0 pointer-events-none z-50">
              <div className="absolute top-0 left-0 w-1/2 h-1/2 border-r border-b border-ink-gold/40 bg-ink-gold/5 backdrop-blur-[1px]">
                <div className="absolute bottom-4 right-4 text-[10px] font-annotation text-ink-gold uppercase tracking-widest bg-asphalt-black px-2 py-1 border border-ink-gold/20">
                  Typography Lock Zone (35% NS)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Inspector */}
        <div className="h-64 border-t border-concrete-grey/10 bg-asphalt-black overflow-y-auto p-6 z-10">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-4 h-4 text-concrete-grey" />
            <span className="text-xs font-annotation text-concrete-grey uppercase tracking-widest">
              Composition Context
            </span>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] font-annotation text-ink-gold uppercase mb-2">
                Resolved Manifest
              </h4>
              <pre className="text-[10px] font-mono text-paper-white/60 bg-black/40 p-4 rounded border border-concrete-grey/5 overflow-x-auto">
                {JSON.stringify(compositionResult, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="text-[10px] font-annotation text-ink-gold uppercase mb-2">
                Original Data
              </h4>
              <pre className="text-[10px] font-mono text-paper-white/60 bg-black/40 p-4 rounded border border-concrete-grey/5 overflow-x-auto">
                {JSON.stringify(selectedHero, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DesignSidekick;
