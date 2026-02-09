import React from 'react';
import { Link } from 'react-router-dom';
import { ManifestoCard } from '../../components/ManifestoCard';
import styles from './LandingPage.module.css';

// KeralaRage Assets
import sentryKrShiva from '../../assets/KrMotifs/sentry_kr-shiva.png';
import wallpaper from '../../assets/textures/wallpaper.png';

/**
 * CareerCopilot Landing Page ("The Resurrection")
 *
 * V3.1 KrDark Mode Implementation:
 * ✓ ASSET-01 Wallpaper Integration
 * ✓ High-Fidelity Hero with Proclamation/Curator mix
 * ✓ Viscous Breeze motion ready (CSS)
 * ✓ Federation Font Stack enforced
 */
export function LandingPage(): React.ReactElement {
  return (
    <div className={styles.container}>
      {/* LAYER 0: The Great Wallpaper (ASSET-01) */}
      <div
        className={styles.wallpaperLayer}
        style={{ backgroundImage: `url(${wallpaper})` }}
      />

      {/* LAYER 1: Organic Gradient Blobs */}
      <div className={styles.blobCanvas}>
        <div className={`${styles.blob} ${styles.blobA}`} />
        <div className={`${styles.blob} ${styles.blobB}`} />
        <div className={`${styles.blob} ${styles.blobC}`} />
      </div>

      {/* LAYER 2: KrMotif Anchors */}
      <div className={styles.KrMotifLayer}>
        <img
          src={sentryKrShiva}
          alt="The Sentry KrShiva"
          className={styles.sentryMascot}
        />
      </div>

      {/* LAYER 3: Hero Card (Kerala Rage Manifesto) */}
      <main className="relative z-20 flex justify-center items-center py-20">
        <ManifestoCard
          title="Career Resurrection"
          content="A Kerala Streetprint Naturalist’s approach to modern career transition. Your professional history is a KrMotif awaiting audit. Secure the past to claim the future."
          actionLabel="ENTER STATION"
          onAction={() => window.location.href = '/login'}
        />
      </main>

      <div className={styles.m3Star}>✦</div>
    </div>
  );
}

export default LandingPage;
