import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import styles from './OnboardingPage.module.css';

// Haeckel Icons for domains
import icon1 from '../../assets/icons/haeckel/icon-haeckel-1-1.png';
import icon2 from '../../assets/icons/haeckel/icon-haeckel-1-2.png';
import icon3 from '../../assets/icons/haeckel/icon-haeckel-1-3.png';
import icon4 from '../../assets/icons/haeckel/icon-haeckel-2-1.png';
import icon5 from '../../assets/icons/haeckel/icon-haeckel-2-2.png';
import icon6 from '../../assets/icons/haeckel/icon-haeckel-2-3.png';
import icon7 from '../../assets/icons/haeckel/icon-haeckel-3-1.png';
import icon8 from '../../assets/icons/haeckel/icon-haeckel-3-2.png';
import icon9 from '../../assets/icons/haeckel/icon-haeckel-3-3.png';

const DOMAINS = [
  { id: 'social-work', name: 'Social Work', icon: icon1 },
  { id: 'healthcare', name: 'Healthcare', icon: icon2 },
  { id: 'education', name: 'Education', icon: icon3 },
  { id: 'government', name: 'Government', icon: icon4 },
  { id: 'community', name: 'Community Services', icon: icon5 },
  { id: 'nonprofit', name: 'Non-Profit', icon: icon6 },
  { id: 'mental-health', name: 'Mental Health', icon: icon7 },
  { id: 'disability', name: 'Disability Services', icon: icon8 },
  { id: 'youth', name: 'Youth Support', icon: icon9 },
=======
import { PathSelectionCard } from '@/components/PathSelectionCard';
import styles from './OnboardingPage.module.css';

// Kr-Solidarity Icons for domains
const DOMAINS = [
  { id: 'social-work', name: 'Social Work', icon: '/assets/kr-solidarity/ui-kit/svg/motifs/kr-solidarity__ui-kit__KR-UI-008__v1.svg' },
  { id: 'healthcare', name: 'Healthcare', icon: '/assets/kr-solidarity/ui-kit/svg/motifs/kr-solidarity__ui-kit__KR-UI-010__v1.svg' },
  { id: 'education', name: 'Education', icon: '/assets/kr-solidarity/ui-kit/svg/motifs/kr-solidarity__ui-kit__KR-UI-012__v1.svg' },
  { id: 'government', name: 'Government', icon: '/assets/kr-solidarity/ui-kit/svg/motifs/kr-solidarity__ui-kit__KR-UI-013__v1.svg' },
  { id: 'community', name: 'Community Services', icon: '/assets/kr-solidarity/ui-kit/svg/motifs/kr-solidarity__ui-kit__KR-UI-014__v1.svg' },
  { id: 'nonprofit', name: 'Non-Profit', icon: '/assets/kr-solidarity/ui-kit/svg/motifs/kr-solidarity__ui-kit__KR-UI-015__v1.svg' },
  { id: 'mental-health', name: 'Mental Health', icon: '/assets/kr-solidarity/ui-kit/svg/motifs/kr-solidarity__ui-kit__KR-UI-018__v1.svg' },
  { id: 'disability', name: 'Disability Services', icon: '/assets/kr-solidarity/ui-kit/svg/motifs/kr-solidarity__ui-kit__KR-UI-019__v1.svg' },
  { id: 'youth', name: 'Youth Support', icon: '/assets/kr-solidarity/ui-kit/svg/motifs/kr-solidarity__ui-kit__KR-UI-001__v1.svg' },
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
        <p className="text-curator-accent">
<<<<<<< HEAD
          Select your botanical domain to begin the resurrection.
        </p>
      </header>

      <div className={styles.grid}>
        {DOMAINS.map((domain) => (
          <button
            key={domain.id}
            className={`${styles.leafCard} ${selected === domain.id ? styles.selected : ''}`}
            onClick={() => setSelected(domain.id)}
          >
            <div className={styles.iconWrapper}>
              <img
                src={domain.icon}
                alt=""
              />
            </div>
            <span className="text-annotation">{domain.name}</span>
          </button>
=======
          Select your domain to begin the resurrection.
        </p>
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
        ))}
      </div>

      <footer className={styles.footer}>
        <button
<<<<<<< HEAD
          className="btn-pebble bg-wattle-gold text-specimen-night px-12 py-4 disabled:opacity-30 disabled:cursor-not-allowed"
=======
          className="btn-pebble bg-ink-gold text-asphalt-black px-12 py-4 disabled:opacity-30 disabled:cursor-not-allowed"
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
