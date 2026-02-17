import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Copy, Check, Zap, RotateCcw, FileText, Loader2 } from 'lucide-react';

// ============================================================================
// KSC GENERATOR / STUDIO — KERALA RAGE / SOLIDARITY MODE — "THE WORKSHOP"
// AI-powered KSC response generator. Paste criteria, generate response.
// Charcoal surfaces, Solidarity Red CTA, inkGold outputs.
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

const EXAMPLE_CRITERIA = [
  {
    label: 'Family Violence',
    text: 'Demonstrated experience in providing crisis intervention and safety planning for individuals and families experiencing family violence, including knowledge of the MARAM framework.',
  },
  {
    label: 'Case Management',
    text: 'Proven ability to manage complex caseloads, including intake assessment, care coordination, and outcome reporting within a community services context.',
  },
  {
    label: 'Stakeholder Engagement',
    text: 'Experience in building and maintaining productive relationships with key stakeholders including government agencies, community organisations, and client advocacy groups.',
  },
];

export function KSCGenerator() {
  const [criteria, setCriteria] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!criteria.trim()) return;
    setLoading(true);
    setResponse('');

    setTimeout(() => {
      const generated = `I bring over seven years of dedicated experience in social work practice across metropolitan Melbourne, with a demonstrated commitment to trauma-informed, culturally responsive service delivery.

In my current role as Senior Case Manager at Berry Street, I have developed and implemented comprehensive case management strategies for families experiencing complex challenges. This has included:

• Conducting thorough risk assessments using the MARAM framework, with a focus on intersectional considerations of culture, disability, and socioeconomic factors

• Coordinating multi-agency responses involving child protection, family violence services, and mental health providers to ensure holistic support

• Developing individualized safety plans in collaboration with clients, prioritizing their autonomy and self-determination

• Maintaining detailed case records and contributing to outcome reporting that has informed organisational practice improvements

Previously, as a Family Violence Practitioner at Safe Steps, I provided immediate crisis intervention and safety planning for individuals and families. I facilitated connections with court support services, emergency accommodation, and long-term counselling programs.

My approach is grounded in the understanding that effective practice requires continuous learning, cultural humility, and genuine partnership with the communities we serve. I am committed to advocating for systemic change while providing responsive, person-centred support.`;

      setResponse(generated);
      setWordCount(generated.split(/\s+/).length);
      setLoading(false);
    }, 2500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCriteria('');
    setResponse('');
    setWordCount(0);
    setCopied(false);
  };

  const handleLoadExample = (text: string) => {
    setCriteria(text);
    setResponse('');
    setWordCount(0);
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
        <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.stencilYellow, marginBottom: '12px' }}>
          THE WORKSHOP // KSC STUDIO
        </p>
        <h1
          style={{
            fontFamily: FONTS.display,
            fontVariationSettings: "'wght' 800, 'wdth' 120",
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            lineHeight: 1.05,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            color: COLORS.workerAsh,
            marginBottom: '8px',
          }}
        >
          KSC <span style={{ color: COLORS.stencilYellow }}>GENERATOR</span>
        </h1>
        <p style={{ fontFamily: FONTS.primary, fontVariationSettings: "'wght' 475, 'wdth' 98", fontSize: '15px', color: COLORS.workerAsh, opacity: 0.5, maxWidth: '600px', lineHeight: 1.6 }}>
          Paste a Key Selection Criteria and generate a tailored response using your ingested profile data.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...SPRING_SETTLE, delay: 0.1 }}
        >
          {/* Example criteria quick-load */}
          <div className="mb-4">
            <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.workerAshMuted, marginBottom: '8px' }}>
              QUICK LOAD EXAMPLES
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_CRITERIA.map((ex) => (
                <motion.button
                  key={ex.label}
                  onClick={() => handleLoadExample(ex.text)}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  className="cursor-pointer"
                  style={{
                    fontFamily: FONTS.mono,
                    fontWeight: 700,
                    fontSize: '10px',
                    letterSpacing: '0.04em',
                    color: COLORS.stencilYellow,
                    background: `${COLORS.stencilYellow}10`,
                    padding: '6px 14px',
                    borderRadius: SHAPES.pebble,
                    border: `1px solid ${COLORS.stencilYellow}25`,
                  }}
                >
                  {ex.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Criteria input */}
          <div
            className="noise-texture relative overflow-hidden p-6"
            style={{
              background: COLORS.surface1,
              borderRadius: SHAPES.pebble,
              border: `1px solid ${COLORS.surface3}`,
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: COLORS.stencilYellow }} />

            <label
              style={{
                fontFamily: FONTS.mono,
                fontWeight: 700,
                fontSize: '10px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: focusedField === 'criteria' ? COLORS.inkGold : COLORS.workerAshMuted,
                display: 'block',
                marginBottom: '8px',
              }}
            >
              KEY SELECTION CRITERIA
            </label>
            <textarea
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              onFocus={() => setFocusedField('criteria')}
              onBlur={() => setFocusedField(null)}
              rows={8}
              placeholder="Paste the selection criteria here..."
              style={{
                fontFamily: FONTS.primary,
                fontVariationSettings: "'wght' 400",
                fontSize: '14px',
                color: COLORS.workerAsh,
                background: COLORS.surface2,
                border: focusedField === 'criteria' ? `2px solid ${COLORS.inkGold}` : `1px solid ${COLORS.surface4}`,
                borderRadius: SHAPES.pebble,
                padding: '16px',
                width: '100%',
                outline: 'none',
                resize: 'vertical' as const,
                lineHeight: 1.6,
                boxShadow: focusedField === 'criteria' ? `0 0 12px ${COLORS.inkGold}22` : 'none',
                transition: 'border 0.3s, box-shadow 0.3s',
              }}
            />

            <div className="flex items-center gap-3 mt-4">
              <motion.button
                onClick={handleGenerate}
                disabled={loading || !criteria.trim()}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                className="flex-1 flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  background: loading || !criteria.trim() ? COLORS.surface3 : COLORS.solidarityRed,
                  color: COLORS.canvas,
                  fontFamily: FONTS.primary,
                  fontVariationSettings: "'wght' 800",
                  fontSize: '13px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '14px 24px',
                  borderRadius: SHAPES.pebble,
                  border: 'none',
                  boxShadow: loading || !criteria.trim() ? 'none' : `0 0 20px ${COLORS.solidarityRed}44`,
                }}
              >
                {loading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <Loader2 size={16} />
                    </motion.div>
                    GENERATING...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    GENERATE RESPONSE
                  </>
                )}
              </motion.button>

              {(criteria || response) && (
                <motion.button
                  onClick={handleReset}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  className="cursor-pointer"
                  style={{
                    background: 'transparent',
                    color: COLORS.surface6,
                    padding: '14px',
                    borderRadius: SHAPES.pebble,
                    border: `1px solid ${COLORS.surface4}`,
                  }}
                >
                  <RotateCcw size={16} />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Output panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...SPRING_SETTLE, delay: 0.2 }}
          className="noise-texture relative overflow-hidden p-6"
          style={{
            background: COLORS.surface1,
            borderRadius: SHAPES.pebble,
            border: `1px solid ${COLORS.surface3}`,
            minHeight: '400px',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: response ? COLORS.activistGreen : COLORS.surface3 }} />

          <div className="flex items-center justify-between mb-4">
            <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: response ? COLORS.activistGreen : COLORS.workerAshMuted }}>
              {response ? 'GENERATED RESPONSE' : 'AWAITING INPUT'}
            </p>
            {response && (
              <div className="flex items-center gap-3">
                <span style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted }}>
                  {wordCount} WORDS
                </span>
                <motion.button
                  onClick={handleCopy}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  className="flex items-center gap-1 cursor-pointer"
                  style={{
                    background: copied ? `${COLORS.activistGreen}18` : `${COLORS.inkGold}12`,
                    color: copied ? COLORS.activistGreen : COLORS.inkGold,
                    fontFamily: FONTS.mono,
                    fontWeight: 700,
                    fontSize: '10px',
                    letterSpacing: '0.04em',
                    padding: '6px 14px',
                    borderRadius: SHAPES.pebble,
                    border: `1px solid ${copied ? COLORS.activistGreen + '30' : COLORS.inkGold + '25'}`,
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'COPIED' : 'COPY'}
                </motion.button>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="mb-4"
                >
                  <Zap size={32} style={{ color: COLORS.solidarityRed }} />
                </motion.div>
                <p style={{ fontFamily: FONTS.display, fontVariationSettings: "'wght' 700", fontSize: '18px', color: COLORS.solidarityRed, textShadow: `0 0 20px ${COLORS.solidarityRed}44` }}>
                  CRAFTING YOUR RESPONSE...
                </p>
                <p style={{ fontFamily: FONTS.curator, fontSize: '14px', color: COLORS.smokeOrange, opacity: 0.5, marginTop: '12px' }}>
                  matching your experience to the criteria
                </p>
              </motion.div>
            ) : response ? (
              <motion.div
                key="response"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={SPRING_SETTLE}
              >
                <div
                  className="p-5"
                  style={{
                    background: COLORS.surface2,
                    borderRadius: SHAPES.pebble,
                    border: `1px solid ${COLORS.surface4}`,
                  }}
                >
                  <p
                    style={{
                      fontFamily: FONTS.primary,
                      fontVariationSettings: "'wght' 400",
                      fontSize: '14px',
                      color: COLORS.workerAsh,
                      lineHeight: 1.8,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {response}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <FileText size={48} style={{ color: COLORS.surface3, marginBottom: '16px' }} />
                <p style={{ fontFamily: FONTS.display, fontVariationSettings: "'wght' 600", fontSize: '16px', color: COLORS.workerAshDim, textAlign: 'center' }}>
                  PASTE YOUR CRITERIA
                </p>
                <p style={{ fontFamily: FONTS.mono, fontSize: '11px', color: COLORS.workerAshDim, marginTop: '8px', textAlign: 'center' }}>
                  The engine will generate a tailored response from your profile.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}