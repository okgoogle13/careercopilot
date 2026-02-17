import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, FileText, FilePlus, Trash2, Download, Edit3,
  Clock, ArrowUpRight, Filter, FolderOpen, Eye,
} from 'lucide-react';

// ============================================================================
// DOCUMENTS / EDITOR — KERALA RAGE / SOLIDARITY MODE — "THE ARCHIVE"
// Document management: resumes, cover letters, KSC responses.
// Charcoal surfaces, pebble shapes, ink-gold focus.
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

type DocType = 'resume' | 'cover' | 'ksc' | 'reference';
type DocFilter = 'all' | DocType;

interface Document {
  id: string;
  name: string;
  type: DocType;
  updated: string;
  atsScore?: number;
  targetRole?: string;
  version: number;
}

const TYPE_COLORS: Record<DocType, string> = {
  resume: COLORS.solidarityRed,
  cover: COLORS.inkGold,
  ksc: COLORS.signalGreen,
  reference: COLORS.metalBlue,
};

const TYPE_LABELS: Record<DocType, string> = {
  resume: 'RESUME',
  cover: 'COVER LETTER',
  ksc: 'KSC RESPONSE',
  reference: 'REFERENCE',
};

const DOCUMENTS: Document[] = [
  { id: '1', name: 'Senior Case Manager Resume', type: 'resume', updated: '2 days ago', atsScore: 94, targetRole: 'Berry Street', version: 3 },
  { id: '2', name: 'Family Violence Cover Letter', type: 'cover', updated: '3 days ago', targetRole: 'Safe Steps', version: 2 },
  { id: '3', name: 'Crisis Intervention KSC', type: 'ksc', updated: '1 week ago', targetRole: 'Anglicare', version: 1 },
  { id: '4', name: 'Youth Work Resume', type: 'resume', updated: '1 week ago', atsScore: 82, targetRole: 'Orygen', version: 2 },
  { id: '5', name: 'Community Dev Cover Letter', type: 'cover', updated: '2 weeks ago', targetRole: 'City of Yarra', version: 1 },
  { id: '6', name: 'NDIS Support Coordinator Resume', type: 'resume', updated: '3 weeks ago', atsScore: 78, version: 1 },
  { id: '7', name: 'Stakeholder Engagement KSC', type: 'ksc', updated: '3 weeks ago', targetRole: 'DFFH', version: 2 },
  { id: '8', name: 'Professional References', type: 'reference', updated: '1 month ago', version: 1 },
  { id: '9', name: 'AOD Counsellor Cover Letter', type: 'cover', updated: '1 month ago', targetRole: 'Uniting', version: 1 },
];

export function Documents() {
  const [filter, setFilter] = useState<DocFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedField, setFocusedField] = useState(false);

  const filtered = DOCUMENTS.filter((doc) => {
    if (filter !== 'all' && doc.type !== filter) return false;
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: DOCUMENTS.length,
    resume: DOCUMENTS.filter(d => d.type === 'resume').length,
    cover: DOCUMENTS.filter(d => d.type === 'cover').length,
    ksc: DOCUMENTS.filter(d => d.type === 'ksc').length,
    reference: DOCUMENTS.filter(d => d.type === 'reference').length,
  };

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1440px] mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_SLAM}
        className="mb-8"
      >
        <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.metalBlue, marginBottom: '12px' }}>
          THE ARCHIVE // DOCUMENT MANAGEMENT
        </p>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <h1
            style={{
              fontFamily: FONTS.display,
              fontVariationSettings: "'wght' 800, 'wdth' 120",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              lineHeight: 1.05,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              color: COLORS.workerAsh,
            }}
          >
            YOUR <span style={{ color: COLORS.metalBlue }}>DOCUMENTS</span>
          </h1>
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
            className="flex items-center gap-2 cursor-pointer"
            style={{
              background: COLORS.solidarityRed,
              color: COLORS.canvas,
              fontFamily: FONTS.primary,
              fontVariationSettings: "'wght' 800",
              fontSize: '12px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              padding: '12px 24px',
              borderRadius: SHAPES.pebble,
              border: 'none',
              boxShadow: `0 0 16px ${COLORS.solidarityRed}44`,
            }}
          >
            <FilePlus size={16} />
            NEW DOCUMENT
          </motion.button>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: focusedField ? COLORS.inkGold : COLORS.surface5 }} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setFocusedField(true)}
          onBlur={() => setFocusedField(false)}
          placeholder="Search documents..."
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

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {([
          { key: 'all' as DocFilter, label: 'ALL', color: COLORS.workerAsh },
          { key: 'resume' as DocFilter, label: 'RESUMES', color: TYPE_COLORS.resume },
          { key: 'cover' as DocFilter, label: 'COVER LETTERS', color: TYPE_COLORS.cover },
          { key: 'ksc' as DocFilter, label: 'KSC', color: TYPE_COLORS.ksc },
          { key: 'reference' as DocFilter, label: 'REFERENCES', color: TYPE_COLORS.reference },
        ]).map((f) => (
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
              background: filter === f.key ? f.color : COLORS.surface2,
              padding: '8px 16px',
              borderRadius: SHAPES.pebble,
              border: `1px solid ${filter === f.key ? f.color : COLORS.surface4}`,
            }}
          >
            {f.label}
            <span style={{ fontSize: '9px', opacity: 0.7 }}>{counts[f.key]}</span>
          </motion.button>
        ))}
      </div>

      {/* Document list */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map((doc, i) => {
            const color = TYPE_COLORS[doc.type];
            return (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ ...SPRING_SLAM, delay: i * 0.03 }}
                whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.35)' }}
                className="relative noise-texture overflow-hidden cursor-pointer group"
                style={{
                  background: COLORS.surface1,
                  borderRadius: SHAPES.pebble,
                  border: `1px solid ${COLORS.surface3}`,
                  padding: '16px 20px',
                }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: color }} />

                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div style={{ background: `${color}15`, borderRadius: SHAPES.pebble, padding: '10px', flexShrink: 0 }}>
                    <FileText size={20} style={{ color }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: FONTS.proclamation, fontWeight: 700, fontSize: '15px', color: COLORS.workerAsh, marginBottom: '2px' }}>
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
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
                        {TYPE_LABELS[doc.type]}
                      </span>
                      <span className="flex items-center gap-1" style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted }}>
                        <Clock size={10} /> {doc.updated}
                      </span>
                      {doc.targetRole && (
                        <span style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshDim }}>
                          → {doc.targetRole}
                        </span>
                      )}
                      <span style={{ fontFamily: FONTS.mono, fontSize: '9px', color: COLORS.workerAshDim }}>
                        v{doc.version}
                      </span>
                    </div>
                  </div>

                  {/* ATS Score */}
                  {doc.atsScore && (
                    <div className="text-right flex-shrink-0 hidden sm:block">
                      <p style={{ fontFamily: FONTS.mono, fontWeight: 800, fontSize: '24px', color: COLORS.inkGold, lineHeight: 1 }}>
                        {doc.atsScore}
                      </p>
                      <p style={{ fontFamily: FONTS.mono, fontSize: '8px', color: COLORS.workerAshMuted, letterSpacing: '0.06em' }}>
                        ATS
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {[
                      { icon: Eye, color: COLORS.signalGreen, label: 'Preview' },
                      { icon: Edit3, color: COLORS.inkGold, label: 'Edit' },
                      { icon: Download, color: COLORS.metalBlue, label: 'Download' },
                      { icon: Trash2, color: COLORS.charcoalRed, label: 'Delete' },
                    ].map((action) => (
                      <motion.button
                        key={action.label}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                        className="cursor-pointer p-2"
                        title={action.label}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: action.color,
                          opacity: 0.7,
                        }}
                      >
                        <action.icon size={16} />
                      </motion.button>
                    ))}
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
          <FolderOpen size={48} style={{ color: COLORS.surface4, margin: '0 auto 16px' }} />
          <p style={{ fontFamily: FONTS.display, fontVariationSettings: "'wght' 700", fontSize: '20px', color: COLORS.workerAshDim }}>
            NO DOCUMENTS FOUND
          </p>
        </div>
      )}
    </div>
  );
}