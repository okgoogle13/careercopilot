import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { validateFile } from '@/utils/fileValidation';

interface DropZoneProps {
  onFileDrop?: (files: File[]) => void;
  onValidationError?: (error: string) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  isProcessing?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFileDrop,
  onValidationError,
  maxFiles = 5,
  acceptedTypes = ['.pdf', '.docx', '.txt'],
  isProcessing = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const filterValidFiles = useCallback(
    (files: File[]): File[] => {
      const valid: File[] = [];
      for (const file of files) {
        const result = validateFile(file, acceptedTypes);
        if (result.valid) {
          valid.push(file);
        } else if (onValidationError) {
          onValidationError(result.error!);
        }
      }
      return valid;
    },
    [acceptedTypes, onValidationError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = filterValidFiles(Array.from(e.dataTransfer.files));
      if (onFileDrop && files.length > 0) {
        onFileDrop(files.slice(0, maxFiles));
      }
    },
    [onFileDrop, maxFiles, filterValidFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = filterValidFiles(Array.from(e.target.files || []));
      if (onFileDrop && files.length > 0) {
        onFileDrop(files.slice(0, maxFiles));
      }
    },
    [onFileDrop, maxFiles, filterValidFiles]
  );

  // Visual states from KR-SOLID-030
  const getStateStyles = () => {
    if (isProcessing) {
      return {
        border: 'border-solid border-[var(--sys-color-inkGold-base)]',
        bg: 'bg-[var(--sys-color-inkGold-base)]/10',
        scale: 1.0,
      };
    }
    if (isDragOver) {
      return {
        border: 'border-solid border-[var(--sys-color-paperWhite-base)]',
        bg: 'bg-[var(--sys-color-paperWhite-base)]/5',
        scale: 1.05,
      };
    }
    return {
      border: 'border-dashed border-[var(--sys-color-concreteGrey-base)]/30',
      bg: 'bg-transparent',
      scale: 1.0,
    };
  };

  const stateStyles = getStateStyles();

  return (
    <motion.div
      className={`relative flex min-h-[320px] flex-col items-center justify-center rounded-megaphone border-2 ${stateStyles.border} ${stateStyles.bg} p-12 transition-colors`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      animate={{ scale: stateStyles.scale }}
      transition={{ type: 'spring', stiffness: 500, damping: 27 }}
      data-testid="file-dropzone"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(218, 246, 116, 0.05) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <input
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
        id="file-input"
        disabled={isProcessing}
      />

      {isProcessing ? (
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="h-16 w-16 rounded-march border-4 border-[var(--sys-color-inkGold-base)] border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="font-primary text-lg text-[var(--sys-color-inkGold-base)] uppercase tracking-wider">
            Synthesizing Artifacts...
          </p>
        </div>
      ) : (
        <>
          {/* Stencil Headline */}
          <motion.p
            className="font-display mb-4 text-4xl text-[var(--sys-color-solidarityRed-base)] font-black uppercase"
            style={{ transform: 'rotate(-2.5deg)' }}
            animate={{ rotate: [-2.5, -1.5, -2.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            DEPOSIT ARTIFACTS
          </motion.p>

          <h2 className="font-mono mb-6 text-xl font-bold uppercase tracking-[0.3em] text-[var(--sys-color-paperWhite-base)] opacity-40">
            [ ARCHIVE INPUT ]
          </h2>

          <label
            htmlFor="file-input"
            className="cursor-pointer rounded-pebble bg-[var(--sys-color-solidarityRed-base)] px-8 py-4 font-primary text-sm font-black uppercase tracking-widest text-[var(--sys-color-paperWhite-base)] transition-all hover:scale-105 hover:brightness-110 shadow-maximum"
          >
            Open Dossier
          </label>

          <p className="font-primary mt-6 text-xs uppercase tracking-widest text-[var(--sys-color-concreteGrey-base)]">
            or drag and drop {maxFiles > 1 ? `up to ${maxFiles} files` : 'a file'}
          </p>
          <p className="font-mono mt-2 text-[10px] uppercase tracking-[0.2em] text-[var(--sys-color-concreteGrey-base)]/40">
            {acceptedTypes.join(' ● ')}
          </p>
        </>
      )}

      {/* Industrial Accent (Bottom-Right) */}
      <div
        className="pointer-events-none absolute bottom-4 right-4 opacity-10"
        style={{ width: '120px', height: '120px' }}
      >
        <div className="h-full w-full rounded-megaphone border-4 border-[var(--sys-color-inkGold-base)]" />
      </div>
    </motion.div>
  );
};

export default DropZone;
