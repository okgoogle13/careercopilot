import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PathSelectionCard } from '@/components/PathSelectionCard';
import { LayeredHero } from '../../components/kerala-rage/LayeredHero';
import type { SolidarityManifest } from '../../design/hero/heroTypes';
import { loadHeroRegistry } from '../../design/hero/heroRegistry';
import { resolvePageHeroComposition } from '../../design/hero/pageHeroMap';
import { composeHero } from '../../lib/composeHero';
import { OnboardingProgress } from './OnboardingProgress';
import { WelcomeScreen, WELCOME_SEEN_KEY } from './WelcomeScreen';
import { useAnalytics } from '../../hooks/useAnalytics';
import styles from './OnboardingPage.module.css';

// ============================================================================
// CONSTANTS
// ============================================================================

/** localStorage key for JTBD self-segmentation (L1 recommendation) */
export const USER_SEGMENT_KEY = 'cc_user_segment';

const ONBOARDING_STEPS = ['Welcome', 'Choose field', 'Your background', 'Upload resume'];

// ============================================================================
// JTBD SEGMENTATION DATA  (L1 recommendation)
// ============================================================================

const SEGMENTS = [
  {
    id: 'graduate',
    emoji: '🎓',
    label: 'Recent graduate',
    description: 'Entering the workforce for the first time',
  },
  {
    id: 'career-change',
    emoji: '🔄',
    label: 'Career changer',
    description: 'Switching sectors or reinventing your direction',
  },
  {
    id: 'senior',
    emoji: '📈',
    label: 'Senior professional',
    description: 'Seeking advancement or executive-level roles',
  },
  {
    id: 'migrant',
    emoji: '🌏',
    label: 'Migrant / international',
    description: 'Building your career in a new country',
  },
];

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
  // onboardingStep: 1 = Welcome, 2 = Domain selection, 3 = JTBD segmentation
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3>(() => {
    try {
      return localStorage.getItem(WELCOME_SEEN_KEY) === 'true' ? 2 : 1;
    } catch {
      return 1;
    }
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [heroData, setHeroData] = useState<{
    layers: any[];
    typography: any;
    animation: any;
    zIndexMap: any;
  } | null>(null);
  const navigate = useNavigate();
  const { track } = useAnalytics();

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
    if (onboardingStep === 2 && selected) {
      track('onboarding_domain_selected', { domain: selected });
      setOnboardingStep(3);
    } else if (onboardingStep === 3) {
      if (selectedSegment) {
        track('onboarding_segment_selected', { segment: selectedSegment });
      }
      try {
        if (selectedSegment) localStorage.setItem(USER_SEGMENT_KEY, selectedSegment);
      } catch {
        // ignore
      }
      navigate('/career/ingest');
    }
  };

  // Step 1 — Welcome screen (H1)
  if (onboardingStep === 1) {
    return (
      <WelcomeScreen
        onGetStarted={() => {
          track('onboarding_welcome_seen');
          setOnboardingStep(2);
        }}
      />
    );
  }

  return (
    <div className={styles.container}>
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
        <header className={styles.header}>
          <div className="mb-6">
            <OnboardingProgress
              currentStep={onboardingStep}
              totalSteps={4}
              steps={ONBOARDING_STEPS}
            />
          </div>

          {onboardingStep === 2 && (
            <>
              <h1 className="text-bloom-ultra">Choosing the Soil</h1>
              <p className="text-curator-accent">Select your professional domain to personalize your experience.</p>
            </>
          )}

          {onboardingStep === 3 && (
            <>
              <h1 className="text-bloom-ultra">Your Background</h1>
              <p className="text-curator-accent">Help us tailor your experience to where you are in your career.</p>
            </>
          )}
        </header>

        {/* Step 2: Domain selection */}
        {onboardingStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-12 max-w-7xl mx-auto">
            {DOMAINS.map((domain) => (
              <PathSelectionCard
                key={domain.id}
                title={domain.name}
                description={`Specialize in ${domain.name} through the lens of Kerala Rage autonomy.`}
                isSelected={selected === domain.id}
                onSelect={() => setSelected(domain.id)}
              />
            ))}
          </div>
        )}

        {/* Step 3: JTBD segmentation (L1) */}
        {onboardingStep === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-12 max-w-3xl mx-auto">
            {SEGMENTS.map((seg) => (
              <button
                key={seg.id}
                onClick={() => setSelectedSegment(seg.id)}
                className={`
                  flex items-start gap-5 p-6 rounded-[10px] border text-left transition-all duration-200
                  ${
                    selectedSegment === seg.id
                      ? 'border-ink-gold bg-ink-gold/10 shadow-[0_0_30px_rgba(218,246,116,0.15)]'
                      : 'border-concrete-grey/20 bg-white/[0.02] hover:border-ink-gold/30 hover:bg-ink-gold/5'
                  }
                `}
              >
                <span className="text-3xl flex-shrink-0">{seg.emoji}</span>
                <div>
                  <p className="font-primary text-sm font-semibold text-paper-white mb-1">{seg.label}</p>
                  <p className="font-primary text-xs text-concrete-grey/60">{seg.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <footer className={styles.footer}>
          <div className="flex flex-col items-center gap-4">
            <button
              className="btn-pebble bg-ink-gold text-asphalt-black px-12 py-4 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={onboardingStep === 2 && !selected}
              onClick={handleProceed}
            >
              {onboardingStep === 2 ? 'Continue' : 'Start Setup →'}
            </button>
            {onboardingStep === 3 && !selectedSegment && (
              <button
                onClick={handleProceed}
                className="font-annotation text-xs text-concrete-grey/40 uppercase tracking-widest hover:text-concrete-grey transition-colors"
              >
                Skip this step
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

export default OnboardingPage;
