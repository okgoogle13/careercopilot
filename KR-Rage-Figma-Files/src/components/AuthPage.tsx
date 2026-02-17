import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Eye, EyeOff, Zap } from 'lucide-react';

// ============================================================================
// AUTH PAGE — KERALA RAGE / SOLIDARITY MODE
// Combined login/register. Charcoal card, inkGold focus, Solidarity Red CTA.
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
  workerAsh: '#DAF6B3',
  workerAshMuted: '#9AAF7D',
  workerAshDim: '#7A8A6D',
  smokeOrange: '#DA8B48',
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

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    // Mock auth — simulate delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative"
      style={{ background: COLORS.canvas }}
    >
      {/* Atmosphere */}
      <div className="fixed inset-0 -z-10 mesh-gradient noise-texture" style={{ background: COLORS.canvas }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
        className="w-full max-w-md relative"
      >
        {/* Card */}
        <div
          className="relative overflow-hidden noise-texture"
          style={{
            background: COLORS.surface1,
            borderRadius: SHAPES.pebble,
            border: `1px solid ${COLORS.surface3}`,
            padding: '40px',
          }}
        >
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: COLORS.solidarityRed }}
          />

          {/* Logo mark */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
            className="w-14 h-14 flex items-center justify-center mx-auto mb-6"
            style={{
              background: COLORS.solidarityRed,
              borderRadius: SHAPES.pebble,
              boxShadow: `0 0 12px ${COLORS.solidarityRed}66`,
            }}
          >
            <Zap size={24} style={{ color: COLORS.canvas }} />
          </motion.div>

          {/* Title */}
          <h1
            className="text-center mb-1"
            style={{
              fontFamily: FONTS.display,
              fontVariationSettings: "'wght' 800, 'wdth' 120",
              fontSize: '28px',
              letterSpacing: '0.02em',
              textTransform: 'uppercase' as const,
              color: COLORS.workerAsh,
              lineHeight: 1.1,
            }}
          >
            CAREER{' '}
            <span style={{ color: COLORS.stencilYellow }}>COPILOT</span>
          </h1>

          {/* Micro label */}
          <p
            className="text-center mb-8"
            style={{
              fontFamily: FONTS.mono,
              fontWeight: 700,
              fontSize: '10px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: COLORS.solidarityRed,
              marginTop: '8px',
            }}
          >
            SOLIDARITY MODE
          </p>

          {/* Tab toggle */}
          <div
            className="flex mb-8"
            style={{
              background: COLORS.surface2,
              borderRadius: SHAPES.pebble,
              padding: '4px',
              border: `1px solid ${COLORS.surface4}`,
            }}
          >
            {['Sign In', 'Register'].map((tab, i) => {
              const active = i === 0 ? isLogin : !isLogin;
              return (
                <motion.button
                  key={tab}
                  onClick={() => { setIsLogin(i === 0); setError(''); }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
                  className="flex-1 py-2.5 relative"
                  style={{
                    fontFamily: FONTS.primary,
                    fontWeight: active ? 800 : 500,
                    fontSize: '13px',
                    letterSpacing: '0.03em',
                    color: active ? COLORS.workerAsh : COLORS.workerAshMuted,
                    background: active ? COLORS.surface4 : 'transparent',
                    borderRadius: SHAPES.pebble,
                    border: 'none',
                    cursor: 'pointer',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  {tab}
                </motion.button>
              );
            })}
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div
                  className="px-4 py-3"
                  style={{
                    background: `${COLORS.charcoalRed}15`,
                    borderRadius: SHAPES.pebble,
                    border: `1px solid ${COLORS.charcoalRed}40`,
                    fontFamily: FONTS.primary,
                    fontWeight: 500,
                    fontSize: '13px',
                    color: COLORS.charcoalRed,
                  }}
                >
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: M3_EXPRESSIVE }}
                >
                  <label
                    style={{
                      fontFamily: FONTS.mono,
                      fontWeight: 700,
                      fontSize: '10px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase' as const,
                      color: focusedField === 'name' ? COLORS.inkGold : COLORS.workerAshMuted,
                      display: 'block',
                      marginBottom: '8px',
                      transition: `color 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
                    }}
                  >
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Your full name"
                    style={{
                      width: '100%',
                      background: COLORS.surface2,
                      border: `1px solid ${focusedField === 'name' ? COLORS.inkGold : COLORS.surface4}`,
                      borderRadius: SHAPES.pebble,
                      padding: '14px 16px',
                      fontFamily: FONTS.primary,
                      fontWeight: 500,
                      fontSize: '14px',
                      color: COLORS.workerAsh,
                      outline: 'none',
                      boxShadow: focusedField === 'name' ? `0 0 12px ${COLORS.inkGold}33` : 'none',
                      transition: `all 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label
                style={{
                  fontFamily: FONTS.mono,
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase' as const,
                  color: focusedField === 'email' ? COLORS.inkGold : COLORS.workerAshMuted,
                  display: 'block',
                  marginBottom: '8px',
                  transition: `color 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
                }}
              >
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="you@solidarity.org"
                style={{
                  width: '100%',
                  background: COLORS.surface2,
                  border: `1px solid ${focusedField === 'email' ? COLORS.inkGold : COLORS.surface4}`,
                  borderRadius: SHAPES.pebble,
                  padding: '14px 16px',
                  fontFamily: FONTS.primary,
                  fontWeight: 500,
                  fontSize: '14px',
                  color: COLORS.workerAsh,
                  outline: 'none',
                  boxShadow: focusedField === 'email' ? `0 0 12px ${COLORS.inkGold}33` : 'none',
                  transition: `all 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  fontFamily: FONTS.mono,
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase' as const,
                  color: focusedField === 'password' ? COLORS.inkGold : COLORS.workerAshMuted,
                  display: 'block',
                  marginBottom: '8px',
                  transition: `color 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
                }}
              >
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    background: COLORS.surface2,
                    border: `1px solid ${focusedField === 'password' ? COLORS.inkGold : COLORS.surface4}`,
                    borderRadius: SHAPES.pebble,
                    padding: '14px 48px 14px 16px',
                    fontFamily: FONTS.primary,
                    fontWeight: 500,
                    fontSize: '14px',
                    color: COLORS.workerAsh,
                    outline: 'none',
                    boxShadow: focusedField === 'password' ? `0 0 12px ${COLORS.inkGold}33` : 'none',
                    transition: `all 600ms cubic-bezier(${M3_EXPRESSIVE.join(',')})`,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: COLORS.surface6,
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.6, ease: M3_EXPRESSIVE }}
              className="w-full flex items-center justify-center gap-3"
              style={{
                background: COLORS.solidarityRed,
                color: COLORS.canvas,
                fontFamily: FONTS.primary,
                fontWeight: 800,
                fontSize: '14px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase' as const,
                padding: '16px',
                borderRadius: SHAPES.pebble,
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                boxShadow: `0 0 12px ${COLORS.solidarityRed}66`,
              }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-current border-t-transparent"
                  style={{ borderRadius: '98%' }}
                />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p
              style={{
                fontFamily: FONTS.primary,
                fontWeight: 400,
                fontSize: '13px',
                color: COLORS.workerAshMuted,
              }}
            >
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                style={{
                  fontFamily: FONTS.primary,
                  fontWeight: 700,
                  fontSize: '13px',
                  color: COLORS.signalGreen,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                {isLogin ? 'Register' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Curator annotation */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-center mt-6"
            style={{
              fontFamily: FONTS.curator,
              fontSize: '16px',
              color: COLORS.stencilYellow,
              transform: 'rotate(-1deg)',
            }}
          >
            no neutral canvas.
          </motion.p>
        </div>

        {/* Landing link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            style={{
              fontFamily: FONTS.mono,
              fontWeight: 600,
              fontSize: '11px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              color: COLORS.workerAshMuted,
              textDecoration: 'none',
            }}
          >
            ← BACK TO LANDING
          </Link>
        </div>
      </motion.div>
    </div>
  );
}