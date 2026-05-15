import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Shapes, Type, Waves } from 'lucide-react';
import { Strike } from '../../components/ui/Strike';
import { cn } from '../../lib/utils';
import { KrDarkSpring } from '@/design/tokens/motion-presets';

const MOTION_CONTRACTS = {
  easing: 'var(--kr-motion-easing-strike)',
  strike: 'var(--kr-motion-duration-strike)',
  march: 'var(--kr-motion-duration-march)',
  substrate: 'var(--kr-motion-duration-placard)', // Using placard as slow substrate
};

export function ArchetypeMorphPreviewer({ onInteraction }: { onInteraction?: () => void }) {
  const [state, setState] = useState<'base' | 'active'>('base');
  const [currentArchetype, setCurrentArchetype] = useState<'strike' | 'march' | 'placard'>(
    'strike'
  );

  const handleToggle = () => {
    setState((s) => (s === 'base' ? 'active' : 'base'));
    onInteraction?.();
  };

  const shapes = {
    strike: {
      base: 'var(--kr-archetypes-strike-shape-base)',
      active: 'var(--kr-archetypes-strike-shape-active)',
    },
    march: {
      base: 'var(--kr-archetypes-march-shape-base)',
      active: 'var(--kr-archetypes-march-shape-active)',
    },
    placard: {
      base: 'var(--kr-archetypes-placard-shape-base)',
      active: 'var(--kr-archetypes-placard-shape-base)', // Placards are currently immutable
    },
  };

  const isActive = state === 'active';
  const clipPath = isActive ? shapes[currentArchetype].active : shapes[currentArchetype].base;
  const contractDuration =
    currentArchetype === 'march' ? MOTION_CONTRACTS.march : MOTION_CONTRACTS.strike;

  return (
    <div className="p-8 bg-surface-container rounded-strike border border-[var(--kr-color-concrete-grey-steps-0)] space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-title-large font-bold flex items-center gap-2">
          <Shapes className="w-6 h-6 text-primary" />
          Archetype Morph Previewer
        </h3>
        <button
          type="button"
          onClick={handleToggle}
          className="px-4 py-2 bg-primary text-on-primary rounded-march font-bold uppercase text-xs"
        >
          {isActive ? 'Reset Base' : 'Activate'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="relative group">
            <motion.div
              className="h-56 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-outline/30"
              style={{ borderRadius: clipPath }}
              animate={{ borderRadius: clipPath }}
              transition={KrDarkSpring}
            >
              <div className="text-center p-6 bg-charcoalBackground/40 backdrop-blur-sm rounded-lg border border-white/5">
                <div className="text-3xl font-black uppercase tracking-tighter text-worker-ash">
                  {currentArchetype}
                </div>
                <div className="text-[10px] font-mono opacity-70 mt-2 py-1 px-2 bg-primary/20 rounded uppercase tracking-widest">
                  {isActive ? 'active' : 'base'} state
                </div>
              </div>
            </motion.div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['strike', 'march', 'placard'] as const).map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setCurrentArchetype(name)}
                className={`px-3 py-1 rounded-march text-xs font-bold uppercase transition-all ${
                  currentArchetype === name
                    ? 'bg-primary text-on-primary shadow-glow-gold'
                    : 'bg-surface-dim text-on-surface hover:bg-surface-container-high border border-outline/20'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold text-ink-gold font-display">Active Contract</p>
          <div className="bg-surface-dim p-4 rounded-strike text-[10px] font-mono space-y-2 border border-outline/20">
            <div className="flex justify-between border-b border-outline/10 pb-1">
              <span className="opacity-50">easing</span>
              <span className="text-primary truncate ml-4">{MOTION_CONTRACTS.easing}</span>
            </div>
            <div className="flex justify-between border-b border-outline/10 pb-1">
              <span className="opacity-50">duration</span>
              <span className="text-primary">{contractDuration}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-50">physics</span>
              <span className="text-primary">stiffness 120 / damping 20</span>
            </div>
          </div>
          <p className="text-[10px] text-on-surface-variant leading-relaxed">
            * Strike and Placard use <strong>typeSpringSlam</strong>; March uses{' '}
            <strong>dragSettle</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

export function TypographyAxisValidator({ onInteraction }: { onInteraction?: () => void }) {
  const [axes, setAxes] = useState({ wght: 400, wdth: 100, GRAD: 0 });

  const handleAxisChange = (axis: keyof typeof axes, value: number) => {
    setAxes((prev) => ({ ...prev, [axis]: value }));
    onInteraction?.();
  };

  const settings = `'wght' ${axes.wght}, 'wdth' ${axes.wdth}, 'GRAD' ${axes.GRAD}`;

  return (
    <div className="p-8 bg-surface-container rounded-strike border border-[var(--kr-color-concrete-grey-steps-0)] space-y-6">
      <h3 className="text-title-large font-bold flex items-center gap-2">
        <Type className="w-6 h-6 text-secondary" />
        Typography Axis Validator
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-64 bg-surface-dim rounded-strike flex flex-col items-center justify-center border border-outline relative overflow-hidden">
          <div className="absolute top-2 left-3 text-[10px] font-mono opacity-30 uppercase tracking-widest">
            Live Output
          </div>
          <motion.h2
            className="text-6xl text-center px-4"
            style={{
              fontFamily: 'var(--kr-type-font-primary)',
              fontVariationSettings: settings,
            }}
            animate={{ fontVariationSettings: settings }}
            transition={KrDarkSpring}
          >
            KR Type
          </motion.h2>
          <div className="absolute bottom-4 text-[10px] font-mono text-primary/60 border border-primary/20 px-2 py-0.5 rounded">
            {settings}
          </div>
        </div>

        <div className="space-y-6 bg-surface-dim/50 p-6 rounded-strike border border-outline/20">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-tighter">
                <span className="text-secondary font-bold">Weight (wght)</span>
                <span className="text-worker-ash bg-charcoalBackground-steps-3 px-1 rounded">
                  {axes.wght}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="900"
                step="1"
                value={axes.wght}
                onChange={(e) => handleAxisChange('wght', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[var(--kr-color-concrete-grey-steps-0)] rounded-lg appearance-none cursor-pointer accent-secondary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-tighter">
                <span className="text-secondary font-bold">Width (wdth)</span>
                <span className="text-worker-ash bg-charcoalBackground-steps-3 px-1 rounded">
                  {axes.wdth}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                step="1"
                value={axes.wdth}
                onChange={(e) => handleAxisChange('wdth', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[var(--kr-color-concrete-grey-steps-0)] rounded-lg appearance-none cursor-pointer accent-secondary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-tighter">
                <span className="text-secondary font-bold">Grade (GRAD)</span>
                <span className="text-worker-ash bg-charcoalBackground-steps-3 px-1 rounded">
                  {axes.GRAD}
                </span>
              </div>
              <input
                type="range"
                min="-200"
                max="200"
                step="1"
                value={axes.GRAD}
                onChange={(e) => handleAxisChange('GRAD', parseInt(e.target.value))}
                className="w-full h-1.5 bg-[var(--kr-color-concrete-grey-steps-0)] rounded-lg appearance-none cursor-pointer accent-secondary"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-outline/10 text-[10px] text-on-surface-variant italic leading-relaxed">
            * Variable axes allow for fluid transition between "Pressure" and "Relief" states in the
            KR narrative.
          </div>
        </div>
      </div>
    </div>
  );
}

export function LayoutSlopAuditor({ onInteraction }: { onInteraction?: () => void }) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [violations, setViolations] = useState<string[]>([]);
  const [currentDelta, setCurrentDelta] = useState({ dw: 0, dh: 0 });
  const [testType, setTestType] = useState<'correct' | 'wrong'>('correct');
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const baselineRef = useRef<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (!isMonitoring || !elementRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;

        if (!baselineRef.current) {
          baselineRef.current = { width, height };
          return;
        }

        const dW = Math.abs(width - baselineRef.current.width);
        const dH = Math.abs(height - baselineRef.current.height);

        setCurrentDelta({ dw: dW, dh: dH });

        if (dW > 0.5 || dH > 0.5) {
          const timestamp = new Date().toLocaleTimeString([], {
            hour12: false,
            minute: '2-digit',
            second: '2-digit',
          });
          setViolations((prev) => {
            const msg = `[${timestamp}] SLOP: ${dW.toFixed(1)}px width | ${dH.toFixed(1)}px height`;
            if (prev[0]?.split('] ')[1] === msg.split('] ')[1]) return prev; // Avoid duplicates
            return [msg, ...prev].slice(0, 5);
          });
        }
      }
    });

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [isMonitoring, testType]);

  const start = () => {
    baselineRef.current = null;
    setViolations([]);
    setCurrentDelta({ dw: 0, dh: 0 });
    setIsMonitoring(true);
    onInteraction?.();
  };

  return (
    <div className="p-8 bg-surface-container rounded-strike border border-[var(--kr-color-concrete-grey-steps-0)] space-y-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-title-large font-bold flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-warning" />
          Layout Slop Auditor
        </h3>
        <Strike
          variant={isMonitoring ? 'destructive' : 'primary'}
          size="sm"
          onClick={isMonitoring ? () => setIsMonitoring(false) : start}
          className={cn(isMonitoring && 'animate-pulse')}
        >
          {isMonitoring ? 'STOP / RESET' : 'START AUDIT'}
        </Strike>
      </div>

      <div className="flex gap-2 p-1 bg-surface-dim rounded-strike border border-outline/20 w-fit">
        <button
          type="button"
          onClick={() => {
            setTestType('correct');
            setViolations([]);
            baselineRef.current = null;
          }}
          className={`px-4 py-1.5 rounded-strike text-[10px] font-bold uppercase transition-all ${testType === 'correct' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface/60 hover:text-on-surface'}`}
        >
          Optimal (GRAD)
        </button>
        <button
          type="button"
          onClick={() => {
            setTestType('wrong');
            setViolations([]);
            baselineRef.current = null;
          }}
          className={`px-4 py-1.5 rounded-strike text-[10px] font-bold uppercase transition-all ${testType === 'wrong' ? 'bg-error text-on-error shadow-sm' : 'text-on-surface/60 hover:text-on-surface'}`}
        >
          Sloppy (Weight)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="h-44 bg-surface-dim rounded-strike border-2 border-dashed border-outline/40 flex items-center justify-center relative overflow-hidden group hover:border-primary/40 transition-colors"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute top-2 left-3 text-[9px] font-mono opacity-20 uppercase tracking-[0.2em]">
            Interaction Zone
          </div>
          {testType === 'correct' ? (
            <motion.div
              ref={elementRef}
              className="text-2xl font-display text-worker-ash cursor-help"
              style={{ fontVariationSettings: "'wght' 400, 'GRAD' 0" }}
              animate={{
                fontVariationSettings: isHovered
                  ? "'wght' 400, 'GRAD' 150'"
                  : "'wght' 400, 'GRAD' 0'",
              }}
              transition={KrDarkSpring}
            >
              Stable Layout
            </motion.div>
          ) : (
            <motion.div
              ref={elementRef}
              className="text-2xl font-display text-solidarity-crimson cursor-help"
              initial={{ fontWeight: 400 }}
              animate={{ fontWeight: isHovered ? 800 : 400 }}
              transition={KrDarkSpring}
            >
              Reflow Risk
            </motion.div>
          )}
          {isHovered && (
            <div className="absolute bottom-2 text-[8px] font-mono text-primary animate-bounce">
              INTERACTING...
            </div>
          )}
        </div>

        <div
          className={cn(
            'p-5 rounded-strike border transition-all duration-500 flex flex-col gap-4',
            violations.length
              ? 'bg-error/5 border-error/40'
              : isMonitoring
                ? 'bg-primary/5 border-primary/40'
                : 'bg-surface-dim border-outline/20'
          )}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              {violations.length ? (
                <div className="w-2 h-2 rounded-full bg-error animate-ping" />
              ) : (
                <div
                  className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-primary animate-pulse' : 'bg-outline'}`}
                />
              )}
              {violations.length
                ? 'Violations Logged'
                : isMonitoring
                  ? 'Monitoring Active'
                  : 'Auditor Idle'}
            </div>
            {isMonitoring && (
              <div className="text-[10px] font-mono opacity-60">
                ΔW: {currentDelta.dw.toFixed(1)}px
              </div>
            )}
          </div>

          <div className="flex-grow space-y-2 text-[10px] font-mono overflow-y-auto max-h-24 custom-scrollbar">
            {violations.length ? (
              violations.map((v, i) => (
                <div
                  key={i}
                  className="flex gap-2 text-error animate-in fade-in slide-in-from-left-1 border-b border-error/10 pb-1"
                >
                  <span className="opacity-40">!</span>
                  {v}
                </div>
              ))
            ) : (
              <div className="text-on-surface-variant/50 leading-relaxed italic">
                {isMonitoring
                  ? "Move cursor over the Interaction Zone. Stable layouts use 'GRAD' (0px shift); sloppy layouts shift bounding box width via standard 'wght'."
                  : "Click 'Start Audit' to initialize baseline dimensions."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MotionContractPanel() {
  return (
    <div className="p-8 bg-surface-container rounded-strike border border-[var(--kr-color-concrete-grey-steps-0)] space-y-4">
      <h3 className="text-title-large font-bold flex items-center gap-2">
        <Waves className="w-6 h-6 text-tertiary" />
        Canonical Motion Contracts
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
        <div className="bg-surface-dim p-3 rounded-strike border border-outline">
          typeSpringSlam: 600ms
        </div>
        <div className="bg-surface-dim p-3 rounded-strike border border-outline">
          dragSettle: 800ms
        </div>
        <div className="bg-surface-dim p-3 rounded-strike border border-outline">
          waterRipple: 3000ms
        </div>
      </div>
      <div className="bg-surface-dim p-3 rounded-strike border border-outline text-xs font-mono">
        easing: var(--kr-motion-easing-strike)
      </div>
    </div>
  );
}
