/**
 * ELECTRIC ALCHEMIST: APPLICATION GENERATOR MODAL
 *
 * A modal for generating job applications using AI.
 */

import React, { useState } from 'react';
import { X, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components';
import { ElectricInput as Input } from '@/components/electric/input';
import { ElectricTextarea as Textarea } from '@/components/electric/textarea';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

export interface ApplicationGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (jobDescription: string, resumeText: string) => Promise<void>;
  loading?: boolean;
  success?: boolean;
  error?: string | null;
  className?: string;
}

export function ApplicationGeneratorModal({
  open,
  onClose,
  onGenerate,
  loading = false,
  success = false,
  error = null,
  className,
}: ApplicationGeneratorModalProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');

  const handleGenerate = async (): Promise<void> => {
    if (!jobDescription.trim() || !resumeText.trim() || loading) return;
    try {
      await onGenerate(jobDescription.trim(), resumeText.trim());
    } catch (err) {
      console.error('Error generating application:', err);
    }
  };

  const handleReset = (): void => {
    setJobDescription('');
    setResumeText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen: boolean) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'bg-surface-container-highest rounded-lg p-6 w-full max-w-2xl',
            'shadow-lg z-50 focus:outline-none',
            className
          )}
        >
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Generate Application
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="rounded-full p-1 hover:bg-surface-variant/20"
                aria-label="Close"
                onClick={() => {
                  handleReset();
                  onClose();
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Application Generated Successfully!</h3>
              <p className="text-on-surface-variant mb-6">
                Your application has been generated and saved to your documents.
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  onClick={() => {
                    handleReset();
                    onClose();
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="job-description" className="block text-sm font-medium mb-1">
                    Job Description
                  </label>
                  <Textarea
                    id="job-description"
                    value={jobDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={5}
                    className="w-full"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="resume-text" className="block text-sm font-medium mb-1">
                    Your Resume/CV Text
                  </label>
                  <Textarea
                    id="resume-text"
                    value={resumeText}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResumeText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Paste your resume/CV text here..."
                    rows={5}
                    className="w-full"
                    disabled={loading}
                  />
                </div>

                {error && <p className="text-error text-sm mt-2">{error}</p>}
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleReset();
                    onClose();
                  }}
                  disabled={loading}
                  className="px-4"
                >
                  Cancel
                </Button>
                <Button onClick={handleGenerate} disabled={!jobDescription.trim() || !resumeText.trim() || loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Application
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ApplicationGeneratorModal;
