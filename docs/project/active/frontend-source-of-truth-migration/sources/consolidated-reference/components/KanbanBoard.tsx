import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus, GripVertical, Calendar, MapPin } from 'lucide-react';

// ============================================================================
// APPLICATIONS — Kerala Rage v6.1 · Screenprint Reconstruction
// Token Sync v2.0 · Shape System v6.1 · Anti-Slop Active
//
// SCREENPRINT LAWS (non-negotiable):
//   1. Flat solid fills only — zero gradients, zero glassmorphism
//   2. box-shadow blur-radius: 0 always — flat ink offsets only
//   3. Cards → --sys-shape-screenCard01 (2px 8px 8px 2px)
//   4. Columns → --sys-shape-radius-none (0px)
//   5. Drag shadow → 4px 4px 0px solidarityRed, no blur
//   6. Drag transition → transform 200ms cubic-bezier(0.25,0.46,0.45,0.94)
//   7. Only count badges use pill shape (pillMarch01)
// ============================================================================

// ── DIRECT COLOR TOKENS ──────────────────────────────────────────────────────
const C = {
  canvas:         'var(--sys-color-charcoalBackground-steps-0)',  // #0F0F0F
  surface1:       'var(--sys-color-charcoalBackground-steps-1)',  // #1A1A1A
  surface2:       'var(--sys-color-charcoalBackground-steps-2)',  // #242424
  surface3:       'var(--sys-color-charcoalBackground-steps-3)',  // #2A2A2A
  surface4:       'var(--sys-color-charcoalBackground-steps-4)',  // #323232
  surface5:       'var(--sys-color-charcoalBackground-steps-5)',  // #3A3A3A
  solidarityRed:  'var(--sys-color-solidarityRed-base)',          // #F14714
  inkGold:        'var(--sys-color-inkGold-base)',                // #DAF674
  stencilYellow:  'var(--sys-color-stencilYellow-base)',          // #F6E748
  signalGreen:    'var(--sys-color-signalGreen-base)',            // #48F0E5
  activistGreen:  'var(--sys-color-kr-activistSmokeGreen-base)',  // #48DA8B
  workerAsh:      'var(--sys-color-worker-ash-base)',             // #DAF6B3
  workerAshMuted: 'var(--sys-color-worker-ash-steps-1)',          // #8DAF75
  workerAshDim:   'var(--sys-color-worker-ash-steps-0)',          // #627A4F
  smokeOrange:    'var(--sys-color-solidaritySmokeOrange-base)',  // #DA8B48
  metalBlue:      'var(--sys-color-protestMetalBlue-base)',       // #48B3DA
  concreteGrey:   'var(--sys-color-concreteGrey-base)',           // #A39B8F
};

// ── SHAPE TOKENS — v6.1 ───────────────────────────────────────────────────────
const S = {
  // Kanban card: labor marker — sharp left (registration cut), rounded right
  card:       'var(--sys-shape-screenCard01)',   // 2px 8px 8px 2px
  // Column walls: structural — zero radius, raw concrete
  column:     'var(--sys-shape-radius-none)',    // 0px
  // Count badges ONLY: pill
  pill:       'var(--sys-shape-pillMarch01)',    // 9999px
  // Strike CTA: blockRiot03
  strike:     'var(--sys-shape-blockRiot03)',    // 32px 2px 2px 2px
  // Scaffold nav chips: blockRiot01
  chip:       'var(--sys-shape-blockRiot01)',    // 8px 2px 8px 2px
  // Sentry avatar: 98%, never 50%
  sentry:     'var(--sys-shape-sentryAvatar)',   // 98%
};

// ── FONT FAMILY TOKENS ───────────────────────────────────────────────────────
const F = {
  primary:      'var(--sys-type-fontFamilies-primary), system-ui, sans-serif',
  display:      'var(--sys-type-fontFamilies-display), serif',
  proclamation: 'var(--sys-type-fontFamilies-proclamation), serif',
  mono:         'var(--sys-type-fontFamilies-mono), monospace',
  curator:      'var(--sys-type-fontFamilies-curator), cursive',
};

// Precise easing — drag interactions (no overshoot)
const PRECISE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
// M3 Expressive — typographic transitions
const M3 = [0.34, 1.56, 0.64, 1] as const;

// ============================================================================
// TYPES
// ============================================================================

type ColId = 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER';

interface Card {
  id: string;
  title: string;
  company: string;
  location: string;
  score: number;
  dateApplied: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface ColConfig {
  id: ColId;
  label: string;
  accentToken: string;
}

const DRAG_TYPE = 'APP_CARD';

// ============================================================================
// DATA
// ============================================================================

const INIT: Record<ColId, Card[]> = {
  APPLIED: [
    { id: '1', title: 'Senior Case Manager',          company: 'Berry Street',               location: 'Melbourne VIC', score: 94, dateApplied: '2d ago', priority: 'HIGH' },
    { id: '2', title: 'AOD Counsellor',                company: 'Uniting',                    location: 'Geelong VIC',   score: 71, dateApplied: '5d ago', priority: 'MEDIUM' },
    { id: '3', title: 'Community Worker',              company: 'Brotherhood of St Laurence', location: 'Fitzroy VIC',   score: 68, dateApplied: '1w ago', priority: 'LOW' },
  ],
  SCREENING: [
    { id: '4', title: 'Family Violence Practitioner', company: 'Safe Steps',                 location: 'Remote VIC',    score: 87, dateApplied: '3d ago', priority: 'HIGH' },
    { id: '5', title: 'Mental Health Clinician',      company: 'Orygen',                     location: 'Parkville VIC', score: 82, dateApplied: '6d ago', priority: 'MEDIUM' },
  ],
  INTERVIEW: [
    { id: '6', title: 'Youth Outreach Worker',        company: 'Frontyard',                  location: 'CBD VIC',       score: 78, dateApplied: '8d ago', priority: 'HIGH' },
  ],
  OFFER: [
    { id: '7', title: 'NDIS Support Coordinator',     company: 'Scope',                      location: 'Hawthorn VIC',  score: 91, dateApplied: '12d ago', priority: 'HIGH' },
  ],
};

const COLS: ColConfig[] = [
  { id: 'APPLIED',   label: 'APPLIED',   accentToken: C.metalBlue },
  { id: 'SCREENING', label: 'SCREENING', accentToken: C.stencilYellow },
  { id: 'INTERVIEW', label: 'INTERVIEW', accentToken: C.inkGold },
  { id: 'OFFER',     label: 'OFFER',     accentToken: C.activistGreen },
];

// ============================================================================
// HELPERS
// ============================================================================

function scoreToken(n: number): string {
  if (n >= 90) return C.inkGold;
  if (n >= 80) return C.activistGreen;
  if (n >= 70) return C.stencilYellow;
  return C.smokeOrange;
}

function priorityToken(p: string): string {
  if (p === 'HIGH')   return C.solidarityRed;
  if (p === 'MEDIUM') return C.stencilYellow;
  return C.metalBlue;
}

// ============================================================================
// DRAGGABLE CARD
// Flat shadow on drag: 4px 4px 0px solidarityRed — no blur.
// Drag transition: transform 200ms PRECISE.
// border-radius: screenCard01 (2px 8px 8px 2px) — always.
// ============================================================================

function AppCard({ card, index, colId }: { card: Card; index: number; colId: ColId }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: DRAG_TYPE,
    item: { id: card.id, fromCol: colId },
    collect: m => ({ isDragging: m.isDragging() }),
  });

  const sc = scoreToken(card.score);
  const pc = priorityToken(card.priority);

  return (
    <motion.div
      ref={dragRef as any}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: isDragging ? 0.35 : 1, x: 0 }}
      transition={{ duration: 0.28, ease: M3 }}
      className="relative overflow-hidden noise-texture cursor-grab active:cursor-grabbing group"
      style={{
        background:   C.surface2,
        borderRadius: S.card,
        border:       `1px solid ${C.surface4}`,
        padding:      '14px 14px 12px 16px',
        marginBottom: '6px',
        // Flat shadow: 0 blur always. Drag → solidarityRed offset; rest → subtle dark
        boxShadow:    isDragging
          ? `4px 4px 0px ${C.solidarityRed}`
          : `2px 2px 0px ${C.surface4}`,
        transition:   `transform 200ms ${PRECISE}, box-shadow 200ms ${PRECISE}, opacity 200ms ${PRECISE}`,
      }}
    >
      {/* Left score bar — 3px flat ink bleed */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: sc, borderRadius: '0' }}
      />

      {/* Grip + score row */}
      <div className="flex items-center justify-between mb-2.5">
        {/* Priority chip */}
        <span
          style={{
            fontFamily:   F.mono,
            fontWeight:   700,
            fontSize:     '8px',
            letterSpacing:'0.08em',
            textTransform:'uppercase' as const,
            color:        pc,
            background:   C.surface3,
            padding:      '2px 7px',
            borderRadius: S.chip,
            border:       `1px solid ${pc}`,
          }}
        >
          {card.priority}
        </span>
        <div className="flex items-center gap-2">
          {/* Score — mono wght 800, large */}
          <span
            style={{
              fontFamily: F.mono,
              fontWeight: 800,
              fontSize:   '18px',
              lineHeight:  1,
              color:      sc,
              // flat ink shadow
              textShadow: `2px 2px 0px ${C.surface4}`,
            }}
          >
            {card.score}
          </span>
          {/* Grip — hover reveal */}
          <GripVertical
            size={12}
            className="opacity-0 group-hover:opacity-50"
            style={{
              color:      C.workerAshDim,
              transition: `opacity 180ms ${PRECISE}`,
              flexShrink: 0,
            }}
          />
        </div>
      </div>

      {/* Title — Proclamation, wght 700 */}
      <p
        style={{
          fontFamily: F.proclamation,
          fontWeight: 700,
          fontSize:   '13px',
          lineHeight:  1.3,
          color:      C.workerAsh,
          marginBottom:'3px',
          margin:     '0 0 3px',
        }}
      >
        {card.title}
      </p>

      {/* Company — mono wght 100, extreme contrast with title */}
      <p
        style={{
          fontFamily:   F.mono,
          fontWeight:   100,
          fontSize:     '10px',
          letterSpacing:'0.05em',
          textTransform:'uppercase' as const,
          color:        C.workerAshMuted,
          marginBottom: '10px',
          margin:       '0 0 10px',
        }}
      >
        {card.company}
      </p>

      {/* Location · Date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <MapPin size={9} style={{ color: C.workerAshDim, flexShrink: 0 }} />
          <span style={{ fontFamily: F.mono, fontWeight: 300, fontSize: '9px', color: C.workerAshDim }}>
            {card.location}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={9} style={{ color: C.workerAshDim, flexShrink: 0 }} />
          <span style={{ fontFamily: F.mono, fontWeight: 300, fontSize: '9px', color: C.workerAshDim }}>
            {card.dateApplied}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// DROPPABLE COLUMN
// border-radius: 0 (radius-none). No gradients. Flat border only.
// isOver state: flat left border thickens + surface3 background.
// ============================================================================

function KanbanCol({ config, cards, onDrop }: {
  config: ColConfig;
  cards: Card[];
  onDrop: (cardId: string, from: ColId, to: ColId) => void;
}) {
  const [{ isOver }, dropRef] = useDrop({
    accept: DRAG_TYPE,
    drop: (item: { id: string; fromCol: ColId }) => {
      if (item.fromCol !== config.id) onDrop(item.id, item.fromCol, config.id);
    },
    collect: m => ({ isOver: m.isOver() }),
  });

  return (
    <div
      ref={dropRef as any}
      className="flex flex-col min-h-[480px] noise-texture"
      style={{
        background:   isOver ? C.surface3 : C.surface1,
        borderRadius: S.column,
        // isOver: left border becomes accent-colored 3px mark
        borderLeft:   `3px solid ${isOver ? config.accentToken : C.surface3}`,
        borderTop:    `1px solid ${C.surface3}`,
        borderRight:  `1px solid ${C.surface3}`,
        borderBottom: `1px solid ${C.surface3}`,
        padding:      '16px',
        transition:   `background 200ms ${PRECISE}, border-color 200ms ${PRECISE}`,
      }}
    >
      {/* Column header */}
      <div
        className="flex items-center justify-between mb-4 pb-3"
        style={{ borderBottom: `1px solid ${C.surface3}` }}
      >
        <div className="flex items-center gap-2.5">
          {/* Accent dot — sentry shape (98%, NEVER 50%) */}
          <div
            className="w-2.5 h-2.5 flex-shrink-0"
            style={{
              background:   config.accentToken,
              borderRadius: S.sentry,
              // flat shadow — no blur
              boxShadow:    `2px 2px 0px ${C.surface4}`,
            }}
          />
          {/* Column label — display wght 700, upper */}
          <p
            style={{
              fontFamily:            F.display,
              fontVariationSettings: "'wght' 700, 'SOFT' 0, 'WONK' 0",
              fontSize:              '13px',
              textTransform:         'uppercase' as const,
              letterSpacing:         '0.06em',
              color:                 C.workerAsh,
              margin:                0,
            }}
          >
            {config.label}
          </p>
        </div>

        {/* Count — ONLY element using pill shape (pillMarch01) */}
        <span
          style={{
            fontFamily:   F.mono,
            fontWeight:   800,
            fontSize:     '11px',
            lineHeight:    1,
            color:        config.accentToken,
            background:   C.surface3,
            padding:      '3px 10px',
            borderRadius: S.pill,
            border:       `1px solid ${config.accentToken}`,
          }}
        >
          {cards.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1">
        <AnimatePresence>
          {cards.map((card, i) => (
            <AppCard key={card.id} card={card} index={i} colId={config.id} />
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {cards.length === 0 && (
          <div
            className="flex items-center justify-center py-16"
            style={{
              border:       `1px dashed ${C.surface4}`,
              borderRadius: S.card,
            }}
          >
            <p
              style={{
                fontFamily:   F.mono,
                fontWeight:   100,
                fontSize:     '9px',
                letterSpacing:'0.12em',
                color:        C.workerAshDim,
                textTransform:'uppercase' as const,
                margin:       0,
              }}
            >
              DROP HERE
            </p>
          </div>
        )}
      </div>

      {/* Column bottom accent bar — flat 2px, color of accent */}
      <div
        className="mt-4 h-[2px]"
        style={{
          background:   isOver ? config.accentToken : C.surface3,
          transition:   `background 200ms ${PRECISE}`,
        }}
      />
    </div>
  );
}

// ============================================================================
// MAIN — KanbanBoard / Applications
// ============================================================================

export function KanbanBoard() {
  const [cols, setCols] = useState(INIT);

  const handleDrop = useCallback((cardId: string, from: ColId, to: ColId) => {
    setCols(prev => {
      const card = prev[from].find(c => c.id === cardId);
      if (!card) return prev;
      return {
        ...prev,
        [from]: prev[from].filter(c => c.id !== cardId),
        [to]:   [...prev[to], card],
      };
    });
  }, []);

  const total     = Object.values(cols).reduce((s, c) => s + c.length, 0);
  const interviews = cols.INTERVIEW.length;
  const offers     = cols.OFFER.length;

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="relative min-h-screen"
        style={{ background: C.canvas }}
      >
        {/* Wheat-paste grain — screenprint texture, 5% opacity */}
        <div className="fixed inset-0 -z-10 noise-texture" style={{ background: C.canvas }} />

        <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">

          {/* ═══════════════════════════════════════════
              TOP BAR — label / status pills / CTA
              ═══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: M3 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5"
            style={{ borderBottom: `1px solid ${C.surface3}` }}
          >
            {/* Left: path label */}
            <p
              style={{
                fontFamily:   F.mono,
                fontWeight:   100,
                fontSize:     '11px',
                letterSpacing:'0.15em',
                textTransform:'uppercase' as const,
                color:        C.workerAshMuted,
                margin:       0,
              }}
            >
              CAREER COPILOT // APPLICATIONS
            </p>

            {/* Centre: status pills */}
            <div className="flex flex-wrap items-center gap-2">
              {COLS.map(col => (
                <span
                  key={col.id}
                  style={{
                    fontFamily:   F.mono,
                    fontWeight:   700,
                    fontSize:     '10px',
                    letterSpacing:'0.06em',
                    textTransform:'uppercase' as const,
                    color:        col.accentToken,
                    background:   C.surface2,
                    padding:      '4px 12px',
                    borderRadius: S.pill,
                    border:       `1px solid ${col.accentToken}`,
                    // flat shadow on pill — no blur
                    boxShadow:    `2px 2px 0px ${C.surface4}`,
                  }}
                >
                  {cols[col.id].length} {col.label}
                </span>
              ))}
            </div>

            {/* Right: Strike CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.28, ease: M3 }}
              className="flex items-center gap-2"
              style={{
                background:   C.solidarityRed,
                color:        C.canvas,
                fontFamily:   F.primary,
                fontWeight:   900,
                fontSize:     '12px',
                letterSpacing:'0.06em',
                textTransform:'uppercase' as const,
                padding:      '9px 20px',
                borderRadius: S.strike,
                border:       'none',
                cursor:       'pointer',
                // flat ink offset — no blur
                boxShadow:    `3px 3px 0px ${C.surface4}`,
              }}
            >
              <Plus size={14} strokeWidth={2.5} />
              NEW
            </motion.button>
          </motion.div>

          {/* ═══════════════════════════════════════════
              HERO HEADING
              ═══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: M3 }}
            className="mb-2"
          >
            {/* H1 — Proclamation, wght 900, solidarityRed, ink offset */}
            <h1
              style={{
                fontFamily:   F.proclamation,
                fontWeight:   900,
                fontSize:     'clamp(2.5rem, 7vw, 5.5rem)',
                lineHeight:   0.93,
                letterSpacing:'-0.04em',
                textTransform:'uppercase' as const,
                color:        C.solidarityRed,
                // flat stencil text shadow — no blur
                textShadow:   `4px 4px 0px ${C.surface3}`,
                margin:       0,
              }}
            >
              APPLICATIONS
            </h1>
          </motion.div>

          {/* Subline — mono wght 100, extreme contrast with h1 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.45, ease: M3 }}
            style={{
              fontFamily:   F.mono,
              fontWeight:   100,
              fontSize:     '11px',
              letterSpacing:'0.10em',
              textTransform:'uppercase' as const,
              color:        C.workerAshMuted,
              marginBottom: '28px',
              margin:       '6px 0 28px',
            }}
          >
            {total} ACTIVE&nbsp;·&nbsp;{interviews} INTERVIEW&nbsp;·&nbsp;{offers} OFFER
            &nbsp;//&nbsp;DRAG TO UPDATE STATUS
          </motion.p>

          {/* Flat solidarity red divider — 3px */}
          <div
            className="mb-6"
            style={{
              height:     '3px',
              background: C.solidarityRed,
            }}
          />

          {/* ═══════════════════════════════════════════
              BOARD — 4 columns
              ═══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: M3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0"
            style={{
              // Column grid lines — flat 1px between columns, not gap
              outline:      `1px solid ${C.surface3}`,
            }}
          >
            {COLS.map((col, i) => (
              <KanbanCol
                key={col.id}
                config={col}
                cards={cols[col.id]}
                onDrop={handleDrop}
              />
            ))}
          </motion.div>

          {/* ═══════════════════════════════════════════
              FOOTER
              ═══════════════════════════════════════════ */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-6 pb-4 mt-8"
            style={{ borderTop: `1px solid ${C.surface3}` }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p
                style={{
                  fontFamily:   F.mono,
                  fontWeight:   700,
                  fontSize:     '10px',
                  letterSpacing:'0.08em',
                  textTransform:'uppercase' as const,
                  color:        C.workerAshMuted,
                  margin:       0,
                }}
              >
                CAREER COPILOT // APPLICATIONS // SOLIDARITY MODE
              </p>
              <p
                style={{
                  fontFamily: F.curator,
                  fontWeight: 400,
                  fontSize:   '15px',
                  color:      C.smokeOrange,
                  margin:     0,
                }}
              >
                every application is an act of resistance
              </p>
            </div>
            <p
              style={{
                fontFamily:   F.mono,
                fontWeight:   100,
                fontSize:     '9px',
                letterSpacing:'0.06em',
                textTransform:'uppercase' as const,
                color:        C.workerAshDim,
                marginTop:    '6px',
                margin:       '6px 0 0',
              }}
            >
              TOKEN SYNC v2.0 · SHAPE SYSTEM v6.1 · ANTI-SLOP ACTIVE
            </p>
          </motion.footer>

        </div>
      </div>
    </DndProvider>
  );
}
