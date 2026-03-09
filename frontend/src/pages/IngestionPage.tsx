import { Pebble, Signal, Stone } from '@/components/ui';
import { ApplicationForm } from '@/components/ApplicationForm';
import { ValidationDashboard } from '@/features/onboarding/components/ValidationDashboard';
import { OnboardingProgress } from '@/features/onboarding/OnboardingProgress';
import { useCareerIngestion } from '@/hooks/useCareerIngestion';
import { CareerDatabase } from '@/types/api';
import { m3Toast } from '@/utils/toast';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, FileText, Fingerprint, Microscope } from 'lucide-react';
import React, { useState, useEffect } from 'react';

// KrDark Assets
const solidarityTexture =
  '/assets/kr-solidarity/abstract/kr-solidarity__atmospheric__texture--solidarity-chatgpt-image-f--v1.png';
const paperGrain =
  '/assets/kr-solidarity/texture/kr-solidarity__substrate__landmark--melbourne-laneway--v1.png';

import { LayeredHero } from '../components/kerala-rage/LayeredHero';
import { loadHeroRegistry } from '../design/hero/heroRegistry';
import { composeHero } from '../lib/composeHero';
import type { SolidarityManifest } from '../design/hero/heroTypes';

type UploadStage = 'idle' | 'uploading' | 'extracting' | 'processing' | 'embedding' | 'complete';

/**
 * CareerCopilot Ingestion Page ("The Deposit / Kr-Archive")
 *
 * V5.0 KR Solidarity Implementation:
 * ✓ KR-SOLID-030 Solidarity Approval Plate
 * ✓ Texture-KrDark-Paper White overlay (Substrate)
 * ✓ Industrial Stencil metaphors
 * ✓ Clinical palette restricted to Charcoal/Paper White/Ink
 */
export const IngestionPage: React.FC = () => {
  const { submitDocuments, updateCareerDatabase, isLoading, error } = useCareerIngestion();
  const [careerData, setCareerData] = useState<CareerDatabase | null>(null);
  const [heroData, setHeroData] = useState<{
    layers: any[];
    typography: any;
    animation: any;
    zIndexMap: any;
  } | null>(null);

  useEffect(() => {
    async function loadHero() {
      try {
        const [manifest, registry] = await Promise.all([
          fetch('/assets/kerala-rage-kr-solidarity-manifest.json').then((r) => r.json()),
          loadHeroRegistry(),
        ]);

        const result = composeHero(
          manifest as SolidarityManifest,
          registry,
          'kr-hero-industrial-collective-005'
        );

        if (result.valid) {
          setHeroData({
            layers: result.resolvedLayers,
            typography: result.typography,
            animation: result.animation,
            zIndexMap: result.zIndexMap,
          });
        }
      } catch (error) {
        console.error('Failed to load ingestion hero:', error);
      }
    }
    loadHero();
  }, []);
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
      m3Toast.success('Ingestion Complete', 'Professional data archived successfully.');
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadStage('idle');
      setProgress(0);
      m3Toast.error('Ingestion Failed', 'A system fault occurred during extraction.');
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
        return 'Extracting Semantic Identity...';
      case 'processing':
        return 'Analyzing Professional Profile...';
      case 'embedding':
        return 'Mapping Career Vector...';
      case 'complete':
        return 'Archive Complete.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-asphalt-black-darkest flex items-center justify-center p-6 relative overflow-hidden">
      {/* Hero Engine Integration: Industrial Background */}
      {heroData && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <LayeredHero
            layers={heroData.layers}
            typography={{ ...heroData.typography, headline: '', supporting: '' }}
            animation={{ ...heroData.animation, scroll_behavior: 'none' }}
            zIndexMap={heroData.zIndexMap}
            className="h-full"
          />
        </div>
      )}

      <Stone
        elevation="floating"
        className="max-w-2xl w-full border-2 border-concrete-grey/5 shadow-maximum relative z-10"
      >
        {/* Solidarity Approval Plate (KR-SOLID-030 Metaphor) */}
        <AnimatePresence>
          {uploadStage === 'complete' && (
            <motion.div
              initial={{ scale: 2, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 0.15, rotate: -15 }}
              className="absolute top-10 right-10 w-48 h-48 pointer-events-none"
            >
              <img
                src={solidarityTexture}
                alt="Verified"
                className="w-full h-full object-contain rounded-stone border-4 border-ink-gold"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header: Clinical Focus */}
        <header className="text-center mb-12">
          <div className="mb-8">
            <OnboardingProgress
              currentStep={2}
              totalSteps={3}
              steps={['Choose field', 'Upload resume', 'Review']}
            />
          </div>
          <div className="w-24 h-24 bg-ink-gold/5 rounded-stone flex items-center justify-center mx-auto mb-6 border border-ink-gold/10 relative">
            <div className="absolute inset-0 animate-pulse border border-ink-gold/5 rounded-stone scale-110" />
            <Microscope className="w-12 h-12 text-ink-gold" />
          </div>
          <h1 className="text-5xl font-bloom font-bold text-paper-white tracking-tighter uppercase">
            Deposit Identity
          </h1>
          <p className="font-annotation text-xs text-concrete-grey-dark mt-3 tracking-[0.3em] uppercase opacity-60">
            [ PHASE.01: SEMANTIC_ARCHIVAL ]
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
          {isLoading ? getStageMessage() : 'Initialize Archival'}
        </Pebble>

        {/* KrDark Technical Audit */}
        <div className="mt-12 p-6 bg-asphalt-black/40 rounded-stone border border-concrete-grey/10 flex gap-5">
          <Microscope className="w-8 h-8 text-ink-gold/40 shrink-0" />
          <p className="font-field-note text-[11px] text-paper-white/50 leading-relaxed italic">
            <strong className="text-paper-white font-annotation uppercase tracking-wider not-italic">
              Compliance Audit:
            </strong>{' '}
            Professional vectors are extracted via industrial-grade LLM processing. This process
            mandates time for secure identity archival. Do not terminate session during synthesis.
          </p>
        </div>
      </Stone>
    </div>
  );
};

export default IngestionPage;
