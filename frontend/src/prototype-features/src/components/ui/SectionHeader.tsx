/* eslint-disable */
import React from 'react';
import { motion } from 'motion/react';

type Props = {
  title: string;
  subtitle?: string;
};

export function SectionHeader({ title, subtitle }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="mb-8 border-b border-[var(--sys-color-outline-variant)] pb-4"
    >
      <h2 className="text-5xl type-solidarityProtest text-[var(--sys-color-paperWhite-base)] uppercase tracking-tighter leading-none">
        {title}
      </h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-xl type-melancholyLonging text-[var(--sys-color-worker-ash-base)]"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
