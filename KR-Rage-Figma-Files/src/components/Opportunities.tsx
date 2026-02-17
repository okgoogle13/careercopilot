import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, MapPin, Clock, ArrowUpRight, Briefcase, Star,
  Heart, Building2, Filter, SlidersHorizontal,
} from 'lucide-react';

// ============================================================================
// OPPORTUNITIES / FEED — KERALA RAGE / SOLIDARITY MODE — "THE LOOKOUT"
// Job listings feed. Charcoal cards, ATS match scores, pebble tags.
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

const SHAPES = { pebble: '16px 8px 12px 20px' };
const M3_EXPRESSIVE = [0.34, 1.56, 0.64, 1] as const;
const SPRING_SLAM = { duration: 0.6, ease: M3_EXPRESSIVE };
const SPRING_SETTLE = { duration: 0.8, ease: M3_EXPRESSIVE };

type FeedFilter = 'all' | 'strong' | 'solid' | 'saved';

interface Opportunity {
  id: string;
  role: string;
  org: string;
  location: string;
  type: string;
  posted: string;
  atsScore: number;
  tags: string[];
  saved: boolean;
  salary?: string;
}

const OPPORTUNITIES: Opportunity[] = [
  { id: '1', role: 'Senior Case Manager', org: 'Berry Street', location: 'Inner North, Melbourne', type: 'Full-Time', posted: '2 days ago', atsScore: 94, tags: ['Case Management', 'Family Violence', 'MARAM'], saved: true, salary: '$95K – $105K' },
  { id: '2', role: 'Family Violence Practitioner', org: 'Safe Steps', location: 'Melbourne CBD', type: 'Full-Time', posted: '3 days ago', atsScore: 89, tags: ['Crisis Support', 'Risk Assessment', 'Court Support'], saved: false, salary: '$88K – $98K' },
  { id: '3', role: 'Youth Outreach Worker', org: 'Anglicare Victoria', location: 'Western Suburbs', type: 'Part-Time', posted: '1 week ago', atsScore: 82, tags: ['Youth Work', 'AOD', 'Group Facilitation'], saved: false, salary: '$75K – $82K' },
  { id: '4', role: 'NDIS Support Coordinator', org: 'genU', location: 'Eastern Suburbs', type: 'Full-Time', posted: '4 days ago', atsScore: 78, tags: ['NDIS', 'Disability', 'Care Planning'], saved: true, salary: '$80K – $90K' },
  { id: '5', role: 'Mental Health Clinician', org: 'Orygen', location: 'Parkville', type: 'Contract', posted: '5 days ago', atsScore: 71, tags: ['Mental Health', 'Assessment', 'CBT'], saved: false, salary: '$92K – $102K' },
  { id: '6', role: 'Community Development Officer', org: 'City of Yarra', location: 'Inner North, Melbourne', type: 'Full-Time', posted: '1 week ago', atsScore: 67, tags: ['Community Dev', 'Engagement', 'Advocacy'], saved: false, salary: '$85K – $95K' },
  { id: '7', role: 'Housing Support Worker', org: 'Launch Housing', location: 'Melbourne CBD', type: 'Full-Time', posted: '2 weeks ago', atsScore: 73, tags: ['Housing', 'Homelessness', 'Intake'], saved: false, salary: '$72K – $80K' },
  { id: '8', role: 'AOD Counsellor', org: 'Uniting', location: 'Northern Suburbs', type: 'Part-Time', posted: '6 days ago', atsScore: 85, tags: ['AOD', 'Counselling', 'Harm Reduction'], saved: true, salary: '$78K – $88K' },
];

function scoreColor(score: number): string {
  if (score >= 85) return COLORS.inkGold;
  if (score >= 75) return COLORS.activistGreen;
  if (score >= 65) return COLORS.stencilYellow;
  return COLORS.smokeOrange;
}

function scoreLabel(score: number): string {
  if (score >= 85) return 'STRONG';
  if (score >= 75) return 'SOLID';
  if (score >= 65) return 'BUILDING';
  return 'DEVELOPING';
}

export function Opportunities() {
  const [filter, setFilter] = useState<FeedFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(OPPORTUNITIES.filter(o => o.saved).map(o => o.id)));
  const [focusedField, setFocusedField] = useState(false);

  const toggleSaved = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = OPPORTUNITIES.filter((opp) => {
    if (filter === 'strong' && opp.atsScore < 85) return false;
    if (filter === 'solid' && (opp.atsScore < 75 || opp.atsScore >= 85)) return false;
    if (filter === 'saved' && !savedIds.has(opp.id)) return false;
    if (searchQuery && !opp.role.toLowerCase().includes(searchQuery.toLowerCase()) && !opp.org.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1440px] mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_SLAM}
        className="mb-8"
      >
        <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.signalGreen, marginBottom: '12px' }}>
          THE LOOKOUT // CURATED FEED
        </p>
        <h1
          style={{
            fontFamily: FONTS.display,
            fontVariationSettings: "'wght' 800, 'wdth' 120",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            lineHeight: 1.05,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            color: COLORS.workerAsh,
            marginBottom: '8px',
          }}
        >
          OPPORTUNITIES <span style={{ color: COLORS.signalGreen }}>FEED</span>
        </h1>
        <p style={{ fontFamily: FONTS.primary, fontVariationSettings: "'wght' 475, 'wdth' 98", fontSize: '15px', color: COLORS.workerAsh, opacity: 0.5, maxWidth: '600px' }}>
          ATS-scored job listings matched to your solidarity profile. Sorted by relevance.
        </p>
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_SETTLE, delay: 0.15 }}
        className="mb-6"
      >
        {/* Search bar */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: focusedField ? COLORS.inkGold : COLORS.surface5 }} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setFocusedField(true)}
            onBlur={() => setFocusedField(false)}
            placeholder="Search roles, organisations..."
            style={{
              fontFamily: FONTS.primary,
              fontVariationSettings: "'wght' 475",
              fontSize: '14px',
              color: COLORS.workerAsh,
              background: COLORS.surface1,
              border: focusedField ? `2px solid ${COLORS.inkGold}` : `1px solid ${COLORS.surface4}`,
              borderRadius: SHAPES.pebble,
              padding: '14px 16px 14px 44px',
              width: '100%',
              outline: 'none',
              boxShadow: focusedField ? `0 0 12px ${COLORS.inkGold}22` : 'none',
              transition: 'border 0.3s, box-shadow 0.3s',
            }}
          />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {([
            { key: 'all', label: 'ALL', count: OPPORTUNITIES.length },
            { key: 'strong', label: 'STRONG (85+)', count: OPPORTUNITIES.filter(o => o.atsScore >= 85).length },
            { key: 'solid', label: 'SOLID (75-84)', count: OPPORTUNITIES.filter(o => o.atsScore >= 75 && o.atsScore < 85).length },
            { key: 'saved', label: 'SAVED', count: savedIds.size },
          ] as { key: FeedFilter; label: string; count: number }[]).map((f) => (
            <motion.button
              key={f.key}
              onClick={() => setFilter(f.key)}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
              className="cursor-pointer flex items-center gap-2"
              style={{
                fontFamily: FONTS.mono,
                fontWeight: 700,
                fontSize: '10px',
                letterSpacing: '0.06em',
                color: filter === f.key ? COLORS.canvas : COLORS.workerAshMuted,
                background: filter === f.key ? COLORS.inkGold : COLORS.surface2,
                padding: '8px 16px',
                borderRadius: SHAPES.pebble,
                border: `1px solid ${filter === f.key ? COLORS.inkGold : COLORS.surface4}`,
              }}
            >
              {f.label}
              <span style={{ fontFamily: FONTS.mono, fontSize: '9px', opacity: 0.7 }}>
                {f.count}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Results count */}
      <p style={{ fontFamily: FONTS.mono, fontSize: '10px', letterSpacing: '0.06em', color: COLORS.workerAshMuted, marginBottom: '16px', textTransform: 'uppercase' }}>
        {filtered.length} OPPORTUNITIES FOUND
      </p>

      {/* Feed list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((opp, i) => {
            const color = scoreColor(opp.atsScore);
            const label = scoreLabel(opp.atsScore);
            const isSaved = savedIds.has(opp.id);
            return (
              <motion.div
                key={opp.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ ...SPRING_SLAM, delay: i * 0.04 }}
                whileHover={{ y: -3, boxShadow: '0 8px 16px rgba(0,0,0,0.45)' }}
                className="relative noise-texture overflow-hidden cursor-pointer group"
                style={{
                  background: COLORS.surface1,
                  borderRadius: SHAPES.pebble,
                  border: `1px solid ${COLORS.surface3}`,
                  padding: '20px 24px',
                }}
              >
                {/* Left accent */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: color }} />

                <div className="flex items-start gap-4">
                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3
                          style={{
                            fontFamily: FONTS.proclamation,
                            fontWeight: 700,
                            fontSize: '16px',
                            color: COLORS.workerAsh,
                            lineHeight: 1.3,
                            marginBottom: '4px',
                          }}
                        >
                          {opp.role}
                        </h3>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="flex items-center gap-1" style={{ fontFamily: FONTS.mono, fontSize: '11px', color: COLORS.workerAshMuted }}>
                            <Building2 size={12} /> {opp.org}
                          </span>
                          <span className="flex items-center gap-1" style={{ fontFamily: FONTS.mono, fontSize: '11px', color: COLORS.workerAshMuted }}>
                            <MapPin size={12} /> {opp.location}
                          </span>
                          <span className="flex items-center gap-1" style={{ fontFamily: FONTS.mono, fontSize: '11px', color: COLORS.workerAshMuted }}>
                            <Clock size={12} /> {opp.posted}
                          </span>
                        </div>
                      </div>

                      {/* ATS Score */}
                      <div className="text-right flex-shrink-0">
                        <p style={{ fontFamily: FONTS.mono, fontWeight: 800, fontSize: '28px', lineHeight: 1, color, textShadow: `0 0 12px ${color}44` }}>
                          {opp.atsScore}
                        </p>
                        <span
                          style={{
                            fontFamily: FONTS.mono,
                            fontWeight: 700,
                            fontSize: '9px',
                            letterSpacing: '0.06em',
                            color,
                            background: `${color}18`,
                            padding: '2px 8px',
                            borderRadius: SHAPES.pebble,
                            border: `1px solid ${color}30`,
                          }}
                        >
                          {label}
                        </span>
                      </div>
                    </div>

                    {/* Tags + meta */}
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        <span
                          style={{
                            fontFamily: FONTS.mono,
                            fontWeight: 700,
                            fontSize: '9px',
                            letterSpacing: '0.04em',
                            color: COLORS.metalBlue,
                            background: `${COLORS.metalBlue}12`,
                            padding: '4px 10px',
                            borderRadius: SHAPES.pebble,
                            border: `1px solid ${COLORS.metalBlue}25`,
                          }}
                        >
                          {opp.type}
                        </span>
                        {opp.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontFamily: FONTS.mono,
                              fontWeight: 600,
                              fontSize: '9px',
                              letterSpacing: '0.04em',
                              color: COLORS.surface6,
                              background: COLORS.surface2,
                              padding: '4px 10px',
                              borderRadius: SHAPES.pebble,
                              border: `1px solid ${COLORS.surface4}`,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        {opp.salary && (
                          <span style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '11px', color: COLORS.smokeOrange }}>
                            {opp.salary}
                          </span>
                        )}
                        <motion.button
                          onClick={(e) => { e.stopPropagation(); toggleSaved(opp.id); }}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                          className="cursor-pointer"
                          style={{ background: 'none', border: 'none', color: isSaved ? COLORS.solidarityRed : COLORS.surface5 }}
                        >
                          <Heart size={18} fill={isSaved ? COLORS.solidarityRed : 'none'} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div
          className="text-center py-16 noise-texture relative overflow-hidden"
          style={{
            background: COLORS.surface1,
            borderRadius: SHAPES.pebble,
            border: `1px solid ${COLORS.surface3}`,
          }}
        >
          <Search size={48} style={{ color: COLORS.surface4, margin: '0 auto 16px' }} />
          <p style={{ fontFamily: FONTS.display, fontVariationSettings: "'wght' 700", fontSize: '20px', color: COLORS.workerAshDim }}>
            NO MATCHES FOUND
          </p>
          <p style={{ fontFamily: FONTS.mono, fontSize: '11px', color: COLORS.workerAshDim, marginTop: '8px' }}>
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}
    </div>
  );
}