import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Check, User, Briefcase, Compass, Zap } from 'lucide-react';

// ============================================================================
// ONBOARDING — KERALA RAGE / SOLIDARITY MODE
// 3-step onboarding wizard. Identity → Skills → Preferences.
// Charcoal surfaces, inkGold progress, Solidarity Red completion.
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

const STEPS = [
  { id: 1, label: 'IDENTITY', icon: User, accent: COLORS.inkGold },
  { id: 2, label: 'SKILLS', icon: Briefcase, accent: COLORS.signalGreen },
  { id: 3, label: 'DIRECTION', icon: Compass, accent: COLORS.stencilYellow },
];

const INDUSTRIES = [
  'Community Services', 'Child Protection', 'Family Violence',
  'Youth Work', 'Mental Health', 'Disability Services',
  'AOD Counselling', 'Housing & Homelessness', 'Aged Care',
];

const SKILL_OPTIONS = [
  'Case Management', 'Risk Assessment', 'Trauma-Informed Care',
  'Crisis Intervention', 'Group Facilitation', 'Report Writing',
  'Stakeholder Engagement', 'Cultural Competency', 'Advocacy',
  'Program Evaluation', 'Community Development', 'NDIS Knowledge',
  'Family Mediation', 'Court Support', 'Intake & Assessment',
];

const JOB_TYPES = [
  'Full-Time', 'Part-Time', 'Contract', 'Casual',
];

const LOCATIONS = [
  'Melbourne CBD', 'Inner North', 'Inner South', 'Western Suburbs',
  'Eastern Suburbs', 'Northern Suburbs', 'Regional VIC', 'Remote / WFH',
];

export function Onboarding() {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [industry, setIndustry] = useState('');
  const [yearsExp, setYearsExp] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleJobType = (jt: string) => {
    setSelectedJobTypes((prev) =>
      prev.includes(jt) ? prev.filter((j) => j !== jt) : [...prev, jt]
    );
  };

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  };

  const handleComplete = () => {
    window.location.href = '/ingestion';
  };

  const inputStyle = (field: string) => ({
    fontFamily: FONTS.primary,
    fontVariationSettings: "'wght' 475, 'wdth' 98",
    fontSize: '14px',
    color: COLORS.workerAsh,
    background: COLORS.surface2,
    border: focusedField === field
      ? `2px solid ${COLORS.inkGold}`
      : `1px solid ${COLORS.surface4}`,
    borderRadius: SHAPES.pebble,
    padding: '14px 16px',
    width: '100%',
    outline: 'none',
    boxShadow: focusedField === field ? `0 0 12px ${COLORS.inkGold}22` : 'none',
    transition: 'border 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  });

  const labelStyle = (field: string) => ({
    fontFamily: FONTS.mono,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    color: focusedField === field ? COLORS.inkGold : COLORS.workerAshMuted,
    display: 'block',
    marginBottom: '6px',
  });

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: COLORS.canvas }}>
      {/* Atmosphere */}
      <div className="fixed inset-0 mesh-gradient noise-texture pointer-events-none" style={{ background: COLORS.canvas }} />

      <div className="relative z-10 max-w-2xl mx-auto p-6 md:p-12 pt-12 md:pt-20">
        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING_SLAM}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <motion.div
                  animate={{
                    background: step >= s.id ? s.accent : COLORS.surface3,
                    scale: step === s.id ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  className="flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: SHAPES.pebble,
                    flexShrink: 0,
                  }}
                >
                  {step > s.id ? (
                    <Check size={18} style={{ color: COLORS.canvas }} />
                  ) : (
                    <s.icon size={18} style={{ color: step >= s.id ? COLORS.canvas : COLORS.workerAshMuted }} />
                  )}
                </motion.div>
                <p
                  className="ml-3 hidden sm:block"
                  style={{
                    fontFamily: FONTS.mono,
                    fontWeight: 700,
                    fontSize: '10px',
                    letterSpacing: '0.06em',
                    color: step >= s.id ? s.accent : COLORS.workerAshDim,
                  }}
                >
                  {s.label}
                </p>
                {i < STEPS.length - 1 && (
                  <div
                    className="flex-1 mx-3 h-[2px]"
                    style={{
                      background: step > s.id ? COLORS.inkGold : COLORS.surface3,
                      transition: 'background 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-1 rounded-full overflow-hidden" style={{ background: COLORS.surface3 }}>
            <motion.div
              className="h-full"
              animate={{ width: `${progress}%` }}
              transition={SPRING_SETTLE}
              style={{ background: COLORS.inkGold }}
            />
          </div>
        </motion.div>

        {/* Step content card */}
        <motion.div
          layout
          className="relative noise-texture overflow-hidden"
          style={{
            background: COLORS.surface1,
            borderRadius: SHAPES.pebble,
            border: `1px solid ${COLORS.surface3}`,
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: STEPS[step - 1].accent }}
          />

          <div className="p-8 md:p-10">
            <AnimatePresence mode="wait">
              {/* STEP 1 — IDENTITY */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={SPRING_SLAM}
                >
                  <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.inkGold, marginBottom: '8px' }}>
                    STEP 01 // IDENTITY
                  </p>
                  <h2
                    style={{
                      fontFamily: FONTS.display,
                      fontVariationSettings: "'wght' 800, 'wdth' 120",
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                      color: COLORS.workerAsh,
                      marginBottom: '8px',
                      lineHeight: 1.1,
                    }}
                  >
                    WHO ARE <span style={{ color: COLORS.stencilYellow }}>YOU</span>?
                  </h2>
                  <p style={{ fontFamily: FONTS.primary, fontVariationSettings: "'wght' 475", fontSize: '14px', color: COLORS.workerAsh, opacity: 0.5, marginBottom: '32px', lineHeight: 1.6 }}>
                    Tell us about yourself so we can build your solidarity profile.
                  </p>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle('firstName')}>FIRST NAME</label>
                        <input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          onFocus={() => setFocusedField('firstName')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Nishant"
                          style={inputStyle('firstName')}
                        />
                      </div>
                      <div>
                        <label style={labelStyle('lastName')}>LAST NAME</label>
                        <input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          onFocus={() => setFocusedField('lastName')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Kumar"
                          style={inputStyle('lastName')}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle('industry')}>PRIMARY INDUSTRY</label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        onFocus={() => setFocusedField('industry')}
                        onBlur={() => setFocusedField(null)}
                        style={{ ...inputStyle('industry'), cursor: 'pointer' }}
                      >
                        <option value="">Select your industry</option>
                        {INDUSTRIES.map((ind) => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle('yearsExp')}>YEARS OF EXPERIENCE</label>
                      <select
                        value={yearsExp}
                        onChange={(e) => setYearsExp(e.target.value)}
                        onFocus={() => setFocusedField('yearsExp')}
                        onBlur={() => setFocusedField(null)}
                        style={{ ...inputStyle('yearsExp'), cursor: 'pointer' }}
                      >
                        <option value="">Select range</option>
                        <option value="0-2">0–2 years</option>
                        <option value="3-5">3–5 years</option>
                        <option value="5-10">5–10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 — SKILLS */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={SPRING_SLAM}
                >
                  <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.signalGreen, marginBottom: '8px' }}>
                    STEP 02 // SKILLS
                  </p>
                  <h2
                    style={{
                      fontFamily: FONTS.display,
                      fontVariationSettings: "'wght' 800, 'wdth' 120",
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                      color: COLORS.workerAsh,
                      marginBottom: '8px',
                      lineHeight: 1.1,
                    }}
                  >
                    YOUR <span style={{ color: COLORS.signalGreen }}>ARSENAL</span>
                  </h2>
                  <p style={{ fontFamily: FONTS.primary, fontVariationSettings: "'wght' 475", fontSize: '14px', color: COLORS.workerAsh, opacity: 0.5, marginBottom: '24px', lineHeight: 1.6 }}>
                    Select the skills that define your practice. These power your ATS matching.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {SKILL_OPTIONS.map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <motion.button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                          className="cursor-pointer"
                          style={{
                            fontFamily: FONTS.mono,
                            fontWeight: 700,
                            fontSize: '11px',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            color: isSelected ? COLORS.canvas : COLORS.signalGreen,
                            background: isSelected ? COLORS.signalGreen : `${COLORS.signalGreen}12`,
                            padding: '8px 16px',
                            borderRadius: SHAPES.pebble,
                            border: `1px solid ${isSelected ? COLORS.signalGreen : COLORS.signalGreen + '30'}`,
                          }}
                        >
                          {isSelected && <Check size={12} className="inline mr-1" style={{ verticalAlign: 'middle' }} />}
                          {skill}
                        </motion.button>
                      );
                    })}
                  </div>

                  <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshDim, marginTop: '16px' }}>
                    {selectedSkills.length} SKILLS SELECTED
                  </p>
                </motion.div>
              )}

              {/* STEP 3 — DIRECTION */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={SPRING_SLAM}
                >
                  <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.stencilYellow, marginBottom: '8px' }}>
                    STEP 03 // DIRECTION
                  </p>
                  <h2
                    style={{
                      fontFamily: FONTS.display,
                      fontVariationSettings: "'wght' 800, 'wdth' 120",
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                      color: COLORS.workerAsh,
                      marginBottom: '8px',
                      lineHeight: 1.1,
                    }}
                  >
                    WHERE <span style={{ color: COLORS.stencilYellow }}>NEXT</span>?
                  </h2>
                  <p style={{ fontFamily: FONTS.primary, fontVariationSettings: "'wght' 475", fontSize: '14px', color: COLORS.workerAsh, opacity: 0.5, marginBottom: '24px', lineHeight: 1.6 }}>
                    Set your job search preferences. We'll curate the feed to match.
                  </p>

                  {/* Job type */}
                  <div className="mb-6">
                    <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.workerAshMuted, marginBottom: '10px' }}>
                      EMPLOYMENT TYPE
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {JOB_TYPES.map((jt) => {
                        const isSelected = selectedJobTypes.includes(jt);
                        return (
                          <motion.button
                            key={jt}
                            onClick={() => toggleJobType(jt)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                            className="cursor-pointer"
                            style={{
                              fontFamily: FONTS.mono,
                              fontWeight: 700,
                              fontSize: '11px',
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                              color: isSelected ? COLORS.canvas : COLORS.stencilYellow,
                              background: isSelected ? COLORS.stencilYellow : `${COLORS.stencilYellow}12`,
                              padding: '8px 18px',
                              borderRadius: SHAPES.pebble,
                              border: `1px solid ${isSelected ? COLORS.stencilYellow : COLORS.stencilYellow + '30'}`,
                            }}
                          >
                            {isSelected && <Check size={12} className="inline mr-1" style={{ verticalAlign: 'middle' }} />}
                            {jt}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Locations */}
                  <div>
                    <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.workerAshMuted, marginBottom: '10px' }}>
                      PREFERRED LOCATIONS
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {LOCATIONS.map((loc) => {
                        const isSelected = selectedLocations.includes(loc);
                        return (
                          <motion.button
                            key={loc}
                            onClick={() => toggleLocation(loc)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                            className="cursor-pointer"
                            style={{
                              fontFamily: FONTS.mono,
                              fontWeight: 700,
                              fontSize: '11px',
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                              color: isSelected ? COLORS.canvas : COLORS.metalBlue,
                              background: isSelected ? COLORS.metalBlue : `${COLORS.metalBlue}12`,
                              padding: '8px 16px',
                              borderRadius: SHAPES.pebble,
                              border: `1px solid ${isSelected ? COLORS.metalBlue : COLORS.metalBlue + '30'}`,
                            }}
                          >
                            {isSelected && <Check size={12} className="inline mr-1" style={{ verticalAlign: 'middle' }} />}
                            {loc}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: `1px solid ${COLORS.surface3}` }}>
              {step > 1 ? (
                <motion.button
                  onClick={() => setStep(step - 1)}
                  whileHover={{ scale: 1.03, x: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  className="flex items-center gap-2 cursor-pointer"
                  style={{
                    background: 'transparent',
                    color: COLORS.surface6,
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
                  <ArrowLeft size={16} />
                  BACK
                </motion.button>
              ) : (
                <div />
              )}

              <motion.button
                onClick={() => step < 3 ? setStep(step + 1) : handleComplete()}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                className="flex items-center gap-2 cursor-pointer"
                style={{
                  background: step === 3 ? COLORS.solidarityRed : COLORS.inkGold,
                  color: COLORS.canvas,
                  fontFamily: FONTS.primary,
                  fontVariationSettings: "'wght' 800",
                  fontSize: '13px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '14px 28px',
                  borderRadius: SHAPES.pebble,
                  border: 'none',
                  boxShadow: step === 3 ? `0 0 20px ${COLORS.solidarityRed}44` : `0 0 20px ${COLORS.inkGold}22`,
                }}
              >
                {step === 3 ? 'LAUNCH INGESTION' : 'CONTINUE'}
                {step === 3 ? <Zap size={16} /> : <ArrowRight size={16} />}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Curator annotation */}
        <motion.p
          initial={{ opacity: 0, rotate: 5 }}
          animate={{ opacity: 0.35, rotate: 2 }}
          transition={{ ...SPRING_SETTLE, delay: 0.6 }}
          className="mt-8 text-center pointer-events-none"
          style={{
            fontFamily: FONTS.curator,
            fontSize: '16px',
            color: COLORS.smokeOrange,
            textShadow: `0 0 16px ${COLORS.smokeOrange}30`,
          }}
        >
          building your solidarity profile...
        </motion.p>
      </div>
    </div>
  );
}