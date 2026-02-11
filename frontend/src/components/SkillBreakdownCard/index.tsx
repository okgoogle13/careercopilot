import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for Tailwind class merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SkillCategory {
  label: string;
  value: number; // 0-100
  details?: string[];
}

export interface SkillBreakdownCardProps {
  /** The primary numeric metric to reveal */
  overallScore: number;
  /** Categorized sub-scores */
  categories: SkillCategory[];
  /** Optional action callbacks */
  onAction?: (type: 'strengthen' | 'archive') => void;
  /** Loading state for gauge animation */
  isLoading?: boolean;
}

/**
 * SkillBreakdownCard
 * 
 * The "Audit Microscope" for skill verification.
 * Uses blueprint grids and high-vis score gauges.
 */
export const SkillBreakdownCard: React.FC<SkillBreakdownCardProps> = ({
  overallScore,
  categories,
  onAction,
  isLoading = false
}) => {
  return (
    <div className="p-8 bg-charcoal-100 rounded-stone shadow-viscous border border-blueprint-grey/10 relative overflow-hidden">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('/assets/blueprint-grid.svg')] z-0" />

      <div className="relative z-10 flex flex-col gap-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Radial Score Gauge Simulation */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-charcoal-200"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="351.85"
                initial={{ strokeDashoffset: 351.85 }}
                animate={{ strokeDashoffset: 351.85 - (351.85 * overallScore) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-ink-gold shadow-glow-ink"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-jetbrains-mono font-bold text-2xl text-ink-gold">
              {overallScore}%
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-display-sm font-solidarity-800 text-paper-white uppercase tracking-tighter">
              SOLIDARITY ANALYSIS
            </h2>
            <p className="font-jetbrains-mono text-xs text-blueprint-grey/60 uppercase">
              Microscope Version: V2.1.0_KERALA
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {categories.map((cat, idx) => (
            <div key={cat.label} className="space-y-2">
              <div className="flex justify-between font-jetbrains-mono text-xs uppercase tracking-widest text-paper-white/80">
                <span>{cat.label}</span>
                <span>{cat.value}%</span>
              </div>
              <div className="h-2 w-full bg-charcoal-200 rounded-slab overflow-hidden">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: cat.value / 100 }}
                  transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                  style={{ transformOrigin: 'left' }}
                  className="h-full bg-smoke-green shadow-[0_0_10px_rgba(72,218,139,0.3)]"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction?.('strengthen')}
            className="flex-1 py-3 bg-ink-gold text-charcoal font-bold uppercase text-xs tracking-widest rounded-pebble"
          >
            STRENGTHEN
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction?.('archive')}
            className="flex-1 py-3 border border-blueprint-grey/40 text-blueprint-grey font-bold uppercase text-xs tracking-widest rounded-pebble hover:text-paper-white transition-colors"
          >
            ARCHIVE
          </motion.button>
        </div>
      </div>
    </div>
  );
};
