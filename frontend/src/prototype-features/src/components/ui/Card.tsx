/* eslint-disable */
import React from 'react';
import { motion } from 'motion/react';

type Props = {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
};

export function Card({ children, className = '', hoverEffect = false }: Props) {
  return (
    <motion.div
      whileHover={hoverEffect ? { scale: 1.01, rotate: -0.5, y: -2 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`p-8 border shadow-[var(--sys-shadow-elevation2Placard)] relative overflow-hidden ${className}`}
      style={{
        borderRadius: 'var(--sys-shape-block-main)',
        background: 'var(--sys-color-charcoalBackground-steps-1)',
        borderColor: 'var(--sys-color-outline-variant)',
      }}
    >
      {/* Wheat-paste noise background */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wall-4-light.png')]" />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
