import { Pebble, Signal, Stone } from '@/components/ui';
import { ValidationDashboard } from '@/features/onboarding/components/ValidationDashboard';
import { useCareerIngestion } from '@/hooks/useCareerIngestion';
import { CareerDatabase } from '@/types/api';
import { m3Toast } from '@/utils/toast';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, FileText, Fingerprint, Microscope } from 'lucide-react';
import React, { useState } from 'react';

// Laboratory Assets
import naturesClockwork from '../assets/specimens/natures_clockwork.jpg';
import paperGrain from '../assets/textures/paper-grain.png';

type UploadStage = 'idle' | 'uploading' | 'extracting' | 'processing' | 'embedding' | 'complete';

/**
 * CareerCopilot Ingestion Page ("The Mulch / Specimen Tray")
 *
 * V3.1 Laboratory Mode Implementation:
 * ✓ ASSET-08 Verification Stamp Integration
 * ✓ Texture-Laboratory-Parchment overlay
 * ✓ Skeleton Etch Motif metaphors
 * ✓ Clinical palette restricted to Obsidian/Parchment/Wattle
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
      m3Toast.success('Ingestion Complete', 'Specimen data archived successfully.');
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
        return 'Analyzing Career Specimen...';
      case 'embedding':
        return 'Mapping Professional Vector...';
      case 'complete':
        return 'Extraction Complete.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-specimen-night-darkest flex items-center justify-center p-6 relative overflow-hidden">
      {/* Texture Layer: Laboratory Parchment */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url(${paperGrain})`, backgroundRepeat: 'repeat' }}
      />

      {/* Background Motifs */}
      <div className="absolute top-10 left-10 w-64 h-64 grayscale opacity-10 pointer-events-none border border-flannel-flower/20 rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 grayscale opacity-5 pointer-events-none border-l border-t border-flannel-flower/20 rounded-tl-[120px]" />

      <Stone
        mode="laboratory"
        elevation="floating"
        className="max-w-2xl w-full border-2 border-flannel-flower/5 shadow-maximum relative z-10"
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
                className="w-full h-full object-contain rounded-full border-4 border-wattle-gold"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header: Clinical Focus */}
        <header className="text-center mb-12">
          <div className="w-24 h-24 bg-wattle-gold/5 rounded-stone flex items-center justify-center mx-auto mb-6 border border-wattle-gold/10 relative">
            <div className="absolute inset-0 animate-pulse border border-wattle-gold/5 rounded-stone scale-110" />
            <Microscope className="w-12 h-12 text-wattle-gold" />
          </div>
          <h1 className="text-5xl font-bloom font-bold text-parchment tracking-tighter uppercase">
            Specimen Ingestion
          </h1>
          <p className="font-annotation text-xs text-flannel-flower-dark mt-3 tracking-[0.3em] uppercase opacity-60">
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

        {/* File Ingestion Zone (The Mulch) */}
        <div
          className={`
            border-2 border-dashed rounded-stone p-12 text-center mb-10
            transition-all duration-500 var(--ease-viscous-breeze)
            ${isLoading ? 'opacity-30 border-parchment/5 grayscale' : 'border-flannel-flower/20 hover:border-wattle-gold/50 hover:bg-white/[0.02]'}
          `}
        >
          <input
            accept=".pdf,.docx,.txt"
            className="hidden"
            id="file-upload"
            multiple
            type="file"
            onChange={handleFileSelect}
            disabled={isLoading}
          />

          <label
            htmlFor="file-upload"
            className="cursor-pointer group"
          >
            <div className="mb-6 flex justify-center">
              <Fingerprint
                className={`w-12 h-12 transition-colors duration-500 ${isLoading ? 'text-parchment/10' : 'text-flannel-flower group-hover:text-wattle-gold'}`}
              />
            </div>
            <Pebble
              variant="secondary"
              disabled={isLoading}
              className="pointer-events-none font-bold tracking-widest uppercase text-xs"
              size="sm"
            >
              Deposit Payloads
            </Pebble>
            <p className="mt-4 font-annotation text-[9px] text-flannel-flower/40 uppercase tracking-tighter">
              PDF / DOCX / TEXT specimens accepted
            </p>
          </label>

          {selectedFiles.length > 0 && (
            <div className="mt-10 space-y-3">
              {selectedFiles.map((file, idx) => (
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-stone border border-flannel-flower/10"
                >
                  <FileText className="w-4 h-4 text-wattle-gold/50" />
                  <div className="text-left flex-grow">
                    <div className="text-xs font-field-note text-parchment/80">{file.name}</div>
                    <div className="text-[10px] font-annotation text-flannel-flower-dark uppercase tracking-widest">
                      Payload: {Math.round(file.size / 1024)} KB
                    </div>
                  </div>
                  <CheckCircle className="w-3 h-3 text-eucalypt-smoke" />
                </motion.div>
              ))}
            </div>
          )}
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

        {/* Clinical Progress Visualization */}
        {isLoading && (
          <div className="mt-10 transition-all animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-annotation text-[10px] text-flannel-flower-dark tracking-[0.2em] uppercase">
                Extraction Protocol In Progress
              </span>
              <span className="font-annotation text-[10px] text-wattle-gold font-bold">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-specimen-night-darkest h-1.5 rounded-full overflow-hidden border border-white/5">
              <motion.div
                className="bg-wattle-gold h-full shadow-[0_0_15px_rgba(212,168,75,0.4)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'linear' }}
              />
            </div>
          </div>
        )}

        {/* Laboratory Technical Audit */}
        <div className="mt-12 p-6 bg-specimen-night/40 rounded-stone border border-flannel-flower/10 flex gap-5">
          <Microscope className="w-8 h-8 text-wattle-gold/40 shrink-0" />
          <p className="font-field-note text-[11px] text-parchment/50 leading-relaxed italic">
            <strong className="text-parchment font-annotation uppercase tracking-wider not-italic">
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
