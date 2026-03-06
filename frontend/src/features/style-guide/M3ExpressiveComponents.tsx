/**
 * M3 Expressive Interactive Components
 *
 * Live demonstrations of M3 Expressive principles:
 * - Morph Previewer: Toggle between Rest/Expressive states
 * - Axis Visualizer: Real-time font-variation-settings display
 * - Slop Auditor: Detect layout reflows during morphs
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, AlertTriangle, CheckCircle, Shapes, Type } from 'lucide-react';

/**
 * Mor Previewer Component
 *
 * Demonstrates shape morphing with live clip-path display
 */
export function MorphPreviewer() {
  const [state, setState] = useState<'rest' | 'expressive'>('rest');
  const [currentShape, setCurrentShape] = useState<'pebble' | 'leaf' | 'gem'>('pebble');

  const shapes = {
    pebble:
      'polygon(8% 20%, 28% 8%, 48% 8%, 68% 8%, 88% 20%, 96% 40%, 96% 60%, 88% 80%, 68% 92%, 48% 92%, 28% 92%, 8% 80%, 4% 60%, 4% 40%)',
    leaf: 'polygon(5% 15%, 25% 5%, 45% 5%, 65% 5%, 85% 15%, 95% 35%, 95% 55%, 85% 75%, 65% 95%, 45% 95%, 25% 95%, 5% 75%, 5% 55%, 5% 35%)',
    gem: 'polygon(20% 0%, 50% 10%, 80% 0%, 95% 30%, 90% 60%, 70% 85%, 50% 100%, 30% 85%, 10% 60%, 5% 30%)',
  };

  const clipPath = state === 'expressive' ? shapes[currentShape] : 'none';

  return (
    <div className="p-8 bg-surface-container rounded-xl border border-outline-variant space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-title-large font-bold flex items-center gap-2">
          <Shapes className="w-6 h-6 text-primary" />
          Morph Previewer
        </h3>
        <button
          onClick={() => setState((s) => (s === 'rest' ? 'expressive' : 'rest'))}
          className="px-4 py-2 bg-primary text-on-primary rounded-sentry font-bold uppercase text-sm hover:scale-105 transition-transform flex items-center gap-2"
        >
          {state === 'rest' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          {state === 'rest' ? 'Morph' : 'Reset'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Live Preview */}
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant font-mono">
            Current State: {state.toUpperCase()}
          </p>
          <motion.div
            className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
            style={{ clipPath }}
            animate={{ clipPath }}
            transition={{ type: 'spring', stiffness: 500, damping: 27 }}
          >
            <div className="text-center">
              <div className="text-6xl font-black">M3</div>
              <div className="text-sm font-mono opacity-70 mt-2">{currentShape}</div>
            </div>
          </motion.div>

          {/* Shape Selector */}
          <div className="flex gap-2">
            {(['pebble', 'leaf', 'gem'] as const).map((shape) => (
              <button
                key={shape}
                onClick={() => setCurrentShape(shape)}
                className={`px-3 py-1 rounded-sentry text-sm font-bold uppercase transition-all ${
                  currentShape === shape
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-dim text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>

        {/* Code Display */}
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant font-bold">Current clip-path:</p>
          <div className="bg-surface-dim p-4 rounded-pebble overflow-x-auto">
            <pre className="text-xs font-mono text-primary">
              {clipPath === 'none' ? 'none (Rest State)' : clipPath}
            </pre>
          </div>

          <div className="bg-tertiary-container/20 p-4 rounded-pebble border border-tertiary">
            <p className="text-sm font-bold mb-2">Physics:</p>
            <div className="text-xs font-mono space-y-1 text-on-surface-variant">
              <div>stiffness: 500</div>
              <div>damping: 27</div>
              <div>damping ratio (ζ): 0.6</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Axis Visualizer Component
 *
 * Shows real-time font-variation-settings during hover
 */
export function AxisVisualizer() {
  const [isHovering, setIsHovering] = useState(false);
  const [axes, setAxes] = useState({ wght: 400, wdth: 100, GRAD: 0 });

  const restAxes = { wght: 400, wdth: 100, GRAD: 0 };
  const morphAxes = { wght: 400, wdth: 110, GRAD: 150 }; // Pebble morph state

  useEffect(() => {
    setAxes(isHovering ? morphAxes : restAxes);
  }, [isHovering]);

  const fontVariationSettings = `'wght' ${axes.wght}, 'wdth' ${axes.wdth}, 'GRAD' ${axes.GRAD}`;

  return (
    <div className="p-8 bg-surface-container rounded-xl border border-outline-variant space-y-6">
      <h3 className="text-title-large font-bold flex items-center gap-2">
        <Type className="w-6 h-6 text-secondary" />
        Axis Visualizer
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interactive Typography */}
        <div
          className="h-64 bg-gradient-to-br from-secondary/10 to-tertiary/10 rounded-xl flex items-center justify-center cursor-pointer border-2 border-dashed border-secondary/30"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <motion.h2
            className="text-6xl text-center px-4"
            style={{
              fontFamily: '"Work Sans", sans-serif',
              fontWeight: axes.wght,
              fontVariationSettings,
            }}
            animate={{ fontVariationSettings }}
            transition={{ type: 'spring', stiffness: 500, damping: 27 }}
          >
            Hover Me
          </motion.h2>
        </div>

        {/* Real-Time Axes Display */}
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant font-bold">Live font-variation-settings:</p>

          {/* wght Axis */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-mono">wght (Weight)</span>
              <span
                className={`text-lg font-bold ${axes.wght === restAxes.wght ? 'text-green-500' : 'text-yellow-500'}`}
              >
                {axes.wght}
              </span>
            </div>
            <div className="h-2 bg-surface-dim rounded-sentry overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                style={{ width: `${(axes.wght / 900) * 100}%` }}
                animate={{ width: `${(axes.wght / 900) * 100}%` }}
              />
            </div>
            <p className="text-xs text-on-surface-variant">✅ Constant (Anti-Slop Rule)</p>
          </div>

          {/* wdth Axis */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-mono">wdth (Width)</span>
              <span
                className={`text-lg font-bold ${isHovering ? 'text-secondary' : 'text-on-surface'}`}
              >
                {axes.wdth}
              </span>
            </div>
            <div className="h-2 bg-surface-dim rounded-sentry overflow-hidden">
              <motion.div
                className="h-full bg-secondary"
                animate={{ width: `${axes.wdth}%` }}
              />
            </div>
          </div>

          {/* GRAD Axis */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-mono">GRAD (Optical Grade)</span>
              <span
                className={`text-lg font-bold ${isHovering ? 'text-tertiary' : 'text-on-surface'}`}
              >
                {axes.GRAD}
              </span>
            </div>
            <div className="h-2 bg-surface-dim rounded-sentry overflow-hidden">
              <motion.div
                className="h-full bg-tertiary"
                animate={{ width: `${(axes.GRAD / 200) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-green-500/10 p-3 rounded-pebble border border-green-500/30 mt-4">
            <p className="text-xs font-bold text-green-700 dark:text-green-400">
              ✓ Parametric Pairing Active: Typography synced with shape morph
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Slop Auditor Component
 *
 * Detects layout shifts during typography morphs (Anti-Slop Rule validation)
 */
export function SlopAuditor() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [violations, setViolations] = useState<string[]>([]);
  const [testType, setTestType] = useState<'correct' | 'wrong'>('correct');

  const elementRef = useRef<HTMLDivElement>(null);
  const initialSizeRef = useRef<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (!isMonitoring || !elementRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;

        if (!initialSizeRef.current) {
          initialSizeRef.current = { width, height };
          return;
        }

        if (
          Math.abs(width - initialSizeRef.current.width) > 2 ||
          Math.abs(height - initialSizeRef.current.height) > 2
        ) {
          setViolations((prev) => [
            ...prev,
            `Layout shift detected! ${width} x ${height} (was ${initialSizeRef.current?.width} x ${initialSizeRef.current?.height})`,
          ]);
        }
      }
    });

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [isMonitoring]);

  const startTest = () => {
    setViolations([]);
    initialSizeRef.current = null;
    setIsMonitoring(true);
  };

  const stopTest = () => {
    setIsMonitoring(false);
  };

  return (
    <div className="p-8 bg-surface-container rounded-xl border border-outline-variant space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-title-large font-bold flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-warning" />
          Slop Auditor
        </h3>
        <div className="flex gap-2">
          <button
            onClick={startTest}
            disabled={isMonitoring}
            className="px-4 py-2 bg-primary text-on-primary rounded-sentry font-bold uppercase text-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            Start Monitor
          </button>
          <button
            onClick={stopTest}
            disabled={!isMonitoring}
            className="px-4 py-2 bg-error text-on-error rounded-sentry font-bold uppercase text-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            Stop
          </button>
        </div>
      </div>

      <p className="text-sm text-on-surface-variant">
        This component monitors for layout reflows during typography morphs.
        <strong className="text-on-surface">
          {' '}
          Hover the test element while monitoring to see if it triggers layout shifts.
        </strong>
      </p>

      {/* Test Type Selector */}
      <div className="flex gap-4">
        <button
          onClick={() => setTestType('correct')}
          className={`px-4 py-2 rounded-pebble font-bold text-sm ${
            testType === 'correct' ? 'bg-green-500 text-white' : 'bg-surface-dim text-on-surface'
          }`}
        >
          ✓ Correct (GRAD only)
        </button>
        <button
          onClick={() => setTestType('wrong')}
          className={`px-4 py-2 rounded-pebble font-bold text-sm ${
            testType === 'wrong' ? 'bg-error text-on-error' : 'bg-surface-dim text-on-surface'
          }`}
        >
          ✗ Wrong (Changes font-weight)
        </button>
      </div>

      {/* Test Element */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-gradient-to-br from-warning/10 to-error/10 rounded-xl flex items-center justify-center border-2 border-dashed border-warning/30">
          {testType === 'correct' ? (
            <motion.div
              ref={elementRef}
              className="text-center px-4"
              style={{
                fontFamily: '"Work Sans", sans-serif',
                fontWeight: 400,
                fontVariationSettings: "'wght' 400, 'GRAD' 0",
              }}
              whileHover={{
                fontVariationSettings: "'wght' 400, 'GRAD' 150", // Only GRAD changes
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 27 }}
            >
              <div className="text-4xl font-bold">Correct Method</div>
              <div className="text-sm text-on-surface-variant mt-2">Uses GRAD axis only</div>
            </motion.div>
          ) : (
            <motion.div
              ref={elementRef}
              className="text-center px-4"
              style={{
                fontFamily: '"Work Sans", sans-serif',
              }}
              initial={{ fontWeight: 400 }}
              whileHover={{ fontWeight: 700 }} // WRONG: Changes font-weight
              transition={{ type: 'spring', stiffness: 500, damping: 27 }}
            >
              <div className="text-4xl font-bold">Wrong Method</div>
              <div className="text-sm text-on-surface-variant mt-2">
                Changes font-weight (causes reflow)
              </div>
            </motion.div>
          )}
        </div>

        {/* Violations Display */}
        <div className="space-y-4">
          <div
            className={`p-4 rounded-pebble border-2 ${
              violations.length > 0
                ? 'bg-error/10 border-error'
                : 'bg-green-500/10 border-green-500'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {violations.length > 0 ? (
                <>
                  <AlertTriangle className="w-5 h-5 text-error" />
                  <span className="font-bold text-error">Layout Shifts Detected!</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-bold text-green-700 dark:text-green-400">
                    {isMonitoring ? 'Monitoring...' : 'No Violations'}
                  </span>
                </>
              )}
            </div>

            {violations.length > 0 && (
              <div className="space-y-1 mt-3">
                {violations.map((v, i) => (
                  <div
                    key={i}
                    className="text-xs font-mono text-error bg-error/5 p-2 rounded"
                  >
                    {v}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-surface-dim p-4 rounded-pebble">
            <p className="text-xs font-bold mb-2">Anti-Slop Rule:</p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <code className="text-error">font-weight</code> must remain <strong>constant</strong>{' '}
              during morphs. Use <code className="text-green-500">GRAD</code> and{' '}
              <code className="text-green-500">wdth</code> axes instead. This prevents expensive
              layout recalculations and visual jank.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
