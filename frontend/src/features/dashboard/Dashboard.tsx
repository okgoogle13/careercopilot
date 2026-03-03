import { Pebble, StatusBadge, Stone } from '@/components/ui';
import { motion } from 'framer-motion';
import { FileText, Layout, Plus, Sparkles, Target, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LayeredHero } from '../../components/kerala-rage/LayeredHero';
import { loadHeroRegistry } from '../../design/hero/heroRegistry';
import { composeHero } from '../../utils/heroComposer';
import type { SolidarityManifest } from '../../design/hero/heroTypes';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Profile {
  name: string;
  company: string;
  score: number;
  status: 'EXCELLENT' | 'GOOD' | 'FAIR';
}

// ============================================================================
// MOCK DATA
// ============================================================================

const PROFILES: Profile[] = [
  { name: 'Senior Software Engineer', company: 'TECHCORP', score: 92, status: 'EXCELLENT' },
  { name: 'UX Designer', company: 'DESIGNHUB', score: 85, status: 'GOOD' },
  { name: 'Product Manager', company: 'STARTUPXYZ', score: 78, status: 'FAIR' },
  { name: 'System Architect', company: 'GLOBALINFRA', score: 88, status: 'GOOD' },
];

/**
 * CareerCopilot Dashboard ("Solidarity Hub")
 *
 * V3.1 KrDark Mode Implementation:
 * ✓ ASSET-09 [SOLIDARITY_STYLE] Labyrinth (Ceiling Motifs)
 * ✓ High-fidelity Hero Metric Bar
 * ✓ 2x2 KrMotif Grid with Expressive Synthesis effects
 */
export function Dashboard() {
  const [heroData, setHeroData] = useState<{
    layers: any[];
    typography: any;
    animation: any;
    zIndexMap: any;
  } | null>(null);

  useEffect(() => {
    async function loadHero() {
      try {
        const [manifest, registry] = await Promise.all([
          fetch('/assets/kerala-rage-kr-solidarity-manifest.json').then((r) => r.json()),
          loadHeroRegistry(),
        ]);

        const result = composeHero(
          manifest as SolidarityManifest,
          registry,
          'layered-solidarity-hero'
        );

        if (result.valid) {
          setHeroData({
            layers: result.resolvedLayers,
            typography: result.typography,
            animation: result.animation,
            zIndexMap: result.zIndexMap,
          });
        }
      } catch (error) {
        console.error('Failed to load dashboard hero:', error);
      }
    }
    loadHero();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <div className="min-h-screen bg-asphalt-black relative overflow-hidden p-8 md:p-12 lg:p-16">
      {/* Background Layer: Hero Engine Integration */}
      {heroData && (
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <LayeredHero
            layers={heroData.layers}
            typography={{ ...heroData.typography, headline: '', supporting: '' }} // Hide text for background use
            animation={heroData.animation}
            zIndexMap={heroData.zIndexMap}
            className="h-full"
          />
        </div>
      )}

      <motion.div
        variants={container as any}
        initial="hidden"
        animate="show"
        className="max-w-[1440px] mx-auto relative z-10 space-y-12"
      >
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-concrete-grey/10 pb-12">
          <motion.div
            variants={item as any}
            className="space-y-2"
          >
            <p className="font-annotation text-xs text-ink-gold tracking-[0.6em] uppercase opacity-60">
              [ SOLIDARITY.REPORT_SUMMARY ]
            </p>
            <h1 className="font-display text-7xl font-black text-paper-white tracking-tighter uppercase leading-[0.9]">
              SOLIDARITY <span className="text-ink-gold">HUB</span>
            </h1>
            <p className="font-primary text-lg text-concrete-grey opacity-70 italic">
              "Archival synthesis reveals multiple resistance pathways."
            </p>
          </motion.div>

          {/* Quick Stats / Mini Metrics */}
          <motion.div
            variants={item as any}
            className="flex gap-6"
          >
            <div className="text-right">
              <span className="block font-annotation text-[10px] text-concrete-grey-dark uppercase tracking-widest">
                Growth Rate
              </span>
              <span className="text-2xl font-black text-paper-white">+14%</span>
            </div>
            <div className="w-px bg-concrete-grey/20 h-10" />
            <div className="text-right">
              <span className="block font-annotation text-[10px] text-concrete-grey-dark uppercase tracking-widest">
                KrMotifs Found
              </span>
              <span className="text-2xl font-black text-paper-white">42</span>
            </div>
          </motion.div>
        </header>

        {/* Hero Metric Bar: High Fidelity Calibration */}
        <motion.div variants={item as any}>
          <Stone
           
            elevation="raised"
            className="p-8 md:p-12 bg-asphalt-black/40 border-ink-gold/20 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative"
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-ink-gold/5 via-transparent to-transparent pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full relative z-10">
              {/* Active Inquiries */}
              <div className="space-y-1">
                <div className="flex items-center gap-3 text-ink-gold mb-3">
                  <FileText className="w-6 h-6" />
                  <span className="font-annotation text-[10px] uppercase tracking-[0.3em] font-bold">
                    Active Inquiries
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black text-paper-white leading-none tracking-tighter">
                    08
                  </span>
                  <StatusBadge
                    label="STABLE"
                    variant="success"
                  />
                </div>
              </div>

              {/* Calibrated Matches */}
              <div className="space-y-1">
                <div className="flex items-center gap-3 text-concrete-grey mb-3">
                  <Target className="w-6 h-6" />
                  <span className="font-annotation text-[10px] uppercase tracking-[0.3em] font-bold">
                    High Calibration
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black text-paper-white leading-none tracking-tighter">
                    03
                  </span>
                  <span className="text-[10px] font-annotation text-ink-gold uppercase opacity-50 tracking-widest leading-none">
                    ≥ 90% Match
                  </span>
                </div>
              </div>

              {/* Solidarity Energy / Velocity */}
              <div className="space-y-1">
                <div className="flex items-center gap-3 text-tertiary mb-3">
                  <Zap className="w-6 h-6" />
                  <span className="font-annotation text-[10px] uppercase tracking-[0.3em] font-bold">
                    Synthesis Velocity
                  </span>
                </div>
                <div className="relative pt-4">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 1.5, ease: 'circOut' }}
                      className="h-full bg-gradient-to-r from-ink-gold to-concrete-grey shadow-[0_0_10px_rgba(var(--color-ink-gold),0.5)]"
                    />
                  </div>
                  <p className="text-[9px] font-annotation text-paper-white opacity-40 mt-3 uppercase tracking-widest text-right">
                    Optimal throughput maintained
                  </p>
                </div>
              </div>
            </div>
          </Stone>
        </motion.div>

        {/* Global Action Drawer */}
        <motion.div
          variants={item as any}
          className="flex flex-wrap gap-4"
        >
          <Pebble
            variant="primary"
            size="lg"
            className="h-16 px-10 font-bold uppercase tracking-wider shadow-glow-gold"
          >
            <Plus className="w-5 h-5 mr-3" /> Deposit KrMotif
          </Pebble>
          <Pebble
            variant="secondary"
            size="lg"
            className="h-16 px-10 font-bold uppercase tracking-wider backdrop-blur-md"
          >
            <Layout className="w-5 h-5 mr-3" /> View Archive
          </Pebble>
          <Pebble
            variant="ghost"
            size="lg"
            className="h-16 px-10 font-bold uppercase tracking-wider border-concrete-grey/20 hover:bg-concrete-grey/5"
          >
            <Sparkles className="w-5 h-5 mr-3 text-ink-gold" /> Automated Synthesis
          </Pebble>
        </motion.div>

        {/* 2x2 KrMotif Grid: Optimized Application Profiles */}
        <section className="space-y-8">
          <div className="flex items-baseline gap-4">
            <h2 className="font-display text-3xl font-bold text-paper-white uppercase tracking-tight">
              RECENT <span className="text-ink-gold">SYNTHESIS</span>
            </h2>
            <div className="flex-1 h-px bg-concrete-grey/10" />
            <span className="font-annotation text-[9px] text-concrete-grey opacity-50 uppercase tracking-[0.4em]">
              KrMotif.LOG
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {PROFILES.map((profile, idx) => (
              <motion.div
                key={idx}
                variants={item as any}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Stone
                 
                  elevation="floating"
                  className="p-8 border-concrete-grey/10 bg-asphalt-black/20 group-hover:bg-asphalt-black/40 group-hover:border-ink-gold/30 transition-all duration-500 overflow-hidden relative"
                >
                  {/* Active Synthesis Effect */}
                  <div className="absolute -inset-20 bg-ink-gold/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                  <div className="relative z-10 flex justify-between items-start">
                    <div className="space-y-4">
                      <div>
                        <p className="font-annotation text-[10px] text-ink-gold uppercase tracking-[0.2em] opacity-80 mb-1">
                          {profile.company}
                        </p>
                        <h3 className="font-display text-2xl font-black text-paper-white tracking-tight leading-tight uppercase group-hover:text-ink-gold transition-colors">
                          {profile.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-4">
                        <StatusBadge
                          label={profile.status}
                          variant={profile.status === 'EXCELLENT' ? 'success' : 'warning'}
                          showDot
                        />
                        <span className="font-annotation text-[9px] text-concrete-grey opacity-40 uppercase tracking-widest leading-none">
                          Last Audit: 2m ago
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-6xl font-black text-paper-white tracking-tighter leading-none mb-1 tabular-nums group-hover:scale-110 transition-transform origin-right">
                        {profile.score}
                      </div>
                      <p className="font-annotation text-[9px] text-ink-gold uppercase tracking-widest font-bold opacity-60">
                        Calibration
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-concrete-grey/5 flex justify-between items-center relative z-10">
                    <button className="text-[10px] font-annotation text-concrete-grey uppercase tracking-widest hover:text-paper-white transition-colors">
                      Generate Artifacts →
                    </button>
                  </div>
                </Stone>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>

      {/* Viscous Breeze Shadowplay (Bottom Right) */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-64 -right-64 w-[800px] h-[800px] rounded-full bg-gradient-to-tl from-concrete-grey/10 via-transparent to-transparent blur-3xl pointer-events-none"
      />
    </div>
  );
}

export default Dashboard;
