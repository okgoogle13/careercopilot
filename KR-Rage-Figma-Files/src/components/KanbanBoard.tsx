import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Plus, GripVertical, Calendar, MapPin, ChevronRight, X,
} from 'lucide-react';

// ============================================================================
// KANBAN BOARD — "THE COMMAND CENTER"
// Manage active applications through lifecycle stages.
// Kerala Rage / Solidarity Mode — hi-fi spec implementation.
// ============================================================================

const COLORS = {
  canvas: '#0F0F0F',
  surface1: '#1A1A1A',
  surface2: '#242424',
  surface3: '#2A2A2A',
  surface4: '#323232',
  surface5: '#3A3A3A',
  surface6: '#444444',
  solidarityRed: '#F14714',
  inkGold: '#DAF674',
  stencilYellow: '#F6E748',
  signalGreen: '#48F0E5',
  activistGreen: '#48DA8B',
  workerAsh: '#DAF6B3',
  workerAshMuted: '#9AAF7D',
  workerAshDim: '#7A8A6D',
  smokeOrange: '#DA8B48',
  metalBlue: '#48B3DA',
  charcoalRed: '#F14844',
};

const FONTS = {
  primary: "'Work Sans', system-ui, sans-serif",
  display: "'Fraunces', serif",
  proclamation: "'Libre Bodoni', serif",
  mono: "'JetBrains Mono', monospace",
  curator: "'Caveat', cursive",
};

const SHAPES = {
  pebble: '16px 8px 12px 20px',
  stone: '16px 4px 12px 24px',
};

const M3_EXPRESSIVE = [0.34, 1.56, 0.64, 1] as const;
const SPRING_SLAM = { duration: 0.6, ease: M3_EXPRESSIVE };
const SPRING_SETTLE = { duration: 0.8, ease: M3_EXPRESSIVE };

// ============================================================================
// TYPES
// ============================================================================

type ColumnId = 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER';

interface ApplicationCard {
  id: string;
  title: string;
  company: string;
  location: string;
  matchScore: number;
  dateApplied: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface ColumnConfig {
  id: ColumnId;
  label: string;
  accent: string;
  count: number;
}

const ITEM_TYPE = 'APPLICATION_CARD';

// ============================================================================
// MOCK DATA — Social work context
// ============================================================================

const INITIAL_DATA: Record<ColumnId, ApplicationCard[]> = {
  APPLIED: [
    { id: '1', title: 'Senior Case Manager', company: 'Berry Street', location: 'Melbourne VIC', matchScore: 94, dateApplied: '2d ago', priority: 'HIGH' },
    { id: '2', title: 'AOD Counsellor', company: 'Uniting', location: 'Geelong VIC', matchScore: 71, dateApplied: '5d ago', priority: 'MEDIUM' },
    { id: '3', title: 'Community Worker', company: 'Brotherhood of St Laurence', location: 'Fitzroy VIC', matchScore: 68, dateApplied: '1w ago', priority: 'LOW' },
  ],
  SCREENING: [
    { id: '4', title: 'Family Violence Practitioner', company: 'Safe Steps', location: 'Remote VIC', matchScore: 87, dateApplied: '3d ago', priority: 'HIGH' },
    { id: '5', title: 'Mental Health Clinician', company: 'Orygen', location: 'Parkville VIC', matchScore: 82, dateApplied: '6d ago', priority: 'MEDIUM' },
  ],
  INTERVIEW: [
    { id: '6', title: 'Youth Outreach Worker', company: 'Frontyard', location: 'CBD VIC', matchScore: 78, dateApplied: '8d ago', priority: 'HIGH' },
  ],
  OFFER: [
    { id: '7', title: 'NDIS Support Coordinator', company: 'Scope', location: 'Hawthorn VIC', matchScore: 91, dateApplied: '12d ago', priority: 'HIGH' },
  ],
};

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: 'APPLIED', label: 'APPLIED', accent: COLORS.metalBlue, count: 0 },
  { id: 'SCREENING', label: 'SCREENING', accent: COLORS.stencilYellow, count: 0 },
  { id: 'INTERVIEW', label: 'INTERVIEW', accent: COLORS.inkGold, count: 0 },
  { id: 'OFFER', label: 'OFFER', accent: COLORS.activistGreen, count: 0 },
];

// ============================================================================
// HELPER: Score color
// ============================================================================

function scoreColor(score: number): string {
  if (score >= 90) return COLORS.inkGold;
  if (score >= 80) return COLORS.activistGreen;
  if (score >= 70) return COLORS.stencilYellow;
  return COLORS.smokeOrange;
}

function priorityColor(p: string): string {
  if (p === 'HIGH') return COLORS.solidarityRed;
  if (p === 'MEDIUM') return COLORS.stencilYellow;
  return COLORS.workerAshMuted;
}

// ============================================================================
// DRAGGABLE CARD
// ============================================================================

function DraggableCard({
  card,
  index,
  columnId,
}: {
  card: ApplicationCard;
  index: number;
  columnId: ColumnId;
}) {
  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { id: card.id, fromColumn: columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const sc = scoreColor(card.matchScore);
  const pc = priorityColor(card.priority);

  return (
    <motion.div
      ref={dragRef as any}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      transition={{ ...SPRING_SLAM, delay: index * 0.05 }}
      whileHover={{ y: -3, boxShadow: `0 8px 16px rgba(0,0,0,0.45)` }}
      className="relative overflow-hidden noise-texture cursor-grab active:cursor-grabbing group"
      style={{
        background: COLORS.surface2,
        borderRadius: SHAPES.pebble,
        border: `1px solid ${COLORS.surface4}`,
        padding: '16px',
        marginBottom: '8px',
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      {/* Left score bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: sc }}
      />

      {/* Grip handle */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-50" style={{ transition: `opacity 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})` }}>
        <GripVertical size={14} style={{ color: COLORS.workerAshDim }} />
      </div>

      {/* Priority badge + Score */}
      <div className="flex items-center justify-between mb-3">
        <span
          style={{
            fontFamily: FONTS.mono,
            fontWeight: 700,
            fontSize: '9px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
            color: pc,
            background: `${pc}15`,
            padding: '2px 8px',
            borderRadius: '4px',
            border: `1px solid ${pc}25`,
          }}
        >
          {card.priority}
        </span>
        <span
          style={{
            fontFamily: FONTS.mono,
            fontWeight: 800,
            fontSize: '16px',
            color: sc,
            textShadow: `0 0 8px ${sc}44`,
          }}
        >
          {card.matchScore}
        </span>
      </div>

      {/* Title — Proclamation font */}
      <h4
        style={{
          fontFamily: FONTS.proclamation,
          fontWeight: 700,
          fontSize: '14px',
          color: COLORS.workerAsh,
          lineHeight: 1.3,
          marginBottom: '4px',
        }}
      >
        {card.title}
      </h4>

      {/* Company — Mono label */}
      <p
        style={{
          fontFamily: FONTS.mono,
          fontWeight: 500,
          fontSize: '10px',
          letterSpacing: '0.04em',
          textTransform: 'uppercase' as const,
          color: COLORS.workerAshMuted,
          marginBottom: '8px',
        }}
      >
        {card.company}
      </p>

      {/* Bottom row — Location + Date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <MapPin size={10} style={{ color: COLORS.workerAshDim }} />
          <span style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.workerAshDim }}>
            {card.location}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={10} style={{ color: COLORS.workerAshDim }} />
          <span style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.workerAshDim }}>
            {card.dateApplied}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// DROPPABLE COLUMN
// ============================================================================

function KanbanColumn({
  config,
  cards,
  onDrop,
}: {
  config: ColumnConfig;
  cards: ApplicationCard[];
  onDrop: (cardId: string, fromColumn: ColumnId, toColumn: ColumnId) => void;
}) {
  const [{ isOver }, dropRef] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: { id: string; fromColumn: ColumnId }) => {
      if (item.fromColumn !== config.id) {
        onDrop(item.id, item.fromColumn, config.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={dropRef as any}
      className="flex flex-col min-h-[400px]"
      style={{
        background: isOver ? `${config.accent}08` : COLORS.surface1,
        borderRadius: SHAPES.stone,
        border: `1px solid ${isOver ? `${config.accent}30` : COLORS.surface3}`,
        padding: '16px',
        transition: `all 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
      }}
    >
      {/* Column header — Fraunces Restrained */}
      <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: `1px solid ${COLORS.surface3}` }}>
        <div className="flex items-center gap-3">
          {/* Accent dot */}
          <div
            className="w-2.5 h-2.5"
            style={{
              background: config.accent,
              borderRadius: '98%',
              boxShadow: `0 0 8px ${config.accent}44`,
            }}
          />
          <h3
            style={{
              fontFamily: FONTS.display,
              fontVariationSettings: "'wght' 700, 'wdth' 100, 'SOFT' 20, 'WONK' 0",
              fontSize: '16px',
              textTransform: 'uppercase' as const,
              color: COLORS.workerAsh,
              letterSpacing: '0.02em',
            }}
          >
            {config.label}
          </h3>
        </div>

        {/* Count badge */}
        <span
          style={{
            fontFamily: FONTS.mono,
            fontWeight: 800,
            fontSize: '11px',
            color: config.accent,
            background: `${config.accent}15`,
            padding: '2px 8px',
            borderRadius: '4px',
          }}
        >
          {cards.length}
        </span>
      </div>

      {/* Cards area */}
      <div className="flex-1 overflow-y-auto space-y-0">
        <AnimatePresence>
          {cards.map((card, i) => (
            <DraggableCard
              key={card.id}
              card={card}
              index={i}
              columnId={config.id}
            />
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {cards.length === 0 && (
          <div
            className="flex items-center justify-center py-12"
            style={{
              border: `1px dashed ${COLORS.surface4}`,
              borderRadius: SHAPES.pebble,
            }}
          >
            <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshDim, letterSpacing: '0.04em' }}>
              DROP HERE
            </p>
          </div>
        )}
      </div>

      {/* Wheat paste tear placeholder on column header (decorative) */}
      <div
        className="mt-3 h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${config.accent}20, transparent 80%)`,
        }}
      />
    </div>
  );
}

// ============================================================================
// MAIN KANBAN COMPONENT
// ============================================================================

export function KanbanBoard() {
  const [columns, setColumns] = useState(INITIAL_DATA);

  const handleDrop = useCallback(
    (cardId: string, fromColumn: ColumnId, toColumn: ColumnId) => {
      setColumns((prev) => {
        const card = prev[fromColumn].find((c) => c.id === cardId);
        if (!card) return prev;

        return {
          ...prev,
          [fromColumn]: prev[fromColumn].filter((c) => c.id !== cardId),
          [toColumn]: [...prev[toColumn], card],
        };
      });
    },
    []
  );

  // Stats
  const totalCards = Object.values(columns).reduce((sum, col) => sum + col.length, 0);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative min-h-screen" style={{ background: COLORS.canvas }}>
        {/* Atmosphere */}
        <div className="fixed inset-0 -z-10 mesh-gradient noise-texture" style={{ background: COLORS.canvas }} />

        <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">

          {/* ═══════════════════════════════════════════
              HEADER
              ═══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING_SLAM}
            className="mb-8"
          >
            {/* Micro label */}
            <p
              style={{
                fontFamily: FONTS.mono,
                fontWeight: 700,
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
                color: COLORS.solidarityRed,
                marginBottom: '8px',
              }}
            >
              CAREER COPILOT // KANBAN
            </p>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1
                  style={{
                    fontFamily: FONTS.display,
                    fontVariationSettings: "'wght' 900, 'SOFT' 100, 'WONK' 1",
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    lineHeight: 1.05,
                    letterSpacing: '-0.01em',
                    color: COLORS.workerAsh,
                    marginBottom: '8px',
                  }}
                >
                  THE{' '}
                  <span style={{ color: COLORS.stencilYellow }}>COMMAND</span>{' '}
                  CENTER
                </h1>
                <p
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: '11px',
                    letterSpacing: '0.05em',
                    color: COLORS.workerAshMuted,
                    textTransform: 'uppercase' as const,
                  }}
                >
                  {totalCards} ACTIVE APPLICATIONS // DRAG TO UPDATE STATUS
                </p>
              </div>

              {/* Add new */}
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                className="flex items-center gap-3 self-start"
                style={{
                  background: COLORS.solidarityRed,
                  color: COLORS.canvas,
                  fontFamily: FONTS.primary,
                  fontWeight: 800,
                  fontSize: '12px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase' as const,
                  padding: '12px 24px',
                  borderRadius: SHAPES.pebble,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: `0 0 12px ${COLORS.solidarityRed}66`,
                }}
              >
                <Plus size={16} />
                NEW APPLICATION
              </motion.button>
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════
              BOARD — 4 Columns
              ═══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SETTLE, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {COLUMN_CONFIG.map((col) => (
              <KanbanColumn
                key={col.id}
                config={col}
                cards={columns[col.id]}
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
            transition={{ delay: 0.8 }}
            className="pt-8 pb-4 mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ borderTop: `1px solid ${COLORS.surface3}` }}
          >
            <p
              style={{
                fontFamily: FONTS.mono,
                fontSize: '10px',
                letterSpacing: '0.06em',
                color: COLORS.workerAshMuted,
                textTransform: 'uppercase' as const,
              }}
            >
              CAREER COPILOT v1.0 // COMMAND CENTER // SOLIDARITY MODE
            </p>
            <p
              style={{
                fontFamily: FONTS.curator,
                fontSize: '14px',
                color: COLORS.smokeOrange,
                opacity: 0.6,
              }}
            >
              every application is an act of resistance
            </p>
          </motion.footer>
        </div>
      </div>
    </DndProvider>
  );
}