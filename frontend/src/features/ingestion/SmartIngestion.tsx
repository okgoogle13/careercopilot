import { Placard, Strike } from '@/components/ui';
import { ValidationDashboard } from '@/features/onboarding/components/ValidationDashboard';
import { OnboardingProgress } from '@/features/onboarding/OnboardingProgress';
import { useCareerIngestion } from '@/hooks/useCareerIngestion';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useUserStore } from '@/stores/userStore';
import { CareerDatabase } from '@/types/api';
import { m3Toast } from '@/utils/toast';
import { AnimatePresence, motion } from 'framer-motion';
import { Microscope } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { DropZone } from './components/DropZone';
import { EvidenceUploader } from './components/EvidenceUploader';

import { LayeredHero } from '@/components/kerala-rage/LayeredHero';
import { loadHeroRegistry } from '@/design/hero/heroRegistry';
import { composeHero } from '@/lib/composeHero';
import type { SolidarityManifest } from '@/design/hero/heroTypes';

// KrDark Assets
const solidarityTexture =
  '/assets/kr-solidarity/abstract/kr-solidarity__atmospheric__texture--solidarity-chatgpt-image-f--v1.png';

type UploadStage = 'idle' | 'uploading' | 'extracting' | 'processing' | 'embedding' | 'complete';

/**
 * SmartIngestion Feature Component
 *
 * Modernized version of IngestionPage, complying with KR Solidarity v6.0.
 * Orchestrates the full ingestion flow: Resume upload + Evidence enrichment.
 */
export const SmartIngestion: React.FC = () => {
  const navigate = useNavigate();
  const { track } = useAnalytics();
  const { submitDocuments, updateCareerDatabase, isLoading } = useCareerIngestion();
  const setHasMaster = useUserStore((state) => state.setHasMaster);
  const setHasCompletedIngestion = useUserStore((state) => state.setHasCompletedIngestion);

  const [careerData, setCareerData] = useState<CareerDatabase | null>(null);
  const [uploadStage, setUploadStage] = useState<UploadStage>('idle');
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

  const handleResumeUpload = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      track('resume_ingestion_started', { file_count: files.length });
      setUploadStage('uploading');

      setUploadStage('extracting');

      setUploadStage('processing');

      const result = await submitDocuments(files);

      setUploadStage('embedding');

      setUploadStage('complete');

      setCareerData(result);
      setHasMaster(true);
      setHasCompletedIngestion(true);

      localStorage.setItem('cc_master_status', 'true');
      localStorage.removeItem('cc_ingestion_skipped');

      track('resume_ingestion_completed', { file_count: files.length });
      m3Toast.success('Ingestion Complete', 'Professional data archived successfully.');
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadStage('idle');
      m3Toast.error('Upload failed', 'We could not process your file. Please try again.');
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
        return 'Uploading file...';
      case 'extracting':
        return 'Extracting text...';
      case 'processing':
        return 'Analyzing resume...';
      case 'embedding':
        return 'Building profile context...';
      case 'complete':
        return 'Upload complete.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col bg-[var(--sys-color-charcoalBackground-base)]">
      {/* Hero Engine Integration: Industrial Background */}
      {heroData && (
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
          <LayeredHero
            layers={heroData.layers}
            typography={{ ...heroData.typography, headline: '', supporting: '' }}
            animation={{ ...heroData.animation, scroll_behavior: 'none' }}
            zIndexMap={heroData.zIndexMap}
            className="h-full"
          />
        </div>
      )}

      <main className="flex-grow flex items-center justify-center p-6 z-10">
        <Placard className="max-w-3xl w-full border-2 border-[var(--sys-color-concreteGrey-base)]/10 shadow-maximum relative bg-[var(--sys-color-charcoalBackground-base)]/80 backdrop-blur-md">
          {/* Solidarity Approval Plate */}
          <AnimatePresence>
            {uploadStage === 'complete' && (
              <motion.div
                initial={{ scale: 2, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 0.15, rotate: -15 }}
                className="absolute top-10 right-10 w-48 h-48 pointer-events-none z-20"
              >
                <img
                  src={solidarityTexture}
                  alt="Verified"
                  className="w-full h-full object-contain filter grayscale invert brightness-200"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <header className="text-center mb-10">
            <div className="mb-12">
              <OnboardingProgress
                currentStep={4}
                totalSteps={4}
                steps={['Welcome', 'Strategy', 'Context', 'Archive']}
              />
            </div>

            <div className="w-24 h-24 bg-[var(--sys-color-inkGold-base)]/5 rounded-megaphone flex items-center justify-center mx-auto mb-6 border border-[var(--sys-color-inkGold-base)]/10 relative">
              <div className="absolute inset-0 animate-pulse border border-[var(--sys-color-inkGold-base)]/5 rounded-megaphone scale-110" />
              <Microscope className="w-12 h-12 text-[var(--sys-color-inkGold-base)]" />
            </div>

            <h1 className="text-5xl font-display font-black text-[var(--sys-color-paperWhite-base)] tracking-tight uppercase">
              Professional Archive
            </h1>
            <p className="font-jetbrains-mono text-xs text-[var(--sys-color-concreteGrey-steps-3)] mt-3 tracking-[0.3em] uppercase opacity-60">
              [ SYSTEM INGESTION M4 ]
            </p>
          </header>

          <div className="grid grid-cols-1 gap-8">
            {/* Primary DropZone */}
            <div className="space-y-4">
              <h2 className="font-display text-sm font-bold text-[var(--sys-color-inkGold-base)] uppercase tracking-widest pl-2 flex justify-between items-center">
                <span>Primary Master Resource</span>
                {isLoading && (
                  <span className="font-mono text-[10px] text-[var(--sys-color-solidarityRed-base)] animate-pulse">
                    {getStageMessage()}
                  </span>
                )}
              </h2>
              <DropZone
                onFileDrop={handleResumeUpload}
                isProcessing={isLoading}
              />
            </div>

            {/* Evidence Enrichment */}
            <div className="space-y-4 mt-8">
              <h2 className="font-display text-sm font-bold text-[var(--sys-color-inkGold-base)] uppercase tracking-widest pl-2">
                Strategic Evidence Enrichment
              </h2>
              <EvidenceUploader />
            </div>
          </div>

          {/* Footer Actions */}
          <footer className="mt-12 pt-8 border-t border-[var(--sys-color-concreteGrey-base)]/10">
            <button
              onClick={() => {
                setHasCompletedIngestion(false);
                navigate('/dashboard');
              }}
              className="w-full text-xs uppercase tracking-[0.24em] font-mono text-[var(--sys-color-concreteGrey-base)] hover:text-[var(--sys-color-inkGold-base)] transition-colors text-center"
            >
              Skip Ingestion — Proceed to Tactical Dashboard
            </button>
          </footer>
        </Placard>
      </main>

      {/* KrDark Technical Audit Note */}
      <footer className="p-8 flex justify-center z-10">
        <div className="max-w-2xl flex gap-5 items-center opacity-40">
          <Microscope className="w-5 h-5 text-[var(--sys-color-inkGold-base)] shrink-0" />
          <p className="font-primary text-[10px] text-[var(--sys-color-paperWhite-base)] leading-relaxed uppercase tracking-wider">
            Archive extraction utilizes high-fidelity LLM parsing. Expected latency: 15–45s.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SmartIngestion;
