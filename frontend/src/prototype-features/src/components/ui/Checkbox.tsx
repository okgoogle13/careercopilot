/* eslint-disable */
import React from 'react';
import { motion } from 'motion/react';

type Props = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function Checkbox({ label, checked, onChange }: Props) {
  return (
    <label className="flex items-center gap-4 cursor-pointer group">
      <div className="relative flex items-center justify-center w-8 h-8">
        <motion.div
          animate={{
            scale: checked ? 1 : 0.9,
            rotate: checked ? -2 : 2,
            backgroundColor: checked
              ? 'var(--sys-color-solidarityRed-base)'
              : 'var(--sys-color-charcoalBackground-steps-0)',
            borderColor: checked
              ? 'var(--sys-color-solidarityRed-base)'
              : 'var(--sys-color-outline-variant)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute inset-0 border"
          style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
        />
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        {checked && (
          <motion.svg
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-5 h-5 text-[var(--sys-color-paperWhite-base)] relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="square"
              strokeLinejoin="miter"
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        )}
      </div>
      <span className="text-lg type-melancholyLonging text-[var(--sys-color-worker-ash-base)] group-hover:text-[var(--sys-color-paperWhite-base)] transition-colors">
        {label}
      </span>
    </label>
  );
}
