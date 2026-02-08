import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

// kerala-rage Assets
import sentrykr-shiva from '../../assets/kr-motifs/sentry_kr-shiva.png';
import wallpaper from '../../assets/textures/wallpaper.png';

/**
 * CareerCopilot Landing Page ("The Resurrection")
 *
 * V3.1 kr-dark Mode Implementation:
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

      {/* LAYER 2: kr-motif Anchors */}
      <div className={styles.kr-motifLayer}>
        <img
          src={sentrykr-shiva}
          alt="The Sentry kr-shiva"
          className={styles.sentryMascot}
        />
      </div>

      {/* LAYER 3: Hero Card (kr-dark Glass) */}
      <main className={styles.heroCard}>
        <div className="hero-cursive-mix">
          <span className="proclamation text-bloom-ultra">Career</span>
          <span className="cursive">Copilot</span>
        </div>

        <p className={styles.heroTagline}>
          A kerala-streetprint Naturalist’s approach to modern career transition.
        </p>

        <div className="mt-8 flex flex-col items-center gap-2">
          <span className="text-annotation text-wattle-gold tracking-[0.2em]">
            RESURRECTION PROTOCOL V3.1
          </span>
          <span className="text-curator-annotation text-concrete-grey opacity-60">
            → kr-motifs awaiting audit
          </span>
        </div>

        <div className={styles.actionContainer}>
          <Link
            to="/login"
            className={styles.btnPebbleFilled}
          >
            Enter Station
          </Link>
          <Link
            to="/register"
            className={styles.btnPebbleOutlined}
          >
            New kr-motif
          </Link>
          <Link
            to="/dashboard?demo=true"
            className={styles.btnLink}
          >
            Explore as Guest
          </Link>
        </div>
      </main>

      <div className={styles.m3Star}>✦</div>
    </div>
  );
}

export default LandingPage;
