import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PathSelectionCard } from '@/components/PathSelectionCard';
import { useAnalytics } from '@/hooks/useAnalytics';
import { OnboardFlow } from '@/screens/03_onboarding/OnboardFlow';
import { useUserStore } from '@/stores/userStore';
import { LayeredHero } from '../../components/kerala-rage/LayeredHero';
import type { SolidarityManifest } from '../../design/hero/heroTypes';
import { loadHeroRegistry } from '../../design/hero/heroRegistry';
import { resolvePageHeroComposition } from '../../design/hero/pageHeroMap';
import { composeHero } from '../../lib/composeHero';
import { OnboardingProgress } from './OnboardingProgress';
import styles from './OnboardingPage.module.css';

const ONBOARDING_STEPS = ['Welcome', 'Choose field', 'Choose your situation', 'Upload resume'];

const DOMAINS = [
  {
    id: 'social-work',
    name: 'Social Work',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
  },
  {
    id: 'education',
    name: 'Education',
  },
  {
    id: 'government',
    name: 'Government',
  },
  {
    id: 'community',
    name: 'Community Services',
  },
  {
    id: 'nonprofit',
    name: 'Non-Profit',
  },
  {
    id: 'mental-health',
    name: 'Mental Health',
  },
  {
    id: 'disability',
    name: 'Disability Services',
  },
  {
    id: 'youth',
    name: 'Youth Support',
  },
];

export function OnboardingPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [segment, setSegment] = useState<string | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2>(1);
  const [heroData, setHeroData] = useState<{
    layers: any[];
    typography: any;
    animation: any;
    zIndexMap: any;
  } | null>(null);
  const navigate = useNavigate();
  const { track } = useAnalytics();
  const setUserSegment = useUserStore((state) => state.setUserSegment);

  const SEGMENTS = [
    { id: 'recent-graduate', title: 'Recent Graduate' },
    { id: 'career-change', title: 'Career Change' },
    { id: 'senior-advancement', title: 'Senior Advancement' },
    { id: 'international-applicant', title: 'International Applicant' },
  ];

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
          resolvePageHeroComposition('onboarding')
        );

        if (result.valid) {
          setHeroData({
            layers: result.resolvedLayers,
            typography: result.typography,
            animation: result.animation ?? result.motion,
            zIndexMap: result.zIndexMap,
          });
        }
      } catch (error) {
        console.error('Failed to load onboarding hero:', error);
      }
    }
    loadHero();
  }, []);

  const handleProceed = () => {
    if (selected && segment) {
      track('onboarding_jtbd_segment_selected', { segment });
      setUserSegment(segment);
      navigate('/profile');
    }
  };

  const getCardSpan = (index: number): string => {
    if (index <= 1) return 'lg:col-span-3';
    if (index <= 4) return 'lg:col-span-2';
    return 'lg:col-span-3';
  };

  return (
    <OnboardFlow
      className="max-w-7xl mx-auto w-full"
      showActions={false}
      title={
        onboardingStep === 1 ? 'Choose Your Focus Area' : 'What Best Describes Your Situation?'
      }
      subtitle={
        onboardingStep === 1
          ? 'Select your domain to personalize job matching and drafting quality.'
          : 'We use this to tune examples, prompts, and recommendations in your dashboard.'
      }
    >
      {heroData && (
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <LayeredHero
            layers={heroData.layers}
            typography={{ ...heroData.typography, headline: '', supporting: '' }}
            animation={heroData.animation}
            zIndexMap={heroData.zIndexMap}
            className="h-full"
          />
        </div>
      )}

      <div className="relative z-10 w-full">
        <div className="mb-8">
          <OnboardingProgress
            currentStep={onboardingStep === 1 ? 2 : 3}
            totalSteps={4}
            steps={ONBOARDING_STEPS}
          />
        </div>

        {onboardingStep === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 p-12 max-w-7xl mx-auto">
            {DOMAINS.map((domain, index) => (
              <PathSelectionCard
                key={domain.id}
                title={domain.name}
                description={`Build role-specific context for ${domain.name} applications.`}
                isSelected={selected === domain.id}
                onSelect={() => {
                  setSelected(domain.id);
                  track('onboarding_domain_selected', { domain: domain.id });
                }}
                className={getCardSpan(index)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-12 max-w-5xl mx-auto">
            {SEGMENTS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSegment(item.id)}
                className={`text-left rounded-placard border px-6 py-5 transition-all ${
                  segment === item.id
                    ? 'border-inkGold-base bg-inkGold-base/10 text-worker-ash-base'
                    : 'border-concreteGrey-base/20 bg-charcoalBackground-base/45 text-concreteGrey-base hover:border-inkGold-base/40'
                }`}
              >
                <p className="font-display text-xl">{item.title}</p>
              </button>
            ))}
          </div>
        )}

        <footer className={styles.footer}>
          {onboardingStep === 1 ? (
            <button
              className="btn-strike bg-inkGold-base text-charcoalBackground-base px-12 py-4 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={!selected}
              onClick={() => setOnboardingStep(2)}
            >
              Continue
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <button
                className="btn-strike bg-concreteGrey-base/20 text-worker-ash-base px-8 py-4"
                onClick={() => setOnboardingStep(1)}
              >
                Back
              </button>
              <button
                className="btn-strike bg-inkGold-base text-charcoalBackground-base px-12 py-4 disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={!segment}
                onClick={handleProceed}
              >
                Continue to Document Setup
              </button>
            </div>
          )}
        </footer>
      </div>
    </OnboardFlow>
  );
}

export default OnboardingPage;
