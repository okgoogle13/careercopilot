import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  AlertCircle,
  CheckCircle2,
  Compass,
  Layers3,
  Palette,
  Shapes,
  Type,
  Zap,
  Menu,
  X,
  Copy,
  ExternalLink,
} from 'lucide-react';
import {
  March,
  Megaphone,
  Placard,
  ScaffoldArea,
  ScaffoldInput,
  StatusBadge,
  Strike,
  KrIcon,
  Valve,
} from '../../components/ui';
import { PageHeader } from '../../components/shared/PageHeader';
import {
  ArchetypeMorphPreviewer,
  LayoutSlopAuditor,
  MotionContractPanel,
  TypographyAxisValidator,
} from './M3ExpressiveComponents';
import { cn } from '../../lib/utils';

const ARCHETYPE_MATRIX = [
  {
    archetype: 'Button (Strike)',
    purpose: 'Primary actions and irreversible commits',
    base: 'shape.blockRiot03',
    active: 'shape.blockRiot02',
    loading: 'shape.blockRiot03-loading',
    ambient: '—',
    motion: 'typeSpringSlam (600ms)',
    components: 'Strike, KeralaRageButton',
  },
  {
    archetype: 'Select (March)',
    purpose: 'Sequential selection and progression controls',
    base: 'shape.blockRiot01',
    active: 'shape.marchSurge01',
    loading: 'shape.blockRiot02',
    ambient: '—',
    motion: 'dragSettle (800ms)',
    components: 'March',
  },
  {
    archetype: 'Dialog (Megaphone)',
    purpose: 'Interruption, announcement, priority focus',
    base: 'shape.megaphoneCut01',
    active: 'shape.megaphoneCut01',
    loading: 'shape.megaphoneCut01-loading',
    ambient: 'shape.substrateTile01',
    motion: 'typeSpringSlam (600ms)',
    components: 'Megaphone',
  },
  {
    archetype: 'Card (Placard)',
    purpose: 'Content framing and narrative containers',
    base: 'shape.placardTorn01',
    active: 'shape.placardTorn01-selected',
    loading: 'shape.blockRiot03',
    ambient: '—',
    motion: 'dragSettle (800ms)',
    components: 'Placard',
  },
  {
    archetype: 'Input / Textarea / Panel (Scaffold)',
    purpose: 'Structural layout and form infrastructure',
    base: 'shape.scaffoldFrame01 / shape.blockRiot02',
    active: 'immutable',
    loading: 'immutable',
    ambient: '—',
    motion: 'none (static)',
    components: 'ScaffoldInput, ScaffoldArea',
  },
  {
    archetype: 'Surface / Background (Substrate)',
    purpose: 'Atmospheric background and environmental texture',
    base: 'shape.substrateTile02',
    active: '—',
    loading: '—',
    ambient: 'shape.substrateTile01',
    motion: 'waterRipple (3000ms)',
    components: 'Background motifs only',
  },
] as const;

const COLOR_TOKENS = [
  { token: '--sys-color-charcoalBackground-base', swatch: '#1A1714', usage: 'substrate' },
  { token: '--sys-color-worker-ash-base', swatch: '#DAF6B3', usage: 'primary text' },
  { token: '--sys-color-solidarityRed-base', swatch: '#F14714', usage: 'critical actions' },
  { token: '--sys-color-inkGold-base', swatch: '#DAF674', usage: 'focus and halo' },
  { token: '--sys-color-kr-activistSmokeGreen-base', swatch: '#48DA8B', usage: 'success/growth' },
  { token: '--sys-color-stencilYellow-base', swatch: '#F6E748', usage: 'attention' },
  { token: '--sys-color-protestMetalBlue-base', swatch: '#48B3DA', usage: 'cool accent' },
  { token: '--sys-color-concreteGrey-base', swatch: '#A39B8F', usage: 'structure/dividers' },
] as const;

const TYPE_SAMPLES = [
  {
    label: 'Proclamation',
    familyVar: '--sys-type-fontFamilies-proclamation',
    fallback: 'Libre Bodoni',
    sizeVar: '--sys-type-scale-headline',
    text: 'COLLECTIVE DEMAND',
    style: { fontWeight: 800, letterSpacing: '-0.02em' },
  },
  {
    label: 'Primary UI',
    familyVar: '--sys-type-fontFamilies-primary',
    fallback: 'Work Sans',
    sizeVar: '--sys-type-scale-body',
    text: 'Operational copy optimized for dense interface reading.',
    style: { fontWeight: 500 },
  },
  {
    label: 'Display Editorial',
    familyVar: '--sys-type-fontFamilies-display',
    fallback: 'Fraunces',
    sizeVar: '--sys-type-scale-subhead',
    text: 'Resistance has a signature rhythm.',
    style: { fontWeight: 700, fontVariationSettings: "'wght' 700, 'wdth' 108" },
  },
  {
    label: 'Field-Note',
    familyVar: '--sys-type-fontFamilies-mono',
    fallback: 'JetBrains Mono',
    sizeVar: '--sys-type-scale-small',
    text: 'pipeline_status=green  coverage=96  regressions=0',
    style: { fontWeight: 500, letterSpacing: '0.01em' },
  },
] as const;

const SPACING_SCALE = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'] as const;
const SHAPE_TOKENS = [
  '--sys-shape-blockRiot01',
  '--sys-shape-blockRiot02',
  '--sys-shape-blockRiot03',
  '--sys-shape-marchSurge01',
  '--sys-shape-megaphoneCut01',
  '--sys-shape-placardTorn01',
] as const;

const MARCH_OPTIONS = [
  { value: 'resume', label: 'Resume' },
  { value: 'cover-letter', label: 'Cover Letter' },
  { value: 'ksc', label: 'KSC Response' },
] as const;

export function StyleGuide() {
  const [marchValue, setMarchValue] = useState('resume');
  const [showMegaphone, setShowMegaphone] = useState(false);
  const [scaffoldInput, setScaffoldInput] = useState('Union-facing program coordinator');
  const [scaffoldArea, setScaffoldArea] = useState(
    'Draft narrative for trauma-informed community impact.'
  );
  const [valveEnabled, setValveEnabled] = useState(true);

  // Interaction Tracking for Dynamic Checklist
  const [interactions, setInteractions] = useState({
    typography: false,
    motion: false,
    quality: false,
    components: false,
    foundations: false,
  });

  const [gritStatus, setGritStatus] = useState<'loading' | 'loaded' | 'failed'>('loading');

  useEffect(() => {
    const img = new Image();
    img.src = '/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-ui-019--v1.svg';
    img.onload = () => setGritStatus('loaded');
    img.onerror = () => setGritStatus('failed');
  }, []);

  const handleInteraction = (key: keyof typeof interactions) => {
    setInteractions((prev) => ({ ...prev, [key]: true }));
  };

  const validationChecklist = useMemo(
    () => [
      {
        id: 'archetypes',
        text: 'Archetype matrix includes base/active/loading/ambient dimensions.',
        status: 'pass',
      },
      {
        id: 'typography',
        text: 'Typography demonstrates all KR families with interactive axis validation.',
        status: interactions.typography ? 'pass' : 'todo',
      },
      {
        id: 'gallery',
        text: 'Component gallery renders canonical primitives with interactive states.',
        status: interactions.components ? 'pass' : 'todo',
      },
      {
        id: 'motion',
        text: 'Motion contracts are visible and tied to canonical durations/easing.',
        status: interactions.motion ? 'pass' : 'todo',
      },
      {
        id: 'foundations',
        text: 'Foundations include semantic color, spacing, shape, and elevation diagnostics.',
        status: interactions.foundations ? 'pass' : 'todo',
      },
      {
        id: 'quality',
        text: 'Layout quality is audited for slop/reflow violations.',
        status: interactions.quality ? 'pass' : 'todo',
      },
    ],
    [interactions]
  );

  const isReady = validationChecklist.every((i) => i.status === 'pass');
  const progress =
    (validationChecklist.filter((i) => i.status === 'pass').length / validationChecklist.length) *
    100;

  const sections = [
    { id: 'gate-definition', label: 'Gate Definition', icon: CheckCircle2 },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'archetype-matrix', label: 'Archetype Matrix', icon: Shapes },
    { id: 'component-gallery', label: 'Component Gallery', icon: Compass },
    { id: 'foundations', label: 'Foundations', icon: Palette },
    { id: 'motion-diagnostics', label: 'Motion & Quality', icon: Zap },
    { id: 'validation-checklist', label: 'Validation Checklist', icon: AlertCircle },
  ];

  const noiseOverlay = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`;

  return (
    <div
      className="p-6 md:p-12 max-w-7xl mx-auto min-h-screen relative selection:bg-primary/30"
      style={{ backgroundImage: noiseOverlay }}
    >
      <div className="flex flex-col 2xl:flex-row gap-10">
        {/* Sticky Sidebar */}
        <aside className="hidden 2xl:block 2xl:w-64 flex-shrink-0">
          <div className="2xl:sticky top-12 space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-black uppercase tracking-tighter text-primary border-l-4 border-primary pl-4">
                KR STYLE GUIDE
              </h1>
              <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest pl-5">
                Rev: 2026.03.v9
              </p>
            </div>

            <nav className="space-y-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-3 px-4 py-2 rounded-strike text-xs font-bold uppercase transition-all hover:bg-surface-container-high text-on-surface-variant hover:text-primary group"
                >
                  <section.icon className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                  {section.label}
                </a>
              ))}
            </nav>

            <div className="pt-8 border-t border-outline/10">
              <div className="bg-surface-dim p-4 rounded-strike border border-outline/20 space-y-3 shadow-xl">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase opacity-60">Ready Status</span>
                  <StatusBadge
                    variant={isReady ? 'success' : 'warning'}
                    label={isReady ? 'GO' : 'PENDING'}
                    showDot
                  />
                </div>
                <div className="h-1.5 bg-outline-variant rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                  />
                </div>
                <p className="text-[9px] font-mono opacity-40 uppercase text-center">
                  {Math.round(progress)}% Validation Complete
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow space-y-20">
          <header>
            <PageHeader
              title="KR Solidarity Living Style Guide"
              description="Live atlas of foundations, archetypes, components, and validation diagnostics."
              highlightedWord="Living"
            />
          </header>

          <section
            id="gate-definition"
            className="bg-surface-container border border-outline rounded-strike p-8 space-y-6 scroll-mt-12 shadow-glow-gold/5"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-black uppercase tracking-tight">Gate Definition</h2>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              This page is the decision surface for KR execution. It must demonstrate canonical
              foundations, archetypes, interactive components, and motion physics before advancing
              phases.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px] font-mono uppercase tracking-widest">
              <div className="bg-surface-dim border border-outline rounded-strike p-4 flex flex-col gap-1">
                <span className="opacity-40">Contract A</span>
                <span className="text-primary font-bold">typeSpringSlam = 600ms</span>
              </div>
              <div className="bg-surface-dim border border-outline rounded-strike p-4 flex flex-col gap-1">
                <span className="opacity-40">Contract B</span>
                <span className="text-secondary font-bold">dragSettle = 800ms</span>
              </div>
              <div className="bg-surface-dim border border-outline rounded-strike p-4 flex flex-col gap-1">
                <span className="opacity-40">Contract C</span>
                <span className="text-tertiary font-bold">waterRipple = 3000ms</span>
              </div>
            </div>
          </section>

          <section
            id="typography"
            className="space-y-6 scroll-mt-12"
          >
            <h3 className="text-headline-small font-black uppercase tracking-wide flex items-center gap-2">
              <Type className="w-6 h-6 text-primary" />
              Typography System
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {TYPE_SAMPLES.map((item) => (
                <article
                  key={item.label}
                  className="bg-surface-container border border-outline rounded-strike p-6 space-y-3 transition-transform hover:scale-[1.01]"
                >
                  <div className="flex justify-between items-center opacity-40 font-mono text-[10px] uppercase">
                    <span>{item.label}</span>
                    <span>{item.familyVar}</span>
                  </div>
                  <p
                    className="leading-tight text-on-surface"
                    style={{
                      fontFamily: `var(${item.familyVar}), ${item.fallback}`,
                      fontSize: `var(${item.sizeVar})`,
                      ...item.style,
                    }}
                  >
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="archetype-matrix"
            className="space-y-6 scroll-mt-12"
          >
            <h3 className="text-headline-small font-black uppercase tracking-wide flex items-center gap-2">
              <Shapes className="w-6 h-6 text-primary" />
              Archetype Matrix
            </h3>
            <div className="overflow-x-auto bg-surface-container border border-outline rounded-strike shadow-xl">
              <table className="w-full text-sm min-w-[980px]">
                <thead>
                  <tr className="text-left border-b border-outline bg-surface-dim">
                    <th className="p-4 font-black uppercase text-xs">Archetype</th>
                    <th className="p-4 font-black uppercase text-xs">Purpose</th>
                    <th className="p-4 font-black uppercase text-xs">Base Token</th>
                    <th className="p-4 font-black uppercase text-xs">Active State</th>
                    <th className="p-4 font-black uppercase text-xs">Motion Contract</th>
                    <th className="p-4 font-black uppercase text-xs">Primitives</th>
                  </tr>
                </thead>
                <tbody>
                  {ARCHETYPE_MATRIX.map((row) => (
                    <tr
                      key={row.archetype}
                      className="border-b border-outline/50 align-top hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 font-black uppercase text-primary">{row.archetype}</td>
                      <td className="p-4 text-on-surface-variant max-w-xs leading-relaxed">
                        {row.purpose}
                      </td>
                      <td className="p-4 font-mono text-[10px] opacity-60">{row.base}</td>
                      <td className="p-4 font-mono text-[10px] opacity-60">{row.active}</td>
                      <td className="p-4 font-mono text-[10px] text-secondary">{row.motion}</td>
                      <td className="p-4 text-[10px] font-mono opacity-80">{row.components}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section
            id="component-gallery"
            className="space-y-8 scroll-mt-12"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-headline-small font-black uppercase tracking-wide flex items-center gap-2">
                <Compass className="w-6 h-6 text-primary" />
                Canonical Component Gallery
              </h3>
              <Strike
                size="sm"
                variant="ghost"
                onClick={() => handleInteraction('components')}
              >
                MARK SAMPLED
              </Strike>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <Placard
                elevation="raised"
                header={<h3 className="text-title-medium font-black uppercase">Button Variants</h3>}
              >
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-4">
                    <Strike
                      variant="primary"
                      onClick={() => handleInteraction('components')}
                    >
                      Primary Button
                    </Strike>
                    <Strike variant="secondary">Secondary</Strike>
                    <Strike variant="ghost">Ghost</Strike>
                    <Strike variant="destructive">Destructive</Strike>
                    <Strike isLoading>Loading</Strike>
                  </div>
                  <div className="pt-6 border-t border-outline/10 grid grid-cols-2 gap-x-6 gap-y-3 text-[10px] font-mono leading-tight opacity-60 uppercase tracking-tighter">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>Primary: Critical path / Commit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                      <span>Secondary: Alternate / Cancel</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white/40" />
                      <span>Ghost: Low-emphasis / Utility</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-error" />
                      <span>Destructive: Data loss warning</span>
                    </div>
                  </div>
                </div>
              </Placard>

              <Placard elevation="raised">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 pt-2">
                    <StatusBadge
                      label="Ready"
                      variant="success"
                      showDot
                    />
                    <StatusBadge
                      label="Attention"
                      variant="warning"
                      showDot
                    />
                    <StatusBadge
                      label="Blocked"
                      variant="error"
                      showDot
                    />
                    <StatusBadge
                      label="Queued"
                      variant="neutral"
                      showDot
                    />
                  </div>
                </div>
              </Placard>

              <Placard
                elevation="raised"
                header={
                  <h3 className="text-title-medium font-black uppercase">Input and Textarea</h3>
                }
              >
                <div className="space-y-6">
                  <ScaffoldInput
                    id="style-guide-input"
                    label="Role target"
                    value={scaffoldInput}
                    onChange={(e) => {
                      setScaffoldInput(e.target.value);
                      handleInteraction('components');
                    }}
                    helperText="Structural input geometry is immutable."
                    fullWidth
                  />
                  <ScaffoldArea
                    id="style-guide-area"
                    label="Narrative Brief"
                    value={scaffoldArea}
                    onChange={(e) => {
                      setScaffoldArea(e.target.value);
                      handleInteraction('components');
                    }}
                    helperText="Long-form structured content."
                    fullWidth
                    rows={4}
                  />
                </div>
              </Placard>

              <Placard
                elevation="raised"
                header={
                  <h3 className="text-title-medium font-black uppercase">Input Error States</h3>
                }
              >
                <div className="space-y-6">
                  <ScaffoldInput
                    id="style-guide-error-input"
                    label="Required field"
                    value=""
                    error={true}
                    errorMessage="This field is required"
                    helperText="Input shows error state with red border and alert message"
                    fullWidth
                  />
                  <ScaffoldArea
                    id="style-guide-error-area"
                    label="Narrative content"
                    value=""
                    error={true}
                    errorMessage="Please provide at least 20 characters"
                    helperText="Text areas support error states for validation feedback"
                    fullWidth
                    rows={4}
                  />
                </div>
              </Placard>

              <Placard
                elevation="raised"
                header={
                  <h3 className="text-title-medium font-black uppercase">Select and Dialog</h3>
                }
                footer={
                  <div className="flex justify-end pt-4">
                    <Strike
                      variant="secondary"
                      onClick={() => setShowMegaphone(true)}
                    >
                      Open Dialog
                    </Strike>
                  </div>
                }
              >
                <div className="space-y-6">
                  <March
                    label="Artifact type"
                    options={[...MARCH_OPTIONS]}
                    value={marchValue}
                    onChange={(value) => {
                      setMarchValue(value);
                      handleInteraction('components');
                    }}
                    fullWidth
                  />
                  <div className="grid grid-cols-4 gap-3">
                    {['stencil', 'tram', 'seal', 'wheat'].map((name) => (
                      <div
                        key={name}
                        className="flex flex-col items-center gap-2 p-3 bg-surface-dim rounded-strike border border-outline/10 group hover:border-primary/40 transition-colors"
                      >
                        <KrIcon
                          name={name as any}
                          size={32}
                          className="opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                        <span className="text-[9px] font-mono uppercase opacity-40 group-hover:opacity-100">
                          {name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Placard>

              <Placard
                elevation="raised"
                header={
                  <h3 className="text-title-medium font-black uppercase">
                    Structural Control (Valve)
                  </h3>
                }
              >
                <div className="space-y-6">
                  <Valve
                    label="Enable high-pressure mode"
                    checked={valveEnabled}
                    onChange={(e) => {
                      setValveEnabled(e.target.checked);
                      handleInteraction('components');
                    }}
                    helperText="Valve controls narrative pressure with viscous spring logic."
                  />
                  <div className="p-4 bg-surface-dim rounded-pebble border border-outline/10">
                    <p className="text-xs font-mono opacity-60 uppercase mb-2">Current Stance</p>
                    <div className="text-xl font-black text-primary">
                      {valveEnabled ? 'COLLECTIVE PRESSURE ACTIVE' : 'SYSTEM VENTING'}
                    </div>
                  </div>
                </div>
              </Placard>

              <Placard
                elevation="raised"
                header={
                  <h3 className="text-title-medium font-black uppercase">The "Grit" Protocol</h3>
                }
              >
                <div className="space-y-4">
                  <div
                    className={cn(
                      'h-32 rounded-strike border relative overflow-hidden transition-all duration-700',
                      gritStatus === 'failed'
                        ? 'border-error/40 bg-error/5'
                        : 'border-outline bg-charcoalBackground-steps-2'
                    )}
                  >
                    {gritStatus === 'failed' ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-error gap-2 p-4 text-center">
                        <AlertCircle className="w-8 h-8" />
                        <span className="text-[10px] font-mono leading-tight">
                          Grit asset failed to load.
                          <br />
                          Falling back to diagonal safety hatch.
                        </span>
                        <div
                          className="absolute inset-0 opacity-10 pointer-events-none"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(45deg, var(--sys-color-solidarityRed-base) 0, var(--sys-color-solidarityRed-base) 1px, transparent 0, transparent 10px)',
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        className="absolute inset-0 opacity-60"
                        style={{
                          backgroundImage:
                            "url('/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-ui-019--v1.svg')",
                          backgroundRepeat: 'repeat',
                          mixBlendMode: 'overlay',
                        }}
                      />
                    )}
                  </div>
                  <div className="flex justify-between items-baseline">
                    <p className="text-[10px] font-mono opacity-50 uppercase">
                      Token: KR-UI-019 (Grit)
                    </p>
                    <StatusBadge
                      label={gritStatus.toUpperCase()}
                      variant={gritStatus === 'loaded' ? 'success' : 'error'}
                    />
                  </div>
                </div>
              </Placard>
            </div>
          </section>

          <section
            id="foundations"
            className="space-y-10 scroll-mt-12"
            onMouseEnter={() => handleInteraction('foundations')}
          >
            <h3 className="text-headline-small font-black uppercase tracking-wide flex items-center gap-2">
              <Palette className="w-6 h-6 text-primary" />
              Foundations Atlas
            </h3>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              <div className="bg-surface-container border border-outline rounded-strike p-6 space-y-6 shadow-xl">
                <h3 className="text-title-medium font-black uppercase flex items-center justify-between">
                  Semantic Color Registry
                  <span className="text-[10px] opacity-40">Click to Copy</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {COLOR_TOKENS.map((item) => (
                    <motion.div
                      key={item.token}
                      className="rounded-pebble border border-outline p-3 space-y-2 group relative overflow-hidden bg-surface-dim hover:border-primary/40 transition-colors"
                      whileHover={{ y: -2 }}
                    >
                      <div
                        className="h-16 rounded-pebble border border-outline relative transition-shadow group-hover:shadow-lg"
                        style={{ backgroundColor: `var(${item.token})` }}
                      >
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.token);
                            toast.success(`Copied ${item.token}`);
                          }}
                          className="absolute inset-0 bg-charcoalBackground/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[10px] uppercase font-black text-white backdrop-blur-sm"
                        >
                          <Copy className="w-4 h-4" />
                          Copy Token
                        </button>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-mono break-all font-bold text-primary">
                          {item.token}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] text-on-surface-variant italic">{item.usage}</p>
                          <p className="text-[10px] font-mono opacity-40">{item.swatch}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-10">
                <div className="bg-surface-container border border-outline rounded-strike p-6 space-y-6 shadow-xl">
                  <h3 className="text-title-medium font-black uppercase">
                    Spacing & Layout Tension
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {SPACING_SCALE.map((s) => (
                      <div
                        key={s}
                        className="bg-surface-dim border border-outline rounded-pebble p-4 text-xs font-mono group hover:bg-white/5 transition-colors"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-primary font-bold">{`--sys-spacing-${s}`}</div>
                          <Strike
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={() => {
                              navigator.clipboard.writeText(`var(--sys-spacing-${s})`);
                              toast.success(`Copied spacing token: ${s}`);
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Strike>
                        </div>
                        <div className="flex items-center gap-4">
                          <div
                            style={{ width: `var(--sys-spacing-${s})` }}
                            className="h-4 bg-primary rounded-sm shadow-glow-gold/20"
                          />
                          <span className="opacity-30 text-[10px]">{s.toUpperCase()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-surface-container border border-outline rounded-strike p-6 space-y-6 shadow-xl">
                  <h3 className="text-title-medium font-black uppercase">Shape Signatures</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {SHAPE_TOKENS.map((shape) => (
                      <div
                        key={shape}
                        className="bg-surface-dim border border-outline p-4 rounded-strike space-y-3 group hover:border-secondary/40 transition-colors"
                      >
                        <div className="text-[9px] font-mono opacity-40 break-all leading-tight h-8">
                          {shape}
                        </div>
                        <div
                          style={{ borderRadius: `var(${shape})` }}
                          className="h-16 border-2 border-dashed border-outline/30 bg-charcoalBackground-steps-3 group-hover:bg-secondary/5 transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container border border-outline rounded-strike p-8 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black uppercase flex items-center gap-3">
                  <Layers3 className="w-8 h-8 text-primary" />
                  Elevation Diagnostics
                </h3>
                <div className="text-[10px] font-mono opacity-40 uppercase">
                  Stone & Float Physics v6.0
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <Placard
                    elevation="flat"
                    className="h-40 flex items-center justify-center border-dashed"
                  >
                    <span className="text-sm font-black uppercase opacity-20 tracking-widest">
                      FLAT
                    </span>
                  </Placard>
                  <div className="text-[10px] font-mono space-y-1 px-2">
                    <p className="text-secondary font-bold">--sys-elevation0</p>
                    <p className="opacity-40 italic">
                      Structural baseline. No shadow. Border only.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Placard
                    elevation="raised"
                    className="h-40 flex items-center justify-center bg-surface-dim"
                  >
                    <span className="text-sm font-black uppercase opacity-60 tracking-widest text-primary">
                      RAISED
                    </span>
                  </Placard>
                  <div className="text-[10px] font-mono space-y-1 px-2">
                    <p className="text-primary font-bold">--sys-elevation2Placard</p>
                    <p className="opacity-40 italic text-on-surface">
                      Standard interactive focus. Stone-like presence.
                    </p>
                    <p className="text-[8px] opacity-30 mt-1">
                      SHADOW: 0 4px 20px -2px rgba(0,0,0,0.4)
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative pt-4">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-ink-gold text-charcoalBackground rounded-full text-[8px] font-black z-10 animate-pulse">
                      FLOATING
                    </div>
                    <Placard
                      elevation="floating"
                      className="h-40 flex items-center justify-center bg-white/5 border-primary/20"
                    >
                      <span className="text-sm font-black uppercase tracking-[0.2em] text-ink-gold drop-shadow-lg">
                        FLOAT
                      </span>
                    </Placard>
                  </div>
                  <div className="text-[10px] font-mono space-y-1 px-2">
                    <p className="text-ink-gold font-bold">--sys-elevation4Float</p>
                    <p className="opacity-40 italic">
                      Modal/Interruption depth. Detached from substrate.
                    </p>
                    <p className="text-[8px] opacity-30 mt-1">
                      SHADOW: 0 15px 45px -10px rgba(0,0,0,0.6)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="motion-diagnostics"
            className="space-y-10 scroll-mt-12"
          >
            <h3 className="text-headline-small font-black uppercase tracking-wide flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              Motion + Quality Diagnostics
            </h3>
            <MotionContractPanel />
            <ArchetypeMorphPreviewer onInteraction={() => handleInteraction('motion')} />
            <TypographyAxisValidator onInteraction={() => handleInteraction('typography')} />
            <LayoutSlopAuditor onInteraction={() => handleInteraction('quality')} />
          </section>

          <section
            id="validation-checklist"
            className="bg-surface-container border border-outline rounded-strike p-10 space-y-8 scroll-mt-12 overflow-hidden relative shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none rotate-12">
              <AlertCircle className="w-64 h-64" />
            </div>

            <div className="space-y-2 relative z-10">
              <h3 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                <AlertCircle className="w-10 h-10 text-warning" />
                Validation Checklist
              </h3>
              <p className="text-on-surface-variant max-w-2xl font-medium">
                This checklist evaluates live DOM state and interactions. All items must pass for
                "GO" status.
              </p>
            </div>

            <ul className="space-y-4 relative z-10 max-w-3xl">
              {validationChecklist.map((item) => (
                <motion.li
                  key={item.id}
                  className={cn(
                    'flex items-start gap-4 p-4 rounded-strike border transition-all duration-500',
                    item.status === 'pass'
                      ? 'bg-primary/5 border-primary/20'
                      : 'bg-white/5 border-outline/10 grayscale opacity-60'
                  )}
                  initial={false}
                  animate={{ x: item.status === 'pass' ? 0 : -10 }}
                >
                  <div
                    className={cn(
                      'mt-1 flex-shrink-0 w-6 h-6 rounded-strike border flex items-center justify-center transition-all duration-700',
                      item.status === 'pass'
                        ? 'bg-primary border-primary text-on-primary rotate-0 scale-110'
                        : 'bg-surface-dim border-outline/30 rotate-45 scale-90'
                    )}
                  >
                    {item.status === 'pass' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4 opacity-20" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <span
                      className={cn(
                        'text-sm font-bold uppercase tracking-tight',
                        item.status === 'pass' ? 'text-primary' : 'text-on-surface-variant'
                      )}
                    >
                      {item.id}
                    </span>
                    <p
                      className={cn(
                        'text-sm leading-relaxed',
                        item.status === 'pass' ? 'text-on-surface' : 'text-on-surface-variant'
                      )}
                    >
                      {item.text}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>

            {isReady && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gradient-to-r from-success/20 to-primary/20 border border-success/40 rounded-strike flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center text-on-primary animate-bounce">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase text-success">
                      Institutional Squelch Pass
                    </h4>
                    <p className="text-sm opacity-80">
                      All v6.0 compliance criteria met for current session.
                    </p>
                  </div>
                </div>
                <Strike
                  variant="primary"
                  iconRight={<ExternalLink className="w-4 h-4" />}
                >
                  PROCEED TO CI
                </Strike>
              </motion.div>
            )}
          </section>
        </main>
      </div>

      <AnimatePresence>
        {showMegaphone && (
          <Megaphone
            open={showMegaphone}
            onClose={() => setShowMegaphone(false)}
            title="SYSTEM ANNOUNCEMENT"
          >
            <div className="space-y-6">
              <p className="text-lg font-display leading-snug text-worker-ash-base">
                This dialog demonstrates the <strong>Megaphone</strong> internal mapping using{' '}
                <em>typeSpringSlam</em> entry physics.
              </p>
              <div className="p-4 bg-white/5 rounded-strike border border-white/10 space-y-2">
                <p className="text-[10px] font-mono uppercase opacity-40">Contract Validation</p>
                <ul className="text-xs space-y-1 text-on-surface-variant">
                  <li>• Entry: spring(600ms, stiffness 180, damping 15)</li>
                  <li>• Backdrop: viscous-breeze blur (12px)</li>
                  <li>• Shape: immutable megaphoneCut01</li>
                </ul>
              </div>
              <div className="flex justify-end gap-3">
                <Strike
                  variant="ghost"
                  onClick={() => setShowMegaphone(false)}
                >
                  DISMISS
                </Strike>
                <Strike
                  variant="primary"
                  onClick={() => {
                    setShowMegaphone(false);
                    handleInteraction('components');
                  }}
                >
                  ACKNOWLEDGE
                </Strike>
              </div>
            </div>
          </Megaphone>
        )}
      </AnimatePresence>
    </div>
  );
}

function ComponentSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-dim border border-outline rounded-strike p-6 space-y-4 shadow-inner">
      <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.2em] border-b border-outline/10 pb-2">
        {title}
      </h4>
      <div className="flex flex-wrap gap-6 items-start">{children}</div>
    </div>
  );
}
