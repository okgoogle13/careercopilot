import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface LoginCardProps {
  /** Callback on submission */
  onLogin: (credentials: LoginCredentials) => void;
  /** Callback for registration link */
  onRegisterClick: () => void;
  /** Loading state for the verification pulse */
  isLoading?: boolean;
}

/**
 * LoginCard
 *
 * The "Verification Gateway" for Kerala Rage.
 * Enforces Solidarity Mode geometry and motion.
 */
export const LoginCard: React.FC<LoginCardProps> = ({
  onLogin,
  onRegisterClick,
  isLoading = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <div className="relative group">
      {/* Halo Disk Radiance */}
      <div
        className={cn(
          'absolute inset-0 -z-10 bg-ink-gold/20 blur-3xl rounded-sentry scale-150 transition-opacity',
          isLoading ? 'animate-pulse opacity-60' : 'opacity-0 group-hover:opacity-40'
        )}
      />

      <motion.form
        onSubmit={handleSubmit}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          'w-[480px] p-12 bg-[var(--sys-color-charcoalBackground-base)]/90 backdrop-blur-md',
          'border border-blueprint-grey/30 rounded-stone shadow-viscous',
          'flex flex-col gap-8 relative overflow-hidden'
        )}
        aria-label="Verification Gateway"
        role="form"
      >
        {/* Screenprint Substrate Overlay */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('/assets/kr-solidarity/texture/kr-solidarity__atmospheric__texture--asphalt-grain--v2.png')] mix-blend-overlay" />

        <h2 className="text-display-lg font-serif italic text-paper-white tracking-tighter">
          VERIFY IDENTITY
        </h2>

        <div className="flex flex-col gap-6 relative z-10">
          <div className="space-y-2">
            <label
              htmlFor="email-input"
              className="text-blueprint-grey font-jetbrains-mono text-xs uppercase tracking-widest"
            >
              Email Address
            </label>
            <input
              id="email-input"
              data-testid="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                'w-full bg-[var(--sys-color-charcoalBackground-base)]/40 border border-blueprint-grey/20 p-4 rounded-slab',
                'text-paper-white font-jetbrains-mono focus:border-ink-gold focus:outline-none transition-colors'
              )}
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password-input"
              className="text-blueprint-grey font-jetbrains-mono text-xs uppercase tracking-widest"
            >
              Password
            </label>
            <input
              id="password-input"
              data-testid="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                'w-full bg-[var(--sys-color-charcoalBackground-base)]/40 border border-blueprint-grey/20 p-4 rounded-slab',
                'text-paper-white font-jetbrains-mono focus:border-ink-gold focus:outline-none transition-colors'
              )}
              required
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className={cn(
            'mt-4 py-5 bg-ink-gold text-charcoal font-bold uppercase tracking-[0.2em]',
            'rounded-pebble shadow-hover-rise text-lg'
          )}
          disabled={isLoading}
        >
          {isLoading ? 'VERIFYING...' : 'ENTER ARCHIVE'}
        </motion.button>

        <button
          type="button"
          onClick={onRegisterClick}
          className="text-center text-paper-white/60 font-mono text-[10px] uppercase tracking-widest hover:text-ink-gold transition-colors"
        >
          Create Collective ID
        </button>
      </motion.form>
    </div>
  );
};
