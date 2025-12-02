/**
 * ELECTRIC ALCHEMIST: APPLICATION GENERATOR MODAL
 *
 * One-click job application package generation.
 * Uses Electric Alchemist design system components.
 */

import React, { useState } from 'react';
import { CheckCircle2, FileText, Mail, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Card } from './Card';
import { cn } from '@/lib/utils';
import type { ApplicationPackage } from '@/api/workflowService';
import { workflowService } from '@/api/workflowService';
import { isApiError } from '@/types/api';

export interface ApplicationGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  jobTitle: string;
  jobDescription: string;
  companyName: string;
  onSuccess?: (applicationPackage: ApplicationPackage) => void;
}

const steps = ['Prepare Documents', 'Customize Content', 'Review', 'Submit'];

/**
 * ApplicationGeneratorModal Component
 *
 * Modal for generating complete job application packages.
 */
export const ApplicationGeneratorModal: React.FC<ApplicationGeneratorModalProps> = ({
  open,
  onClose,
  jobTitle,
  jobDescription,
  companyName,
  onSuccess,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applicationPackage, setApplicationPackage] = useState<ApplicationPackage | null>(null);
  const [progress, setProgress] = useState(0);

  const handleGeneratePackage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await workflowService.generateApplicationPackage({
        jobTitle,
        jobDescription,
        companyName,
      });

      if (isApiError(response)) {
        setError(response.message || 'Failed to generate application package');
        return;
      }

      setApplicationPackage(response.data);
      setActiveStep(2);
    } catch (error) {
      console.error('Error generating application package:', error);
      setError('Failed to generate application package. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!applicationPackage) return;

    setIsLoading(true);
    setError(null);

    try {
      setActiveStep(3);
      setProgress(33);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(66);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(100);

      onSuccess?.(applicationPackage);
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error('Error submitting application:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit application');
      setActiveStep(2);
    } finally {
      setIsLoading(false);
    }
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
            onClick={onClose}
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
                  <h2 className="text-hero text-xl text-on-surface">Generate Job Application</h2>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-surface-container-high transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-on-surface" />
                  </button>
                </div>

                {/* Job Info */}
                <Card variant="default" className="mb-6 p-4 bg-surface-container">
                  <p className="text-data text-xs text-on-surface-variant mb-1">Job Position</p>
                  <p className="text-hero text-base font-semibold mb-1 text-on-surface">
                    {jobTitle}
                  </p>
                  <p className="text-human text-sm text-on-surface-variant">{companyName}</p>
                </Card>

                {/* Stepper */}
                <div className="flex items-center justify-between mb-6">
                  {steps.map((label, index) => (
                    <div key={label} className="flex items-center flex-1">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-data text-xs font-medium',
                          index <= activeStep
                            ? 'bg-primary text-on-primary-container'
                            : 'bg-surface-container text-on-surface-variant'
                        )}
                      >
                        {index < activeStep ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={cn(
                            'flex-1 h-0.5 mx-2',
                            index < activeStep ? 'bg-primary' : 'bg-outline-variant'
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 p-3 bg-error-container border border-error rounded-[8px] text-on-error text-human text-sm">
                    {error}
                  </div>
                )}

                {/* Step Content */}
                <div className="min-h-[200px] mb-6">
                  {activeStep === 0 && (
                    <div className="space-y-4">
                      <p className="text-human text-on-surface mb-4">
                        We'll generate a complete application package with:
                      </p>
                      <div className="space-y-3">
                        {[
                          'Tailored resume optimized for this job',
                          'Custom cover letter addressing the role',
                          'Key Selection Criteria responses',
                          'ATS optimization analysis',
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                            <p className="text-human text-sm text-on-surface">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-human text-on-surface mb-4">Customizing your application...</p>
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {activeStep === 2 && applicationPackage && (
                    <div className="space-y-4">
                      <p className="text-hero text-base font-semibold text-on-surface mb-4">
                        Review Your Application Package
                      </p>

                      <Card variant="default" className="p-4 border-outline-variant">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="w-4 h-4 text-primary" />
                              <p className="text-hero text-sm text-on-surface">Resume</p>
                            </div>
                            <p className="text-data text-xs text-on-surface-variant">
                              Tailored for {jobTitle} position
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Mail className="w-4 h-4 text-primary" />
                              <p className="text-hero text-sm text-on-surface">Cover Letter</p>
                            </div>
                            <p className="text-data text-xs text-on-surface-variant">
                              Custom message addressing company and role
                            </p>
                          </div>

                          {applicationPackage.kscResponses && (
                            <div>
                              <p className="text-hero text-sm text-on-surface mb-2">
                                Key Selection Criteria
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {applicationPackage.kscResponses.map((_, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-surface-container text-data text-xs rounded-[8px] text-on-surface"
                                  >
                                    KSC {idx + 1}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>

                      <p className="text-data text-xs text-on-surface-variant">
                        You can further customize these documents after submission
                      </p>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      {progress < 100 ? (
                        <>
                          <div className="relative w-16 h-16">
                            <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
                            <div
                              className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"
                              style={{
                                clipPath: `inset(0 ${100 - progress}% 0 0)`,
                              }}
                            />
                          </div>
                          <p className="text-human text-on-surface">Submitting your application...</p>
                          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-primary"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-16 h-16 text-primary" />
                          <p className="text-hero text-lg text-on-surface">Application Submitted!</p>
                          <p className="text-human text-sm text-on-surface-variant text-center">
                            Your application package has been generated and is ready to send
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                    Cancel
                  </Button>
                  {activeStep === 0 && (
                    <Button variant="default" onClick={handleGeneratePackage} disabled={isLoading}>
                      {isLoading ? 'Generating...' : 'Generate Package'}
                    </Button>
                  )}
                  {activeStep === 2 && (
                    <Button
                      variant="default"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit Application
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

