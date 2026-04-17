import { Strike, Placard } from '@/components/ui';
import { motion } from 'framer-motion';
import { FileText, Layout, Plus, Rocket, Sparkles, Target, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayeredHero } from '../../components/kerala-rage/LayeredHero';
import { loadHeroRegistry } from '../../design/hero/heroRegistry';
import { composeHero } from '../../lib/composeHero';
import type { SolidarityManifest } from '../../design/hero/heroTypes';
import { OnboardingChecklist, CHECKLIST_DISMISSED_KEY } from './OnboardingChecklist';
import { ATSTrendChart } from './components/ATSTrendChart';
import { useUserStore } from '@/stores/userStore';
import { KrDarkSpring } from '@/design/tokens/motion-presets';

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
  const [showChecklist, setShowChecklist] = useState(() => {
    // Show checklist unless user has explicitly dismissed it
    try {
      return localStorage.getItem(CHECKLIST_DISMISSED_KEY) !== 'true';
    } catch {
      return true;
    }
  });
  const { hasMaster, hasCompletedIngestion, userSegment, checkMaster } = useUserStore();
  const [showIngestionReminder, setShowIngestionReminder] = useState(
    () => localStorage.getItem('cc_ingestion_skipped') === 'true'
  );

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
    void checkMaster();
  }, [checkMaster]);

  const handleChecklistDismiss = () => {
    try {
      localStorage.setItem(CHECKLIST_DISMISSED_KEY, 'true');
    } catch {
      // ignore
    }
    setShowChecklist(false);
  };

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
      transition: KrDarkSpring,
    },
  };

  const showActivationChecklist = hasMaster && showChecklist;
  const segmentMessage: Record<string, string> = {
    'recent-graduate': 'Start with guided templates to build confidence quickly.',
    'career-change': 'Translate transferable strengths into role-specific outcomes.',
    'senior-advancement': 'Focus on leadership evidence and measurable impact.',
    'international-applicant': 'Prioritize localization, clarity, and ATS-friendly phrasing.',
  };

  return (
    <div className="relative overflow-hidden p-6 md:p-10 lg:p-14">
      {/* Background Layer: Hero Engine Integration */}
      {heroData && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
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
            <p className="font-mono text-xs text-ink-gold tracking-[0.6em] uppercase opacity-60">
              [ DASHBOARD OVERVIEW ]
            </p>
            <h1 className="font-display text-7xl font-black text-paper-white tracking-tighter uppercase leading-[0.9]">
              SOLIDARITY <span className="text-ink-gold">HUB</span>
            </h1>
            <p className="font-primary text-lg text-concrete-grey opacity-70 italic">
              "Track your current application pipeline and next best actions."
            </p>
          </motion.div>

          {/* Quick Stats / Mini Metrics */}
          {!showActivationChecklist && (
            <motion.div
              variants={item as any}
              className="flex gap-6"
            >
              <div className="text-right">
                <span className="block font-mono text-[10px] text-concrete-grey-dark uppercase tracking-widest">
                  Match Trend
                </span>
                <span className="text-2xl font-black text-paper-white">+14%</span>
              </div>
              <div className="w-px bg-concrete-grey/20 h-10" />
              <div className="text-right">
                <span className="block font-mono text-[10px] text-concrete-grey-dark uppercase tracking-widest">
                  Roles Tracked
                </span>
                <span className="text-2xl font-black text-paper-white">42</span>
              </div>
            </motion.div>
          )}
        </header>

        {userSegment && (
          <motion.div variants={item as any}>
            <div className="rounded-placard border border-concrete-grey/20 bg-asphalt-black/35 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-gold/75 mb-1">
                Personalized Focus
              </p>
              <p className="font-primary text-sm text-paper-white">
                {segmentMessage[userSegment] ??
                  'Progress through the checklist to unlock advanced tailoring.'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Hero Metric Bar */}
        {hasMaster && !showActivationChecklist && (
          <motion.div variants={item as any}>
            <Placard
              elevation="raised"
              className="p-8 md:p-12 bg-asphalt-black/40 border-ink-gold/20 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative"
            >
              {/* Glossy Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-ink-gold/5 via-transparent to-transparent pointer-events-none" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full relative z-10">
                {/* Active Applications */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3 text-ink-gold mb-3">
                    <FileText className="w-6 h-6" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
                      Active Applications
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-black text-paper-white leading-none tracking-tighter">
                      08
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--kr-color-kr-activist-smoke-green-base)] border border-[var(--kr-color-kr-activist-smoke-green-base)]/30 bg-[var(--kr-color-kr-activist-smoke-green-base)]/10 rounded-march">
                      STABLE
                    </span>
                  </div>
                </div>

                {/* High Matches */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3 text-concrete-grey mb-3">
                    <Target className="w-6 h-6" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
                      High Matches
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-black text-paper-white leading-none tracking-tighter">
                      03
                    </span>
                    <span className="text-[10px] font-mono text-ink-gold uppercase opacity-50 tracking-widest leading-none">
                      ≥ 90% Match
                    </span>
                  </div>
                </div>

                {/* Weekly Progress */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3 text-tertiary mb-3">
                    <Zap className="w-6 h-6" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
                      Weekly Progress
                    </span>
                  </div>
                  <div className="relative pt-4">
                    <div className="h-1.5 w-full bg-white/5 rounded-march overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 1.5, ease: 'circOut' }}
                        className="h-full bg-gradient-to-r from-ink-gold to-concrete-grey"
                      />
                    </div>
                    <p className="text-[9px] font-mono text-paper-white opacity-40 mt-3 uppercase tracking-widest text-right">
                      Applications moving forward
                    </p>
                  </div>
                </div>
              </div>
            </Placard>
          </motion.div>
        )}

        {/* Onboarding Activation Checklist (shown until dismissed) */}
        {showActivationChecklist && (
          <motion.div variants={item as any}>
            <OnboardingChecklist onDismiss={handleChecklistDismiss} />
          </motion.div>
        )}

        {!hasCompletedIngestion && showIngestionReminder && (
          <motion.div variants={item as any}>
            <div className="rounded-placard border border-[var(--sys-color-solidarityRed-base)]/45 bg-[var(--sys-color-solidarityRed-base)]/12 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="font-primary text-sm text-paper-white">
                Add your master resume to unlock personalized analysis, quick apply, and
                high-fidelity tailoring.
              </p>
              <button
                className="font-mono text-[10px] uppercase tracking-widest text-ink-gold"
                onClick={() => {
                  localStorage.removeItem('cc_ingestion_skipped');
                  setShowIngestionReminder(false);
                }}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        <motion.div variants={item as any}>
          {!hasMaster ? (
            <Link
              to="/profile"
              className="block w-full rounded-placard border border-[--sys-color-inkGold-base]/35 bg-[--sys-color-inkGold-base] text-[--sys-color-charcoalBackground-base] px-8 py-6 font-black uppercase tracking-wide text-center transition-all duration-300"
            >
              <span className="inline-flex items-center justify-center gap-3">
                <Rocket className="w-5 h-5" /> Build Master Resume
              </span>
            </Link>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/apply"
                className="rounded-placard px-7 py-5 font-black uppercase tracking-wide text-center transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'var(--sys-color-solidarityRed-base)',
                  color: 'var(--sys-color-charcoalBackground-base)',
                  boxShadow:
                    '0 16px 42px color-mix(in srgb, var(--sys-color-solidarityRed-base) 36%, transparent)',
                }}
              >
                <span className="inline-flex items-center justify-center gap-2">🎯 Apply Now</span>
              </Link>
              <Link
                to="/profile"
                className="rounded-placard border border-concrete-grey/25 bg-asphalt-black/40 text-paper-white px-7 py-5 font-bold uppercase tracking-wide text-center transition-all duration-300 hover:border-ink-gold/35"
              >
                Update Master
              </Link>
            </div>
          )}
        </motion.div>

        {hasMaster && !showActivationChecklist && (
          <>
            {/* Global Action Drawer */}
            <motion.div
              variants={item as any}
              className="flex flex-wrap gap-4"
            >
              <Strike
                variant="primary"
                size="lg"
                className="h-16 px-10 font-bold uppercase tracking-wider shadow-glow-gold"
              >
                <Plus className="w-5 h-5 mr-3" /> Add Application
              </Strike>
              <Strike
                variant="secondary"
                size="lg"
                className="h-16 px-10 font-bold uppercase tracking-wider backdrop-blur-md"
              >
                <Layout className="w-5 h-5 mr-3" /> View Archive
              </Strike>
              <Strike
                variant="ghost"
                size="lg"
                className="h-16 px-10 font-bold uppercase tracking-wider border-concrete-grey/20 hover:bg-concrete-grey/5"
              >
                <Sparkles className="w-5 h-5 mr-3 text-ink-gold" /> Smart Suggestions
              </Strike>
            </motion.div>

            {/* 2x2 Grid: Recent Application Profiles */}
            <section className="space-y-8">
              <div className="flex items-baseline gap-4">
                <h2 className="font-display text-3xl font-bold text-paper-white uppercase tracking-tight">
                  RECENT <span className="text-ink-gold">APPLICATIONS</span>
                </h2>
                <div className="flex-1 h-px bg-concrete-grey/10" />
                <span className="font-mono text-[9px] text-concrete-grey opacity-50 uppercase tracking-[0.4em]">
                  ACTIVITY
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
                    <Placard
                      elevation="floating"
                      className="p-8 border-concrete-grey/10 bg-asphalt-black/20 group-hover:bg-asphalt-black/40 group-hover:border-ink-gold/30 transition-all duration-500 overflow-hidden relative"
                    >
                      {/* Active Synthesis Effect */}
                      <div className="absolute -inset-20 bg-ink-gold/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                      <div className="relative z-10 flex justify-between items-start">
                        <div className="space-y-4">
                          <div>
                            <p className="font-mono text-[10px] text-ink-gold uppercase tracking-[0.2em] opacity-80 mb-1">
                              {profile.company}
                            </p>
                            <h3 className="font-display text-2xl font-black text-paper-white tracking-tight leading-tight uppercase group-hover:text-ink-gold transition-colors">
                              {profile.name}
                            </h3>
                          </div>

                          <div className="flex items-center gap-4">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-march ${
                                profile.status === 'EXCELLENT'
                                  ? 'text-[var(--kr-color-kr-activist-smoke-green-base)] border border-[var(--kr-color-kr-activist-smoke-green-base)]/30 bg-[var(--kr-color-kr-activist-smoke-green-base)]/10'
                                  : 'text-[var(--sys-color-stencilYellow-base)] border border-[var(--sys-color-stencilYellow-base)]/30 bg-[var(--sys-color-stencilYellow-base)]/10'
                              }`}
                            >
                              {profile.status}
                            </span>
                            <span className="font-mono text-[9px] text-concrete-grey opacity-40 uppercase tracking-widest leading-none">
                              Last updated: 2m ago
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-6xl font-black text-paper-white tracking-tighter leading-none mb-1 tabular-nums group-hover:scale-110 transition-transform origin-right">
                            {profile.score}
                          </div>
                          <p className="font-mono text-[9px] text-ink-gold uppercase tracking-widest font-bold opacity-60">
                            Match score
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-concrete-grey/5 flex justify-between items-center relative z-10">
                        <button className="text-[10px] font-mono text-concrete-grey uppercase tracking-widest hover:text-paper-white transition-colors">
                          Generate documents →
                        </button>
                      </div>
                    </Placard>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ATS Score Trend Chart — B19 harvest */}
            <motion.div variants={item as any}>
              <ATSTrendChart />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Viscous Breeze Shadowplay (Bottom Right) */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-64 -right-64 w-[800px] h-[800px] rounded-march bg-gradient-to-tl from-concreteGrey-base/5 via-transparent to-transparent blur-3xl pointer-events-none"
      />
    </div>
  );
}

export default Dashboard;
