import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, FileText, CheckCircle2, AlertTriangle, Zap, ArrowRight,
  Loader2, X, Eye, Sparkles,
} from 'lucide-react';

// ============================================================================
// INGESTION — KERALA RAGE / SOLIDARITY MODE
// Resume / document upload + parsing. Wheat-paste upload zone.
// Skills extraction preview. Solidarity Red urgency on parsing state.
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
};

const M3_EXPRESSIVE = [0.34, 1.56, 0.64, 1] as const;
const SPRING_SLAM = { duration: 0.6, ease: M3_EXPRESSIVE };
const SPRING_SETTLE = { duration: 0.8, ease: M3_EXPRESSIVE };

type IngestionStatus = 'idle' | 'uploading' | 'parsing' | 'extracting' | 'complete';

interface ExtractedData {
  skills: string[];
  experience: { role: string; org: string; years: string }[];
  education: { degree: string; institution: string }[];
  certifications: string[];
  summary: string;
}

const MOCK_EXTRACTION: ExtractedData = {
  skills: [
    'Case Management', 'Risk Assessment', 'Crisis Intervention',
    'Trauma-Informed Care', 'Family Mediation', 'Report Writing',
    'Stakeholder Engagement', 'Group Facilitation', 'NDIS Knowledge',
    'Cultural Safety', 'Court Support', 'Intake & Assessment',
  ],
  experience: [
    { role: 'Senior Case Manager', org: 'Berry Street', years: '2021–Present' },
    { role: 'Family Violence Practitioner', org: 'Safe Steps', years: '2019–2021' },
    { role: 'Youth Outreach Worker', org: 'Anglicare', years: '2017–2019' },
  ],
  education: [
    { degree: 'Master of Social Work', institution: 'University of Melbourne' },
    { degree: 'Bachelor of Psychology', institution: 'Monash University' },
  ],
  certifications: [
    'Working With Children Check',
    'Mental Health First Aid',
    'MARAM Framework Training',
    'Cert IV in AOD',
  ],
  summary: 'Experienced social worker with 7+ years across family violence prevention, youth outreach, and case management in metropolitan Melbourne. Strong advocate for trauma-informed practice and cultural competency.',
};

const STATUS_LABELS: Record<IngestionStatus, string> = {
  idle: 'AWAITING UPLOAD',
  uploading: 'UPLOADING DOCUMENT',
  parsing: 'PARSING STRUCTURE',
  extracting: 'EXTRACTING INTELLIGENCE',
  complete: 'INGESTION COMPLETE',
};

const STATUS_COLORS: Record<IngestionStatus, string> = {
  idle: COLORS.workerAshMuted,
  uploading: COLORS.smokeOrange,
  parsing: COLORS.solidarityRed,
  extracting: COLORS.stencilYellow,
  complete: COLORS.activistGreen,
};

export function Ingestion() {
  const [status, setStatus] = useState<IngestionStatus>('idle');
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const simulateIngestion = useCallback((name: string) => {
    setFileName(name);
    setStatus('uploading');
    setTimeout(() => setStatus('parsing'), 1200);
    setTimeout(() => setStatus('extracting'), 2800);
    setTimeout(() => {
      setStatus('complete');
      setExtractedData(MOCK_EXTRACTION);
    }, 4500);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      simulateIngestion(file.name);
    }
  }, [simulateIngestion]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateIngestion(file.name);
    }
  }, [simulateIngestion]);

  const handlePasteSubmit = () => {
    if (pasteContent.trim()) {
      simulateIngestion('Pasted Resume Content');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setFileName('');
    setExtractedData(null);
    setPasteContent('');
    setPasteMode(false);
  };

  const handleContinue = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: COLORS.canvas }}>
      <div className="fixed inset-0 mesh-gradient noise-texture pointer-events-none" style={{ background: COLORS.canvas }} />

      <div className="relative z-10 max-w-3xl mx-auto p-6 md:p-12 pt-12 md:pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING_SLAM}
          className="mb-8"
        >
          <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: STATUS_COLORS[status], marginBottom: '12px' }}>
            INGESTION ENGINE // {STATUS_LABELS[status]}
          </p>
          <h1
            style={{
              fontFamily: FONTS.display,
              fontVariationSettings: "'wght' 800, 'wdth' 120",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              color: COLORS.workerAsh,
              marginBottom: '8px',
            }}
          >
            FEED THE <span style={{ color: COLORS.solidarityRed }}>ENGINE</span>
          </h1>
          <p style={{ fontFamily: FONTS.primary, fontVariationSettings: "'wght' 475, 'wdth' 98", fontSize: '15px', color: COLORS.workerAsh, opacity: 0.5, lineHeight: 1.6 }}>
            Upload your resume and we'll extract skills, experience, and certifications to power your ATS matching.
          </p>
        </motion.div>

        {/* Status indicator bar */}
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="mb-6 p-4 flex items-center gap-4"
            style={{
              background: `${STATUS_COLORS[status]}10`,
              borderRadius: SHAPES.pebble,
              border: `1px solid ${STATUS_COLORS[status]}30`,
              transformOrigin: 'left',
            }}
          >
            {status === 'complete' ? (
              <CheckCircle2 size={20} style={{ color: STATUS_COLORS[status] }} />
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 size={20} style={{ color: STATUS_COLORS[status] }} />
              </motion.div>
            )}
            <div className="flex-1">
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em', color: STATUS_COLORS[status] }}>
                {STATUS_LABELS[status]}
              </p>
              <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted }}>
                {fileName}
              </p>
            </div>
            {status === 'complete' && (
              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                className="cursor-pointer"
                style={{ background: 'none', border: 'none', color: COLORS.workerAshMuted }}
              >
                <X size={18} />
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Upload Zone (hidden after ingestion starts) */}
        <AnimatePresence>
          {status === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={SPRING_SETTLE}
            >
              {/* Mode toggle */}
              <div className="flex gap-2 mb-4">
                {[
                  { mode: false, label: 'UPLOAD FILE' },
                  { mode: true, label: 'PASTE TEXT' },
                ].map((m) => (
                  <motion.button
                    key={m.label}
                    onClick={() => setPasteMode(m.mode)}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                    className="cursor-pointer"
                    style={{
                      fontFamily: FONTS.mono,
                      fontWeight: 700,
                      fontSize: '10px',
                      letterSpacing: '0.06em',
                      color: pasteMode === m.mode ? COLORS.canvas : COLORS.workerAshMuted,
                      background: pasteMode === m.mode ? COLORS.inkGold : COLORS.surface2,
                      padding: '8px 20px',
                      borderRadius: SHAPES.pebble,
                      border: `1px solid ${pasteMode === m.mode ? COLORS.inkGold : COLORS.surface4}`,
                    }}
                  >
                    {m.label}
                  </motion.button>
                ))}
              </div>

              {!pasteMode ? (
                /* Drop zone */
                <motion.div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  animate={{
                    borderColor: dragOver ? COLORS.solidarityRed : COLORS.surface4,
                    background: dragOver ? `${COLORS.solidarityRed}08` : COLORS.surface1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative noise-texture overflow-hidden cursor-pointer"
                  style={{
                    borderRadius: SHAPES.pebble,
                    border: `2px dashed ${COLORS.surface4}`,
                    padding: '48px 32px',
                    textAlign: 'center' as const,
                  }}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <motion.div
                    animate={{ y: dragOver ? -8 : 0, scale: dragOver ? 1.1 : 1 }}
                    transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                    className="mb-4"
                  >
                    <Upload size={48} style={{ color: dragOver ? COLORS.solidarityRed : COLORS.surface5, margin: '0 auto' }} />
                  </motion.div>
                  <p
                    style={{
                      fontFamily: FONTS.display,
                      fontVariationSettings: "'wght' 700, 'wdth' 110",
                      fontSize: '20px',
                      textTransform: 'uppercase',
                      color: COLORS.workerAsh,
                      marginBottom: '8px',
                    }}
                  >
                    DROP YOUR RESUME HERE
                  </p>
                  <p style={{ fontFamily: FONTS.mono, fontSize: '11px', color: COLORS.workerAshMuted, marginBottom: '16px' }}>
                    PDF, DOCX, or TXT — Max 10MB
                  </p>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                    style={{
                      fontFamily: FONTS.mono,
                      fontWeight: 700,
                      fontSize: '11px',
                      letterSpacing: '0.06em',
                      color: COLORS.solidarityRed,
                      background: `${COLORS.solidarityRed}12`,
                      padding: '8px 20px',
                      borderRadius: SHAPES.pebble,
                      border: `1px solid ${COLORS.solidarityRed}30`,
                      display: 'inline-block',
                    }}
                  >
                    OR BROWSE FILES
                  </motion.span>
                </motion.div>
              ) : (
                /* Paste zone */
                <div
                  className="noise-texture relative overflow-hidden"
                  style={{
                    background: COLORS.surface1,
                    borderRadius: SHAPES.pebble,
                    border: `1px solid ${COLORS.surface3}`,
                    padding: '24px',
                  }}
                >
                  <label style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: focusedField === 'paste' ? COLORS.inkGold : COLORS.workerAshMuted, display: 'block', marginBottom: '8px' }}>
                    PASTE RESUME CONTENT
                  </label>
                  <textarea
                    value={pasteContent}
                    onChange={(e) => setPasteContent(e.target.value)}
                    onFocus={() => setFocusedField('paste')}
                    onBlur={() => setFocusedField(null)}
                    rows={10}
                    placeholder="Paste your resume text here..."
                    style={{
                      fontFamily: FONTS.primary,
                      fontVariationSettings: "'wght' 400",
                      fontSize: '14px',
                      color: COLORS.workerAsh,
                      background: COLORS.surface2,
                      border: focusedField === 'paste' ? `2px solid ${COLORS.inkGold}` : `1px solid ${COLORS.surface4}`,
                      borderRadius: SHAPES.pebble,
                      padding: '16px',
                      width: '100%',
                      outline: 'none',
                      resize: 'vertical' as const,
                      lineHeight: 1.6,
                      boxShadow: focusedField === 'paste' ? `0 0 12px ${COLORS.inkGold}22` : 'none',
                    }}
                  />
                  <motion.button
                    onClick={handlePasteSubmit}
                    disabled={!pasteContent.trim()}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                    className="mt-4 flex items-center gap-2 cursor-pointer"
                    style={{
                      background: pasteContent.trim() ? COLORS.solidarityRed : COLORS.surface3,
                      color: COLORS.canvas,
                      fontFamily: FONTS.primary,
                      fontVariationSettings: "'wght' 800",
                      fontSize: '13px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      padding: '14px 28px',
                      borderRadius: SHAPES.pebble,
                      border: 'none',
                      boxShadow: pasteContent.trim() ? `0 0 20px ${COLORS.solidarityRed}44` : 'none',
                    }}
                  >
                    <Zap size={16} />
                    BEGIN INGESTION
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Parsing Animation */}
        <AnimatePresence>
          {(status === 'uploading' || status === 'parsing' || status === 'extracting') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={SPRING_SETTLE}
              className="noise-texture relative overflow-hidden"
              style={{
                background: COLORS.surface1,
                borderRadius: SHAPES.pebble,
                border: `1px solid ${COLORS.surface3}`,
                padding: '48px 32px',
                textAlign: 'center' as const,
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: STATUS_COLORS[status] }} />

              {/* Scanning animation */}
              <motion.div
                className="mx-auto mb-6"
                style={{
                  width: '80px',
                  height: '100px',
                  background: COLORS.surface2,
                  borderRadius: SHAPES.pebble,
                  border: `1px solid ${COLORS.surface4}`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <FileText size={32} style={{ color: COLORS.surface5, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                <motion.div
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: STATUS_COLORS[status],
                    boxShadow: `0 0 12px ${STATUS_COLORS[status]}`,
                  }}
                />
              </motion.div>

              <p
                style={{
                  fontFamily: FONTS.display,
                  fontVariationSettings: "'wght' 800",
                  fontSize: '24px',
                  color: STATUS_COLORS[status],
                  marginBottom: '8px',
                  textShadow: `0 0 20px ${STATUS_COLORS[status]}44`,
                }}
              >
                {status === 'uploading' && 'UPLOADING...'}
                {status === 'parsing' && 'PARSING STRUCTURE...'}
                {status === 'extracting' && 'EXTRACTING INTELLIGENCE...'}
              </p>
              <p style={{ fontFamily: FONTS.mono, fontSize: '11px', color: COLORS.workerAshMuted }}>
                {fileName}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Extraction Results */}
        <AnimatePresence>
          {status === 'complete' && extractedData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING_SETTLE}
              className="space-y-4"
            >
              {/* Summary */}
              <div
                className="noise-texture relative overflow-hidden p-6"
                style={{
                  background: COLORS.surface1,
                  borderRadius: SHAPES.pebble,
                  border: `1px solid ${COLORS.surface3}`,
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: COLORS.activistGreen }} />
                <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.activistGreen, marginBottom: '12px' }}>
                  EXTRACTED SUMMARY
                </p>
                <p
                  style={{
                    fontFamily: FONTS.proclamation,
                    fontWeight: 700,
                    fontSize: '16px',
                    color: COLORS.workerAsh,
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                  }}
                >
                  "{extractedData.summary}"
                </p>
              </div>

              {/* Skills */}
              <div
                className="noise-texture relative overflow-hidden p-6"
                style={{
                  background: COLORS.surface1,
                  borderRadius: SHAPES.pebble,
                  border: `1px solid ${COLORS.surface3}`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.signalGreen }}>
                    EXTRACTED SKILLS ({extractedData.skills.length})
                  </p>
                  <Sparkles size={16} style={{ color: COLORS.signalGreen }} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {extractedData.skills.map((skill, i) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ ...SPRING_SLAM, delay: i * 0.05 }}
                      style={{
                        fontFamily: FONTS.mono,
                        fontWeight: 700,
                        fontSize: '10px',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        color: COLORS.signalGreen,
                        background: `${COLORS.signalGreen}12`,
                        padding: '6px 14px',
                        borderRadius: SHAPES.pebble,
                        border: `1px solid ${COLORS.signalGreen}30`,
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div
                className="noise-texture relative overflow-hidden p-6"
                style={{
                  background: COLORS.surface1,
                  borderRadius: SHAPES.pebble,
                  border: `1px solid ${COLORS.surface3}`,
                }}
              >
                <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.inkGold, marginBottom: '12px' }}>
                  WORK EXPERIENCE ({extractedData.experience.length})
                </p>
                <div className="space-y-4">
                  {extractedData.experience.map((exp, i) => (
                    <motion.div
                      key={exp.role}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...SPRING_SLAM, delay: 0.1 + i * 0.1 }}
                      className="flex items-start gap-4 p-4"
                      style={{
                        background: COLORS.surface2,
                        borderRadius: SHAPES.pebble,
                        border: `1px solid ${COLORS.surface4}`,
                      }}
                    >
                      <div className="w-1 self-stretch flex-shrink-0" style={{ background: COLORS.inkGold, borderRadius: '2px' }} />
                      <div className="flex-1">
                        <p style={{ fontFamily: FONTS.proclamation, fontWeight: 700, fontSize: '15px', color: COLORS.workerAsh, marginBottom: '2px' }}>
                          {exp.role}
                        </p>
                        <p style={{ fontFamily: FONTS.mono, fontSize: '11px', color: COLORS.workerAshMuted, letterSpacing: '0.04em' }}>
                          {exp.org}
                        </p>
                      </div>
                      <span style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', color: COLORS.smokeOrange, letterSpacing: '0.04em', flexShrink: 0 }}>
                        {exp.years}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Education + Certifications side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="noise-texture relative overflow-hidden p-6"
                  style={{
                    background: COLORS.surface1,
                    borderRadius: SHAPES.pebble,
                    border: `1px solid ${COLORS.surface3}`,
                  }}
                >
                  <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.metalBlue, marginBottom: '12px' }}>
                    EDUCATION
                  </p>
                  {extractedData.education.map((edu) => (
                    <div key={edu.degree} className="mb-3 last:mb-0">
                      <p style={{ fontFamily: FONTS.primary, fontVariationSettings: "'wght' 700", fontSize: '13px', color: COLORS.workerAsh }}>
                        {edu.degree}
                      </p>
                      <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted }}>
                        {edu.institution}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  className="noise-texture relative overflow-hidden p-6"
                  style={{
                    background: COLORS.surface1,
                    borderRadius: SHAPES.pebble,
                    border: `1px solid ${COLORS.surface3}`,
                  }}
                >
                  <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.stencilYellow, marginBottom: '12px' }}>
                    CERTIFICATIONS
                  </p>
                  {extractedData.certifications.map((cert) => (
                    <div
                      key={cert}
                      className="flex items-center gap-2 mb-2 last:mb-0"
                    >
                      <CheckCircle2 size={14} style={{ color: COLORS.stencilYellow, flexShrink: 0 }} />
                      <p style={{ fontFamily: FONTS.primary, fontVariationSettings: "'wght' 500", fontSize: '13px', color: COLORS.workerAsh }}>
                        {cert}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue CTA */}
              <div className="flex items-center justify-between pt-4">
                <motion.button
                  onClick={handleReset}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  className="flex items-center gap-2 cursor-pointer"
                  style={{
                    background: 'transparent',
                    color: COLORS.workerAshMuted,
                    fontFamily: FONTS.mono,
                    fontWeight: 700,
                    fontSize: '11px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '12px 20px',
                    borderRadius: SHAPES.pebble,
                    border: `1px solid ${COLORS.surface4}`,
                  }}
                >
                  UPLOAD ANOTHER
                </motion.button>

                <motion.button
                  onClick={handleContinue}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  className="flex items-center gap-2 cursor-pointer"
                  style={{
                    background: COLORS.solidarityRed,
                    color: COLORS.canvas,
                    fontFamily: FONTS.primary,
                    fontVariationSettings: "'wght' 800",
                    fontSize: '14px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    padding: '16px 32px',
                    borderRadius: SHAPES.pebble,
                    border: 'none',
                    boxShadow: `0 0 24px ${COLORS.solidarityRed}44`,
                  }}
                >
                  ENTER THE COLLECTIVE
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Curator annotation */}
        <motion.p
          initial={{ opacity: 0, rotate: -4 }}
          animate={{ opacity: 0.3, rotate: -2 }}
          transition={{ ...SPRING_SETTLE, delay: 0.6 }}
          className="mt-8 text-center pointer-events-none"
          style={{
            fontFamily: FONTS.curator,
            fontSize: '16px',
            color: COLORS.stencilYellow,
            textShadow: `0 0 16px ${COLORS.stencilYellow}30`,
          }}
        >
          your experience is the ammunition
        </motion.p>
      </div>
    </div>
  );
}