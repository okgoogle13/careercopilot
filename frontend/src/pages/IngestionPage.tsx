import { Pebble, Signal, Stone } from '@/components/ui';
import { ValidationDashboard } from '@/features/onboarding/components/ValidationDashboard';
import { useCareerIngestion } from '@/hooks/useCareerIngestion';
import { CareerDatabase } from '@/types/api';
import { m3Toast } from '@/utils/toast';
import { BrainCircuit, CheckCircle, CloudUpload, FileText } from 'lucide-react';
import React, { useState } from 'react';

type UploadStage = 'idle' | 'uploading' | 'extracting' | 'processing' | 'embedding' | 'complete';

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
      m3Toast.success('Ingestion Complete', 'Your professional vector has been updated.');
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadStage('idle');
      setProgress(0);
      m3Toast.error('Ingestion Failed', 'Please verify your files and try again.');
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
        return 'Uploading payloads...';
      case 'extracting':
        return 'Harvesting semantic text...';
      case 'processing':
        return 'Generating tactical insights...';
      case 'embedding':
        return 'Mapping professional vector...';
      case 'complete':
        return 'Synthesis complete!';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-specimen-night)] flex items-center justify-center p-6 bg-gradient-to-b from-transparent to-[var(--color-wattle-gold)]/5">
      <Stone
        mode="laboratory"
        elevation="raised"
        className="max-w-2xl w-full border border-[var(--color-eucalypt-smoke-base)]/30 shadow-2xl"
      >
        {/* Header */}
        <header className="text-center mb-10">
          <div className="w-20 h-20 bg-[var(--color-wattle-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--color-wattle-gold)]/20 shadow-inner">
            <BrainCircuit className="w-10 h-10 text-[var(--color-wattle-gold)]" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-parchment)] tracking-tight">
            Career DNA Ingestion
          </h1>
          <p className="text-lg text-[var(--color-flannel-flower-dark)] mt-2">
            Upload your resume and artifacts to seed the AI strategy engine.
          </p>
        </header>

        {/* Error State */}
        {error && (
          <Signal
            severity="error"
            variant="tonal"
            className="mb-6"
          >
            {error}
          </Signal>
        )}

        {/* File Upload Zone */}
        <div
          className={`
                        border-2 border-dashed rounded-pebble p-10 text-center mb-8
                        transition-all duration-300 var(--ease-viscous-breeze)
                        ${isLoading ? 'opacity-50 border-white/5' : 'border-[var(--color-eucalypt-smoke-base)]/40 hover:border-[var(--color-wattle-gold)] hover:bg-white/5'}
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
            className="cursor-pointer"
          >
            <Pebble
              variant="ghost"
              iconLeft={<CloudUpload className="w-5 h-5" />}
              disabled={isLoading}
              className="pointer-events-none"
              size="md"
            >
              Select Documents
            </Pebble>
          </label>

          {selectedFiles.length > 0 && (
            <div className="mt-8 space-y-3">
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-stone border border-white/5"
                >
                  <FileText className="w-5 h-5 text-[var(--color-wattle-gold)]" />
                  <div className="text-left flex-grow">
                    <div className="text-sm font-field-note text-[var(--color-parchment)]">
                      {file.name}
                    </div>
                    <div className="text-[10px] font-annotation text-[var(--color-flannel-flower-dark)] uppercase tracking-widest">
                      {(file.size / 1024).toFixed(1)} KB payload
                    </div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-[var(--color-eucalypt-smoke-base)]/40" />
                </div>
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
          size="md"
          className="w-full h-16 text-lg"
        >
          {isLoading ? getStageMessage() : 'Initialize Synthesis'}
        </Pebble>

        {/* Progress Visualization */}
        {isLoading && (
          <div className="mt-8 transition-all animate-in fade-in slide-in-from-top-2">
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5 shadow-inner">
              <div
                className="bg-[var(--color-wattle-gold)] h-full transition-all duration-500 var(--ease-viscous-breeze) shadow-[0_0_10px_var(--color-wattle-gold)/50]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="font-annotation text-[10px] text-[var(--color-flannel-flower-dark)] tracking-tighter uppercase">
                Extraction in progress...
              </span>
              <span className="font-annotation text-[10px] text-[var(--color-wattle-gold)] font-bold">
                {progress}%
              </span>
            </div>
          </div>
        )}

        {/* Laboratory Notice */}
        <div className="mt-10 p-4 bg-[var(--ref-palette-primary-90)]/10 rounded-[var(--radius-stone)] border border-[var(--ref-palette-primary-90)]/20 flex gap-4">
          <BrainCircuit className="w-6 h-6 text-[var(--ref-palette-primary-60)] shrink-0" />
          <p className="font-field-note text-xs text-[var(--color-parchment)]/70 leading-relaxed">
            <strong className="text-[var(--color-parchment)]">Technical Note:</strong> Our inference
            engine uses Gemini 1.5 Pro to derive structured professional vectors. Processing may
            take a few moments as we harvest semantic embeddings.
          </p>
        </div>
      </Stone>
    </div>
  );
};
