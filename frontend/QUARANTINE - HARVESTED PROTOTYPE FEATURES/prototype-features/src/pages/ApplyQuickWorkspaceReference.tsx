/**
 * CLASSIFICATION: Support-Reference Page
 * Prototype-only reference page.
 * CANONICAL ROUTE OWNER: /apply/quick (applications family)
 */
import React from 'react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';
import { SolidarityPageLayout } from '../components/layout/SolidarityPageLayout';
import { LayeredHero } from '../components/layout/LayeredHero';
import { JobInputPanel } from '../components/feature/JobInputPanel';
import { AiOutputsTabs } from '../components/feature/AiOutputsTabs';
import { SaveApplicationBar } from '../components/feature/SaveApplicationBar';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { useUserStore } from '@/stores/userStore';
import { profileService } from '@/api/profileService';

export function ApplyQuickWorkspaceReference() {
  const { hasMaster, loadingMaster } = useUserStore();

  const { data: profiles, isLoading: isLoadingProfiles } = useQuery({
    queryKey: ['userProfiles'],
    queryFn: () => profileService.getProfiles(),
    enabled: hasMaster,
  });

  const handleLoadSampleProfile = () => {
    if (isLoadingProfiles || !profiles) return;
    console.log('Profiles loaded:', profiles);
  };

  return (
    <SolidarityPageLayout
      heroNode={
        <LayeredHero
          imageUrl="https://picsum.photos/seed/workspace/1920/1080?blur=2"
          altText="Workspace Hero"
        />
      }
    >
      <WorkspaceLayout>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="mb-16"
          >
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <h1 className="text-7xl md:text-8xl type-extremeVariableContrast text-[var(--sys-color-paperWhite-base)] uppercase tracking-tighter leading-none mb-6">
                  Application <br />
                  <span className="text-[var(--sys-color-solidarityRed-base)]">Workspace</span>
                </h1>
                <p className="text-xl type-laborExploitationPressure text-[var(--sys-color-stencilYellow-base)] uppercase tracking-widest mb-8">
                  NO NEUTRAL CANVAS. TAILOR YOUR RESPONSE.
                </p>
                <PrimaryButton
                  label={isLoadingProfiles || loadingMaster ? 'Loading...' : 'Load Profile'}
                  onClick={handleLoadSampleProfile}
                  variant="tonal"
                />
              </div>
              <div className="flex-1 w-full">
                <div
                  className="w-full aspect-video border flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
                  style={{
                    borderRadius: 'var(--sys-shape-blockRiot03)',
                    background: 'var(--sys-color-charcoalBackground-steps-2)',
                    borderColor: 'var(--sys-color-outline-variant)',
                  }}
                >
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                  <h3 className="text-2xl type-solidarityProtest text-[var(--sys-color-paperWhite-base)] uppercase tracking-widest mb-4 relative z-10">
                    Hero Illustration Placeholder
                  </h3>
                  <p className="text-sm type-melancholyLonging text-[var(--sys-color-worker-ash-base)] max-w-md relative z-10">
                    Archetype: Placard / Scaffold. Hard architectural lines. Asymmetric radii.
                    <br />
                    <br />
                    <strong className="text-[var(--sys-color-solidarityRed-base)] uppercase tracking-widest">
                      CRITICAL RULE: Zero-Flora lockdown.
                    </strong>
                    <br />
                    Absolutely NO Australian flora, eucalyptus, or wattle concepts permitted in the
                    ultimate imagery.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-12">
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <JobInputPanel />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <AiOutputsTabs />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <SaveApplicationBar />
            </motion.div>
          </div>
        </motion.div>
      </WorkspaceLayout>
    </SolidarityPageLayout>
  );
}
