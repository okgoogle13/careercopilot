import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  variant?: 'horizontal' | 'icon';
  className?: string;
  size?: number | string;
}

/**
 * KERALA RAGE — SOLIDARITY MODE LOGO
 * Reinterprets the red crescent + palm-tree motif into a screenprint-style vector mark.
 *
 * Composition:
 * - Large sweeping crescent (Abstract Scaffold / Rising Horizon)
 * - Iconic Palm Silhouettes (Resistance / Growth)
 * - Solidarity Palette: Red, Ink Gold, Signal Green, Paper White, Asphalt Black
 */
export const Logo: React.FC<LogoProps> = ({ variant = 'horizontal', className = '', size = '100%' }) => {
  const M3_EXPRESSIVE = [0.34, 1.56, 0.64, 1];

  // Color Palette from Design System
  const COLORS = {
    solidarityRed: '#F14714',
    inkGold: '#DAF674',
    signalGreen: '#48F0E5',
    paperWhite: '#F5F0E8',
    asphaltBlack: '#000000',
    stencilYellow: '#F6E748',
    charcoal: '#1A1714',
  };

  const mark = (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background Circle for Icon variant */}
      {variant === 'icon' && (
        <circle cx="50" cy="50" r="48" fill={COLORS.charcoal} />
      )}

      {/* Abstract Scaffold / Rising Horizon (The Crescent) */}
      <g id="crescent_group">
        <motion.path
          id="crescent"
          d="M85 80C95 60 90 35 75 20C60 5 35 0 15 10C35 5 65 10 75 35C85 60 75 85 55 95C70 95 80 90 85 80Z"
          fill={COLORS.paperWhite}
          initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: M3_EXPRESSIVE }}
        />
      </g>

      {/* Support Palms (Background Layers) */}
      <g id="support_palms_group">
        <motion.path
          id="support_palms"
          d="M20 90L25 70M25 70C20 65 15 65 10 70M25 70C25 60 35 60 40 65M25 70C30 75 30 85 25 90M75 95L70 80M70 80C65 75 60 75 55 80M70 80C70 70 80 70 85 75M70 80C75 85 75 95 70 100"
          stroke={COLORS.paperWhite}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: M3_EXPRESSIVE }}
        />
      </g>

      {/* Primary Palm Silhouette (The Resistance) */}
      <motion.g
        id="primary_palm"
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: M3_EXPRESSIVE }}
      >
        <g id="palm_trunk">
          <path
            d="M45 95C48 70 42 45 35 25"
            stroke={COLORS.paperWhite}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
        <g id="palm_leaves">
          {/* Leaves - Red and Green accents */}
          <path
            d="M35 25C25 20 15 25 10 35M35 25C25 15 25 5 35 0M35 25C45 15 55 15 60 25M35 25C45 30 50 40 50 50M35 25C30 35 25 45 20 50"
            stroke={COLORS.solidarityRed}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M35 25C30 20 25 20 20 25M35 25C35 15 40 10 45 15"
            stroke={COLORS.signalGreen}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
        <g id="palm_highlights">
          {/* Stencil Yellow highlights */}
          <circle cx="35" cy="25" r="3" fill={COLORS.stencilYellow} />
        </g>
      </motion.g>

      {/* Halo Disk Accent (Subtle glow) */}
      <circle cx="50" cy="50" r="40" fill={COLORS.inkGold} opacity="0.05" />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        {mark}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`} style={{ height: size }}>
      <div className="h-full aspect-square relative">
        {mark}
      </div>
      <div className="flex flex-col justify-center">
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: M3_EXPRESSIVE }}
          className="m-0 leading-none"
          style={{
            fontFamily: 'var(--sys-type-fontFamilies-display)',
            fontSize: '1.25em',
            fontWeight: 900,
            color: 'var(--sys-color-worker-ash-base)',
            fontVariationSettings: "'wght' 900, 'SOFT' 100, 'WONK' 1, 'wdth' 110",
            letterSpacing: '-0.02em',
          }}
        >
          CAREER <span style={{ color: COLORS.stencilYellow }}>COPILOT</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: M3_EXPRESSIVE }}
          className="m-0 mt-1 leading-none"
          style={{
            fontFamily: 'var(--sys-type-fontFamilies-mono)',
            fontSize: '0.5em',
            fontWeight: 100,
            color: COLORS.solidarityRed,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          SOLIDARITY MODE
        </motion.p>
      </div>
    </div>
  );
};
