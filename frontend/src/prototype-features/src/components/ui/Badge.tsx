import React from 'react';
import { motion } from 'motion/react';

type Props = {
  label: string;
  variant?: 'default' | 'warning' | 'success' | 'danger';
};

export function Badge({ label, variant = 'default' }: Props) {
  let textColor = 'var(--sys-color-paperWhite-base)';
  let bg = 'var(--sys-color-charcoalBackground-steps-3)';
  let borderColor = 'var(--sys-color-outline-variant)';

  if (variant === 'warning') {
    textColor = 'var(--sys-color-charcoalBackground-base)';
    bg = 'var(--sys-color-stencilYellow-base)';
    borderColor = 'var(--sys-color-stencilYellow-base)';
  } else if (variant === 'success') {
    textColor = 'var(--sys-color-charcoalBackground-base)';
    bg = 'var(--sys-color-signalGreen-base)';
    borderColor = 'var(--sys-color-signalGreen-base)';
  } else if (variant === 'danger') {
    textColor = 'var(--sys-color-paperWhite-base)';
    bg = 'var(--sys-color-solidarityRed-base)';
    borderColor = 'var(--sys-color-solidarityRed-base)';
  }

  return (
    <motion.span
      whileHover={{ scale: 1.05, rotate: (Math.random() - 0.5) * 5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className="inline-block px-3 py-1 font-mono text-xs uppercase tracking-widest border"
      style={{
        borderRadius: 'var(--sys-shape-blockRiot02)',
        color: textColor,
        background: bg,
        borderColor: borderColor,
      }}
    >
      {label}
    </motion.span>
  );
}
