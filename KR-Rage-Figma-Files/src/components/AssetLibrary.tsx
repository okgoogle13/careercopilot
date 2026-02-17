import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Upload, Download, Trash2, Image, Archive, Eye, FolderOpen } from 'lucide-react';

// ============================================================================
// ASSET LIBRARY — KERALA RAGE / SOLIDARITY MODE
// File management for career assets. Charcoal surfaces, pebble shapes.
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
  mono: "'JetBrains Mono', monospace",
  curator: "'Caveat', cursive",
};

const SHAPES = { pebble: '16px 8px 12px 20px' };
const M3_EXPRESSIVE = [0.34, 1.56, 0.64, 1] as const;
const SPRING_SLAM = { duration: 0.6, ease: M3_EXPRESSIVE };

interface Asset {
  id: string;
  name: string;
  uploadedAt: string;
  type: 'image' | 'document' | 'archive';
  size: string;
}

const TYPE_ICONS = { image: Image, document: FileText, archive: Archive };
const TYPE_COLORS = { image: COLORS.signalGreen, document: COLORS.inkGold, archive: COLORS.smokeOrange };

const ASSETS: Asset[] = [
  { id: '1', name: 'Professional Headshot.jpg', uploadedAt: '1 day ago', type: 'image', size: '2.4 MB' },
  { id: '2', name: 'Portfolio PDF.pdf', uploadedAt: '2 days ago', type: 'document', size: '5.1 MB' },
  { id: '3', name: 'Certifications.pdf', uploadedAt: '3 days ago', type: 'document', size: '1.2 MB' },
  { id: '4', name: 'References.docx', uploadedAt: '4 days ago', type: 'document', size: '340 KB' },
  { id: '5', name: 'Cover Letter Template.docx', uploadedAt: '5 days ago', type: 'document', size: '280 KB' },
  { id: '6', name: 'Resume v3.pdf', uploadedAt: '1 week ago', type: 'document', size: '420 KB' },
  { id: '7', name: 'LinkedIn Banner.png', uploadedAt: '1 week ago', type: 'image', size: '1.8 MB' },
  { id: '8', name: 'Work Samples.zip', uploadedAt: '2 weeks ago', type: 'archive', size: '12.3 MB' },
];

export function AssetLibrary() {
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1440px] mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_SLAM}
        className="mb-8"
      >
        <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.activistGreen, marginBottom: '12px' }}>
          ASSET STORAGE // FILE MANAGEMENT
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
            ASSET <span style={{ color: COLORS.activistGreen }}>LIBRARY</span>
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
            <Upload size={16} />
            UPLOAD ASSET
          </motion.button>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ASSETS.map((asset, i) => {
          const Icon = TYPE_ICONS[asset.type];
          const color = TYPE_COLORS[asset.type];
          return (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_SLAM, delay: i * 0.05 }}
              whileHover={{ y: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.45)' }}
              className="relative noise-texture overflow-hidden cursor-pointer group"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
                padding: '20px',
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: color }} />

              {/* Thumbnail placeholder */}
              <div
                className="mb-4 flex items-center justify-center"
                style={{
                  background: `${color}08`,
                  borderRadius: SHAPES.pebble,
                  height: '80px',
                  border: `1px dashed ${color}25`,
                }}
              >
                <Icon size={28} style={{ color, opacity: 0.5 }} />
              </div>

              <p style={{ fontFamily: FONTS.primary, fontVariationSettings: "'wght' 600", fontSize: '13px', color: COLORS.workerAsh, marginBottom: '4px', lineHeight: 1.3 }}>
                {asset.name}
              </p>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted }}>
                  {asset.uploadedAt}
                </span>
                <span style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshDim }}>
                  {asset.size}
                </span>
              </div>

              {/* Hover actions */}
              <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {[
                  { icon: Eye, c: COLORS.signalGreen },
                  { icon: Download, c: COLORS.metalBlue },
                  { icon: Trash2, c: COLORS.charcoalRed },
                ].map((a, j) => (
                  <motion.button
                    key={j}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                    className="cursor-pointer p-1.5"
                    style={{ background: COLORS.surface2, border: `1px solid ${COLORS.surface4}`, borderRadius: '6px', color: a.c }}
                  >
                    <a.icon size={14} />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}