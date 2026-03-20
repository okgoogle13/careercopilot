/**
 * CLASSIFICATION: Support Component Only
 * Prototype-only component.
 */
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { FileIcon } from './icons/FileIcon';
import { TrashIcon } from './icons/TrashIcon';

interface DocumentInputProps {
  onProcess: (files: File[], rawText?: string) => void;
  isLoading: boolean;
}

const MAX_FILES = 100;
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

export const DocumentInput: React.FC<DocumentInputProps> = ({ onProcess, isLoading }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [rawText, setRawText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    setError(null);
    const newFiles = Array.from(incomingFiles).filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((files.length > 0 || rawText.trim().length > 0) && !isLoading) {
      onProcess(files, rawText.trim());
    }
  };

  return (
    <div
      className="p-10 bg-[var(--sys-color-charcoalBackground-steps-1)] border border-[var(--sys-color-outline-variant)] my-8 mx-auto max-w-6xl"
      style={{ borderRadius: 'var(--sys-shape-blockRiot02)' }}
    >
      <h2 className="text-3xl type-solidarityProtest text-[var(--sys-color-paperWhite-base)] mb-4 uppercase tracking-tight">
        1. Upload Your Career Documents
      </h2>
      <p className="type-melancholyLonging text-[var(--sys-color-worker-ash-base)] text-lg mb-8">
        Upload your career documents (.pdf, .docx, .txt) or paste raw text. The AI will process up
        to 100 documents to de-duplicate and merge the information.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className={`relative border-2 border-dashed p-12 text-center transition-all cursor-pointer
              ${isDragging ? 'border-[var(--sys-color-solidarityRed-base)] bg-[var(--sys-color-charcoalBackground-steps-2)]' : 'border-[var(--sys-color-outline-variant)] hover:border-[var(--sys-color-paperWhite-base)]'}`}
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
              disabled={isLoading}
            />
            <div className="flex flex-col items-center text-[var(--sys-color-paperWhite-base)]">
              <UploadIcon className="w-16 h-16 mb-6 text-[var(--sys-color-solidarityRed-base)]" />
              <p className="text-xl font-bold uppercase tracking-wider mb-2">
                Drag & drop files here
              </p>
              <p className="text-[var(--sys-color-worker-ash-base)]">
                or click to select (Up to {MAX_FILES} documents)
              </p>
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
              onChange={(e) => setRawText(e.target.value)}
              placeholder="If your PDF fails to upload, paste your unformatted resume or job description here..."
              className="flex-grow p-6 bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-paperWhite-base)] focus:border-[var(--sys-color-solidarityRed-base)] focus:outline-none focus:shadow-[var(--sys-shadow-elevation2Placard)] transition-all resize-y"
              style={{ borderRadius: 'var(--sys-shape-blockRiot01)', minHeight: '200px' }}
              disabled={isLoading}
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
                  className="flex items-center justify-between bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-outline-variant)] p-4 animate-fade-in"
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
                    disabled={isLoading}
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

        <div className="mt-10 flex justify-end">
          <button
            type="submit"
            disabled={isLoading || files.length === 0}
            className="px-8 py-4 bg-[var(--sys-color-solidarityRed-base)] text-[var(--sys-color-paperWhite-base)] font-bold text-lg uppercase tracking-wider disabled:bg-[var(--sys-color-concreteGrey-steps-0)] disabled:cursor-not-allowed transition-all hover:-translate-y-1 hover:shadow-[var(--sys-shadow-elevation3HoverLift)]"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            {isLoading ? 'Processing...' : `Process ${files.length} File(s)`}
          </button>
        </div>
      </form>
    </div>
  );
};
