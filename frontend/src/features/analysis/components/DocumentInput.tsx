/**
 * CLASSIFICATION: Support Component Only
 * Prototype-only component.
 */
import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadIcon } from './icons/UploadIcon';
import { FileIcon } from './icons/FileIcon';
import { TrashIcon } from './icons/TrashIcon';
import { KrDarkSpring } from '@/design/tokens/motion-presets';

interface DocumentInputProps {
  onProcess: (
    files: File[],
    rawText?: string,
    fileData?: { data: string; mimeType: string }[]
  ) => void;
  isLoading: boolean;
  hideTitle?: boolean;
  onRawTextChange?: (text: string) => void;
  initialRawText?: string;
  submitLabel?: string;
}

const MAX_FILES = 10; // Reduced for prototype stability
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

export const DocumentInput: React.FC<DocumentInputProps> = ({
  onProcess,
  isLoading,
  hideTitle,
  onRawTextChange,
  initialRawText = '',
  submitLabel,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [rawText, setRawText] = useState(initialRawText);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setRawText(newText);
    if (onRawTextChange) {
      onRawTextChange(newText);
    }
  };

  const readFileAsBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve({ data: base64String, mimeType: file.type || 'application/octet-stream' });
      };
      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = useCallback((incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    setError(null);
    const newFiles = Array.from(incomingFiles).filter((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const isValidExtension = ['pdf', 'docx', 'txt'].includes(extension || '');

      if (file.size > MAX_FILE_SIZE) {
        setError(`File too large: ${file.name}. Max size is 10MB.`);
        return false;
      }

      if (!ALLOWED_TYPES.includes(file.type) && !isValidExtension) {
        setError(`File type not supported: ${file.name}. Please use PDF, DOCX, or TXT.`);
        return false;
      }
      return true;
    });

    setFiles((prevFiles) => {
      const combined = [...prevFiles, ...newFiles];
      if (combined.length > MAX_FILES) {
        setError(`You can upload a maximum of ${MAX_FILES} documents.`);
        return combined.slice(0, MAX_FILES);
      }
      return combined;
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((files.length > 0 || rawText.trim().length > 0) && !isLoading && !isReading) {
      setIsReading(true);
      setError(null);
      try {
        const fileData = await Promise.all(files.map(readFileAsBase64));
        onProcess(files, rawText.trim(), fileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process files. Please try again.');
      } finally {
        setIsReading(false);
      }
    }
  };

  return (
    <div
      className="p-10 bg-[var(--sys-color-charcoalBackground-steps-2)] border-l-4 border-l-[var(--sys-color-solidarityRed-base)] border-y border-r border-y-[var(--kr-color-concrete-grey-steps-0)] border-r-[var(--kr-color-concrete-grey-steps-0)] shadow-[var(--sys-shadow-elevation2Placard)] my-8 mx-auto max-w-6xl"
      style={{ borderRadius: 'var(--sys-shape-blockRiot02)' }}
    >
      {!hideTitle && (
        <h2 className="text-3xl type-solidarityProtest text-[var(--sys-color-paperWhite-base)] mb-4 uppercase tracking-tight">
          1. Upload Your Career Documents
        </h2>
      )}
      <div className="flex gap-2 mb-8">
        <span className="px-3 py-1 bg-[var(--sys-color-charcoalBackground-steps-2)] text-[var(--sys-color-worker-ash-base)] text-sm font-bold uppercase tracking-wider rounded-full border border-[var(--kr-color-concrete-grey-steps-0)]">
          Up to {MAX_FILES} documents
        </span>
        <span className="px-3 py-1 bg-[var(--sys-color-charcoalBackground-steps-2)] text-[var(--sys-color-worker-ash-base)] text-sm font-bold uppercase tracking-wider rounded-full border border-[var(--kr-color-concrete-grey-steps-0)]">
          PDF · DOCX · TXT
        </span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className={`relative border-2 border-dashed p-12 text-center transition-all cursor-pointer
              ${isDragging ? 'border-[var(--sys-color-primary-base)] bg-[var(--sys-color-primaryContainer-base)]' : 'border-[var(--kr-color-concrete-grey-steps-0)] hover:border-[var(--sys-color-paperWhite-base)]'}`}
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
              disabled={isLoading || isReading}
            />
            <div className="flex flex-col items-center text-[var(--sys-color-paperWhite-base)]">
              <motion.div
                animate={{ scale: isDragging ? 1.2 : 1 }}
                transition={KrDarkSpring}
              >
                <UploadIcon className="w-16 h-16 mb-6 text-[var(--sys-color-solidarityRed-base)]" />
              </motion.div>
              <p className="text-xl font-bold uppercase tracking-wider mb-2">
                Drag & drop files here
              </p>
              <p className="text-[var(--sys-color-worker-ash-base)]">or click to select</p>
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="rawText"
              className="text-xl type-solidarityProtest text-[var(--sys-color-paperWhite-base)] mb-4 uppercase tracking-tight"
            >
              Paste raw text instead
            </label>
            <textarea
              id="rawText"
              value={rawText}
              onChange={handleTextChange}
              placeholder="If your PDF fails to upload, paste your unformatted resume or job description here..."
              className="flex-grow p-6 bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--kr-color-concrete-grey-steps-0)] text-[var(--sys-color-paperWhite-base)] focus:border-[var(--sys-color-primary-base)] focus:outline-none focus:shadow-[var(--sys-shadow-elevation2Placard)] transition-all resize-y"
              style={{ borderRadius: 'var(--sys-shape-blockRiot01)', minHeight: '200px' }}
              disabled={isLoading || isReading}
            />
          </div>
        </div>

        {error && (
          <p className="text-[var(--sys-color-kr-charcoalRed-base)] font-bold mt-6 text-lg uppercase tracking-wider">
            {error}
          </p>
        )}

        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl type-solidarityProtest text-[var(--sys-color-paperWhite-base)] mb-4 uppercase tracking-tight">
              Selected Files:
            </h3>
            <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--kr-color-concrete-grey-steps-0)] p-4 animate-fade-in"
                  style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <FileIcon className="w-8 h-8 text-[var(--sys-color-inkGold-base)] flex-shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-lg font-bold text-[var(--sys-color-paperWhite-base)] truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-[var(--sys-color-worker-ash-base)] uppercase tracking-wider">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    disabled={isLoading || isReading}
                    className="p-2 text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-kr-charcoalRed-base)] hover:bg-[var(--sys-color-charcoalBackground-steps-3)] disabled:text-[var(--sys-color-concreteGrey-steps-0)] transition-colors"
                    style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-end min-h-[60px]">
          <AnimatePresence>
            {(files.length > 0 || rawText.trim().length > 0) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                type="submit"
                disabled={isLoading || isReading}
                className="px-8 py-4 bg-[var(--sys-color-solidarityRed-base)] text-[var(--sys-color-paperWhite-base)] font-bold text-lg uppercase tracking-wider disabled:bg-[var(--sys-color-concreteGrey-steps-0)] disabled:cursor-not-allowed transition-all hover:-translate-y-1 hover:shadow-[var(--sys-shadow-elevation3HoverLift)]"
                style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
              >
                {isLoading || isReading
                  ? 'Processing...'
                  : submitLabel ||
                    `Process ${files.length > 0 ? `${files.length} File(s)` : 'Text'}`}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
};
