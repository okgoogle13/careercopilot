/**
 * CLASSIFICATION: Support Component Only
 * Prototype-only component.
 */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '../ui/SectionHeader';
import { TextInput } from '../ui/TextInput';
import { PrimaryButton } from '../ui/PrimaryButton';
import { DocumentInput } from '../../../components/DocumentInput';
import { StatusSpecificLoadingState } from '../ui/StatusSpecificLoadingState';

export function JobInputPanel() {
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 8000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: 1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="p-10 bg-[var(--sys-color-charcoalBackground-steps-1)] border border-[var(--sys-color-outline-variant)] shadow-[var(--sys-shadow-elevation2Placard)] relative overflow-hidden"
      style={{ borderRadius: 'var(--sys-shape-block-main)' }}
    >
      {/* Wheat-paste noise background */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wall-4-light.png')]" />

      <div className="relative z-10">
        {isLoading ? (
          <StatusSpecificLoadingState />
        ) : (
          <>
            <SectionHeader
              title="Target Role"
              subtitle="Upload the job description or paste raw text. We will extract the exact criteria they are using to filter you out."
            />
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TextInput
                  label="Target Role"
                  placeholder="e.g. Senior Frontend Engineer"
                />
                <TextInput
                  label="Company Name"
                  placeholder="e.g. TechCorp Inc."
                />
              </div>
              <DocumentInput
                onProcess={(files, rawText) => {}}
                isLoading={false}
              />
              <div className="flex justify-end">
                <PrimaryButton
                  label="Analyze Requirements"
                  onClick={handleAnalyze}
                  variant="strike"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
