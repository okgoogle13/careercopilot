import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        ))}
      </div>

      <footer className={styles.footer}>
        <button
          className="btn-pebble bg-wattle-gold text-specimen-night px-12 py-4 disabled:opacity-30 disabled:cursor-not-allowed"
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
