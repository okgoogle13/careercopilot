import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Clock, ArrowRight } from 'lucide-react';

// ============================================================================
// THE LOOKOUT — Clandestine Intelligence Feed — Kerala Rage v6.1
// Job leads = intercepted dispatches / diplomatic cables.
// Token Sync v2.0 · Shape System v6.1 · Anti-Slop Active
//
// INTELLIGENCE LAWS (non-negotiable):
//   1. All leads are classified dispatches with dispatch numbers
//   2. Security Seal watermark pulses on unviewed cards (windFlutter 2000ms)
//   3. The Decrypt: hover on unviewed → scramble → resolve → mark viewed
//   4. VERIFIED leads use protestMetalBlue (#48B3DA) — confirmed intel
//   5. Placard archetype: blockRiot02 base → marchSurge01 on hover (800ms Settle)
//   6. Filter chips: March archetype — blockRiot01 rest → marchSurge01 active
//   7. JetBrains Mono is the primary typeface — Teletype dispatch aesthetic
//   8. Zero gradients, zero glow, flat 0-blur shadows only
// ============================================================================

// ── CSS VAR TOKENS — zero hardcoded hex ─────────────────────────────────────
const C = {
  canvas:         'var(--sys-color-charcoalBackground-steps-0)',
  surface1:       'var(--sys-color-charcoalBackground-steps-1)',
  surface2:       'var(--sys-color-charcoalBackground-steps-2)',
  surface3:       'var(--sys-color-charcoalBackground-steps-3)',
  surface4:       'var(--sys-color-charcoalBackground-steps-4)',
  surface5:       'var(--sys-color-charcoalBackground-steps-5)',
  solidarityRed:  'var(--sys-color-solidarityRed-base)',
  inkGold:        'var(--sys-color-inkGold-base)',
  stencilYellow:  'var(--sys-color-stencilYellow-base)',
  signalGreen:    'var(--sys-color-signalGreen-base)',
  activistGreen:  'var(--sys-color-kr-activistSmokeGreen-base)',
  workerAsh:      'var(--sys-color-worker-ash-base)',
  workerAshMuted: 'var(--sys-color-worker-ash-steps-1)',
  workerAshDim:   'var(--sys-color-worker-ash-steps-0)',
  smokeOrange:    'var(--sys-color-solidaritySmokeOrange-base)',
  metalBlue:      'var(--sys-color-protestMetalBlue-base)',
  concreteGrey:   'var(--sys-color-concreteGrey-base)',
};

// Hex resolved values for inline SVG (cannot use CSS vars in SVG attributes)
const HEX = {
  metalBlue:     '#48B3DA',
  solidarityRed: '#F14714',
  stencilYellow: '#F6E748',
  concreteGrey:  '#A39B8F',
  inkGold:       '#DAF674',
  activistGreen: '#48DA8B',
  surface2:      '#242424',
  surface3:      '#2A2A2A',
  surface4:      '#323232',
  workerAsh:     '#DAF6B3',
  workerAshDim:  '#627A4F',
};

// ── SHAPE TOKENS — v6.1 ──────────────────────────────────────────────────────
const S = {
  // Placard archetype base
  placard:      'var(--sys-shape-blockRiot02)',    // 20px 4px 12px 2px
  // Placard active / hover state
  placardHover: 'var(--sys-shape-marchSurge01)',   // 20px 8px 12px 32px
  // March archetype chip — base
  chipBase:     'var(--sys-shape-blockRiot01)',    // 8px 2px 8px 2px
  // March archetype chip — active/selected
  chipActive:   'var(--sys-shape-marchSurge01)',   // 20px 8px 12px 32px
  // Strike CTA: blockRiot03
  strike:       'var(--sys-shape-blockRiot03)',    // 32px 2px 2px 2px
  // Alert shard — classification badge
  shard:        'var(--sys-shape-alertShard01)',   // 32px 2px 2px 32px
  // Pill — count badges only
  pill:         'var(--sys-shape-pillMarch01)',    // 9999px
};

// ── FONT FAMILY TOKENS ───────────────────────────────────────────────────────
const F = {
  primary:      'var(--sys-type-fontFamilies-primary), system-ui, sans-serif',
  display:      'var(--sys-type-fontFamilies-display), serif',
  proclamation: 'var(--sys-type-fontFamilies-proclamation), serif',
  mono:         'var(--sys-type-fontFamilies-mono), monospace',
  curator:      'var(--sys-type-fontFamilies-curator), cursive',
};

// M3 Expressive — overshoot (drag-over, emphasis)
const M3 = [0.34, 1.56, 0.64, 1] as const;
// Settle / Precise — controlled deceleration (card morph, chip transition)
const SETTLE = [0.25, 0.46, 0.45, 0.94] as const;

// ============================================================================
// TYPES & DATA
// ============================================================================

type Classification = 'VERIFIED' | 'URGENT' | 'UNCONFIRMED' | 'CLASSIFIED';
type FilterKey      = 'ALL' | Classification | 'SAVED';

interface JobLead {
  id:             string;
  dispatch:       string;          // e.g. "KR-0427"
  title:          string;
  organization:   string;
  location:       string;
  salary:         string;
  posted:         number;          // days ago
  classification: Classification;
  signalStrength: number;          // 1–5
  atsScore:       number;
  skills:         string[];
  description:    string;
  viewed:         boolean;
  saved:          boolean;
}

// Classification → accent color mapping (HEX for SVG seal, CSS var for UI)
function classColor(c: Classification): string {
  if (c === 'VERIFIED')   return C.metalBlue;
  if (c === 'URGENT')     return C.solidarityRed;
  if (c === 'CLASSIFIED') return C.stencilYellow;
  return C.concreteGrey;
}
function classColorHex(c: Classification): string {
  if (c === 'VERIFIED')   return HEX.metalBlue;
  if (c === 'URGENT')     return HEX.solidarityRed;
  if (c === 'CLASSIFIED') return HEX.stencilYellow;
  return HEX.concreteGrey;
}

const LEADS: JobLead[] = [
  {
    id: '1', dispatch: 'KR-0427',
    title: 'Senior Case Manager',
    organization: 'Berry Street',
    location: 'Inner North, Melbourne VIC',
    salary: '$95K–$105K',
    posted: 1,
    classification: 'VERIFIED',
    signalStrength: 5,
    atsScore: 94,
    skills: ['Case Management', 'MARAM', 'Family Violence'],
    description: 'Confirmed opening. Lead case management across family services portfolio. Senior practitioner required for case supervision and systemic advocacy.',
    viewed: false, saved: true,
  },
  {
    id: '2', dispatch: 'KR-0391',
    title: 'Family Violence Practitioner',
    organization: 'Safe Steps',
    location: 'Melbourne CBD',
    salary: '$88K–$98K',
    posted: 3,
    classification: 'URGENT',
    signalStrength: 4,
    atsScore: 89,
    skills: ['Crisis Support', 'Risk Assessment', 'Court Support'],
    description: 'Critical intercept. High-priority family violence intervention role. Court support capacity required. Closing in 72 hours — immediate action advised.',
    viewed: false, saved: false,
  },
  {
    id: '3', dispatch: 'KR-0388',
    title: 'Mental Health Clinician',
    organization: 'Orygen',
    location: 'Parkville VIC',
    salary: '$92K–$102K',
    posted: 5,
    classification: 'VERIFIED',
    signalStrength: 4,
    atsScore: 82,
    skills: ['Mental Health', 'CBT', 'Youth Assessment'],
    description: 'Confirmed CAMHS-adjacent role. Early intervention focus for 15–25 age cohort. Strong evidence-based practice framework. Solid match vector.',
    viewed: true, saved: false,
  },
  {
    id: '4', dispatch: 'KR-0379',
    title: 'NDIS Support Coordinator',
    organization: 'genU',
    location: 'Eastern Suburbs VIC',
    salary: '$80K–$90K',
    posted: 4,
    classification: 'VERIFIED',
    signalStrength: 3,
    atsScore: 78,
    skills: ['NDIS', 'Disability', 'Care Planning'],
    description: 'Verified lead in NDIS sector. Full scheme implementation experience preferred. Registered provider with strong support network. Partial skill alignment detected.',
    viewed: true, saved: true,
  },
  {
    id: '5', dispatch: 'KR-0362',
    title: 'Youth Outreach Worker',
    organization: 'Frontyard Youth Services',
    location: 'Melbourne CBD',
    salary: '$72K–$80K',
    posted: 7,
    classification: 'UNCONFIRMED',
    signalStrength: 3,
    atsScore: 68,
    skills: ['Youth Work', 'AOD', 'Group Facilitation'],
    description: 'Unverified intercept. Role listing requires independent confirmation. Organization active in CBD youth crisis. Signal strength moderate — proceed with caution.',
    viewed: false, saved: false,
  },
  {
    id: '6', dispatch: 'KR-0341',
    title: 'Program Manager',
    organization: 'The Salvation Army',
    location: 'North Melbourne VIC',
    salary: '$95K–$110K',
    posted: 2,
    classification: 'VERIFIED',
    signalStrength: 5,
    atsScore: 91,
    skills: ['Program Management', 'Social Work', 'Stakeholder Engagement'],
    description: 'High-confidence intercept. Homelessness and housing stability portfolio. Significant management scope. Your profile alignment is strong — priority dispatch.',
    viewed: false, saved: false,
  },
  {
    id: '7', dispatch: 'KR-0318',
    title: 'Community Development Officer',
    organization: 'AMES Australia',
    location: 'Footscray VIC',
    salary: '$78K–$88K',
    posted: 8,
    classification: 'CLASSIFIED',
    signalStrength: 2,
    atsScore: 74,
    skills: ['Community Dev', 'Settlement', 'Advocacy'],
    description: 'Restricted intel. Settlement sector role with migrant community focus. Cultural safety and language competency preferred. Source: undisclosed network node.',
    viewed: false, saved: false,
  },
  {
    id: '8', dispatch: 'KR-0305',
    title: 'AOD Counsellor',
    organization: 'Uniting',
    location: 'Northern Suburbs VIC',
    salary: '$78K–$88K',
    posted: 6,
    classification: 'UNCONFIRMED',
    signalStrength: 2,
    atsScore: 71,
    skills: ['AOD', 'Harm Reduction', 'Counselling'],
    description: 'Partial intercept. Harm reduction philosophy mandatory. Role may be re-advertised under different title. Signal degraded — verify before submitting.',
    viewed: true, saved: false,
  },
];

// ============================================================================
// THE DECRYPT HOOK
// Scrambles → resolves text left-to-right on hover. 800ms total.
// Trigger: hover on unviewed card only.
// ============================================================================

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#><$%&*_+=-|\\/?!';

function useDecryptText(
  text: string,
  active: boolean,
  onComplete: () => void,
) {
  const [displayed, setDisplayed] = useState(text);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (!active) {
      setDisplayed(text);
      return;
    }

    // 20 frames × 40ms = 800ms total
    let frame = 0;
    const TOTAL_FRAMES = 20;

    timerRef.current = setInterval(() => {
      frame++;
      const progress    = frame / TOTAL_FRAMES;
      const revealedLen = Math.floor(progress * text.length);

      if (frame >= TOTAL_FRAMES) {
        clearInterval(timerRef.current!);
        setDisplayed(text);
        onComplete();
        return;
      }

      setDisplayed(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < revealedLen) return char; // resolved
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(''),
      );
    }, 40);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active, text]);

  return displayed;
}

// ============================================================================
// SECURITY SEAL SVG
// KR solidarity watermark — metalBlue (or classification color).
// Pulses for unviewed cards using windFlutter 2000ms (ambient life).
// ============================================================================

function SecuritySeal({
  colorHex,
  pulsing,
}: {
  colorHex: string;
  pulsing: boolean;
}) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      style={{ zIndex: 0 }}
      animate={pulsing ? { opacity: [0.05, 0.13, 0.05] } : { opacity: 0.05 }}
      transition={
        pulsing
          ? { duration: 2, repeat: Infinity, ease: SETTLE, repeatType: 'loop' }
          : { duration: 0 }
      }
    >
      <svg
        width="140"
        height="140"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer dashed ring */}
        <circle
          cx="50" cy="50" r="46"
          stroke={colorHex} strokeWidth="0.8"
          strokeDasharray="3.5 2.5"
        />
        {/* Inner solid ring */}
        <circle
          cx="50" cy="50" r="37"
          stroke={colorHex} strokeWidth="0.5"
        />
        {/* Cardinal tick marks */}
        <line x1="50" y1="2"  x2="50" y2="10"  stroke={colorHex} strokeWidth="1.5" />
        <line x1="50" y1="90" x2="50" y2="98"  stroke={colorHex} strokeWidth="1.5" />
        <line x1="2"  y1="50" x2="10" y2="50"  stroke={colorHex} strokeWidth="1.5" />
        <line x1="90" y1="50" x2="98" y2="50"  stroke={colorHex} strokeWidth="1.5" />
        {/* Diagonal ticks */}
        <line x1="17.6" y1="17.6" x2="23.2" y2="23.2" stroke={colorHex} strokeWidth="0.8" />
        <line x1="76.8" y1="76.8" x2="82.4" y2="82.4" stroke={colorHex} strokeWidth="0.8" />
        <line x1="76.8" y1="23.2" x2="82.4" y2="17.6" stroke={colorHex} strokeWidth="0.8" />
        <line x1="17.6" y1="82.4" x2="23.2" y2="76.8" stroke={colorHex} strokeWidth="0.8" />
        {/* "VERIFIED" top text */}
        <text
          x="50" y="29"
          textAnchor="middle"
          fill={colorHex}
          fontFamily="'JetBrains Mono', monospace"
          fontSize="5"
          letterSpacing="4"
          fontWeight="700"
        >
          VERIFIED
        </text>
        {/* KR center — heavy mono */}
        <text
          x="50" y="58"
          textAnchor="middle"
          fill={colorHex}
          fontFamily="'JetBrains Mono', monospace"
          fontSize="20"
          fontWeight="800"
          letterSpacing="3"
        >
          KR
        </text>
        {/* "SOLIDARITY" bottom text */}
        <text
          x="50" y="73"
          textAnchor="middle"
          fill={colorHex}
          fontFamily="'JetBrains Mono', monospace"
          fontSize="5"
          letterSpacing="4"
          fontWeight="700"
        >
          SOLIDARITY
        </text>
        {/* Center dot */}
        <circle cx="50" cy="50" r="1.5" fill={colorHex} />
      </svg>
    </motion.div>
  );
}

// ============================================================================
// SIGNAL BARS — radio signal strength indicator (1–5)
// ============================================================================

function SignalBars({ strength, colorHex }: { strength: number; colorHex: string }) {
  const heights = [5, 8, 11, 14, 18];
  return (
    <div className="flex items-end gap-[2px]" aria-label={`Signal strength ${strength}/5`}>
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            width:        '3px',
            height:       `${h}px`,
            background:   i < strength ? colorHex : HEX.surface4,
            borderRadius: '1px 1px 0 0',
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// CLASSIFICATION BADGE — alertShard01 shape
// ============================================================================

function ClassBadge({ c }: { c: Classification }) {
  const color = classColor(c);
  return (
    <span
      style={{
        fontFamily:   F.mono,
        fontWeight:   800,
        fontSize:     '8px',
        letterSpacing:'0.10em',
        textTransform:'uppercase' as const,
        color:        color,
        background:   C.surface3,
        padding:      '3px 10px 3px 8px',
        borderRadius: S.shard,
        border:       `1px solid ${color}`,
        // flat ink offset — zero blur
        boxShadow:    `1px 1px 0px ${C.surface4}`,
        flexShrink:   0,
      }}
    >
      {c}
    </span>
  );
}

// ============================================================================
// ATS SCORE — color-graded match indicator
// ============================================================================

function atsColor(n: number): string {
  if (n >= 90) return C.inkGold;
  if (n >= 80) return C.activistGreen;
  if (n >= 70) return C.stencilYellow;
  return C.smokeOrange;
}

// ============================================================================
// DISPATCH CARD — Placard archetype
// Placard base: blockRiot02 → hover: marchSurge01 (800ms Settle)
// Security Seal: centered watermark, pulsing if unviewed
// Decrypt: scramble → resolve on hover for unviewed cards
// ============================================================================

interface DispatchCardProps {
  lead:     JobLead;
  index:    number;
  onView:   (id: string) => void;
  onSave:   (id: string) => void;
  isSaved:  boolean;
}

function DispatchCard({ lead, index, onView, onSave, isSaved }: DispatchCardProps) {
  const [hovered, setHovered] = useState(false);
  const [viewed, setViewed]   = useState(lead.viewed);

  const handleDecryptComplete = useCallback(() => {
    setViewed(true);
    onView(lead.id);
  }, [lead.id, onView]);

  const decryptTitle = useDecryptText(
    lead.title,
    hovered && !viewed, // decrypt only fires on hover of unviewed cards
    handleDecryptComplete,
  );

  const accentHex = classColorHex(lead.classification);
  const accentVar = classColor(lead.classification);
  const scoreCol  = atsColor(lead.atsScore);
  const SETTLE_CSS = `cubic-bezier(${SETTLE.join(',')})`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, x: 2 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: SETTLE, delay: index * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden noise-texture cursor-pointer"
      style={{
        background:   C.surface1,
        // Placard archetype morph: blockRiot02 → marchSurge01 on hover (800ms Settle)
        borderRadius: hovered ? S.placardHover : S.placard,
        borderTop:    `3px solid ${accentVar}`,
        borderLeft:   `1px solid ${C.surface3}`,
        borderRight:  `1px solid ${C.surface3}`,
        borderBottom: `1px solid ${C.surface3}`,
        // flat shadow — zero blur always
        boxShadow:    hovered
          ? `4px 4px 0px ${C.surface4}`
          : `2px 2px 0px ${C.surface4}`,
        transition:   `border-radius 800ms ${SETTLE_CSS}, box-shadow 200ms ${SETTLE_CSS}`,
        // Subtle Y lift on hover via CSS — not motion (no glow)
        transform:    hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Security Seal — absolute center, z-0, pulsing if unviewed */}
      <SecuritySeal colorHex={accentHex} pulsing={!viewed} />

      {/* Card content — z-1 above seal */}
      <div className="relative p-5" style={{ zIndex: 1 }}>

        {/* ── ROW 1: Dispatch # · Classification · Signal ── */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <ClassBadge c={lead.classification} />
            <span
              style={{
                fontFamily:   F.mono,
                fontWeight:   100,
                fontSize:     '9px',
                letterSpacing:'0.08em',
                color:        C.workerAshDim,
              }}
            >
              DISPATCH #{lead.dispatch}
            </span>
          </div>
          <SignalBars strength={lead.signalStrength} colorHex={accentHex} />
        </div>

        {/* ── ROW 2: Title — Decrypt animation for unviewed ── */}
        <h3
          style={{
            fontFamily:   F.mono,
            fontWeight:   viewed ? 700 : hovered ? 700 : 400,
            fontSize:     '15px',
            lineHeight:   1.3,
            letterSpacing:'0.02em',
            // Unviewed + hovering: metalBlue decrypt color
            // Unviewed resting: workerAshMuted (readable but muted)
            // Viewed: workerAsh
            color:        !viewed && hovered ? accentVar : viewed ? C.workerAsh : C.workerAshMuted,
            marginBottom: '4px',
            margin:       '0 0 4px',
            transition:   `color 280ms ${SETTLE_CSS}, font-weight 280ms ${SETTLE_CSS}`,
            // Monospace character preservation for decrypt scramble
            fontVariantNumeric: 'tabular-nums' as any,
          }}
        >
          {decryptTitle}
          {/* New intercept indicator — blink for unviewed */}
          {!viewed && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: SETTLE }}
              style={{
                display:     'inline-block',
                width:       '2px',
                height:      '13px',
                background:  accentVar,
                marginLeft:  '4px',
                verticalAlign:'middle',
              }}
            />
          )}
        </h3>

        {/* ── ROW 3: Organization ── */}
        <p
          style={{
            fontFamily:   F.mono,
            fontWeight:   100,
            fontSize:     '10px',
            letterSpacing:'0.06em',
            textTransform:'uppercase' as const,
            color:        C.workerAshDim,
            marginBottom: '14px',
            margin:       '0 0 14px',
          }}
        >
          {lead.organization}
        </p>

        {/* Flat divider */}
        <div style={{ height: '1px', background: C.surface3, marginBottom: '12px' }} />

        {/* ── ROW 4: Description — Teletype mono ── */}
        <p
          style={{
            fontFamily:  F.mono,
            fontWeight:  300,
            fontSize:    '11px',
            lineHeight:   1.65,
            color:       C.workerAshMuted,
            marginBottom:'12px',
            margin:      '0 0 12px',
            // Clamp to 3 lines — dispatch is terse
            overflow:    'hidden',
            display:     '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as any,
          }}
        >
          {lead.description}
        </p>

        {/* ── ROW 5: Skill tags ── */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {lead.skills.map((skill) => (
            <span
              key={skill}
              style={{
                fontFamily:   F.mono,
                fontWeight:   700,
                fontSize:     '8px',
                letterSpacing:'0.07em',
                textTransform:'uppercase' as const,
                color:        C.workerAshDim,
                background:   C.surface2,
                padding:      '3px 8px',
                borderRadius: S.chipBase,
                border:       `1px solid ${C.surface4}`,
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Flat divider */}
        <div style={{ height: '1px', background: C.surface3, marginBottom: '12px' }} />

        {/* ── ROW 6: Metadata + ATS score + CTA ── */}
        <div className="flex items-center justify-between gap-2 flex-wrap">

          {/* Left: Location · Salary · Posted */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1" style={{ fontFamily: F.mono, fontWeight: 100, fontSize: '9px', color: C.workerAshDim }}>
                <MapPin size={9} style={{ flexShrink: 0 }} />
                {lead.location}
              </span>
              <span className="flex items-center gap-1" style={{ fontFamily: F.mono, fontWeight: 100, fontSize: '9px', color: C.workerAshDim }}>
                <Clock size={9} style={{ flexShrink: 0 }} />
                INTERCEPTED {lead.posted}d AGO
              </span>
            </div>
            <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: '11px', color: C.smokeOrange }}>
              {lead.salary}
            </span>
          </div>

          {/* Right: ATS score + CTA */}
          <div className="flex items-center gap-3">
            {/* ATS score — mono, color-graded */}
            <div className="text-right">
              <p style={{
                fontFamily:   F.mono,
                fontWeight:   800,
                fontSize:     '22px',
                lineHeight:    1,
                color:        scoreCol,
                textShadow:   `2px 2px 0px ${C.surface3}`,
                margin:       0,
              }}>
                {lead.atsScore}
              </p>
              <p style={{
                fontFamily:   F.mono,
                fontWeight:   100,
                fontSize:     '7px',
                letterSpacing:'0.08em',
                color:        C.workerAshDim,
                margin:       0,
              }}>
                ATS MATCH
              </p>
            </div>

            {/* CTA — Strike archetype (blockRiot03) */}
            {/* Unviewed: "DECRYPT →" | Viewed: "OPEN →" */}
            <motion.button
              onClick={(e) => { e.stopPropagation(); setHovered(true); }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.28, ease: M3 }}
              className="flex items-center gap-1.5 cursor-pointer"
              style={{
                background:   !viewed ? accentVar : C.surface2,
                color:        !viewed ? C.canvas : accentVar,
                fontFamily:   F.mono,
                fontWeight:   900,
                fontSize:     '9px',
                letterSpacing:'0.10em',
                textTransform:'uppercase' as const,
                padding:      '8px 14px',
                borderRadius: S.strike,
                border:       !viewed ? 'none' : `1px solid ${accentVar}`,
                // flat shadow — zero blur
                boxShadow:    `2px 2px 0px ${C.surface4}`,
              }}
            >
              {!viewed ? 'DECRYPT' : 'OPEN'}
              <ArrowRight size={10} strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>

        {/* Save toggle — bottom-right ghost indicator */}
        <button
          onClick={(e) => { e.stopPropagation(); onSave(lead.id); }}
          style={{
            position:     'absolute',
            top:          '16px',
            right:        '16px',
            fontFamily:   F.mono,
            fontWeight:   100,
            fontSize:     '8px',
            letterSpacing:'0.06em',
            textTransform:'uppercase' as const,
            color:        isSaved ? C.inkGold : C.workerAshDim,
            background:   'transparent',
            border:       `1px solid ${isSaved ? C.inkGold : C.surface4}`,
            padding:      '3px 8px',
            borderRadius: S.chipBase,
            cursor:       'pointer',
            opacity:      hovered || isSaved ? 1 : 0,
            transition:   `opacity 180ms ${SETTLE_CSS}, color 180ms ${SETTLE_CSS}, border-color 180ms ${SETTLE_CSS}`,
          }}
        >
          {isSaved ? 'SAVED' : 'SAVE'}
        </button>

      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN — THE LOOKOUT
// ============================================================================

export function Opportunities() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('ALL');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [viewedIds,    setViewedIds]    = useState<Set<string>>(
    new Set(LEADS.filter(l => l.viewed).map(l => l.id)),
  );
  const [savedIds, setSavedIds] = useState<Set<string>>(
    new Set(LEADS.filter(l => l.saved).map(l => l.id)),
  );
  const [searchFocused, setSearchFocused] = useState(false);

  const handleView = useCallback((id: string) => {
    setViewedIds(prev => new Set([...prev, id]));
  }, []);
  const handleSave = useCallback((id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // Filtered leads
  const filtered = LEADS.filter(lead => {
    if (activeFilter === 'SAVED'        && !savedIds.has(lead.id))      return false;
    if (activeFilter !== 'ALL' && activeFilter !== 'SAVED' && lead.classification !== activeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!lead.title.toLowerCase().includes(q) &&
          !lead.organization.toLowerCase().includes(q) &&
          !lead.skills.some(s => s.toLowerCase().includes(q))) return false;
    }
    return true;
  });

  const counts = {
    ALL:          LEADS.length,
    VERIFIED:     LEADS.filter(l => l.classification === 'VERIFIED').length,
    URGENT:       LEADS.filter(l => l.classification === 'URGENT').length,
    UNCONFIRMED:  LEADS.filter(l => l.classification === 'UNCONFIRMED').length,
    CLASSIFIED:   LEADS.filter(l => l.classification === 'CLASSIFIED').length,
    SAVED:        savedIds.size,
  };

  const filterConfig: { key: FilterKey; label: string; accent: string }[] = [
    { key: 'ALL',         label: 'ALL INTERCEPTS', accent: C.workerAsh },
    { key: 'VERIFIED',    label: 'VERIFIED',        accent: C.metalBlue },
    { key: 'URGENT',      label: 'URGENT',          accent: C.solidarityRed },
    { key: 'UNCONFIRMED', label: 'UNCONFIRMED',     accent: C.concreteGrey },
    { key: 'CLASSIFIED',  label: 'CLASSIFIED',      accent: C.stencilYellow },
    { key: 'SAVED',       label: 'SAVED',           accent: C.inkGold },
  ];

  const unviewedCount = LEADS.filter(l => !viewedIds.has(l.id)).length;
  const SETTLE_CSS    = `cubic-bezier(${SETTLE.join(',')})`;

  return (
    <div
      className="p-6 md:p-10 lg:p-12 max-w-[1440px] mx-auto"
      style={{ fontOpticalSizing: 'auto' as any }}
    >

      {/* ═══════════════════════════════════════════
          HERO — THE LOOKOUT
          ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: M3 }}
        className="mb-10"
      >
        <p style={{
          fontFamily:   F.mono,
          fontWeight:   100,
          fontSize:     '10px',
          letterSpacing:'0.14em',
          textTransform:'uppercase' as const,
          color:        C.metalBlue,
          margin:       '0 0 10px',
        }}>
          THE LOOKOUT // CLANDESTINE INTELLIGENCE FEED
        </p>

        {/* Hero heading — proclamation wght 900 */}
        <h1 style={{
          fontFamily:   F.proclamation,
          fontWeight:   900,
          fontSize:     'clamp(2.5rem, 7vw, 5rem)',
          lineHeight:   0.92,
          letterSpacing:'-0.04em',
          textTransform:'uppercase' as const,
          color:        C.workerAsh,
          margin:       '0 0 8px',
          textShadow:   `4px 4px 0px ${C.surface3}`,
        }}>
          THE{' '}
          <span style={{ color: C.metalBlue }}>LOOKOUT</span>
        </h1>

        {/* Subline */}
        <p style={{
          fontFamily:            F.primary,
          fontVariationSettings: "'wght' 475",
          fontSize:              '14px',
          color:                 C.workerAsh,
          opacity:               0.45,
          lineHeight:             1.6,
          maxWidth:              '520px',
          margin:                0,
        }}>
          Intercepted job dispatches, classified by signal strength and ATS alignment.
          Hover unviewed leads to initiate decrypt sequence.
        </p>
      </motion.div>

      {/* ═══════════════════════════════════════════
          INTELLIGENCE STATS STRIP
          ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.45, ease: SETTLE }}
        className="flex flex-wrap items-center gap-4 mb-8 pb-6"
        style={{ borderBottom: `1px solid ${C.surface3}` }}
      >
        {[
          { label: 'TOTAL INTERCEPTS', value: LEADS.length,    color: C.workerAsh },
          { label: 'VERIFIED LEADS',   value: counts.VERIFIED,  color: C.metalBlue },
          { label: 'URGENT',           value: counts.URGENT,    color: C.solidarityRed },
          { label: 'UNVIEWED',         value: unviewedCount,    color: C.stencilYellow },
        ].map(stat => (
          <div key={stat.label} className="flex items-baseline gap-2">
            <span style={{
              fontFamily:   F.mono,
              fontWeight:   800,
              fontSize:     '24px',
              lineHeight:    1,
              color:        stat.color,
              textShadow:   `2px 2px 0px ${C.surface3}`,
            }}>
              {stat.value}
            </span>
            <span style={{
              fontFamily:   F.mono,
              fontWeight:   100,
              fontSize:     '8px',
              letterSpacing:'0.10em',
              textTransform:'uppercase' as const,
              color:        C.workerAshDim,
            }}>
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ═══════════════════════════════════════════
          SEARCH + FILTER BAR
          ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.45, ease: SETTLE }}
        className="mb-6"
      >
        {/* Search — scaffoldFrame01 shape, mono font */}
        <div className="relative mb-4">
          <Search
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: searchFocused ? C.metalBlue : C.workerAshDim }}
          />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="SEARCH INTERCEPTS..."
            style={{
              fontFamily:   F.mono,
              fontWeight:   300,
              fontSize:     '12px',
              letterSpacing:'0.06em',
              color:        C.workerAsh,
              background:   C.surface1,
              borderRadius: 'var(--sys-shape-scaffoldFrame01)', // 8px 2px 8px 2px
              border:       searchFocused
                ? `1px solid ${C.metalBlue}`
                : `1px solid ${C.surface4}`,
              padding:      '13px 16px 13px 38px',
              width:        '100%',
              outline:      'none',
              // flat shadow — zero blur
              boxShadow:    `2px 2px 0px ${C.surface4}`,
              transition:   `border-color 180ms ${SETTLE_CSS}`,
            }}
          />
          {searchQuery && (
            <span style={{
              position:     'absolute',
              right:        '16px',
              top:          '50%',
              transform:    'translateY(-50%)',
              fontFamily:   F.mono,
              fontWeight:   100,
              fontSize:     '9px',
              letterSpacing:'0.06em',
              color:        C.workerAshDim,
            }}>
              {filtered.length} RESULTS
            </span>
          )}
        </div>

        {/* Filter chips — March archetype */}
        <div className="flex flex-wrap gap-2">
          {filterConfig.map(({ key, label, accent }) => {
            const isActive = activeFilter === key;
            return (
              <motion.button
                key={key}
                onClick={() => setActiveFilter(key)}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.28, ease: M3 }}
                className="flex items-center gap-2 cursor-pointer"
                style={{
                  fontFamily:   F.mono,
                  fontWeight:   isActive ? 700 : 100,
                  fontSize:     '9px',
                  letterSpacing:'0.08em',
                  textTransform:'uppercase' as const,
                  color:        isActive ? C.canvas : accent,
                  background:   isActive ? accent : C.surface1,
                  // March archetype: blockRiot01 rest → marchSurge01 active (800ms Settle)
                  borderRadius: isActive ? S.chipActive : S.chipBase,
                  border:       `1px solid ${isActive ? accent : C.surface4}`,
                  padding:      '7px 14px',
                  // flat shadow
                  boxShadow:    isActive ? `2px 2px 0px ${C.surface4}` : 'none',
                  transition:   `border-radius 800ms ${SETTLE_CSS}, background 180ms ${SETTLE_CSS}, color 180ms ${SETTLE_CSS}`,
                }}
              >
                {label}
                <span style={{
                  fontFamily:   F.mono,
                  fontWeight:   isActive ? 800 : 100,
                  fontSize:     '9px',
                  background:   isActive ? `${C.canvas}20` : C.surface3,
                  padding:      '1px 6px',
                  borderRadius: S.pill,
                }}>
                  {counts[key]}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          DISPATCH CARD GRID
          ═══════════════════════════════════════════ */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((lead, i) => (
              <DispatchCard
                key={lead.id}
                lead={{ ...lead, viewed: viewedIds.has(lead.id) }}
                index={i}
                onView={handleView}
                onSave={handleSave}
                isSaved={savedIds.has(lead.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: SETTLE }}
          className="flex flex-col items-center justify-center py-20 noise-texture"
          style={{
            background:   C.surface1,
            borderRadius: S.placard,
            border:       `1px solid ${C.surface3}`,
          }}
        >
          <p style={{
            fontFamily:   F.mono,
            fontWeight:   700,
            fontSize:     '11px',
            letterSpacing:'0.12em',
            textTransform:'uppercase' as const,
            color:        C.workerAshDim,
            margin:       0,
          }}>
            NO INTERCEPTS FOUND
          </p>
          <p style={{
            fontFamily: F.curator,
            fontWeight: 400,
            fontSize:   '15px',
            fontStyle:  'italic',
            color:      C.smokeOrange,
            opacity:    0.5,
            marginTop:  '8px',
            margin:     '8px 0 0',
          }}>
            adjust your filters or search parameters
          </p>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════
          FOOTER — solidarity copy
          ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 pt-6 flex items-center justify-between flex-wrap gap-4"
        style={{ borderTop: `1px solid ${C.surface3}` }}
      >
        <p style={{
          fontFamily:   F.mono,
          fontWeight:   100,
          fontSize:     '9px',
          letterSpacing:'0.08em',
          textTransform:'uppercase' as const,
          color:        C.workerAshDim,
          margin:       0,
        }}>
          THE LOOKOUT // {LEADS.length} DISPATCHES // SOLIDARITY MODE
        </p>
        <p style={{
          fontFamily: F.curator,
          fontWeight: 400,
          fontSize:   '16px',
          fontStyle:  'italic',
          color:      C.smokeOrange,
          opacity:    0.55,
          margin:     0,
        }}>
          every application is a communiqué
        </p>
      </motion.div>

    </div>
  );
}
