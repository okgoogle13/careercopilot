import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NexusInput } from '../../components/kerala-rage/NexusInput';
import { useNavigate } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

type InterceptStatus = 'VERIFIED' | 'URGENT' | 'CLASSIFIED' | 'SAVED';
type FilterTab = 'ALL INTERCEPTS' | 'VERIFIED' | 'URGENT' | 'UNCONFIRMED' | 'CLASSIFIED' | 'SAVED';

interface Intercept {
  id: string;
  status: InterceptStatus;
  signalBars: number; // 1-5
  dispatch: string;
  title: string;
  company: string;
  description: string;
  tags: string[];
  location: string;
  salary: string;
  interceptedAgo: string;
  score: number;
  saved?: boolean;
}

// ─── Figma-accurate token map ─────────────────────────────────────────────────
// VERIFIED badge/bars → protest-metal-blue (#48b3da)
// URGENT badge/bars  → solidarity-red (#f14714)
// Score 94           → stencil-yellow (#daf674)
// Score 89           → activist-smoke-green (#48da8b)
// Score 78           → stencil-yellow-warm (#f6e748)
// Salary             → solidarity-smoke-orange (#da8b48)
// Description/title  → #8daf75 (medium green) / #daf6b3 (light green for top score)
// Muted text/tags    → #627a4f

const STATUS_COLORS: Record<InterceptStatus, { badge: string; bar: string }> = {
  VERIFIED: {
    badge:
      'bg-[var(--kr-color-charcoal-background-steps-1)] border border-[var(--kr-color-protest-metal-blue-base)] text-[var(--kr-color-protest-metal-blue-base)]',
    bar: 'bg-[var(--kr-color-protest-metal-blue-base)]',
  },
  URGENT: {
    badge:
      'bg-[var(--kr-color-charcoal-background-steps-0)] border border-[var(--kr-color-solidarity-red-base)] text-[var(--kr-color-solidarity-red-base)]',
    bar: 'bg-[var(--kr-color-solidarity-red-base)]',
  },
  CLASSIFIED: {
    badge:
      'bg-[var(--kr-color-ink-gold-base)]/20 border border-[var(--kr-color-ink-gold-base)]/50 text-[var(--kr-color-ink-gold-base)]',
    bar: 'bg-[var(--kr-color-ink-gold-base)]',
  },
  SAVED: {
    badge:
      'bg-transparent border border-[var(--kr-color-ink-gold-base)] text-[var(--kr-color-ink-gold-base)]',
    bar: 'bg-[var(--kr-color-ink-gold-base)]',
  },
};

const DECRYPT_BUTTON_COLORS: Record<InterceptStatus, string> = {
  VERIFIED: 'bg-[var(--kr-color-protest-metal-blue-base)]',
  URGENT: 'bg-[var(--kr-color-solidarity-red-base)]',
  CLASSIFIED: 'bg-[var(--kr-color-ink-gold-base)]',
  SAVED: 'bg-[var(--kr-color-charcoal-background-steps-2)]',
};

function getScoreColor(score: number): string {
  if (score >= 92) return 'var(--kr-color-ink-gold-base)';
  if (score >= 85) return 'var(--kr-color-kr-activist-smoke-green-base)';
  return 'var(--kr-color-stencil-yellow-base)';
}

// ─── Mock data (matches Figma exactly) ───────────────────────────────────────

const INTERCEPTS: Intercept[] = [
  {
    id: '1',
    status: 'VERIFIED',
    signalBars: 5,
    dispatch: 'KR-0427',
    title: 'Senior Case Manager',
    company: 'Berry Street',
    description:
      'Confirmed opening. Lead case management across family services portfolio. Senior practitioner required for case supervision and systemic advocacy.',
    tags: ['Case Management', 'MARAM', 'Family Violence'],
    location: 'Inner North, Melbourne VIC',
    salary: '$95K–$105K',
    interceptedAgo: '1d',
    score: 94,
    saved: true,
  },
  {
    id: '2',
    status: 'URGENT',
    signalBars: 4,
    dispatch: 'KR-0391',
    title: 'Family Violence Practitioner',
    company: 'Safe Steps',
    description:
      'Critical intercept. High-priority family violence intervention role. Court support capacity required. Closing in 72 hours — immediate action advised.',
    tags: ['Crisis Support', 'Risk Assessment', 'Court Support'],
    location: 'Melbourne CBD',
    salary: '$88K–$98K',
    interceptedAgo: '3d',
    score: 89,
  },
  {
    id: '3',
    status: 'VERIFIED',
    signalBars: 3,
    dispatch: 'KR-0379',
    title: 'NDIS Support Coordinator',
    company: 'genU',
    description:
      'Verified lead in NDIS sector. Full scheme implementation experience preferred. Registered provider with strong support network. Partial skill alignment detected.',
    tags: ['NDIS', 'Disability', 'Care Planning'],
    location: 'Eastern Suburbs VIC',
    salary: '$80K–$90K',
    interceptedAgo: '4d',
    score: 78,
    saved: true,
  },
  {
    id: '4',
    status: 'VERIFIED',
    signalBars: 3,
    dispatch: 'KR-0412',
    title: 'Mental Health Clinician',
    company: 'Beyond Blue',
    description:
      'Confirmed CAMHS-adjacent role. Early intervention focus for 15–25 age cohort. Strong evidence-based practice framework required.',
    tags: ['Mental Health', 'DBT', 'Youth Assessment'],
    location: 'Footscray VIC',
    salary: '$88K–$98K',
    interceptedAgo: '5d',
    score: 91,
  },
];

const FILTER_TABS: FilterTab[] = [
  'ALL INTERCEPTS',
  'VERIFIED',
  'URGENT',
  'UNCONFIRMED',
  'CLASSIFIED',
  'SAVED',
];

const TAB_COUNTS: Record<FilterTab, number> = {
  'ALL INTERCEPTS': 8,
  VERIFIED: 4,
  URGENT: 1,
  UNCONFIRMED: 2,
  CLASSIFIED: 1,
  SAVED: 2,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** 5-bar signal indicator, coloured by status */
const SignalBars = ({ bars, status }: { bars: number; status: InterceptStatus }) => {
  const barHeights = [5, 8, 11, 14, 18];
  const activeClass = STATUS_COLORS[status].bar;

  return (
    <div
      className="flex items-end gap-[2px]"
      aria-label={`Signal strength ${bars} of 5`}
    >
      {barHeights.map((h, i) => (
        <div
          key={i}
          className={cn(
            'w-[3px] rounded-t-[1px] transition-colors',
            i < bars ? activeClass : 'bg-[var(--kr-color-charcoal-background-steps-4)]'
          )}
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
};

/** Pill-left class badge — matches Figma ClassBadge shape */
const StatusBadge = ({ status }: { status: InterceptStatus }) => (
  <span
    className={cn(
      'px-2 py-0.5 text-[8px] font-mono font-extrabold tracking-[0.08em] uppercase',
      'rounded-l-full rounded-r-[2px]',
      STATUS_COLORS[status].badge
    )}
  >
    {status}
  </span>
);

/** Top-right SAVED pill — stencil-yellow outline, matches Figma */
const SavedBadge = () => (
  <span className="absolute top-4 right-4 border border-[var(--kr-color-ink-gold-base)] text-[var(--kr-color-ink-gold-base)] text-[8px] font-mono font-thin tracking-[0.06em] uppercase px-2 py-0.5 rounded-tl-[8px] rounded-tr-[2px] rounded-bl-[2px] rounded-br-[8px]">
    SAVED
  </span>
);

const InterceptCard = ({
  intercept,
  onDecrypt,
}: {
  intercept: Intercept;
  onDecrypt: (id: string) => void;
}) => {
  const scoreColor = getScoreColor(intercept.score);
  const titleColor =
    intercept.score >= 92
      ? 'var(--kr-color-worker-ash-base)'
      : 'var(--kr-color-worker-ash-steps-1)';
  const decryptBg = DECRYPT_BUTTON_COLORS[intercept.status];

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative flex flex-col gap-0 overflow-hidden',
        'bg-[var(--kr-color-charcoal-background-steps-1)]',
        'border-[var(--kr-color-charcoal-background-steps-2)] border border-t-[3px]',
        'rounded-tl-[20px] rounded-tr-[4px] rounded-bl-[2px] rounded-br-[12px]',
        'shadow-[2px_2px_0px_0px_var(--kr-color-charcoal-background-steps-4)]'
      )}
    >
      {intercept.saved && <SavedBadge />}

      <div className="flex flex-col gap-0 p-5">
        {/* Card header: badge + dispatch + signal */}
        <div className="flex items-center justify-between gap-2 mb-[14px]">
          <div className="flex items-center gap-2">
            <StatusBadge status={intercept.status} />
            <span className="text-[9px] font-mono font-thin tracking-[0.08em] text-[var(--kr-color-worker-ash-steps-0)] uppercase">
              DISPATCH #{intercept.dispatch}
            </span>
          </div>
          <SignalBars
            bars={intercept.signalBars}
            status={intercept.status}
          />
        </div>

        {/* Title */}
        <h3
          className="text-[15px] font-primary font-bold tracking-[0.02em] mb-[6px]"
          style={{ color: titleColor }}
        >
          {intercept.title}
        </h3>

        {/* Company */}
        <p className="text-[10px] font-mono font-thin tracking-[0.06em] uppercase text-[var(--kr-color-worker-ash-steps-0)] mb-[14px]">
          {intercept.company}
        </p>

        {/* Divider */}
        <div className="h-px bg-[var(--kr-color-charcoal-background-steps-2)] mb-[14px]" />

        {/* Description */}
        <p className="text-[11px] font-mono font-light leading-[1.65] text-[var(--kr-color-worker-ash-steps-1)] line-clamp-3 mb-[14px]">
          {intercept.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-[6px] mb-[14px]">
          {intercept.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[8px] font-mono font-bold tracking-[0.07em] uppercase text-[var(--kr-color-worker-ash-steps-0)] bg-[var(--kr-color-charcoal-background-steps-2)] border border-[var(--kr-color-charcoal-background-steps-4)] rounded-tl-[8px] rounded-tr-[2px] rounded-bl-[2px] rounded-br-[8px]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--kr-color-charcoal-background-steps-2)] mb-[14px]" />

        {/* Footer row */}
        <div className="flex items-start justify-between gap-4">
          {/* Left: location, time, salary */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 text-[9px] font-mono font-thin text-[var(--kr-color-worker-ash-steps-0)]">
              <span className="flex items-center gap-1">
                <MapPin className="w-[9px] h-[9px]" />
                {intercept.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-[9px] h-[9px]" />
                INTERCEPTED {intercept.interceptedAgo} AGO
              </span>
            </div>
            <p
              className="text-[11px] font-mono font-bold"
              style={{ color: 'var(--kr-color-solidarity-smoke-orange-base)' }}
            >
              {intercept.salary}
            </p>
          </div>

          {/* Right: score + DECRYPT */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col items-end">
              <span
                className="text-[22px] font-['Work_Sans'] font-thin leading-none tabular-nums"
                style={{ color: scoreColor }}
              >
                {intercept.score}
              </span>
              <span className="text-[7px] font-mono font-thin tracking-[0.08em] text-[var(--kr-color-worker-ash-steps-0)] uppercase">
                ATS MATCH
              </span>
            </div>
            <button
              onClick={() => onDecrypt(intercept.id)}
              className={cn(
                'px-4 py-[7px] text-[9px] font-mono font-extrabold tracking-[0.1em] uppercase',
                'text-[var(--kr-color-charcoal-background-steps-0)]',
                'rounded-tl-[32px] rounded-tr-[2px] rounded-bl-[2px] rounded-br-[2px]',
                'shadow-[2px_2px_0px_0px_var(--kr-color-charcoal-background-steps-4)]',
                'transition-opacity hover:opacity-90',
                decryptBg
              )}
            >
              DECRYPT →
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

export const OpportunitiesDiscovery = memo(function OpportunitiesDiscovery() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL INTERCEPTS');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filtered =
    activeFilter === 'ALL INTERCEPTS'
      ? INTERCEPTS
      : activeFilter === 'SAVED'
        ? INTERCEPTS.filter((i) => i.saved)
        : INTERCEPTS.filter((i) => i.status === (activeFilter as InterceptStatus));

  const displayed = searchQuery
    ? filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : filtered;

  return (
    <div
      className="flex flex-col gap-6 min-h-full px-8 py-8"
      style={{ backgroundColor: 'var(--kr-color-charcoal-background-steps-1)' }}
    >
      {/* ── Hero ── */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-2"
      >
        <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-[var(--kr-color-signal-green-base)]">
          OPPORTUNITIES // CLANDESTINE INTELLIGENCE FEED
        </p>

        <h1 className="flex flex-wrap items-baseline gap-x-3 leading-none">
          <span className="text-[72px] font-black text-worker-ash tracking-tight uppercase">
            THE
          </span>
          <span
            className="text-[72px] font-black uppercase italic tracking-tight"
            style={{ color: 'var(--kr-color-signal-green-base)' }}
          >
            OPPORTUNITIES
          </span>
        </h1>

        <p className="max-w-xl text-[13px] text-worker-ash-muted leading-relaxed">
          Intercepted job dispatches, classified by signal strength and ATS alignment. Hover
          unreviewed leads to initiate decrypt sequence.
        </p>
      </motion.header>

      {/* ── Stats ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-8"
      >
        {[
          { value: 8, label: 'TOTAL INTERCEPTS' },
          { value: 4, label: 'VERIFIED LEADS' },
          { value: 1, label: 'URGENT' },
          { value: 5, label: 'UNVIEWED' },
        ].map(({ value, label }) => (
          <div
            key={label}
            className="flex items-baseline gap-2"
          >
            <span className="text-[28px] font-['Work_Sans'] font-thin text-worker-ash tabular-nums leading-none">
              {value}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-worker-ash-muted">
              {label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ── Search ── */}
      <NexusInput
        icon="search"
        placeholder="SEARCH INTERCEPTS..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        label="Search intercepts"
        className="uppercase tracking-wider text-sm"
      />

      {/* ── Filter tabs ── */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={cn(
              'px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest rounded-sm border transition-colors duration-150',
              activeFilter === tab
                ? 'bg-[var(--kr-color-ink-gold-base)]/10 border-[var(--kr-color-ink-gold-base)]/60 text-[var(--kr-color-ink-gold-base)]'
                : 'bg-transparent border-surface-gutter text-worker-ash-muted hover:border-[var(--kr-color-concrete-grey-steps-0)] hover:text-[var(--kr-color-worker-ash-steps-1)]'
            )}
          >
            {tab} {TAB_COUNTS[tab]}
          </button>
        ))}
      </div>

      {/* ── Card grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayed.map((intercept, i) => (
          <motion.div
            key={intercept.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <InterceptCard
              intercept={intercept}
              onDecrypt={(id) => navigate(`/job/${id}`)}
            />
          </motion.div>
        ))}

        {displayed.length === 0 && (
          <div className="col-span-2 py-16 text-center text-[12px] font-mono uppercase tracking-widest text-worker-ash-muted">
            NO INTERCEPTS MATCH CURRENT FILTER
          </div>
        )}
      </div>
    </div>
  );
});

export default OpportunitiesDiscovery;
