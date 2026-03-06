import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PathSelectionCard } from '@/components/PathSelectionCard';
import { LayeredHero } from '../../components/kerala-rage/LayeredHero';
import type { SolidarityManifest } from '../../design/hero/heroTypes';
import { loadHeroRegistry } from '../../design/hero/heroRegistry';
import { resolvePageHeroComposition } from '../../design/hero/pageHeroMap';
import { composeHero } from '../../lib/composeHero';
import styles from './OnboardingPage.module.css';

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
  const [heroData, setHeroData] = useState<{
    layers: any[];
    typography: any;
    animation: any;
    zIndexMap: any;
  } | null>(null);
  const navigate = useNavigate();

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
    if (selected) {
      // In a real app, save selection to profile
      navigate('/career/ingest');
    }
  };

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
          <h1 className="text-bloom-ultra">Choosing the Soil</h1>
          <p className="text-curator-accent">Select your domain to begin the resurrection.</p>
        </header>

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

        <footer className={styles.footer}>
          <button
            className="btn-pebble bg-ink-gold text-asphalt-black px-12 py-4 disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={!selected}
            onClick={handleProceed}
          >
            Fertilize Selection
          </button>
        </footer>
      </div>
    </div>
  );
}

export default OnboardingPage;
