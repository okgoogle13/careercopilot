import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ApplicationFormProps {
  /** Callback on file upload */
  onUpload: (file: File) => void;
  /** Acceptable file extensions */
  acceptedFormats?: string[];
  /** Loading state during verification */
  isVerifying?: boolean;
}

/**
 * ApplicationForm
 *
 * The "Deposition" station for user history.
 * Features blueprint motifs and gravity-based physics.
 */
export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  onUpload,
  acceptedFormats = ['.pdf', '.doc', '.docx'],
  isVerifying = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onUpload(file);
      setIsSuccess(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-12 bg-charcoal-100 rounded-slab border border-blueprint-grey/10 shadow-viscous relative overflow-hidden">
      {/* Blueprint Watermark */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-ui-018--v1.svg')] z-0" />

      <h1 className="text-display-lg font-solidarity-900 text-ink-gold uppercase mb-12 relative z-10">
        DEPOSIT HISTORY
      </h1>

      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        animate={{
          borderColor: isDragging ? '#F14714' : '#2a2a2a',
          backgroundColor: isDragging ? 'rgba(241, 71, 20, 0.05)' : 'rgba(0,0,0,0.2)',
        }}
        className={cn(
          'relative z-10 p-20 border-2 border-dashed rounded-slab',
          'flex flex-col items-center justify-center gap-6 transition-colors',
          'group cursor-pointer'
        )}
        role="region"
        aria-label="Document Deposition"
      >
        <AnimatePresence>
          {isVerifying ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-12 h-12 border-4 border-ink-gold border-t-transparent rounded-march animate-spin" />
              <span className="font-jetbrains-mono text-xs uppercase text-ink-gold">
                Verifying Integrity...
              </span>
            </motion.div>
          ) : isSuccess ? (
            <motion.div
              initial={{ scale: 2, rotate: -30, opacity: 0 }}
              animate={{ scale: 1, rotate: -5, opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="px-6 py-2 border-4 border-smoke-green text-smoke-green font-bold text-2xl uppercase tracking-tighter">
                VERIFIED
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-paper-white/60">
                History confirmed.
              </span>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
              <svg
                className="w-16 h-16 text-blueprint-grey group-hover:text-solidarity-red transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div className="space-y-2">
                <p className="font-jetbrains-mono text-sm text-paper-white uppercase tracking-widest">
                  DROP PDF HERE FOR ANALYSIS
                </p>
                <p className="text-xs text-blueprint-grey">
                  Accepted: {acceptedFormats.join(', ')}
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
              />
              <label
                htmlFor="file-upload"
                className="mt-4 px-8 py-3 bg-blueprint-grey/20 text-paper-white font-bold uppercase rounded-seed hover:bg-blueprint-grey/40 cursor-pointer transition-colors"
              >
                CHOOSE FILE
              </label>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-12 flex justify-between items-end relative z-10">
        <div className="text-[10px] font-jetbrains-mono text-blueprint-grey/40 uppercase tracking-[0.3em]">
          Station: Collective_V01
        </div>
        <div className="w-32 h-1 bg-solidarity-red/20 overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={isVerifying ? { x: '100%' } : { x: '-100%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="w-full h-full bg-solidarity-red"
          />
        </div>
      </div>
    </div>
  );
};
