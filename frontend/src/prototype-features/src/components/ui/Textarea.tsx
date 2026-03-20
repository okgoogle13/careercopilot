/* eslint-disable */
import React from 'react';
import { motion } from 'motion/react';

type Props = {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export function Textarea({ label, placeholder, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-widest">
        {label}
      </label>
      <motion.textarea
        whileFocus={{ scale: 1.01, rotate: -0.5 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-6 border text-lg type-melancholyLonging min-h-[160px] focus:outline-none focus:shadow-[var(--sys-shadow-elevation2Placard)] text-[var(--sys-color-paperWhite-base)] transition-colors resize-y"
        style={{
          borderRadius: 'var(--sys-shape-blockRiot01)',
          background: 'var(--sys-color-charcoalBackground-steps-0)',
          borderColor: 'var(--sys-color-outline-variant)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--sys-color-solidarityRed-base)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--sys-color-outline-variant)';
        }}
      />
    </div>
  );
}
