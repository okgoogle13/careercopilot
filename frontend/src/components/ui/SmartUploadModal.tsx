/**
 * ELECTRIC ALCHEMIST: SMART UPLOAD MODAL
 *
 * AI-powered document upload with automatic tag suggestion.
 * Uses Electric Alchemist design system components.
 */

import React, { useState } from 'react';
import { CloudUpload, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Card } from './Card';
import { cn } from '@/lib/utils';
import { smartIngestionService } from '@/api/smartIngestionService';
import type { ContextTags } from '@/api/smartIngestionService';
import { isApiError } from '@/types/api';

export interface SmartUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: (document: any) => void;
}

/**
 * SmartUploadModal Component
 *
 * Modal for uploading documents with AI-powered tag suggestions.
 */
export const SmartUploadModal: React.FC<SmartUploadModalProps> = ({
  open,
  onClose,
  onUploadComplete,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<'upload' | 'tagging' | 'saving'>('upload');
  const [suggestedTags, setSuggestedTags] = useState<ContextTags | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setStep('tagging');
    setIsLoading(true);

    try {
      const response = await smartIngestionService.uploadAndTag(selectedFile);

      if (isApiError(response)) {
        setError(response.message || 'Failed to process document');
        setStep('upload');
        return;
      }

      setSuggestedTags(response.data.suggestedTags);

      const tagLabels = Object.keys(response.data.suggestedTags)
        .filter((key) => response.data.suggestedTags[key as keyof ContextTags] > 0.5)
        .map((key) => key.replace(/_/g, ' ').toUpperCase());
      setSelectedTags(tagLabels);
    } catch (error) {
      console.error('Error processing document:', error);
      setError('An unexpected error occurred while processing the document');
      setStep('upload');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDocument = async () => {
    if (!file) return;

    setIsLoading(true);
    setStep('saving');

    try {
      const response = await smartIngestionService.extractAndSave({
        file,
        selectedTags,
        fileName: file.name,
      });

      if (isApiError(response)) {
        throw new Error(response.message || 'Failed to save document');
      }

      onUploadComplete({
        fileName: file.name,
        tags: selectedTags,
        ...response.data,
      });

      handleClose();
    } catch (error) {
      console.error('Error saving document:', error);
      setError(error instanceof Error ? error.message : 'Failed to save document');
      setStep('tagging');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setStep('upload');
    setSuggestedTags(null);
    setSelectedTags([]);
    setError(null);
    onClose();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-scrim"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-modal p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="pointer-events-auto w-full max-w-md"
            >
              <Card variant="default" className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-hero text-xl text-on-surface">
                    {step === 'upload' && 'Upload Document'}
                    {step === 'tagging' && 'Review & Tag Document'}
                    {step === 'saving' && 'Saving Document'}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="p-1 rounded-full hover:bg-surface-container-high transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-on-surface" />
                  </button>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 p-3 bg-error-container border border-error rounded-[8px] text-on-error text-human text-sm">
                    {error}
                  </div>
                )}

                {/* Content */}
                <div className="space-y-4">
                  {step === 'upload' && (
                    <label className="block">
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx,.txt"
                      />
                      <div className="border-2 border-dashed border-outline-variant rounded-[28px] p-12 text-center cursor-pointer hover:bg-surface-container-low transition-colors">
                        <CloudUpload className="w-12 h-12 text-primary mx-auto mb-4" />
                        <p className="text-hero text-lg mb-2 text-on-surface">
                          Drag & drop your document
                        </p>
                        <p className="text-human text-sm text-on-surface-variant">
                          or click to browse (PDF, DOC, DOCX, TXT)
                        </p>
                      </div>
                    </label>
                  )}

                  {step === 'tagging' && suggestedTags && (
                    <div>
                      <p className="text-human text-sm text-on-surface-variant mb-4">
                        AI has analyzed your document. Select the tags that apply:
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {Object.entries(suggestedTags).map(([key, confidence]) => {
                          const label = key.replace(/_/g, ' ').toUpperCase();
                          const isSelected = selectedTags.includes(label);
                          const showTag = confidence > 0.3;

                          if (!showTag) return null;

                          return (
                            <button
                              key={key}
                              onClick={() => toggleTag(label)}
                              className={cn(
                                'px-3 py-1.5 rounded-[8px] text-data text-xs transition-colors',
                                isSelected
                                  ? 'bg-primary text-on-primary-container'
                                  : 'bg-surface-container text-on-surface border border-outline-variant'
                              )}
                            >
                              {label} ({Math.round(confidence * 100)}%)
                            </button>
                          );
                        })}
                      </div>

                      <p className="text-data text-xs text-on-surface-variant mt-4">
                        Confidence scores shown in parentheses. AI suggestions are pre-selected.
                      </p>
                    </div>
                  )}

                  {step === 'saving' && (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-human text-on-surface">Saving your document...</p>
                    </div>
                  )}

                  {step === 'upload' && file && (
                    <div className="p-3 bg-tertiary-container rounded-[8px] flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-on-tertiary-container" />
                      <p className="text-human text-sm text-on-tertiary-container">
                        Selected: {file.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="ghost" onClick={handleClose}>
                    Cancel
                  </Button>
                  {step === 'tagging' && (
                    <Button
                      variant="default"
                      onClick={handleSaveDocument}
                      disabled={isLoading || selectedTags.length === 0}
                    >
                      {isLoading ? 'Saving...' : 'Save Document'}
                    </Button>
                  )}
                  {step === 'upload' && file && (
                    <Button variant="default" onClick={() => setStep('tagging')} disabled={isLoading}>
                      Next
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

