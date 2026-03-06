import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PathSelectionCard } from '@/components/PathSelectionCard';
import styles from './OnboardingPage.module.css';

// Kr-Solidarity Icons for domains
// Path format: /assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-ui-NNN--v1.svg
const DOMAINS = [
  {
    id: 'social-work',
    name: 'Social Work',
    icon: '/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-ui-008--v1.svg',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-ui-010--v1.svg',
  },
  {
    id: 'education',
    name: 'Education',
    icon: '/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-ui-012--v1.svg',
  },
  {
    id: 'government',
    name: 'Government',
    icon: '/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-ui-013--v1.svg',
  },
  {
    id: 'community',
    name: 'Community Services',
    icon: '/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-ui-014--v1.svg',
  },
  {
    id: 'nonprofit',
    name: 'Non-Profit',
    icon: '/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-ui-015--v1.svg',
  },
  {
    id: 'mental-health',
    name: 'Mental Health',
    icon: '/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-ui-018--v1.svg',
  },
  {
    id: 'disability',
    name: 'Disability Services',
    icon: '/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-ui-019--v1.svg',
  },
  {
    id: 'youth',
    name: 'Youth Support',
    icon: '/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-ui-001--v1.svg',
  },
];

export function OnboardingPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleProceed = () => {
    if (selected) {
      // In a real app, save selection to profile
      navigate('/career/ingest');
    }
  };

  return (
    <div className={styles.container}>
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
            // icon can be passed to PathSelectionCard if it supports it,
            // but let's assume it's used internally or needs to be passed.
            // The original code passed 'icon' in the object but didn't use it in PathSelectionCard call?
            // Wait, let's check PathSelectionCard.
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
  );
}

export default OnboardingPage;
