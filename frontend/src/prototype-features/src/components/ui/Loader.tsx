/* eslint-disable */
import React from 'react';
import { motion } from 'motion/react';

export function Loader({ message = 'Extracting skills...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 border shadow-[var(--sys-shadow-elevation3Resting)] flex flex-col items-center justify-center gap-6"
        style={{
          borderRadius: 'var(--sys-shape-alertShard01)',
          background: 'var(--sys-color-charcoalBackground-steps-1)',
          borderColor: 'var(--sys-color-outline-variant)',
        }}
      >
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{
            duration: 1.5,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          <h2 className="text-3xl type-solidarityProtest text-[var(--sys-color-paperWhite-base)] uppercase tracking-tight">
            {message}
          </h2>
        </motion.div>

        <div className="w-48 h-2 bg-[var(--sys-color-charcoalBackground-steps-0)] rounded-full overflow-hidden">
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              ease: 'linear',
              repeat: Infinity,
            }}
            className="w-1/2 h-full rounded-full"
            style={{ background: 'var(--sys-color-solidarityRed-base)' }}
          />
        </div>

        <p className="type-melancholyLonging text-[var(--sys-color-worker-ash-base)] text-sm max-w-xs">
          The system is analyzing the data. Do not interrupt the process.
        </p>
      </motion.div>
    </div>
  );
}
