import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const messages = [
  'Extracting skills...',
  'Formatting timeline...',
  'Analyzing requirements...',
  'Identifying filters...',
  'Drafting response...',
];

export function StatusSpecificLoadingState() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6">
      <div className="relative w-20 h-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-full h-full border-4 border-[var(--sys-color-solidarityRed-base)] border-t-transparent rounded-full"
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={messages[index]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xl font-bold uppercase tracking-widest text-[var(--sys-color-paperWhite-base)]"
        >
          {messages[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
