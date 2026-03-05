import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for Tailwind class merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
          'absolute inset-0 -z-10 bg-ink-gold/20 blur-3xl rounded-full scale-150 transition-opacity',
          isLoading ? 'animate-pulse opacity-60' : 'opacity-0 group-hover:opacity-40'
        )}
      />

      <motion.form
        onSubmit={handleSubmit}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          'w-[480px] p-12 bg-charcoal-100/90 backdrop-blur-md',
          'border border-blueprint-grey/30 rounded-stone shadow-viscous',
          'flex flex-col gap-8 relative overflow-hidden'
        )}
        aria-label="Verification Gateway"
        role="form"
      >
        {/* Screenprint Substrate Overlay */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('/assets/noise-texture.png')] mix-blend-overlay" />

        <h2 className="text-display-lg font-serif italic text-paper-white tracking-tighter">
          VERIFY IDENTITY
        </h2>

        <div className="flex flex-col gap-6 relative z-10">
          <div className="space-y-2">
            <label className="text-blueprint-grey font-jetbrains-mono text-xs uppercase tracking-widest">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                'w-full bg-black/40 border border-blueprint-grey/20 p-4 rounded-slab',
                'text-paper-white font-jetbrains-mono focus:border-ink-gold focus:outline-none transition-colors'
              )}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-blueprint-grey font-jetbrains-mono text-xs uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                'w-full bg-black/40 border border-blueprint-grey/20 p-4 rounded-slab',
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
