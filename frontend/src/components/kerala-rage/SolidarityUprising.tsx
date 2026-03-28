import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { KrDarkSpring } from '@/design/tokens/motion-presets';

type Phase = 'endurance' | 'recognition' | 'resolve';

/* ═══════════════════════════════════════════════════════════════════════
   SVG SUB-COMPOSITIONS
   All colors via KR Solidarity CSS custom properties. No hardcoded hex.
   ═══════════════════════════════════════════════════════════════════════ */

/** Single coconut palm — crown (5 fronds) + curved trunk */
const CoconutPalm: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  trunkColor?: string;
  frondColor?: string;
  opacity?: number;
}> = ({
  x = 0,
  y = 0,
  scale = 1,
  rotation = 0,
  trunkColor = 'var(--sys-color-solidaritySmokeOrange-base)',
  frondColor = 'var(--sys-color-kr-activistSmokeGreen-base)',
  opacity = 1,
}) => (
  <g
    transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotation})`}
    opacity={opacity}
  >
    {/* Trunk — slightly bent, leaning from years of monsoon */}
    <path
      d="M0,0 Q-4,40 -6,80 Q-7,120 -3,160"
      stroke={trunkColor}
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
    {/* Crown — 7 fronds radiating outward, each a long arc */}
    {[
      'M0,0 Q-50,-20 -80,10', // left-far
      'M0,0 Q-40,-35 -65,-15', // left-mid
      'M0,0 Q-25,-45 -40,-35', // left-near
      'M0,0 Q0,-50 5,-45', // center
      'M0,0 Q25,-45 45,-30', // right-near
      'M0,0 Q40,-30 70,-10', // right-mid
      'M0,0 Q50,-15 85,15', // right-far
    ].map((d, i) => (
      <path
        key={i}
        d={d}
        stroke={frondColor}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity={0.7 + (i % 3) * 0.1}
      />
    ))}
    {/* Coconut cluster hint — 2 small circles at crown base */}
    <circle
      cx="-3"
      cy="5"
      r="2.5"
      fill={trunkColor}
      opacity={0.5}
    />
    <circle
      cx="4"
      cy="3"
      r="2"
      fill={trunkColor}
      opacity={0.4}
    />
  </g>
);

/** Traditional kettuvallam (Kerala houseboat) silhouette */
const Kettuvallam: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  opacity?: number;
}> = ({ x = 0, y = 0, scale = 1, opacity = 1 }) => (
  <g
    transform={`translate(${x}, ${y}) scale(${scale})`}
    opacity={opacity}
  >
    {/* Hull — long curved bottom, deeper at center */}
    <path
      d="M-80,0 Q-60,-8 0,-12 Q60,-8 80,0 Q60,6 0,10 Q-60,6 -80,0 Z"
      fill="var(--sys-color-charcoalBackground-base)"
    />
    {/* Canopy arch — bamboo/coir structure */}
    <path
      d="M-45,-2 Q-40,-28 -10,-32 Q20,-28 45,-2"
      stroke="var(--sys-color-solidaritySmokeOrange-base)"
      strokeWidth="2"
      fill="none"
      opacity={0.4}
    />
    {/* Canopy fill — translucent warmth */}
    <path
      d="M-45,-2 Q-40,-28 -10,-32 Q20,-28 45,-2 Z"
      fill="var(--sys-color-solidaritySmokeOrange-base)"
      opacity={0.15}
    />
    {/* Prow — raised front catching sunlight */}
    <path
      d="M80,0 Q88,-6 92,-14 Q90,-10 85,-4"
      stroke="var(--sys-color-inkGold-base)"
      strokeWidth="2.5"
      fill="none"
      opacity={0.6}
      strokeLinecap="round"
    />
    {/* Stern detail */}
    <path
      d="M-80,0 Q-86,-3 -88,-8"
      stroke="var(--sys-color-charcoalBackground-base)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

/** Concentric water ripples expanding outward */
const WaterRipples: React.FC<{
  cx?: number;
  cy?: number;
  count?: number;
  maxRadius?: number;
  color?: string;
}> = ({
  cx = 200,
  cy = 260,
  count = 4,
  maxRadius = 120,
  color = 'var(--sys-color-protestMetalBlue-base)',
}) => (
  <g>
    {Array.from({ length: count }).map((_, i) => {
      const delay = i * 2;
      return (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="0"
          fill="none"
          stroke={color}
          strokeWidth="0.8"
          opacity="0"
        >
          <animate
            attributeName="r"
            values={`0;${maxRadius}`}
            dur="8s"
            begin={`${delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.12;0"
            dur="8s"
            begin={`${delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      );
    })}
  </g>
);

/** Lone figure — seated at water's edge, back to viewer, looking out */
const FigureSilhouette: React.FC<{
  x?: number;
  y?: number;
  opacity?: number;
}> = ({ x = 0, y = 0, opacity = 1 }) => (
  <g
    transform={`translate(${x}, ${y})`}
    opacity={opacity}
    aria-hidden="true"
  >
    {/* Head — slightly forward-tilted */}
    <circle
      cx="0"
      cy="-22"
      r="4.5"
      fill="var(--sys-color-charcoalBackground-base)"
      opacity={0.9}
    />
    {/* Back — slumped, contemplative */}
    <path
      d="M-5,-17 Q-7,-6 -6,5 Q-3,12 0,14 Q3,12 6,5 Q7,-6 5,-17"
      fill="var(--sys-color-charcoalBackground-base)"
      opacity={0.88}
    />
    {/* Knees drawn up */}
    <path
      d="M-6,5 Q-9,9 -12,14 Q-7,16 -3,12"
      fill="var(--sys-color-charcoalBackground-base)"
      opacity={0.8}
    />
    <path
      d="M6,5 Q9,9 12,14 Q7,16 3,12"
      fill="var(--sys-color-charcoalBackground-base)"
      opacity={0.8}
    />
    {/* Ground shadow */}
    <ellipse
      cx="0"
      cy="15"
      rx="10"
      ry="1.8"
      fill="var(--sys-color-charcoalBackground-base)"
      opacity={0.18}
    />
  </g>
);

/** Watermelon arc — abstract half-circle with seeds below the waterline */
const WatermelonArc: React.FC<{ y?: number; opacity?: number }> = ({ y = 265, opacity = 1 }) => (
  <g opacity={opacity}>
    <path
      d={`M80,${y} Q200,${y - 18} 320,${y}`}
      stroke="var(--sys-color-solidarityRed-base)"
      strokeWidth="1.5"
      fill="none"
      opacity={0.09}
    />
    {[130, 165, 200, 235, 270].map((cx, i) => {
      const seedY = y - 4 - (i === 2 ? 8 : i === 1 || i === 3 ? 5 : 2);
      return (
        <ellipse
          key={i}
          cx={cx}
          cy={seedY}
          rx="2"
          ry="4"
          fill="var(--sys-color-solidarityRed-base)"
          opacity={0.07}
          transform={`rotate(${i * 5 - 10}, ${cx}, ${seedY})`}
        />
      );
    })}
  </g>
);

/** Aboriginal flag horizon — three colour bands at/around the waterline */
const AboriginalHorizonBand: React.FC<{ y?: number; scale?: number }> = ({
  y = 240,
  scale = 1,
}) => (
  <g>
    <rect
      x={0}
      y={y - 16}
      width={400}
      height={Math.round(12 * scale)}
      fill="var(--sys-color-aboriginalFlagBlack-base)"
      opacity={0.08}
    />
    <rect
      x={0}
      y={y - 4}
      width={400}
      height={Math.round(8 * scale)}
      fill="var(--sys-color-aboriginalFlagRed-base)"
      opacity={0.1}
    />
    <rect
      x={0}
      y={y + 4}
      width={400}
      height={Math.round(16 * scale)}
      fill="var(--sys-color-aboriginalFlagYellow-base)"
      opacity={0.08}
    />
  </g>
);

/* ═══════════════════════════════════════════════════════════════════════
   PHASE COMPOSITIONS
   ═══════════════════════════════════════════════════════════════════════ */

/** Phase 1: Single bent palm over still water — quiet endurance */
const EnduranceScene: React.FC = () => (
  <svg
    viewBox="0 0 400 400"
    className="w-full h-full"
    aria-hidden="true"
  >
    <defs>
      <linearGradient
        id="water-endurance"
        x1="0"
        y1="0.5"
        x2="0"
        y2="1"
      >
        <stop
          offset="0%"
          stopColor="var(--sys-color-protestMetalBlue-base)"
          stopOpacity="0.3"
        />
        <stop
          offset="100%"
          stopColor="var(--sys-color-charcoalBackground-base)"
          stopOpacity="0.8"
        />
      </linearGradient>
    </defs>

    {/* Sky — muted, heavy */}
    <rect
      width="400"
      height="240"
      fill="var(--sys-color-charcoalBackground-base)"
    />

    {/* Water body */}
    <rect
      y="240"
      width="400"
      height="160"
      fill="url(#water-endurance)"
    />

    {/* Aboriginal flag horizon band — layered at waterline */}
    <AboriginalHorizonBand y={240} />

    {/* Waterline — Aboriginal yellow (sunlight on water, first nations gold) */}
    <line
      x1="0"
      y1="240"
      x2="400"
      y2="240"
      stroke="var(--sys-color-aboriginalFlagYellow-base)"
      strokeWidth="1.2"
      opacity="0.35"
    />

    {/* Palm — slightly bent, solitary */}
    <CoconutPalm
      x={210}
      y={80}
      rotation={4}
    />

    {/* Reflection — color-shifted to watermelon palette */}
    <g
      transform="translate(210, 400) scale(1, -1)"
      opacity={0.25}
    >
      <CoconutPalm
        x={0}
        y={80}
        rotation={4}
        frondColor="var(--sys-color-solidarityRed-base)"
        trunkColor="var(--sys-color-charcoalBackground-base)"
      />
    </g>

    {/* Watermelon arc — submerged symbol in the reflection zone */}
    <WatermelonArc y={265} />

    {/* Lone figure — at water's edge, looking out */}
    <FigureSilhouette
      x={165}
      y={235}
    />

    {/* Ripples from trunk base */}
    <WaterRipples
      cx={207}
      cy={242}
      count={3}
      maxRadius={80}
    />

    {/* Frond sway — CSS animation via SVG animate */}
    <animateTransform
      href="#palm-crown"
      attributeName="transform"
      type="rotate"
      values="-1;1;-1"
      dur="6s"
      repeatCount="indefinite"
      additive="sum"
    />
  </svg>
);

/** Phase 2: Grove emerging — collective recognition */
const RecognitionScene: React.FC = () => {
  const palms = useMemo(
    () => [
      { x: 80, y: 90, rotation: -6, scale: 0.7, delay: 0 },
      { x: 145, y: 70, rotation: -3, scale: 0.85, delay: 0.3 },
      { x: 210, y: 65, rotation: 1, scale: 1, delay: 0.6 },
      { x: 270, y: 72, rotation: 4, scale: 0.85, delay: 0.9 },
      { x: 330, y: 88, rotation: 7, scale: 0.7, delay: 1.2 },
    ],
    []
  );

  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="water-recognition"
          x1="0"
          y1="0.5"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="var(--sys-color-kr-activistSmokeGreen-base)"
            stopOpacity="0.2"
          />
          <stop
            offset="40%"
            stopColor="var(--sys-color-protestMetalBlue-base)"
            stopOpacity="0.35"
          />
          <stop
            offset="100%"
            stopColor="var(--sys-color-charcoalBackground-base)"
            stopOpacity="0.9"
          />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect
        width="400"
        height="245"
        fill="var(--sys-color-charcoalBackground-base)"
      />

      {/* Water */}
      <rect
        y="245"
        width="400"
        height="155"
        fill="url(#water-recognition)"
      />

      {/* Aboriginal flag horizon band */}
      <AboriginalHorizonBand y={245} />

      {/* Waterline — thicker, community established */}
      <line
        x1="0"
        y1="245"
        x2="400"
        y2="245"
        stroke="var(--sys-color-aboriginalFlagYellow-base)"
        strokeWidth="1.8"
        opacity="0.45"
      />

      {/* Grove — palms leaning inward toward each other */}
      {palms.map((p, i) => (
        <g
          key={i}
          opacity={0}
        >
          <CoconutPalm
            x={p.x}
            y={p.y}
            scale={p.scale}
            rotation={p.rotation}
          />
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            dur="0.8s"
            begin={`${p.delay}s`}
            fill="freeze"
          />
        </g>
      ))}

      {/* Reflections — watermelon color shift */}
      <g opacity={0.18}>
        {palms.map((p, i) => (
          <g
            key={`ref-${i}`}
            transform={`translate(${p.x}, 490) scale(${p.scale}, -${p.scale})`}
          >
            <CoconutPalm
              x={0}
              y={80}
              rotation={p.rotation}
              frondColor="var(--sys-color-solidarityRed-base)"
              trunkColor="var(--sys-color-charcoalBackground-base)"
            />
          </g>
        ))}
      </g>

      {/* Expanding solidarity ripples from center */}
      <WaterRipples
        cx={200}
        cy={248}
        count={5}
        maxRadius={160}
      />

      {/* Figure at edge — still present, community around them */}
      <FigureSilhouette
        x={50}
        y={241}
        opacity={0.45}
      />
    </svg>
  );
};

/** Phase 3: Kettuvallam at dusk — dignified resolve */
const ResolveScene: React.FC = () => {
  const palms = useMemo(
    () => [
      { x: 60, y: 95, rotation: -5, scale: 0.6 },
      { x: 120, y: 78, rotation: -2, scale: 0.75 },
      { x: 175, y: 72, rotation: 1, scale: 0.85 },
      { x: 240, y: 76, rotation: 3, scale: 0.75 },
      { x: 300, y: 92, rotation: 6, scale: 0.6 },
    ],
    []
  );

  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        {/* Sunset sky — Palestinian red as weather, in-situ */}
        <linearGradient
          id="sky-resolve"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="var(--sys-color-solidarityRed-base)"
            stopOpacity="0.22"
          />
          <stop
            offset="50%"
            stopColor="var(--sys-color-solidaritySmokeOrange-base)"
            stopOpacity="0.1"
          />
          <stop
            offset="100%"
            stopColor="var(--sys-color-charcoalBackground-base)"
            stopOpacity="1"
          />
        </linearGradient>

        {/* Water — green surface (backwater vegetation / watermelon green) fading to depth */}
        <linearGradient
          id="water-resolve"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="var(--sys-color-kr-activistSmokeGreen-base)"
            stopOpacity="0.25"
          />
          <stop
            offset="35%"
            stopColor="var(--sys-color-protestMetalBlue-base)"
            stopOpacity="0.4"
          />
          <stop
            offset="100%"
            stopColor="var(--sys-color-charcoalBackground-base)"
            stopOpacity="0.95"
          />
        </linearGradient>
      </defs>

      {/* Sunset sky */}
      <rect
        width="400"
        height="250"
        fill="url(#sky-resolve)"
      />

      {/* Water */}
      <rect
        y="250"
        width="400"
        height="150"
        fill="url(#water-resolve)"
      />

      {/* Aboriginal flag horizon band — full weight, resolved */}
      <AboriginalHorizonBand
        y={250}
        scale={1.2}
      />

      {/* Waterline — full strength */}
      <line
        x1="0"
        y1="250"
        x2="400"
        y2="250"
        stroke="var(--sys-color-aboriginalFlagYellow-base)"
        strokeWidth="2"
        opacity="0.5"
      />

      {/* Grove — receding into dusk */}
      {palms.map((p, i) => (
        <CoconutPalm
          key={i}
          x={p.x}
          y={p.y}
          scale={p.scale}
          rotation={p.rotation}
          opacity={0.5}
        />
      ))}

      {/* Kettuvallam — glides from left */}
      <g>
        <Kettuvallam
          x={200}
          y={262}
          scale={1.1}
        />

        {/* Wake lines — Melbourne concrete sensibility */}
        {[0, 1, 2].map((i) => (
          <line
            key={`wake-${i}`}
            x1={200 - 80 - i * 25}
            y1={268 + i * 3}
            x2={200 - 100 - i * 40}
            y2={270 + i * 3}
            stroke="var(--sys-color-concreteGrey-base)"
            strokeWidth="0.6"
            opacity={0.08 + i * 0.02}
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* Boat reflection in water — subtle */}
      <g
        transform="translate(200, 500) scale(1.1, -1.1)"
        opacity={0.12}
      >
        <Kettuvallam
          x={0}
          y={238}
        />
      </g>

      {/* Figure at shore — watching the boat pass */}
      <FigureSilhouette
        x={345}
        y={246}
      />

      {/* Horizon glow — stencilYellow warmth at bottom edge */}
      <line
        x1="0"
        y1="396"
        x2="400"
        y2="396"
        stroke="var(--sys-color-stencilYellow-base)"
        strokeWidth="8"
        opacity="0.08"
      />
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

/**
 * SolidarityUprising — "Backwater Vigil"
 *
 * Three-phase editorial landscape animation:
 *   1. Endurance — single bent palm, still water, lone figure seated at the edge
 *   2. Recognition — grove emerges, ripples spread, figure remains at the periphery
 *   3. Resolve — kettuvallam glides past, figure watches from the shore
 *
 * Cultural solidarity layered, never announced:
 *   - Palestinian: watermelon arc in reflection zone (solidarityRed, barely visible)
 *   - Aboriginal: flag horizon band (aboriginalFlagBlack/Red/Yellow) at every waterline
 *   - Kerala: coconut palms + kettuvallam + protestMetalBlue backwater depth
 *   - Migrant experience: lone figure, back to viewer, holding the landscape inside them
 */
export const SolidarityUprising: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('endurance');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const durations: Record<Phase, number> = {
      endurance: 5000,
      recognition: 5000,
      resolve: 7000,
    };
    const next: Record<Phase, Phase> = {
      endurance: 'recognition',
      recognition: 'resolve',
      resolve: 'endurance',
    };

    const timer = setTimeout(() => setPhase(next[phase]), durations[phase]);
    return () => clearTimeout(timer);
  }, [phase]);

  /** Motion configs — near-stillness, not spectacle */
  const phaseMotion = useMemo(() => {
    if (shouldReduceMotion) {
      return {
        endurance: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.3 },
        },
        recognition: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.3 },
        },
        resolve: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.3 },
        },
      };
    }

    return {
      endurance: {
        initial: { scale: 0.99, opacity: 0 },
        animate: {
          scale: [0.998, 1.002, 0.998],
          opacity: 1,
        },
        exit: { opacity: 0 },
        transition: {
          scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 1.2 },
        },
      },
      recognition: {
        initial: { scale: 1, opacity: 0 },
        animate: {
          scale: 1.03,
          opacity: 1,
        },
        exit: { scale: 1.06, opacity: 0 },
        transition: {
          scale: { duration: 4.5, ease: [0.25, 0.46, 0.45, 0.94] },
          opacity: { duration: 1 },
        },
      },
      resolve: {
        initial: { opacity: 0, x: '-5%' },
        animate: { opacity: 1, x: '0%' },
        exit: { opacity: 0 },
        transition: {
          ...KrDarkSpring,
          damping: 45,
          opacity: { duration: 1.5 },
          x: { duration: 5, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      },
    };
  }, [shouldReduceMotion]);

  return (
    <div
      className="relative w-full h-[600px] overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: 'var(--sys-color-charcoalBackground-base)' }}
      role="img"
      aria-label="Backwater Vigil — an animated landscape: coconut palms over Kerala backwaters, a lone figure at the water's edge, expressing quiet solidarity with migrant, Palestinian, and Aboriginal communities"
    >
      {/* Gritty substrate texture */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[url('/assets/textures/noise-grain.png')]" />

      <AnimatePresence mode="wait">
        {phase === 'endurance' && (
          <motion.div
            key="endurance"
            className="relative z-10 w-full h-full max-w-3xl mx-auto"
            {...phaseMotion.endurance}
          >
            <EnduranceScene />
          </motion.div>
        )}

        {phase === 'recognition' && (
          <motion.div
            key="recognition"
            className="relative z-10 w-full h-full max-w-3xl mx-auto"
            {...phaseMotion.recognition}
          >
            <RecognitionScene />
          </motion.div>
        )}

        {phase === 'resolve' && (
          <motion.div
            key="resolve"
            className="relative z-10 w-full h-full max-w-4xl mx-auto"
            {...phaseMotion.resolve}
          >
            <ResolveScene />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
