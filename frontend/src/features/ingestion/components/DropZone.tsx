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

  // Visual states from DOC-004
  const getStateStyles = () => {
    if (isProcessing) {
      return {
        border: 'border-solid border-sage',
        bg: 'bg-sage/10',
        scale: 1.0,
      };
    }
    if (isDragOver) {
      return {
        border: 'border-solid border-sage',
        bg: 'bg-sage/5',
        scale: 1.05,
      };
    }
    return {
      border: 'border-dashed border-sage',
      bg: 'bg-transparent',
      scale: 1.0,
    };
  };

  const stateStyles = getStateStyles();

  return (
    <motion.div
      className={`relative flex min-h-[320px] flex-col items-center justify-center rounded-tech border-2 ${stateStyles.border} ${stateStyles.bg} p-12 transition-colors`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      animate={{ scale: stateStyles.scale }}
      transition={{ type: 'spring', stiffness: 500, damping: 27 }}
      data-testid="file-dropzone"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(180, 216, 174, 0.05) 1px, transparent 1px)',
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
            className="h-16 w-16 rounded-sentry border-4 border-sage border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="font-leaf text-lg text-sage">Digesting files...</p>
        </div>
      ) : (
        <>
          {/* Chaos Script Text */}
          <motion.p
            className="font-vine mb-4 text-4xl text-ink"
            style={{ transform: 'rotate(-3.5deg)' }}
            animate={{ rotate: [-3.5, -2.5, -3.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            drop chaos here
          </motion.p>

          {/* Trunk Headline */}
          <h2 className="font-trunk mb-6 text-2xl font-black uppercase tracking-tight text-white">
            HISTORY
          </h2>

          <label
            htmlFor="file-input"
            className="cursor-pointer rounded-pebble bg-terracotta px-6 py-3 font-leaf text-sm font-medium text-white transition-all hover:scale-105 hover:brightness-110"
          >
            Browse Files
          </label>

          <p className="font-leaf mt-4 text-sm text-white/60">
            or drag and drop {maxFiles > 1 ? `up to ${maxFiles} files` : 'a file'}
          </p>
          <p className="font-mono mt-2 text-xs uppercase tracking-wide text-white/40">
            {acceptedTypes.join(', ')}
          </p>
        </>
      )}

      {/* Landscape Asset (Bottom-Right) */}
      <div
        className="pointer-events-none absolute bottom-4 right-4 opacity-30"
        style={{ width: '120px', height: '120px' }}
      >
        {/* Placeholder for native-group.png */}
        <div className="h-full w-full rounded-sentry bg-gradient-to-br from-sage/20 to-terracotta/20" />
      </div>
    </motion.div>
  );
};

export default DropZone;
