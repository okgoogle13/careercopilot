import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileText, ArrowRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

// ============================================================================
// INGESTION ENGINE — Kerala Rage v6.1 · Drop-Zone Slam · Wet Ink Processing
// Route: /ingestion — public full-bleed, NO sidebar.
// Token Sync v2.0 · Shape System v6.1 · Anti-Slop Active
//
// DROP-ZONE STATE MACHINE:
//   idle       → 2px dashed surface4 border, workerAsh upload icon
//   dragover   → scale(1.02) translateY(-4px), solidarityRed border, 150ms M3
//   slam       → scale(0.98) translateY(2px) → (1,0) over 300ms, inkGold border
//   processing → Wet Ink bar (0→100% linear), no spinner, stage label cycling
//   complete   → Placard card (screenCard01 shape, inkGold left border), Strike CTA
//
// WET INK LAWS:
//   - Horizontal bar expands left→right using inkGold fill
//   - width: 0% → 100%, transition: 2000ms linear (ink drying metaphor)
//   - No spinner, no shimmer, no circular animation. This is ink drying.
//   - Stage labels cycle: PARSING DOCUMENT → EXTRACTING SKILLS → MAPPING EXPERIENCE → CALIBRATING ATS
//
// SCREENPRINT LAWS:
//   - Zero gradients, zero glassmorphism
//   - box-shadow blur-radius: 0 always
//   - Strike CTA → blockRiot03 shape
//   - Tabs → flat underline only, active = 2px inkGold bottom border
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
  workerAsh:      'var(--sys-color-worker-ash-base)',
  workerAshMuted: 'var(--sys-color-worker-ash-steps-1)',
  workerAshDim:   'var(--sys-color-worker-ash-steps-0)',
  smokeOrange:    'var(--sys-color-solidaritySmokeOrange-base)',
  activistGreen:  'var(--sys-color-kr-activistSmokeGreen-base)',
  signalGreen:    'var(--sys-color-signalGreen-base)',
  metalBlue:      'var(--sys-color-protestMetalBlue-base)',
};

// ── SHAPE TOKENS — v6.1 ──────────────────────────────────────────────────────
const S = {
  // Complete Placard: screenCard01 — labor marker, sharp left, rounded right
  placardCard:  'var(--sys-shape-screenCard01)',   // 2px 8px 8px 2px
  // Strike CTA: blockRiot03
  strike:       'var(--sys-shape-blockRiot03)',    // 32px 2px 2px 2px
  // Scaffold chip: blockRiot01
  chip:         'var(--sys-shape-blockRiot01)',    // 8px 2px 8px 2px
  // File type badge: alertShard01
  shard:        'var(--sys-shape-alertShard01)',   // 32px 2px 2px 32px
  // Drop zone when idle/processing: radius-none (structural defiance)
  dropZone:     'var(--sys-shape-radius-md)',      // 8px — subtle, not institutional
};

// ── FONT FAMILY TOKENS ───────────────────────────────────────────────────────
const F = {
  primary:      'var(--sys-type-fontFamilies-primary), system-ui, sans-serif',
  display:      'var(--sys-type-fontFamilies-display), serif',
  proclamation: 'var(--sys-type-fontFamilies-proclamation), serif',
  mono:         'var(--sys-type-fontFamilies-mono), monospace',
  curator:      'var(--sys-type-fontFamilies-curator), cursive',
};

// M3 Expressive — drag-over overshoot
const M3 = [0.34, 1.56, 0.64, 1] as const;
// Precise — slam rebound, controlled deceleration
const PRECISE = [0.25, 0.46, 0.45, 0.94] as const;

// ── TYPES & SCHEMA ────────────────────────────────────────────────────────────

type DropState = 'idle' | 'dragover' | 'slam' | 'processing' | 'complete';
type InputMode = 'upload' | 'paste';
type ProcessingStage = 'PARSING DOCUMENT' | 'EXTRACTING SKILLS' | 'MAPPING EXPERIENCE' | 'CALIBRATING ATS';

const PROCESSING_STAGES: ProcessingStage[] = [
  'PARSING DOCUMENT',
  'EXTRACTING SKILLS',
  'MAPPING EXPERIENCE',
  'CALIBRATING ATS',
];

interface IngestionResult {
  filename:         string;
  file_type:        'PDF' | 'DOCX' | 'TXT';
  page_count:       number;
  extracted_skills: string[];
  raw_text:         string;
  status:           'idle' | 'processing' | 'complete' | 'error';
}

function getFileType(name: string): 'PDF' | 'DOCX' | 'TXT' {
  const ext = name.split('.').pop()?.toUpperCase();
  if (ext === 'PDF')               return 'PDF';
  if (ext === 'DOCX' || ext === 'DOC') return 'DOCX';
  return 'TXT';
}

// ── WET INK BAR ───────────────────────────────────────────────────────────────
// width: 0% → 100% on 2000ms linear — ink drying, not a loading wheel.
// Controlled by a CSS transition triggered via useEffect.

interface WetInkBarProps {
  active: boolean;
}

function WetInkBar({ active }: WetInkBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (active) {
      const t = setTimeout(() => setWidth(100), 40);
      return () => clearTimeout(t);
    } else {
      setWidth(0);
    }
  }, [active]);

  return (
    <div
      style={{
        width:      '100%',
        height:     '3px',
        background: C.surface3,
        position:   'relative',
        overflow:   'hidden',
      }}
    >
      <div
        style={{
          position:   'absolute',
          top:        0,
          left:       0,
          height:     '100%',
          width:      `${width}%`,
          background: C.inkGold,
          // Ink drying — linear is the metaphor here
          // prefers-reduced-motion handled below
          transition: active ? 'width 2000ms linear' : 'none',
        }}
      />
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .wet-ink-fill { transition: none !important; }
        }
      `}</style>
    </div>
  );
}

// ── FILE TYPE BADGE ───────────────────────────────────────────────────────────
function FileTypeBadge({ type }: { type: 'PDF' | 'DOCX' | 'TXT' }) {
  const color = type === 'PDF' ? C.solidarityRed : type === 'DOCX' ? C.metalBlue : C.stencilYellow;
  return (
    <span style={{
      fontFamily:   F.mono,
      fontWeight:   800,
      fontSize:     '8px',
      letterSpacing:'0.10em',
      textTransform:'uppercase' as const,
      color:        color,
      background:   C.surface3,
      padding:      '3px 10px',
      borderRadius: S.shard,
      border:       `1px solid ${color}`,
    }}>
      {type}
    </span>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function Ingestion() {
  const navigate = useNavigate();

  const [dropState, setDropState]   = useState<DropState>('idle');
  const [inputMode, setInputMode]   = useState<InputMode>('upload');
  const [fileName, setFileName]     = useState('');
  const [fileType, setFileType]     = useState<'PDF' | 'DOCX' | 'TXT'>('PDF');
  const [pasteContent, setPasteContent] = useState('');
  const [currentStage, setCurrentStage] = useState<ProcessingStage>('PARSING DOCUMENT');
  const [result, setResult]         = useState<IngestionResult | null>(null);
  const stageTimerRef               = useRef<ReturnType<typeof setInterval> | null>(null);

  // Trigger processing sequence
  const startProcessing = useCallback((name: string, type: 'PDF' | 'DOCX' | 'TXT') => {
    setFileName(name);
    setFileType(type);
    setCurrentStage('PARSING DOCUMENT');
    setDropState('processing');

    let stageIndex = 0;
    stageTimerRef.current = setInterval(() => {
      stageIndex++;
      if (stageIndex < PROCESSING_STAGES.length) {
        setCurrentStage(PROCESSING_STAGES[stageIndex]);
      } else {
        if (stageTimerRef.current) clearInterval(stageTimerRef.current);
        setResult({
          filename:         name,
          file_type:        type,
          page_count:       2,
          extracted_skills: ['Case Management', 'Risk Assessment', 'Trauma-Informed Care', 'Crisis Intervention', 'Report Writing', 'Stakeholder Engagement', 'Cultural Safety', 'NDIS Knowledge'],
          raw_text:         '',
          status:           'complete',
        });
        setDropState('complete');
      }
    }, 700);
  }, []);

  useEffect(() => {
    return () => { if (stageTimerRef.current) clearInterval(stageTimerRef.current); };
  }, []);

  // ── DROP SLAM SEQUENCE ───────────────────────────────────────────────────
  // 1. Drag over → 'dragover'
  // 2. File drop → 'slam' (brief physical impact)
  // 3. After 300ms → 'processing'

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (dropState === 'idle') setDropState('dragover');
  }, [dropState]);

  const handleDragLeave = useCallback(() => {
    if (dropState === 'dragover') setDropState('idle');
  }, [dropState]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) { setDropState('idle'); return; }

    const type = getFileType(file.name);
    // Slam — absorb the weight of the document
    setDropState('slam');
    setTimeout(() => startProcessing(file.name, type), 300);
  }, [startProcessing]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = getFileType(file.name);
    setDropState('slam');
    setTimeout(() => startProcessing(file.name, type), 300);
  }, [startProcessing]);

  const handlePasteSubmit = useCallback(() => {
    if (!pasteContent.trim()) return;
    startProcessing('Pasted Resume Content.txt', 'TXT');
  }, [pasteContent, startProcessing]);

  const handleReset = useCallback(() => {
    if (stageTimerRef.current) clearInterval(stageTimerRef.current);
    setDropState('idle');
    setFileName('');
    setPasteContent('');
    setResult(null);
    setCurrentStage('PARSING DOCUMENT');
  }, []);

  // ── DERIVE DROP ZONE ANIMATION ────────────────────────────────────────────
  const dropScale = dropState === 'dragover' ? 1.02 : dropState === 'slam' ? 0.98 : 1;
  const dropY     = dropState === 'dragover' ? -4    : dropState === 'slam' ? 2    : 0;
  const dropTransition = dropState === 'dragover'
    ? { duration: 0.15, ease: M3 }   // M3 overshoot on drag-in
    : { duration: 0.30, ease: PRECISE }; // Precise rebound on slam resolve

  // Border changes outside motion — instant on slam (ink impact)
  const getBorderStyle = (): string => {
    if (dropState === 'dragover')   return `2px solid ${C.solidarityRed}`;
    if (dropState === 'slam')       return `2px solid ${C.inkGold}`;
    if (dropState === 'processing') return `2px solid ${C.inkGold}`;
    return `2px dashed ${C.surface4}`;
  };

  const getDropLabel = (): string =>
    dropState === 'dragover' ? 'RELEASE TO LOAD' : 'DROP YOUR RESUME HERE';

  const dropLabelColor = dropState === 'dragover' ? C.solidarityRed : C.workerAsh;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: C.canvas, fontOpticalSizing: 'auto' as any }}
    >
      {/* Wheat-paste grain substrate */}
      <div className="fixed inset-0 -z-10 noise-texture" style={{ background: C.canvas }} />

      <div className="relative z-10 max-w-[680px] mx-auto px-6 md:px-12 pt-12 md:pt-20 pb-16">

        {/* ═════════════════════════════════════════
            HEADER — INGESTION ENGINE
            ═════════════════════════════════════════ */}
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
            color:        C.workerAshDim,
            margin:       '0 0 10px',
          }}>
            INGESTION ENGINE // AWAITING UPLOAD
          </p>

          {/* Hero — "FEED THE" in workerAsh, "ENGINE" in solidarityRed */}
          <h1 style={{
            fontFamily:            F.display,
            fontVariationSettings: "'wght' 900, 'SOFT' 0, 'WONK' 0",
            fontSize:              'clamp(2.5rem, 7vw, 4.5rem)',
            lineHeight:             0.93,
            letterSpacing:         '-0.02em',
            textTransform:         'uppercase' as const,
            color:                 C.workerAsh,
            margin:                '0 0 8px',
            // flat stencil shadow — zero blur
            textShadow:            `3px 3px 0px ${C.surface3}`,
          }}>
            FEED THE{' '}
            <span style={{ color: C.solidarityRed }}>ENGINE</span>
          </h1>

          <p style={{
            fontFamily:            F.primary,
            fontVariationSettings: "'wght' 475",
            fontSize:              '14px',
            color:                 C.workerAsh,
            opacity:               0.5,
            lineHeight:             1.6,
            margin:                0,
          }}>
            Upload your resume and we'll extract skills, experience, and certifications
            to power your ATS matching.
          </p>
        </motion.div>

        {/* ═════════════════════════════════════════
            MODE TABS — flat underline style
            Active: 2px solid inkGold border-bottom
            ═════════════════════════════════════════ */}
        <AnimatePresence>
          {dropState === 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: PRECISE }}
            >
              <div
                className="flex gap-0 mb-6"
                style={{ borderBottom: `1px solid ${C.surface3}` }}
              >
                {([
                  { mode: 'upload' as InputMode, label: 'UPLOAD FILE' },
                  { mode: 'paste'  as InputMode, label: 'PASTE TEXT' },
                ]).map((tab) => {
                  const isActive = inputMode === tab.mode;
                  return (
                    <button
                      key={tab.mode}
                      onClick={() => setInputMode(tab.mode)}
                      style={{
                        fontFamily:   F.mono,
                        fontWeight:   isActive ? 700 : 100,
                        fontSize:     '10px',
                        letterSpacing:'0.08em',
                        textTransform:'uppercase' as const,
                        color:        isActive ? C.inkGold : C.workerAshDim,
                        background:   'transparent',
                        border:       'none',
                        // Flat tab — only bottom border distinguishes active
                        borderBottom: isActive ? `2px solid ${C.inkGold}` : '2px solid transparent',
                        padding:      '10px 20px 10px 0',
                        cursor:       'pointer',
                        marginBottom: '-1px',
                        transition:   `color 180ms ${PRECISE}, border-color 180ms ${PRECISE}`,
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* ── UPLOAD FILE MODE ────────────────────────────── */}
              {inputMode === 'upload' && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease: PRECISE }}
                >
                  <motion.div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-input')?.click()}
                    animate={{ scale: dropScale, y: dropY }}
                    transition={dropTransition}
                    className="relative noise-texture overflow-hidden cursor-pointer"
                    style={{
                      borderRadius: S.dropZone,
                      border:       getBorderStyle(),
                      padding:      '56px 32px',
                      textAlign:    'center' as const,
                      background:   C.surface1,
                    }}
                  >
                    <input
                      id="file-input"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />

                    {/* Upload icon — workerAsh idle, solidarityRed on drag-over */}
                    <div className="mb-5" style={{ display: 'flex', justifyContent: 'center' }}>
                      <Upload
                        size={44}
                        strokeWidth={1.5}
                        style={{
                          color:      dropState === 'dragover' ? C.solidarityRed : C.workerAshMuted,
                          transition: `color 150ms`,
                        }}
                      />
                    </div>

                    {/* Drop label — changes on drag-over */}
                    <p style={{
                      fontFamily:   F.mono,
                      fontWeight:   700,
                      fontSize:     '16px',
                      letterSpacing:'0.06em',
                      textTransform:'uppercase' as const,
                      color:        dropLabelColor,
                      margin:       '0 0 8px',
                      transition:   `color 150ms`,
                    }}>
                      {getDropLabel()}
                    </p>

                    <p style={{
                      fontFamily:   F.mono,
                      fontWeight:   100,
                      fontSize:     '10px',
                      letterSpacing:'0.06em',
                      color:        C.workerAshDim,
                      margin:       '0 0 24px',
                    }}>
                      PDF, DOCX, or TXT — Max 10MB
                    </p>

                    {/* Strike CTA — blockRiot03, solidarityRed */}
                    <span style={{
                      fontFamily:   F.mono,
                      fontWeight:   900,
                      fontSize:     '11px',
                      letterSpacing:'0.08em',
                      textTransform:'uppercase' as const,
                      color:        C.canvas,
                      background:   C.solidarityRed,
                      padding:      '10px 24px',
                      borderRadius: S.strike,
                      display:      'inline-flex',
                      alignItems:   'center',
                      gap:          '8px',
                      // flat ink offset — zero blur
                      boxShadow:    `3px 3px 0px ${C.surface4}`,
                    }}>
                      <Plus size={12} strokeWidth={2.5} />
                      OR BROWSE FILES
                    </span>
                  </motion.div>
                </motion.div>
              )}

              {/* ── PASTE TEXT MODE ─────────────────────────────── */}
              {inputMode === 'paste' && (
                <motion.div
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease: PRECISE }}
                >
                  <div style={{ position: 'relative' }}>
                    <textarea
                      value={pasteContent}
                      onChange={(e) => setPasteContent(e.target.value.slice(0, 8000))}
                      rows={12}
                      maxLength={8000}
                      placeholder="PASTE YOUR RESUME TEXT HERE. PLAIN TEXT ONLY. NO FORMATTING."
                      style={{
                        fontFamily:    F.mono,
                        fontWeight:    300,
                        fontSize:      '13px',
                        lineHeight:     1.6,
                        letterSpacing: '0.02em',
                        color:         C.workerAsh,
                        background:    C.surface2,
                        // border-radius: 0 — raw structural textarea
                        borderRadius:  'var(--sys-shape-radius-none)',
                        border:        `1px solid ${C.surface4}`,
                        padding:       '16px',
                        width:         '100%',
                        outline:       'none',
                        resize:        'vertical' as const,
                        boxSizing:     'border-box' as const,
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = `var(--sys-color-inkGold-base)`;
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = `var(--sys-color-charcoalBackground-steps-4)`;
                      }}
                    />
                    {/* Character counter — mono xs, bottom-right */}
                    <p style={{
                      fontFamily:   F.mono,
                      fontWeight:   100,
                      fontSize:     '9px',
                      letterSpacing:'0.06em',
                      color:        C.workerAshDim,
                      textAlign:    'right' as const,
                      margin:       '4px 0 0',
                    }}>
                      {pasteContent.length} / 8000
                    </p>
                  </div>

                  {/* Strike CTA: PROCESS TEXT */}
                  <motion.button
                    onClick={handlePasteSubmit}
                    disabled={!pasteContent.trim()}
                    whileHover={{ scale: pasteContent.trim() ? 1.02 : 1 }}
                    whileTap={{ scale: pasteContent.trim() ? 0.97 : 1 }}
                    transition={{ duration: 0.28, ease: M3 }}
                    className="mt-6 flex items-center gap-2 cursor-pointer"
                    style={{
                      background:   pasteContent.trim() ? C.inkGold : C.surface3,
                      color:        pasteContent.trim() ? C.canvas : C.workerAshDim,
                      fontFamily:   F.mono,
                      fontWeight:   900,
                      fontSize:     '12px',
                      letterSpacing:'0.08em',
                      textTransform:'uppercase' as const,
                      padding:      '14px 28px',
                      borderRadius: S.strike,
                      border:       'none',
                      // flat ink offset — zero blur
                      boxShadow:    pasteContent.trim() ? `3px 3px 0px ${C.surface4}` : 'none',
                      cursor:       pasteContent.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    PROCESS TEXT
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═════════════════════════════════════════
            WET INK PROCESSING STATE
            Horizontal bar, 0→100%, inkGold fill.
            No spinner. No shimmer. Ink drying.
            ═════════════════════════════════════════ */}
        <AnimatePresence>
          {dropState === 'processing' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: PRECISE }}
              style={{
                background:   C.surface1,
                borderRadius: S.dropZone,
                border:       `1px solid ${C.surface3}`,
                padding:      '32px',
              }}
            >
              {/* Filename */}
              <p style={{
                fontFamily:   F.mono,
                fontWeight:   700,
                fontSize:     '12px',
                letterSpacing:'0.06em',
                textTransform:'uppercase' as const,
                color:        C.inkGold,
                margin:       '0 0 20px',
                // flat ink shadow
                textShadow:   `2px 2px 0px ${C.surface3}`,
              }}>
                {fileName}
              </p>

              {/* Wet Ink bar — 0→100%, inkGold, 2000ms linear (ink drying) */}
              <WetInkBar active={dropState === 'processing'} />

              {/* Stage label — cycling, mono xs, below bar */}
              <motion.p
                key={currentStage}
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18, ease: PRECISE }}
                style={{
                  fontFamily:   F.mono,
                  fontWeight:   100,
                  fontSize:     '9px',
                  letterSpacing:'0.12em',
                  textTransform:'uppercase' as const,
                  color:        C.workerAshMuted,
                  margin:       '10px 0 0',
                }}
              >
                {currentStage}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═════════════════════════════════════════
            COMPLETE STATE — Placard document preview
            screenCard01 shape, inkGold left border.
            Strike CTA → /analysis
            ═════════════════════════════════════════ */}
        <AnimatePresence>
          {dropState === 'complete' && result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: PRECISE }}
            >
              {/* Placard — screenCard01 (2px 8px 8px 2px), inkGold left border */}
              <div style={{
                background:   C.surface1,
                borderRadius: S.placardCard,
                borderLeft:   `3px solid ${C.inkGold}`,
                borderTop:    `1px solid ${C.surface3}`,
                borderRight:  `1px solid ${C.surface3}`,
                borderBottom: `1px solid ${C.surface3}`,
                padding:      '24px 24px 24px 20px',
                // flat shadow — zero blur
                boxShadow:    `3px 3px 0px ${C.surface4}`,
                marginBottom: '16px',
              }}>
                {/* Document icon row */}
                <div className="flex items-start gap-4">
                  <div style={{
                    background:   C.surface2,
                    borderRadius: 'var(--sys-shape-radius-xs)',
                    padding:      '12px',
                    flexShrink:   0,
                  }}>
                    <FileText size={24} style={{ color: C.inkGold }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Filename */}
                    <p style={{
                      fontFamily:   F.proclamation,
                      fontWeight:   700,
                      fontSize:     '15px',
                      color:        C.workerAsh,
                      margin:       '0 0 6px',
                      // truncate long filenames
                      overflow:     'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace:   'nowrap' as const,
                    }}>
                      {result.filename}
                    </p>

                    {/* Badges row — file type + page count */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <FileTypeBadge type={result.file_type} />
                      <span style={{
                        fontFamily:   F.mono,
                        fontWeight:   100,
                        fontSize:     '9px',
                        letterSpacing:'0.08em',
                        textTransform:'uppercase' as const,
                        color:        C.workerAshDim,
                      }}>
                        {result.page_count} {result.page_count === 1 ? 'PAGE' : 'PAGES'}
                      </span>
                      <span style={{
                        fontFamily:   F.mono,
                        fontWeight:   700,
                        fontSize:     '9px',
                        letterSpacing:'0.06em',
                        color:        C.activistGreen,
                      }}>
                        {result.extracted_skills.length} SKILLS EXTRACTED
                      </span>
                    </div>
                  </div>
                </div>

                {/* inkGold divider */}
                <div style={{ height: '1px', background: C.surface3, margin: '16px 0' }} />

                {/* Extracted skills preview */}
                <div className="flex flex-wrap gap-2">
                  {result.extracted_skills.slice(0, 5).map((skill) => (
                    <span key={skill} style={{
                      fontFamily:   F.mono,
                      fontWeight:   700,
                      fontSize:     '8px',
                      letterSpacing:'0.06em',
                      textTransform:'uppercase' as const,
                      color:        C.activistGreen,
                      background:   C.surface2,
                      padding:      '3px 10px',
                      borderRadius: S.chip,
                      border:       `1px solid ${C.activistGreen}`,
                    }}>
                      {skill}
                    </span>
                  ))}
                  {result.extracted_skills.length > 5 && (
                    <span style={{
                      fontFamily:   F.mono,
                      fontWeight:   100,
                      fontSize:     '8px',
                      letterSpacing:'0.06em',
                      color:        C.workerAshDim,
                      padding:      '3px 0',
                    }}>
                      +{result.extracted_skills.length - 5} MORE
                    </span>
                  )}
                </div>
              </div>

              {/* CTA row */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Reset — ghost */}
                <button
                  onClick={handleReset}
                  style={{
                    fontFamily:   F.mono,
                    fontWeight:   700,
                    fontSize:     '10px',
                    letterSpacing:'0.08em',
                    textTransform:'uppercase' as const,
                    color:        C.workerAshDim,
                    background:   'transparent',
                    border:       `1px solid ${C.surface4}`,
                    padding:      '12px 20px',
                    borderRadius: S.chip,
                    cursor:       'pointer',
                  }}
                >
                  UPLOAD ANOTHER
                </button>

                {/* Strike CTA — PROCEED TO ANALYSIS → blockRiot03 */}
                <motion.button
                  onClick={() => navigate('/analysis')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.28, ease: M3 }}
                  className="flex items-center gap-2 cursor-pointer"
                  style={{
                    background:   C.solidarityRed,
                    color:        C.canvas,
                    fontFamily:   F.mono,
                    fontWeight:   900,
                    fontSize:     '13px',
                    letterSpacing:'0.08em',
                    textTransform:'uppercase' as const,
                    padding:      '16px 32px',
                    borderRadius: S.strike,
                    border:       'none',
                    // flat ink offset — zero blur
                    boxShadow:    `4px 4px 0px ${C.surface4}`,
                  }}
                >
                  PROCEED TO ANALYSIS
                  <ArrowRight size={16} strokeWidth={2.5} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═════════════════════════════════════════
            FOOTER TAGLINE
            ═════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: PRECISE }}
          className="mt-16 text-center"
          style={{ borderTop: `1px solid ${C.surface3}`, paddingTop: '24px' }}
        >
          <p style={{
            fontFamily: F.curator,
            fontWeight: 400,
            fontSize:   '18px',
            fontStyle:  'italic',
            color:      C.smokeOrange,
            opacity:    0.65,
            margin:     0,
          }}>
            your experience is the ammunition
          </p>
        </motion.div>

      </div>
    </div>
  );
}
