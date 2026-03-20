import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, title, children }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 backdrop-blur-sm"
            style={{
              background: 'rgba(var(--sys-color-charcoalBackground-base-rgb, 10, 10, 10), 0.8)',
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20, rotate: -2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border shadow-[var(--sys-shadow-elevation4Float)] p-8"
            style={{
              borderRadius: 'var(--sys-shape-alertShard01)',
              background: 'var(--sys-color-charcoalBackground-steps-1)',
              borderColor: 'var(--sys-color-outline-variant)',
            }}
          >
            {/* Wheat-paste noise background */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wall-4-light.png')]" />

            <div className="relative z-10">
              <div
                className="flex items-center justify-between mb-8 border-b pb-4"
                style={{ borderColor: 'var(--sys-color-outline-variant)' }}
              >
                <h2 className="text-4xl type-solidarityProtest text-[var(--sys-color-paperWhite-base)] uppercase tracking-tighter leading-none">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-solidarityRed-base)] transition-colors"
                >
                  <X
                    size={32}
                    strokeWidth={3}
                  />
                </button>
              </div>
              <div className="space-y-6">{children}</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
