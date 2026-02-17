import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Bell, Shield, Palette, Save, Check } from 'lucide-react';

// ============================================================================
// SETTINGS — KERALA RAGE / SOLIDARITY MODE — "THE VAULT"
// Profile, notifications, privacy, and appearance settings.
// Charcoal surfaces, inkGold focus, pebble tabs.
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

type SettingsTab = 'profile' | 'notifications' | 'privacy' | 'appearance';

const TABS: { key: SettingsTab; label: string; icon: typeof User }[] = [
  { key: 'profile', label: 'PROFILE', icon: User },
  { key: 'notifications', label: 'ALERTS', icon: Bell },
  { key: 'privacy', label: 'SECURITY', icon: Shield },
  { key: 'appearance', label: 'DISPLAY', icon: Palette },
];

function ToggleSwitch({ checked, onChange, label, description }: { checked: boolean; onChange: () => void; label: string; description?: string }) {
  return (
    <div className="flex items-start justify-between py-4" style={{ borderBottom: `1px solid ${COLORS.surface3}` }}>
      <div className="flex-1 mr-4">
        <p style={{ fontFamily: FONTS.primary, fontVariationSettings: "'wght' 600", fontSize: '14px', color: COLORS.workerAsh, marginBottom: description ? '4px' : 0 }}>
          {label}
        </p>
        {description && (
          <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.workerAshMuted, lineHeight: 1.5 }}>
            {description}
          </p>
        )}
      </div>
      <motion.button
        onClick={onChange}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
        className="cursor-pointer flex-shrink-0"
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          background: checked ? COLORS.inkGold : COLORS.surface4,
          border: 'none',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: checked ? 'flex-end' : 'flex-start',
          transition: 'background 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <motion.div
          layout
          transition={{ duration: 0.3, ease: M3_EXPRESSIVE }}
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '98%',
            background: checked ? COLORS.canvas : COLORS.surface6,
          }}
        />
      </motion.button>
    </div>
  );
}

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saved, setSaved] = useState(false);

  // Profile state
  const [firstName, setFirstName] = useState('Nishant');
  const [lastName, setLastName] = useState('Kumar');
  const [email, setEmail] = useState('nishant@solidarity.org');
  const [bio, setBio] = useState('Social worker with 7+ years in family violence prevention and community outreach across Melbourne.');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Notification state
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [appUpdates, setAppUpdates] = useState(true);
  const [jobMatches, setJobMatches] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [atsAlerts, setAtsAlerts] = useState(true);

  // Privacy state
  const [profileVisible, setProfileVisible] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);

  // Appearance state
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = (field: string) => ({
    fontFamily: FONTS.primary,
    fontVariationSettings: "'wght' 475, 'wdth' 98",
    fontSize: '14px',
    color: COLORS.workerAsh,
    background: COLORS.surface2,
    border: focusedField === field ? `2px solid ${COLORS.inkGold}` : `1px solid ${COLORS.surface4}`,
    borderRadius: SHAPES.pebble,
    padding: '14px 16px',
    width: '100%',
    outline: 'none',
    boxShadow: focusedField === field ? `0 0 12px ${COLORS.inkGold}22` : 'none',
    transition: 'border 0.3s, box-shadow 0.3s',
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

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1440px] mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_SLAM}
        className="mb-8"
      >
        <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.smokeOrange, marginBottom: '12px' }}>
          THE VAULT // CONFIGURATION
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
          YOUR <span style={{ color: COLORS.smokeOrange }}>SETTINGS</span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Tab list */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...SPRING_SETTLE, delay: 0.1 }}
          className="space-y-1"
        >
          {TABS.map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
              className="w-full flex items-center gap-3 cursor-pointer text-left"
              style={{
                fontFamily: FONTS.mono,
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.04em',
                color: activeTab === tab.key ? COLORS.canvas : COLORS.workerAshMuted,
                background: activeTab === tab.key ? COLORS.inkGold : 'transparent',
                padding: '12px 16px',
                borderRadius: SHAPES.pebble,
                border: activeTab === tab.key ? 'none' : `1px solid transparent`,
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING_SLAM}
          className="noise-texture relative overflow-hidden p-6 md:p-8"
          style={{
            background: COLORS.surface1,
            borderRadius: SHAPES.pebble,
            border: `1px solid ${COLORS.surface3}`,
          }}
        >
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div>
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.inkGold, marginBottom: '24px' }}>
                IDENTITY CONFIGURATION
              </p>

              {/* Avatar placeholder */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    background: `linear-gradient(135deg, ${COLORS.solidarityRed}, ${COLORS.smokeOrange})`,
                    borderRadius: '98%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontFamily: FONTS.primary, fontWeight: 800, fontSize: '24px', color: COLORS.canvas }}>
                    {firstName[0]}{lastName[0]}
                  </span>
                </div>
                <div>
                  <p style={{ fontFamily: FONTS.proclamation, fontWeight: 700, fontSize: '16px', color: COLORS.workerAsh }}>
                    {firstName} {lastName}
                  </p>
                  <p style={{ fontFamily: FONTS.mono, fontSize: '11px', color: COLORS.workerAshMuted }}>
                    {email}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle('firstName')}>FIRST NAME</label>
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} onFocus={() => setFocusedField('firstName')} onBlur={() => setFocusedField(null)} style={inputStyle('firstName')} />
                  </div>
                  <div>
                    <label style={labelStyle('lastName')}>LAST NAME</label>
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} onFocus={() => setFocusedField('lastName')} onBlur={() => setFocusedField(null)} style={inputStyle('lastName')} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle('email')}>EMAIL</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} style={inputStyle('email')} />
                </div>
                <div>
                  <label style={labelStyle('bio')}>BIO</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} onFocus={() => setFocusedField('bio')} onBlur={() => setFocusedField(null)} style={{ ...inputStyle('bio'), resize: 'vertical' as const, lineHeight: 1.6 }} />
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div>
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.stencilYellow, marginBottom: '24px' }}>
                ALERT CONFIGURATION
              </p>
              <ToggleSwitch checked={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} label="Email Notifications" description="Receive important updates via email" />
              <ToggleSwitch checked={appUpdates} onChange={() => setAppUpdates(!appUpdates)} label="Application Updates" description="Get notified when your application status changes" />
              <ToggleSwitch checked={jobMatches} onChange={() => setJobMatches(!jobMatches)} label="New Job Matches" description="Alert when a STRONG match appears in the feed" />
              <ToggleSwitch checked={weeklyDigest} onChange={() => setWeeklyDigest(!weeklyDigest)} label="Weekly Digest" description="Summary of your job search progress each week" />
              <ToggleSwitch checked={atsAlerts} onChange={() => setAtsAlerts(!atsAlerts)} label="ATS Score Alerts" description="Notify when your ATS score changes significantly" />
            </div>
          )}

          {/* PRIVACY TAB */}
          {activeTab === 'privacy' && (
            <div>
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.charcoalRed, marginBottom: '24px' }}>
                SECURITY & PRIVACY
              </p>
              <ToggleSwitch checked={profileVisible} onChange={() => setProfileVisible(!profileVisible)} label="Profile Visibility" description="Allow recruiters to find your profile" />
              <ToggleSwitch checked={showEmail} onChange={() => setShowEmail(!showEmail)} label="Show Email Address" description="Display your email on your public profile" />
              <ToggleSwitch checked={dataSharing} onChange={() => setDataSharing(!dataSharing)} label="Data Sharing" description="Share anonymized usage data to improve the platform" />

              <div className="mt-6 p-4" style={{ background: `${COLORS.charcoalRed}08`, borderRadius: SHAPES.pebble, border: `1px solid ${COLORS.charcoalRed}25` }}>
                <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.charcoalRed, marginBottom: '8px' }}>
                  DANGER ZONE
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  className="cursor-pointer"
                  style={{
                    background: `${COLORS.charcoalRed}18`,
                    color: COLORS.charcoalRed,
                    fontFamily: FONTS.primary,
                    fontVariationSettings: "'wght' 700",
                    fontSize: '12px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    padding: '10px 20px',
                    borderRadius: SHAPES.pebble,
                    border: `1px solid ${COLORS.charcoalRed}30`,
                  }}
                >
                  DELETE ACCOUNT
                </motion.button>
              </div>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div>
              <p style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.metalBlue, marginBottom: '24px' }}>
                DISPLAY PREFERENCES
              </p>

              {/* Solidarity Mode — locked */}
              <div className="py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${COLORS.surface3}` }}>
                <div>
                  <p style={{ fontFamily: FONTS.primary, fontVariationSettings: "'wght' 600", fontSize: '14px', color: COLORS.workerAsh, marginBottom: '4px' }}>
                    Solidarity Mode (Dark Only)
                  </p>
                  <p style={{ fontFamily: FONTS.mono, fontSize: '10px', color: COLORS.solidarityRed }}>
                    LOCKED — NO LIGHT MODE. EVER.
                  </p>
                </div>
                <div
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    background: COLORS.solidarityRed,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '2px',
                    opacity: 0.6,
                  }}
                >
                  <div style={{ width: '20px', height: '20px', borderRadius: '98%', background: COLORS.canvas }} />
                </div>
              </div>

              <ToggleSwitch checked={reducedMotion} onChange={() => setReducedMotion(!reducedMotion)} label="Reduced Motion" description="Minimize animations for accessibility (respects prefers-reduced-motion)" />
              <ToggleSwitch checked={compactMode} onChange={() => setCompactMode(!compactMode)} label="Compact Mode" description="Reduce spacing and padding for dense information display" />
            </div>
          )}

          {/* Save button */}
          <div className="mt-8 pt-6 flex items-center justify-between" style={{ borderTop: `1px solid ${COLORS.surface3}` }}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: saved ? 1 : 0 }}
              className="flex items-center gap-2"
              style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: '11px', color: COLORS.activistGreen }}
            >
              <Check size={16} /> SAVED SUCCESSFULLY
            </motion.p>
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
              className="flex items-center gap-2 cursor-pointer"
              style={{
                background: COLORS.solidarityRed,
                color: COLORS.canvas,
                fontFamily: FONTS.primary,
                fontVariationSettings: "'wght' 800",
                fontSize: '13px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '14px 28px',
                borderRadius: SHAPES.pebble,
                border: 'none',
                boxShadow: `0 0 20px ${COLORS.solidarityRed}44`,
              }}
            >
              <Save size={16} />
              SAVE CHANGES
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}