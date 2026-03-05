import { Pebble, Signal, Stone } from '@/components/ui';
import { ApplicationForm } from '@/components/ApplicationForm';
import { ValidationDashboard } from '@/features/onboarding/components/ValidationDashboard';
import { useCareerIngestion } from '@/hooks/useCareerIngestion';
import { CareerDatabase } from '@/types/api';
import { m3Toast } from '@/utils/toast';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, FileText, Fingerprint, Microscope } from 'lucide-react';
import React, { useState } from 'react';

// KrDark Assets
const naturesClockwork =
  '/assets/kr-solidarity/specimen/kr-solidarity__specimen__triage-natural-history__v1.png';
const paperGrain =
  '/assets/kr-solidarity/texture/kr-solidarity__substrate__kr-solidarity--texture--melbourne-laneway--v1__v1.png';

type UploadStage = 'idle' | 'uploading' | 'extracting' | 'processing' | 'embedding' | 'complete';

/**
 * CareerCopilot Ingestion Page ("The Mulch / KrMotif Tray")
 *
 * V3.1 KrDark Mode Implementation:
 * ✓ ASSET-08 Verification Stamp Integration
 * ✓ Texture-KrDark-Paper White overlay
 * ✓ Skeleton Etch Motif metaphors
 * ✓ Clinical palette restricted to Obsidian/Paper White/Ink
 */
export const IngestionPage: React.FC = () => {
  const { submitDocuments, updateCareerDatabase, isLoading, error } = useCareerIngestion();
  const [careerData, setCareerData] = useState<CareerDatabase | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadStage, setUploadStage] = useState<UploadStage>('idle');
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setUploadStage('uploading');
      setProgress(20);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUploadStage('extracting');
      setProgress(40);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUploadStage('processing');
      setProgress(60);

      const result = await submitDocuments(selectedFiles);

      setUploadStage('embedding');
      setProgress(90);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUploadStage('complete');
      setProgress(100);
      setCareerData(result);
      m3Toast.success('Ingestion Complete', 'KrMotif data archived successfully.');
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadStage('idle');
      setProgress(0);
      m3Toast.error('Ingestion Failed', 'A biological error occurred during extraction.');
    }
  };

  const handleDataUpdate = async (updatedData: CareerDatabase) => {
    setCareerData(updatedData);
    try {
      await updateCareerDatabase(updatedData);
    } catch (err) {
      console.error('Failed to update career data:', err);
    }
  };

  if (careerData) {
    return (
      <ValidationDashboard
        data={careerData}
        onUpdate={handleDataUpdate}
      />
    );
  }

  const getStageMessage = (): string => {
    switch (uploadStage) {
      case 'uploading':
        return 'Depositing Payloads...';
      case 'extracting':
        return 'Harvesting Semantic DNA...';
      case 'processing':
        return 'Analyzing Career KrMotif...';
      case 'embedding':
        return 'Mapping Professional Vector...';
      case 'complete':
        return 'Extraction Complete.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-asphalt-black-darkest flex items-center justify-center p-6 relative overflow-hidden">
      {/* Texture Layer: KrDark Paper White */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url(${paperGrain})`, backgroundRepeat: 'repeat' }}
      />

      {/* Background Motifs */}
      <div className="absolute top-10 left-10 w-64 h-64 grayscale opacity-10 pointer-events-none border border-concrete-grey/20 rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 grayscale opacity-5 pointer-events-none border-l border-t border-concrete-grey/20 rounded-tl-[120px]" />

      <Stone
        elevation="floating"
        className="max-w-2xl w-full border-2 border-concrete-grey/5 shadow-maximum relative z-10"
      >
        {/* Verification Stamp Shadowplay (ASSET-08) */}
        <AnimatePresence>
          {uploadStage === 'complete' && (
            <motion.div
              initial={{ scale: 2, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 0.15, rotate: -15 }}
              className="absolute top-10 right-10 w-48 h-48 pointer-events-none"
            >
              <img
                src={naturesClockwork}
                alt="Verified"
                className="w-full h-full object-contain rounded-full border-4 border-ink-gold"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header: Clinical Focus */}
        <header className="text-center mb-12">
          <div className="w-24 h-24 bg-ink-gold/5 rounded-stone flex items-center justify-center mx-auto mb-6 border border-ink-gold/10 relative">
            <div className="absolute inset-0 animate-pulse border border-ink-gold/5 rounded-stone scale-110" />
            <Microscope className="w-12 h-12 text-ink-gold" />
          </div>
          <h1 className="text-5xl font-bloom font-bold text-paper-white tracking-tighter uppercase">
            KrMotif Ingestion
          </h1>
          <p className="font-annotation text-xs text-concrete-grey-dark mt-3 tracking-[0.3em] uppercase opacity-60">
            [ PHASE.01: SEMANTIC_EXTRACTION ]
          </p>
        </header>

        {/* Error State */}
        {error && (
          <Signal
            severity="error"
            variant="tonal"
            className="mb-8 border-l-4"
          >
            <span className="font-annotation uppercase text-[10px] mr-2">Core Fault:</span> {error}
          </Signal>
        )}

        {/* File Ingestion Zone (ApplicationForm) */}
        <div className="mb-10">
          <ApplicationForm
            onUpload={(file) => {
              setSelectedFiles([file]);
            }}
            isVerifying={isLoading}
          />
        </div>

        {/* Synthesis Trigger */}
        <Pebble
          variant="primary"
          onClick={handleUpload}
          disabled={isLoading || selectedFiles.length === 0}
          isLoading={isLoading}
          size="lg"
          className="w-full h-20 text-xl font-black rounded-stone"
        >
          {isLoading ? getStageMessage() : 'Initialize Harvesting'}
        </Pebble>

        {/* KrDark Technical Audit */}
        <div className="mt-12 p-6 bg-asphalt-black/40 rounded-stone border border-concrete-grey/10 flex gap-5">
          <Microscope className="w-8 h-8 text-ink-gold/40 shrink-0" />
          <p className="font-field-note text-[11px] text-paper-white/50 leading-relaxed italic">
            <strong className="text-paper-white font-annotation uppercase tracking-wider not-italic">
              Clinical Audit:
            </strong>{' '}
            Professional vectors are extracted via Gemini 3.0 Pro. This process mandates biological
            time for semantic harvesting. Do not terminate terminal session during synthesis.
          </p>
        </div>
      </Stone>
    </div>
  );
};

export default IngestionPage;
